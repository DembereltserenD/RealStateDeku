import { Observable, ObservableArray, Frame } from '@nativescript/core';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { Property } from '../../models/property.model';
import * as debounce from 'lodash.debounce';

export class HomeViewModel extends Observable {
  private propertyService: PropertyService;
  private authService: AuthService;
  
  private _properties: ObservableArray<Property>;
  private _favorites: ObservableArray<Property>;
  private _searchQuery: string = '';
  private _selectedTabIndex: number = 0;
  private _isMapLoading: boolean = true;
  private _isLoggedIn: boolean = false;
  private _email: string = '';
  private _password: string = '';
  private _userEmail: string = '';
  private _userAvatar: string = '';
  
  private _filters = {
    minPrice: 0,
    maxPrice: 1000000,
    bedrooms: null,
    bathrooms: null,
    propertyType: null
  };
  
  constructor() {
    super();
    
    this.propertyService = new PropertyService();
    this.authService = new AuthService();
    
    this._properties = new ObservableArray<Property>([]);
    this._favorites = new ObservableArray<Property>([]);
    
    // Create a debounced search function
    this.debouncedSearch = debounce(this.performSearch, 300);
    
    // Check if user is logged in
    this.checkAuthStatus();
    
    // Load initial data
    this.loadProperties();
  }
  
  async checkAuthStatus() {
    const user = await this.authService.getCurrentUser();
    this.isLoggedIn = !!user;
    
    if (user) {
      this.userEmail = user.email;
      this.loadFavorites();
    }
  }
  
  async loadProperties() {
    try {
      const properties = await this.propertyService.getProperties(this._filters);
      this._properties.splice(0);
      properties.forEach(p => this._properties.push(p));
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  }
  
  async loadFavorites() {
    if (!this.isLoggedIn) return;
    
    try {
      const user = this.authService.user;
      const favorites = await this.propertyService.getUserFavorites(user.id);
      this._favorites.splice(0);
      favorites.forEach(f => this._favorites.push(f));
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }
  
  performSearch() {
    // Update filters based on search query
    this.loadProperties();
  }
  
  // Debounced search function will be assigned in constructor
  debouncedSearch: Function;
  
  // Getters and setters
  get properties(): ObservableArray<Property> {
    return this._properties;
  }
  
  get favorites(): ObservableArray<Property> {
    return this._favorites;
  }
  
  get searchQuery(): string {
    return this._searchQuery;
  }
  
  set searchQuery(value: string) {
    if (this._searchQuery !== value) {
      this._searchQuery = value;
      this.notifyPropertyChange('searchQuery', value);
      this.debouncedSearch();
    }
  }
  
  get selectedTabIndex(): number {
    return this._selectedTabIndex;
  }
  
  set selectedTabIndex(value: number) {
    if (this._selectedTabIndex !== value) {
      this._selectedTabIndex = value;
      this.notifyPropertyChange('selectedTabIndex', value);
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
  
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  
  set isLoggedIn(value: boolean) {
    if (this._isLoggedIn !== value) {
      this._isLoggedIn = value;
      this.notifyPropertyChange('isLoggedIn', value);
    }
  }
  
  get email(): string {
    return this._email;
  }
  
  set email(value: string) {
    if (this._email !== value) {
      this._email = value;
      this.notifyPropertyChange('email', value);
    }
  }
  
  get password(): string {
    return this._password;
  }
  
  set password(value: string) {
    if (this._password !== value) {
      this._password = value;
      this.notifyPropertyChange('password', value);
    }
  }
  
  get userEmail(): string {
    return this._userEmail;
  }
  
  set userEmail(value: string) {
    if (this._userEmail !== value) {
      this._userEmail = value;
      this.notifyPropertyChange('userEmail', value);
    }
  }
  
  get userAvatar(): string {
    return this._userAvatar;
  }
  
  set userAvatar(value: string) {
    if (this._userAvatar !== value) {
      this._userAvatar = value;
      this.notifyPropertyChange('userAvatar', value);
    }
  }
  
  // Actions
  async signIn() {
    if (!this.email || !this.password) {
      // Show error message
      return;
    }
    
    const success = await this.authService.signIn(this.email, this.password);
    
    if (success) {
      this.isLoggedIn = true;
      const user = this.authService.user;
      this.userEmail = user.email;
      this.loadFavorites();
      
      // Clear form
      this.email = '';
      this.password = '';
    } else {
      // Show error message
    }
  }
  
  async signUp() {
    if (!this.email || !this.password) {
      // Show error message
      return;
    }
    
    const success = await this.authService.signUp(this.email, this.password);
    
    if (success) {
      this.isLoggedIn = true;
      const user = this.authService.user;
      this.userEmail = user.email;
      
      // Clear form
      this.email = '';
      this.password = '';
    } else {
      // Show error message
    }
  }
  
  async signOut() {
    const success = await this.authService.signOut();
    
    if (success) {
      this.isLoggedIn = false;
      this.userEmail = '';
      this.userAvatar = '';
      this._favorites.splice(0);
    }
  }
  
  navigateToPropertyDetails(propertyId: string) {
    Frame.topmost().navigate({
      moduleName: 'views/property-details/property-details-page',
      context: { propertyId }
    });
  }
  
  navigateToFilters() {
    Frame.topmost().navigate({
      moduleName: 'views/filters/filters-page',
      context: { filters: this._filters },
      transition: { name: 'slideBottom' }
    });
  }
  
  updateFilters(filters) {
    this._filters = { ...filters };
    this.loadProperties();
  }
}