import type { MiniKitGlobal } from './types/minikit'; // Adjust path if necessary

declare global {
  interface Window {
    MiniKit?: MiniKitGlobal;
  }
}

// Adding export {} to ensure this file is treated as a module by TypeScript.
// This can be important for global augmentations to be picked up correctly.
export {};
