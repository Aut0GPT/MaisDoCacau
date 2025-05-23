// Type definitions for MiniKit global object

// User information as defined in the documentation
export interface MiniKitUser {
  walletAddress?: string;
  username?: string;
  profilePictureUrl?: string;
  profileImage?: string; // Alternative profile image URL
  email?: string; // User's email if available
  worldId?: string; // World ID identifier
  permissions?: {
    notifications: boolean;
    contacts: boolean;
  };
  optedIntoOptionalAnalytics?: boolean;
  worldAppVersion?: number;
  deviceOS?: string;
}

// Wallet Auth input parameters
export interface WalletAuthInput {
  nonce: string;
  expirationTime?: Date;
  statement?: string;
  requestId?: string;
  notBefore?: Date;
}

// Verify input parameters
export interface VerifyInput {
  action: string;
  signal?: string;
}

// Pay input parameters
export interface PayInput {
  recipient: string;
  amount: number;
  token: string;
}

// Transaction input parameters
export interface TransactionInput {
  to: string;
  data: string;
  value?: string;
}

// Wallet Auth success response
export interface WalletAuthSuccessPayload {
  status: 'success';
  message: string;
  signature: string;
  address: string;
  version: number;
}

// Error response
export interface ErrorPayload {
  status: 'error';
  error_code: string;
  error_message?: string;
}

// Type guard to check if payload is an error
export function isErrorPayload(payload: unknown): payload is ErrorPayload;

// Command result with payload
export interface CommandResult<T> {
  commandPayload?: unknown;
  finalPayload: T | ErrorPayload;
}

// MiniKit global interface
export interface MiniKitGlobal {
  // User information
  walletAddress?: string;
  
  // User methods
  getUserInfo: () => Promise<MiniKitUser>;
  getUserByUsername: (username: string) => Promise<MiniKitUser>;
  getUserByAddress: (address: string) => Promise<MiniKitUser>;
  
  // Async commands
  commandsAsync: {
    walletAuth: (params: WalletAuthInput) => Promise<CommandResult<WalletAuthSuccessPayload>>;
    verify: (params: VerifyInput) => Promise<CommandResult<unknown>>;
    pay: (params: PayInput) => Promise<CommandResult<unknown>>;
    sendTransaction: (params: TransactionInput) => Promise<CommandResult<unknown>>;
    getPermissions: () => Promise<Record<string, boolean>>;
  };
  
  // Regular commands
  commands: {
    walletAuth: (params: WalletAuthInput) => void;
    verify: (params: VerifyInput) => void;
    pay: (params: PayInput) => void;
    sendTransaction: (params: TransactionInput) => void;
  };
  
  // Utility methods
  isInstalled: () => boolean;
}

// Extend the Window interface
declare global {
  interface Window {
    MiniKit?: MiniKitGlobal;
  }
}

export {};
