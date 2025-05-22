// Type definitions for MiniKit global object

interface MiniKitUserInfo {
  username: string;
  walletAddress: string;
  verified?: boolean;
}

interface MiniKitGlobal {
  getUserInfo: () => Promise<MiniKitUserInfo>;
  getUserByUsername: (username: string) => Promise<MiniKitUserInfo>;
  commandsAsync: {
    walletAuth: (params: any) => Promise<any>;
    verify: (params: any) => Promise<any>;
    pay: (params: any) => Promise<any>;
    sendTransaction: (params: any) => Promise<any>;
    getPermissions: () => Promise<any>;
  };
  commands: {
    walletAuth: (params: any) => void;
    verify: (params: any) => void;
    pay: (params: any) => void;
    sendTransaction: (params: any) => void;
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
