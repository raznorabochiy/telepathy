import cli from "cli";
import { Wallet } from "ethers";
import random from "lodash/random";
import shuffle from "lodash/shuffle";
import { DELAY_SEC, KEYS_FILENAME, SHUFFLE_KEYS } from "./constants";
import { sendMessage } from "./messenger";
import { delayProgress, loadFromFile, waitGas } from "./utils";

let keys = await loadFromFile(KEYS_FILENAME);

if (SHUFFLE_KEYS) {
  keys = shuffle(keys);
}

const lastKey = [...keys].pop();

for (const key of keys) {
  const { address } = new Wallet(key);
  console.log(`===== Address: ${address} ======`);

  try {
    await waitGas();
    await sendMessage(key);
  } catch (error) {
    console.log("Ошибка:", error.message);
    console.log("Приватник:", key);
    cli.spinner("", true);
  }

  if (key !== lastKey) {
    const [min, max] = DELAY_SEC;
    const delayTimeout = random(min, max);
    await delayProgress(delayTimeout);
  }
}
