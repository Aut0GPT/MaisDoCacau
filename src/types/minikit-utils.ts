import type { ErrorPayload } from './minikit';

/**
 * Type guard to check if a payload is an error response from MiniKit
 * @param payload The payload to check
 * @returns True if the payload is an error response
 */
export function isErrorPayload(payload: unknown): payload is ErrorPayload {
  return !!payload && 
         typeof payload === 'object' &&
         payload !== null &&
         'status' in payload &&
         (payload as Record<string, unknown>).status === 'error' &&
         'error_code' in payload &&
         typeof (payload as Record<string, unknown>).error_code === 'string';
}
