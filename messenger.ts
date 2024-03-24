import cli from "cli";
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import sample from "lodash/sample";
import {
  CHAIN_ID,
  DEST_CHAIN,
  MAILBOX_ADDRESS,
  MAILER_ABI,
  MAILER_ADDRESS,
  MESSAGES_FILENAME,
  RPC_URL,
} from "./constants";
import { Network } from "./types";
import { getTxLink, loadFromFile } from "./utils";

const provider = new JsonRpcProvider(RPC_URL);
const messages = await loadFromFile(MESSAGES_FILENAME);
const textEncoder = new TextEncoder();

function getDestChainId(): number {
  let destChain: Network;

  if (DEST_CHAIN === "random") {
    destChain = sample([
      Network.ARBITRUM,
      Network.AVALANCHE,
      Network.BNB,
      Network.GNOSIS,
      Network.GOERLI,
      Network.OPTIMISM,
      Network.POLYGON,
    ]);
  } else {
    destChain = DEST_CHAIN;
  }

  return CHAIN_ID[destChain];
}

export async function sendMessage(key: string) {
  const wallet = new Wallet(key, provider);
  const contract = new Contract(MAILER_ADDRESS, MAILER_ABI, wallet);
  const message = sample(messages);

  if (!message) {
    throw new Error("Нет сообщения для отправки");
  }

  const destChainId = getDestChainId();

  const txArgs = [
    destChainId,
    MAILBOX_ADDRESS,
    textEncoder.encode(message),
  ];

  const gasLimit = await contract.sendMail.estimateGas(...txArgs);
  const { maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData();

  const unsignedTx = await contract.sendMail.populateTransaction(
    ...txArgs,
  );

  cli.spinner("Отправляю транзакцию");

  const tx = await wallet.sendTransaction({
    ...unsignedTx,
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
  });

  await provider.waitForTransaction(tx.hash);
  cli.spinner(getTxLink(tx.hash), true);
}
