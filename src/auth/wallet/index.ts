import { MiniKit } from '@worldcoin/minikit-js';
import { signIn } from 'next-auth/react';
import { getNewNonces } from './server-helpers';
import type { WalletAuthSuccessPayload } from '@/types/minikit';
import { isErrorPayload } from '@/types/minikit-utils';

/**
 * Authenticates a user via their wallet using a nonce-based challenge-response mechanism.
 *
 * This function generates a unique `nonce` and requests the user to sign it with their wallet,
 * producing a `signedNonce`. The `signedNonce` ensures the response we receive from wallet auth
 * is authentic and matches our session creation.
 *
 * @returns {Promise<SignInResponse>} The result of the sign-in attempt.
 * @throws {Error} If wallet authentication fails at any step.
 */
export const walletAuth = async () => {
  try {
    // Check if MiniKit is installed
    if (!MiniKit.isInstalled()) {
      throw new Error('MiniKit is not installed');
    }

    // Generate a unique nonce for this authentication attempt
    const { nonce, signedNonce } = await getNewNonces();

    // Call the MiniKit wallet authentication command
    const result = await MiniKit.commandsAsync.walletAuth({
      nonce,
      requestId: crypto.randomUUID().substring(0, 8), // Optional unique ID for this request
      expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
      notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000), // Valid from 24 hours ago (to account for clock drift)
      statement: `Authenticate with Mais do Cacau (${new Date().toISOString()}).`, // Statement for the user to sign
    });

    // Log the result for debugging
    console.log('Wallet auth result:', result);

    // Check if the authentication was successful
    if (!result) {
      throw new Error('No response from wallet authentication');
    }
    
    // Check if the response is an error
    if (isErrorPayload(result.finalPayload)) {
      const errorPayload = result.finalPayload;
      console.error('Wallet authentication failed', errorPayload.error_code);
      throw new Error(`Authentication failed: ${errorPayload.error_code || 'Unknown error'}`);
    }
    
    // Additional check to ensure we have a success status
    if (result.finalPayload.status !== 'success') {
      throw new Error('Authentication response has unexpected format');
    }

    // Cast the finalPayload to the success type for TypeScript
    const successPayload = result.finalPayload as WalletAuthSuccessPayload;
    
    // Log the successful authentication
    console.log('Authentication successful:', successPayload);

    // Sign in with next-auth using the wallet authentication result
    await signIn('credentials', {
      redirectTo: '/',
      nonce,
      signedNonce,
      finalPayloadJson: JSON.stringify(successPayload),
    });

    return successPayload;
  } catch (error) {
    console.error('Wallet authentication error:', error);
    throw error;
  }
};
