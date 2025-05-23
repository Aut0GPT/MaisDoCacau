import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// In a production environment, these would be environment variables
const supabaseUrl = 'https://your-supabase-project.supabase.co';
const supabaseKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// User types
export interface UserProfile {
  id: string;
  wallet_address: string;
  username: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

// User functions
export async function getUserByWalletAddress(walletAddress: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();
  
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  
  return data as UserProfile;
}

export async function createUserProfile(walletAddress: string, username: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      { 
        wallet_address: walletAddress,
        username: username || `User_${walletAddress.substring(0, 6)}`,
      }
    ])
    .select();
  
  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
  
  return data[0] as UserProfile;
}

export async function getOrCreateUserProfile(walletAddress: string, username: string) {
  const existingUser = await getUserByWalletAddress(walletAddress);
  
  if (existingUser) {
    return existingUser;
  }
  
  return await createUserProfile(walletAddress, username);
}
