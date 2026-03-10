import { supabase } from './supabase';

export interface AuthError {
  message: string;
  status?: number;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw { message: error.message, status: error.status } as AuthError;
  }

  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw { message: error.message, status: error.status } as AuthError;
  }

  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw { message: error.message, status: error.status } as AuthError;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw { message: error.message, status: error.status } as AuthError;
  }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    throw { message: error.message, status: error.status } as AuthError;
  }

  return user;
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw { message: error.message, status: error.status } as AuthError;
  }

  return session;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw { message: error.message, status: error.status } as AuthError;
  }
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw { message: error.message, status: error.status } as AuthError;
  }
}

// Listen for auth state changes
export function onAuthStateChange(
  callback: (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED', session: null) => void
) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event as 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED', session as null);
  });

  return subscription;
}
