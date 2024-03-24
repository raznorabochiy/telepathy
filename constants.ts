import { DestChain, Network } from "./types";

export const RPC_URL = "https://ethereum-rpc.publicnode.com";

// Перемешивать ключи, чтобы запускать аккаунты в случайном порядке
export const SHUFFLE_KEYS = true;

// Задержка между аккаунтами [от, до]
export const DELAY_SEC = [300, 600];

// Сеть назначения
// доступна значения из types.ts или "random" (выбирается случайно)
export const DEST_CHAIN: DestChain = Network.ARBITRUM;

export const MAX_GAS_GWEI = 30;

export const KEYS_FILENAME = "keys.txt";

export const MESSAGES_FILENAME = "messages.txt";

export const MAILER_ADDRESS = "0xa3b31028893c20bEAA882d1508Fe423acA4A70e5";

export const MAILBOX_ADDRESS = "0xF8f0929809fe4c73248C27DA0827C98bbE243FCc";

export const MAILER_ABI = [
  "constructor(address _telepathyRouter)",
  "error InsufficientFee(uint256 actual, uint256 expected)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
  "function ADDR_REVERSE_NODE() view returns (bytes32)",
  "function ETH_NODE() view returns (bytes32)",
  "function claimFees()",
  "function fee() view returns (uint256)",
  "function getName(address _addr) view returns (string name)",
  "function owner() view returns (address)",
  "function renounceOwnership()",
  "function reverseNode(address _addr) pure returns (bytes32)",
  "function sendMail(uint32 _destinationChainId, address _destinationMailbox, bytes _message) payable",
  "function setFee(uint256 _fee)",
  "function telepathyRouter() view returns (address)",
  "function transferOwnership(address newOwner)",
];

export const TX_SCAN = "https://etherscan.io/tx/";

export const CHAIN_ID = {
  [Network.ARBITRUM]: 42161,
  [Network.AVALANCHE]: 43114,
  [Network.BNB]: 56,
  [Network.GNOSIS]: 100,
  [Network.GOERLI]: 5,
  [Network.OPTIMISM]: 10,
  [Network.POLYGON]: 137,
};
