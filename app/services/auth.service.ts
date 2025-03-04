import { Observable } from '@nativescript/core';
import { supabase } from './supabase';

export class AuthService extends Observable {
  private _user = null;
  
  get user() {
    return this._user;
  }
  
  set user(value) {
    if (this._user !== value) {
      this._user = value;
      this.notifyPropertyChange('user', value);
    }
  }
  
  async signUp(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        console.error('Sign up error:', error.message);
        return false;
      }
      
      this.user = data.user;
      return true;
    } catch (error) {
      console.error('Exception during sign up:', error);
      return false;
    }
  }
  
  async signIn(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
        return false;
      }
      
      this.user = data.user;
      return true;
    } catch (error) {
      console.error('Exception during sign in:', error);
      return false;
    }
  }
  
  async signOut(): Promise<boolean> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error.message);
        return false;
      }
      
      this.user = null;
      return true;
    } catch (error) {
      console.error('Exception during sign out:', error);
      return false;
    }
  }
  
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data?.user) {
        this.user = null;
        return null;
      }
      
      this.user = data.user;
      return data.user;
    } catch (error) {
      console.error('Exception getting current user:', error);
      this.user = null;
      return null;
    }
  }
}