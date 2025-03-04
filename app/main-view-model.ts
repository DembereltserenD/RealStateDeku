import { Observable } from '@nativescript/core';
import { supabase } from './services/supabase';

interface Property {
    id: string;
    title: string;
    price: number;
    location: string;
    description?: string;
    images: string[];
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    latitude?: number;
    longitude?: number;
    property_type?: string;
    created_at: Date;
}

export class MainViewModel extends Observable {
    private _properties: Property[] = [];
    private _searchQuery: string = '';
    private _isLoading: boolean = false;

    constructor() {
        super();

        // Load sample data for now
        this._properties = [
            {
                id: '1',
                title: 'Modern Downtown Apartment',
                price: 450000,
                location: '123 Main St, Anytown, USA',
                description: 'Beautiful modern apartment in the heart of downtown',
                images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'],
                bedrooms: 3,
                bathrooms: 2,
                area: 2000,
                property_type: 'Apartment',
                created_at: new Date()
            },
            {
                id: '2',
                title: 'Suburban Family Home',
                price: 550000,
                location: '456 Oak Ave, Somewhere, USA',
                description: 'Spacious family home in a quiet neighborhood',
                images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'],
                bedrooms: 4,
                bathrooms: 3,
                area: 2500,
                property_type: 'House',
                created_at: new Date()
            },
            {
                id: '3',
                title: 'Cozy Studio',
                price: 350000,
                location: '789 Pine Rd, Elsewhere, USA',
                description: 'Perfect starter home or investment property',
                images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
                bedrooms: 2,
                bathrooms: 2,
                area: 1500,
                property_type: 'Studio',
                created_at: new Date()
            }
        ];

        this.notifyPropertyChange('properties', this._properties);
        this.fetchProperties(); // Start loading real data
    }

    get Properties(): Property[] {
        return this._properties;
    }

    get searchQuery(): string {
        return this._searchQuery;
    }

    set searchQuery(value: string) {
        if (this._searchQuery !== value) {
            this._searchQuery = value;
            this.notifyPropertyChange('searchQuery', value);
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

    async onSearch() {
        if (!this._searchQuery.trim()) {
            await this.fetchProperties();
            return;
        }

        const searchTerm = this._searchQuery.toLowerCase();
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error searching properties:', error);
                return;
            }

            this._properties = data;
            this.notifyPropertyChange('properties', this._properties);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    onClear() {
        this.searchQuery = '';
        this.fetchProperties();
    }

    async fetchProperties() {
        this.isLoading = true;
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching properties:', error);
                return;
            }

            this._properties = data || this._properties; // Keep sample data if no data from Supabase
            this.notifyPropertyChange('properties', this._properties);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            this.isLoading = false;
        }
    }
}
