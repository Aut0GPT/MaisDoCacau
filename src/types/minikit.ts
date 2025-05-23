export interface WalletAuthResponse {
  address?: string;
  username?: string;
  verified?: boolean;
  profileImage?: string;
  profilePictureUrl?: string; // Often an alias or alternative for profileImage
  email?: string;
  worldId?: string;
  // Add any other known or expected properties, or use a more generic type if needed
  [key: string]: unknown; // Allows for other properties not explicitly defined yet
}

// Base payload interface for MiniKit responses
export interface BasePayload {
  status: string;
  [key: string]: unknown;
}

// Success payload from wallet authentication
export interface WalletAuthSuccessPayload extends BasePayload {
  status: 'success';
  address: string;
  nonce: string; // Required for authentication verification
  username?: string;
  verified?: boolean;
  profileImage?: string;
  email?: string;
  worldId?: string;
}

// Error payload from MiniKit operations
export interface ErrorPayload extends BasePayload {
  status: 'error';
  error_code: string;
  error_message?: string;
}

export interface UserInfoResponse {
  walletAddress?: string;
  username?: string;
  profileImage?: string;
  profilePictureUrl?: string;
  email?: string;
  worldId?: string;
  [key: string]: unknown;
}

export interface WalletAuthInput {
  nonce: string;
  [key: string]: unknown; // Allow for other potential parameters
}

export interface MiniKitCommands {
  walletAuth: (params: WalletAuthInput) => Promise<WalletAuthResponse | null | undefined>;
  // Define other MiniKit commands here if you use them, e.g.:
  // verify: (params: Record<string, unknown>) => Promise<unknown>;
  // pay: (params: Record<string, unknown>) => Promise<unknown>;
}

export interface ErrorPayload {
  status: 'error';
  error_code: string;
  error_message?: string;
}

export interface WalletAuthSuccessPayload {
  status: 'success';
  address: string;
  message: string;
  signature: string;
  nonce: string;
  [key: string]: unknown;
}

export interface MiniKitGlobal {
  isInstalled?: () => boolean;
  commands: MiniKitCommands;
  getUserInfo?: () => Promise<UserInfoResponse | null | undefined>;
  // Define other global MiniKit properties or methods if known
  [key: string]: unknown; // Allows for other properties
}

// This makes window.MiniKit available globally with the specified type
// Ensure this file is included in your tsconfig.json's "typeRoots" or "files" array
// if you want this global augmentation to be recognized project-wide without explicit imports.
// However, explicit imports of MiniKitGlobal are generally safer.
/*
declare global {
  interface Window {
    MiniKit?: MiniKitGlobal;
  }
}

export {}; // Ensures the file is treated as a module
*/
