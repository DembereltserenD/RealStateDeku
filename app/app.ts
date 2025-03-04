import { Application } from '@nativescript/core';
import './polyfills';
import { initializeSupabase } from './services/supabase';

// Initialize Supabase when the app starts
initializeSupabase();

Application.run({ moduleName: 'app-root' });