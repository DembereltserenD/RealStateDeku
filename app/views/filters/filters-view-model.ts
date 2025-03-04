import { Observable } from '@nativescript/core';

export class FiltersViewModel extends Observable {
  private _minPrice: number;
  private _maxPrice: number;
  private _sliderMinPrice: number;
  private _sliderMaxPrice: number;
  private _selectedBedrooms: number = null;
  private _selectedBathrooms: number = null;
  private _selectedPropertyType: string = null;
  private _hasParking: boolean = false;
  private _hasPool: boolean = false;
  private _petsAllowed: boolean = false;
  
  constructor(filters = {}) {
    super();
    
    // Initialize with existing filters or defaults
    this._minPrice = filters.minPrice || 0;
    this._maxPrice = filters.maxPrice || 1000000;
    this._sliderMinPrice = this._minPrice;
    this._sliderMaxPrice = this._maxPrice;
    this._selectedBedrooms = filters.bedrooms || null;
    this._selectedBathrooms = filters.bathrooms || null;
    this._selectedPropertyType = filters.propertyType || null;
    this._hasParking = filters.hasParking || false;
    this._hasPool = filters.hasPool || false;
    this._petsAllowed = filters.petsAllowed || false;
  }
  
  // Getters and setters
  get minPrice(): number {
    return this._minPrice;
  }
  
  set minPrice(value: number) {
    if (this._minPrice !== value) {
      this._minPrice = value;
      this.notifyPropertyChange('minPrice', value);
      this._sliderMinPrice = value;
      this.notifyPropertyChange('sliderMinPrice', value);
    }
  }
  
  get maxPrice(): number {
    return this._maxPrice;
  }
  
  set maxPrice(value: number) {
    if (this._maxPrice !== value) {
      this._maxPrice = value;
      this.notifyPropertyChange('maxPrice', value);
      this._sliderMaxPrice = value;
      this.notifyPropertyChange('sliderMaxPrice', value);
    }
  }
  
  get sliderMinPrice(): number {
    return this._sliderMinPrice;
  }
  
  set sliderMinPrice(value: number) {
    if (this._sliderMinPrice !== value) {
      this._sliderMinPrice = value;
      this.notifyPropertyChange('sliderMinPrice', value);
      this._minPrice = value;
      this.notifyPropertyChange('minPrice', value);
    }
  }
  
  get sliderMaxPrice(): number {
    return this._sliderMaxPrice;
  }
  
  set sliderMaxPrice(value: number) {
    if (this._sliderMaxPrice !== value) {
      this._sliderMaxPrice = value;
      this.notifyPropertyChange('sliderMaxPrice', value);
      this._maxPrice = value;
      this.notifyPropertyChange('maxPrice', value);
    }
  }
  
  get selectedBedrooms(): number {
    return this._selectedBedrooms;
  }
  
  set selectedBedrooms(value: number) {
    if (this._selectedBedrooms !== value) {
      this._selectedBedrooms = value;
      this.notifyPropertyChange('selectedBedrooms', value);
    }
  }
  
  get selectedBathrooms(): number {
    return this._selectedBathrooms;
  }
  
  set selectedBathrooms(value: number) {
    if (this._selectedBathrooms !== value) {
      this._selectedBathrooms = value;
      this.notifyPropertyChange('selectedBathrooms', value);
    }
  }
  
  get selectedPropertyType(): string {
    return this._selectedPropertyType;
  }
  
  set selectedPropertyType(value: string) {
    if (this._selectedPropertyType !== value) {
      this._selectedPropertyType = value;
      this.notifyPropertyChange('selectedPropertyType', value);
    }
  }
  
  get hasParking(): boolean {
    return this._hasParking;
  }
  
  set hasParking(value: boolean) {
    if (this._hasParking !== value) {
      this._hasParking = value;
      this.notifyPropertyChange('hasParking', value);
    }
  }
  
  get hasPool(): boolean {
    return this._hasPool;
  }
  
  set hasPool(value: boolean) {
    if (this._hasPool !== value) {
      this._hasPool = value;
      this.notifyPropertyChange('hasPool', value);
    }
  }
  
  get petsAllowed(): boolean {
    return this._petsAllowed;
  }
  
  set petsAllowed(value: boolean) {
    if (this._petsAllowed !== value) {
      this._petsAllowed = value;
      this.notifyPropertyChange('petsAllowed', value);
    }
  }
  
  // Get all filters as an object
  getFilters() {
    return {
      minPrice: this._minPrice,
      maxPrice: this._maxPrice,
      bedrooms: this._selectedBedrooms,
      bathrooms: this._selectedBathrooms,
      propertyType: this._selectedPropertyType,
      hasParking: this._hasParking,
      hasPool: this._hasPool,
      petsAllowed: this._petsAllowed
    };
  }
  
  // Reset all filters to default values
  resetFilters() {
    this.minPrice = 0;
    this.maxPrice = 1000000;
    this.selectedBedrooms = null;
    this.selectedBathrooms = null;
    this.selectedPropertyType = null;
    this.hasParking = false;
    this.hasPool = false;
    this.petsAllowed = false;
  }
}