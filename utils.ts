import cli from "cli";
import { Presets, SingleBar } from "cli-progress";
import fs from "fs/promises";
import { formatUnits, JsonRpcProvider } from "ethers";
import { MAX_GAS_GWEI, RPC_URL, TX_SCAN } from "./constants";

const provider = new JsonRpcProvider(RPC_URL);

export const delay = (seconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, seconds * 1000));

export const delayProgress = (seconds: number) => {
  if (seconds === 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const bar = new SingleBar({
      format: "Delay [{bar}] {value}/{total}",
    }, Presets.shades_classic);

    bar.start(seconds, 0);
    let counter = 0;

    const timer = setInterval(() => {
      counter = counter + 1;
      bar.update(counter);
      if (counter === seconds) {
        clearInterval(timer);
        bar.stop();
        resolve();
      }
    }, 1000);
  });
};

export async function loadFromFile(fileName: string) {
  const file = await fs.readFile(fileName, { encoding: "utf-8" });

  return file.split("\n").map((item) => item.trim()).filter(Boolean);
}

export function getTxLink(txHash: string) {
  const url = TX_SCAN;
  return `${url}${txHash}`;
}

async function getBaseGas() {
  const { gasPrice } = await provider.getFeeData();
  return formatUnits(gasPrice!, "gwei");
}

export async function waitGas() {
  while (true) {
    const gas = parseInt(await getBaseGas());

    cli.spinner(`L1 gas: ${gas} GWEI`, true);

    if (gas > MAX_GAS_GWEI) {
      cli.spinner(
        `Газ выше, чем в настройках: ${MAX_GAS_GWEI} GWEI, ждём 15 секунд`,
      );
      await delay(15);
    } else {
      break;
    }
  }
}
