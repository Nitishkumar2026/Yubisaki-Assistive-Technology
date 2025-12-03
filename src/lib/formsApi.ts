import { supabase } from './supabaseClient';

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Contact form submit
export async function submitContact({ name, email, subject, message }: ContactData) {
  if (!supabase) {
    throw new Error("Database connection is not available. Please check your configuration.");
  }
  
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, subject, message }]);

    if (error) {
      // Handle network errors
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
      }
      throw error;
    }
    return data;
  } catch (err: any) {
    // Re-throw with better error message if it's a network error
    if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
    }
    throw err;
  }
}

// Newsletter subscribe
export async function subscribeNewsletter(email: string) {
  if (!supabase) {
    throw new Error("Database connection is not available. Please check your configuration.");
  }

  try {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert([{ email }]);

    if (error) {
      // Handle unique constraint violation for existing emails
      if (error.code === '23505') {
        throw new Error('This email is already subscribed.');
      }
      // Handle network errors
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
      }
      throw error;
    }
    return data;
  } catch (err: any) {
    // Re-throw with better error message if it's a network error
    if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
    }
    throw err;
  }
}
