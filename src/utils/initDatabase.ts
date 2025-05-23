import { seedInitialProducts } from '@/lib/products';
import { createClient } from '@/utils/supabase/server';

/**
 * Initialize the database with sample data
 * This function should be called during app initialization
 */
export async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    // Seed products if needed
    await seedInitialProducts();
    
    console.log('Database initialization complete!');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

/**
 * Check if database tables exist and are properly configured
 */
export async function checkDatabaseSetup() {
  try {
    const supabase = createClient();
    
    // Check if products table exists
    const { error: productsError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (productsError) {
      console.error('Error checking products table:', productsError);
      return false;
    }
    
    // Check if user_profiles table exists
    const { error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (userProfilesError) {
      console.error('Error checking user_profiles table:', userProfilesError);
      return false;
    }
    
    // Check if orders table exists
    const { error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
    
    if (ordersError) {
      console.error('Error checking orders table:', ordersError);
      return false;
    }
    
    // Check if order_items table exists
    const { error: orderItemsError } = await supabase
      .from('order_items')
      .select('id')
      .limit(1);
    
    if (orderItemsError) {
      console.error('Error checking order_items table:', orderItemsError);
      return false;
    }
    
    // Check if notes table exists
    const { error: notesError } = await supabase
      .from('notes')
      .select('id')
      .limit(1);
    
    if (notesError) {
      console.error('Error checking notes table:', notesError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking database setup:', error);
    return false;
  }
}
