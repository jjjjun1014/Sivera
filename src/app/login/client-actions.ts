'use client';

import { signOut } from 'aws-amplify/auth';

/**
 * Client-side logout functionality
 */
export async function clientLogout() {
  try {
    console.log('🚪 Logging out...');
    await signOut({ global: true }); // Global sign out
    console.log('✅ Logout successful');
    
    // Clear all local storage
    localStorage.clear();
    sessionStorage.clear();
    
    window.location.href = '/';
  } catch (error) {
    console.error('❌ Logout failed:', error);
    
    // Force clear everything and redirect
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  }
}

/**
 * Emergency logout - clears everything
 */
export async function emergencyLogout() {
  console.log('🚨 Emergency logout');
  localStorage.clear();
  sessionStorage.clear();
  
  try {
    await signOut({ global: true });
  } catch (e) {
    console.log('Sign out error ignored:', e);
  }
  
  window.location.href = '/';
}
