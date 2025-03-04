import { Observable } from '@nativescript/core';
import { supabase } from './supabase';
import { Property } from '../models/property.model';

export class PropertyService extends Observable {
  async getProperties(filters = {}): Promise<Property[]> {
    try {
      let query = supabase.from('properties').select('*');
      
      // Apply filters if any
      if (filters.hasOwnProperty('minPrice')) {
        query = query.gte('price', filters.minPrice);
      }
      
      if (filters.hasOwnProperty('maxPrice')) {
        query = query.lte('price', filters.maxPrice);
      }
      
      if (filters.hasOwnProperty('bedrooms')) {
        query = query.eq('bedrooms', filters.bedrooms);
      }
      
      // Add pagination
      query = query.range(0, 19);
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching properties:', error);
        return [];
      }
      
      return data as Property[];
    } catch (error) {
      console.error('Exception fetching properties:', error);
      return [];
    }
  }
  
  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching property:', error);
        return null;
      }
      
      return data as Property;
    } catch (error) {
      console.error('Exception fetching property:', error);
      return null;
    }
  }
  
  async toggleFavorite(userId: string, propertyId: string, isFavorite: boolean): Promise<boolean> {
    try {
      if (isFavorite) {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: userId, property_id: propertyId });
          
        return !error;
      } else {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .match({ user_id: userId, property_id: propertyId });
          
        return !error;
      }
    } catch (error) {
      console.error('Exception toggling favorite:', error);
      return false;
    }
  }
  
  async getUserFavorites(userId: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('property_id')
        .eq('user_id', userId);
        
      if (error || !data.length) {
        return [];
      }
      
      const propertyIds = data.map(item => item.property_id);
      
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .in('id', propertyIds);
        
      if (propertiesError) {
        return [];
      }
      
      return properties as Property[];
    } catch (error) {
      console.error('Exception fetching user favorites:', error);
      return [];
    }
  }
}