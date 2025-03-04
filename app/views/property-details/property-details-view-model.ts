import { Observable } from '@nativescript/core';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { Property } from '../../models/property.model';

export class PropertyDetailsViewModel extends Observable {
  private propertyService: PropertyService;
  private authService: AuthService;
  
  private _property: Property;
  private _isLoading: boolean = true;
  private _isMapLoading: boolean = true;
  private _isFavorite: boolean = false;
  
  constructor(propertyId: string) {
    super();
    
    this.propertyService = new PropertyService();
    this.authService = new AuthService();
    
    this.loadProperty(propertyId);
    this.checkFavoriteStatus(propertyId);
  }
  
  async loadProperty(propertyId: string) {
    this.isLoading = true;
    
    try {
      const property = await this.propertyService.getPropertyById(propertyId);
      
      if (property) {
        this.property = property;
      }
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      this.isLoading = false;
    }
  }
  
  async checkFavoriteStatus(propertyId: string) {
    const user = this.authService.user;
    
    if (!user) {
      this.isFavorite = false;
      return;
    }
    
    try {
      const favorites = await this.propertyService.getUserFavorites(user.id);
      this.isFavorite = favorites.some(p => p.id === propertyId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      this.isFavorite = false;
    }
  }
  
  async toggleFavorite() {
    const user = this.authService.user;
    
    if (!user) {
      // Show login prompt
      return;
    }
    
    try {
      const success = await this.propertyService.toggleFavorite(
        user.id,
        this.property.id,
        !this.isFavorite
      );
      
      if (success) {
        this.isFavorite = !this.isFavorite;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }
  
  // Getters and setters
  get property(): Property {
    return this._property;
  }
  
  set property(value: Property) {
    if (this._property !== value) {
      this._property = value;
      this.notifyPropertyChange('property', value);
    }
  }
  
  get isLoading(): boolean {
    return this._isLoading;
  }
  
  set isLoading(value: boolean) {
    if (this._isLoading !== value) {
      this._isLoading = value;
      this.notifyPropertyChange('isLoading', value);
    }
  }
  
  get isMapLoading(): boolean {
    return this._isMapLoading;
  }
  
  set isMapLoading(value: boolean) {
    if (this._isMapLoading !== value) {
      this._isMapLoading = value;
      this.notifyPropertyChange('isMapLoading', value);
    }
  }
  
  get isFavorite(): boolean {
    return this._isFavorite;
  }
  
  set isFavorite(value: boolean) {
    if (this._isFavorite !== value) {
      this._isFavorite = value;
      this.notifyPropertyChange('isFavorite', value);
    }
  }
}