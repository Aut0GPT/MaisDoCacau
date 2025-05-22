// Type definitions for MiniKit global object

interface MiniKitUserInfo {
  username: string;
  walletAddress: string;
  verified?: boolean;
}

interface WalletAuthParams {
  nonce: string;
  expirationTime: Date;
  notBefore: Date;
  statement: string;
}

interface VerifyParams {
  action: string;
  signal?: string;
}

interface PayParams {
  recipient: string;
  amount: number;
  token: string;
}

interface TransactionParams {
  to: string;
  data: string;
  value?: string;
}

interface CommandResponse {
  status: string;
  error_code?: string;
  address?: string;
  [key: string]: unknown;
}

interface FinalPayload {
  status: string;
  error_code?: string;
  address?: string;
  [key: string]: unknown;
}

interface CommandResult {
  finalPayload: FinalPayload;
}

export interface MiniKitGlobal {
  getUserInfo: () => Promise<MiniKitUserInfo>;
  getUserByUsername: (username: string) => Promise<MiniKitUserInfo>;
  commandsAsync: {
    walletAuth: (params: WalletAuthParams) => Promise<CommandResult>;
    verify: (params: VerifyParams) => Promise<CommandResult>;
    pay: (params: PayParams) => Promise<CommandResult>;
    sendTransaction: (params: TransactionParams) => Promise<CommandResult>;
    getPermissions: () => Promise<Record<string, boolean>>;
  };
  commands: {
    walletAuth: (params: WalletAuthParams) => void;
    verify: (params: VerifyParams) => void;
    pay: (params: PayParams) => void;
    sendTransaction: (params: TransactionParams) => void;
  };
  isInstalled: () => boolean;
}

// Extend the Window interface
declare global {
  interface Window {
    MiniKit?: MiniKitGlobal;
  }
}

export {};
