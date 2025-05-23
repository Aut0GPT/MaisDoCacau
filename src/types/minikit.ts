export interface WalletAuthResponse {
  address?: string;
  username?: string;
  verified?: boolean;
  profileImage?: string;
  profilePictureUrl?: string; // Often an alias or alternative for profileImage
  email?: string;
  worldId?: string;
  // Add any other known or expected properties, or use a more generic type if needed
  [key: string]: any; // Allows for other properties not explicitly defined yet
}

export interface UserInfoResponse {
  walletAddress?: string;
  username?: string;
  profileImage?: string;
  profilePictureUrl?: string;
  email?: string;
  worldId?: string;
  [key: string]: any;
}

export interface WalletAuthInput {
  nonce: string;
  [key: string]: any; // Allow for other potential parameters
}

export interface MiniKitCommands {
  walletAuth: (params: WalletAuthInput) => Promise<WalletAuthResponse | null | undefined>;
  // Define other MiniKit commands here if you use them, e.g.:
  // verify: (params: any) => Promise<any>;
  // pay: (params: any) => Promise<any>;
}

export interface MiniKitGlobal {
  isInstalled?: () => boolean;
  commands: MiniKitCommands;
  getUserInfo?: () => Promise<UserInfoResponse | null | undefined>;
  // Define other global MiniKit properties or methods if known
  [key: string]: any; // Allows for other properties
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
