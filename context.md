# Deku Real Estate App - Project Context

## Tech Stack & Architecture

### Core Technologies
- NativeScript: Cross-platform mobile development
- Supabase: Backend services (Auth, Database, Storage)
- TypeScript: Type safety and better developer experience

### Performance Hacks

#### 1. Image Optimization
```typescript
// components/PropertyCard.xml
<Image 
    src="{{ images[0] }}" 
    loadMode="async"
    stretch="aspectFill"
    cache="memory" />

// In view model
import { ImageCache } from '@nativescript/core';

// Preload next 3 images
property.images.slice(1, 4).forEach(url => {
    ImageCache.getInstance().push({
        url: url,
        key: url,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    });
});
```

#### 2. List Performance
```typescript
// Use RadListView for better performance
<RadListView
    items="{{ properties }}"
    loadOnDemandMode="Auto"
    loadOnDemandBufferSize="2"
    pullToRefresh="true">
    
    // Enable UI virtualization
    <RadListView.listViewLayout>
        <ListViewLinearLayout 
            scrollDirection="Vertical"
            itemHeight="400"
            enableGlobalScrolling="true" />
    </RadListView.listViewLayout>
</RadListView>

// Implement infinite scroll
onLoadMoreDataRequested(args: LoadOnDemandListViewEventData) {
    const listView = args.object;
    const lastIndex = this._properties.length;
    
    this.fetchProperties(lastIndex, 20).then(() => {
        listView.notifyLoadOnDemandFinished();
    });
}
```

#### 3. Search Optimization
```typescript
// Debounced search with RxJS
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export class MainViewModel extends Observable {
    private searchSubject = new BehaviorSubject<string>('');
    
    constructor() {
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(query => {
            this.performSearch(query);
        });
    }
}
```

#### 4. Memory Management
```typescript
// Clear image cache when low memory
import { Application } from '@nativescript/core';

Application.on(Application.lowMemoryEvent, () => {
    ImageCache.getInstance().clear();
});

// Properly dispose resources
export class MainViewModel extends Observable {
    private clearSubscriptions() {
        this.searchSubject?.unsubscribe();
        // Clear other subscriptions
    }
    
    public onUnloaded() {
        this.clearSubscriptions();
    }
}
```

### Database Schema

```sql
-- Properties Table
CREATE TABLE properties (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    images TEXT[],
    bedrooms INTEGER,
    bathrooms INTEGER,
    area NUMERIC,
    created_at TIMESTAMPTZ,
    latitude NUMERIC,
    longitude NUMERIC,
    property_type TEXT,
    status TEXT,
    agent_id UUID
);

-- User Favorites Table
CREATE TABLE user_favorites (
    user_id UUID,
    property_id UUID,
    created_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, property_id)
);

-- Property Views Table
CREATE TABLE property_views (
    id UUID PRIMARY KEY,
    property_id UUID,
    user_id UUID,
    viewed_at TIMESTAMPTZ,
    ip_address TEXT
);
```

### Project Structure
```
app/
├── components/         # Reusable UI components
│   ├── PropertyCard.xml
│   └── PropertyList.xml
├── screens/           # Main app screens
├── services/          # API and service layer
│   └── supabase.ts    # Supabase client
├── store/            # State management
├── lib/              # Utilities
└── assets/           # Images and resources
```

### Features Implemented
1. Property Listings
   - Grid view of properties
   - Property cards with images
   - Basic property details
   - Search functionality

2. Data Management
   - Supabase integration
   - Real-time updates
   - Error handling
   - Loading states

3. UI/UX
   - Modern, clean design
   - Responsive layout
   - Image optimization
   - Search bar

### Security
1. Row Level Security (RLS)
   - Public read access for properties
   - Authenticated user policies
   - Agent-specific policies

2. Data Protection
   - Input validation
   - SQL injection prevention
   - Secure image handling

### Next Steps
1. Authentication
   - User registration
   - Login/logout
   - Profile management

2. Property Details
   - Full property information
   - Image gallery
   - Contact agent
   - Similar properties

3. Favorites System
   - Save properties
   - View saved list
   - Remove from favorites

4. Map Integration
   ```typescript
   // Using nativescript-google-maps-sdk
   <MapView
       latitude="{{ region.latitude }}"
       longitude="{{ region.longitude }}"
       zoom="{{ region.zoom }}"
       bearing="{{ region.bearing }}">
       
       <Marker
           latitude="{{ property.latitude }}"
           longitude="{{ property.longitude }}"
           title="{{ property.title }}"
           snippet="{{ property.price }}" />
   </MapView>
   
   // Implement clustering
   const markers = this.properties.map(p => ({
       position: { lat: p.latitude, lng: p.longitude },
       properties: p
   }));
   
   const clusters = supercluster({
       points: markers,
       zoom: this.currentZoom,
       options: { radius: 40, maxZoom: 16 }
   });
   ```

5. Agent Features
   - Property management
   - Listing creation
   - Analytics dashboard

### Development Guidelines
1. Code Style
   - TypeScript strict mode
   - Consistent naming
   - Component modularity

2. Testing
   ```typescript
   // Unit test example
   describe('PropertyViewModel', () => {
       it('should filter properties by price range', () => {
           const vm = new PropertyViewModel();
           vm.setPriceRange(200000, 500000);
           expect(vm.filteredProperties.every(p => 
               p.price >= 200000 && p.price <= 500000
           )).toBe(true);
       });
   });
   ```

3. Documentation
   - Code comments
   - API documentation
   - Setup guides

### Error Handling
```typescript
try {
    const { data, error } = await supabase
        .from('properties')
        .select('*');
    
    if (error) throw error;
    
    // Handle success
} catch (error) {
    console.error('Error:', error);
    // Show user-friendly error
    this.showError('Failed to load properties. Please try again.');
}
```

### Performance Optimizations
1. Image Loading
   - Lazy loading
   - Caching
   - Compression

2. Data Fetching
   - Pagination
   - Infinite scroll
   - Search debouncing

3. UI Performance
   - Component optimization
   - List virtualization
   - Memory management

### Environment Setup
```typescript
// supabase.ts
export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true
        }
    }
);
```

### State Management
```typescript
export class MainViewModel extends Observable {
    private _properties: Property[] = [];
    private _isLoading = false;

    async fetchProperties() {
        this.isLoading = true;
        try {
            // Fetch data
        } finally {
            this.isLoading = false;
        }
    }
}
```

### Design System

#### Theme Configuration
```typescript
// app/theme/index.ts
export const theme = {
    colors: {
        primary: '#D4AF37',
        background: '#030404',
        text: {
            light: '#F0F0F0',
            dark: '#030404'
        },
        states: {
            hover: '#E5C158',
            pressed: '#C3A033',
            disabled: '#8C7324'
        },
        status: {
            success: '#4CAF50',
            error: '#F44336',
            warning: '#FFC107'
        }
    },
    typography: {
        fontFamily: 'Montserrat',
        weights: {
            regular: '400',
            medium: '500',
            semiBold: '600',
            bold: '700'
        },
        sizes: {
            xs: 12,
            sm: 14,
            base: 16,
            lg: 18,
            xl: 20,
            '2xl': 24,
            '3xl': 30
        }
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32
    }
};

// app/theme/styles.ts
export const globalStyles = `
    .page {
        background-color: ${theme.colors.background};
        color: ${theme.colors.text.light};
    }

    .heading {
        font-family: ${theme.typography.fontFamily};
        font-weight: ${theme.typography.weights.bold};
        color: ${theme.colors.text.light};
    }

    .btn-primary {
        background-color: ${theme.colors.primary};
        color: ${theme.colors.text.dark};
        font-weight: ${theme.typography.weights.semiBold};
    }

    .btn-primary:highlighted {
        background-color: ${theme.colors.states.pressed};
    }

    .btn-primary:disabled {
        background-color: ${theme.colors.states.disabled};
        opacity: 0.7;
    }
`;

// Example Component Implementation
// components/PropertyCard.xml
<GridLayout class="property-card">
    <Image src="{{ image }}" stretch="aspectFill" />
    <StackLayout class="property-info">
        <Label text="{{ price }}" class="price-label" />
        <Label text="{{ location }}" class="location-label" />
    </StackLayout>
</GridLayout>

// components/PropertyCard.ts
@CSSType('.property-card')
export class PropertyCard extends GridLayout {
    // Custom styles applied via CSS
}

// app.css
.property-card {
    background-color: ${theme.colors.background};
    border-radius: 8;
    elevation: 3;
    margin: ${theme.spacing.sm};
}

.price-label {
    color: ${theme.colors.primary};
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.sizes.xl};
    font-weight: ${theme.typography.weights.bold};
}

.location-label {
    color: ${theme.colors.text.light};
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.sizes.base};
    font-weight: ${theme.typography.weights.medium};
}
```

#### Accessibility Features
```typescript
// app/utils/accessibility.ts
export const accessibilityUtils = {
    // High contrast mode
    enableHighContrast() {
        return {
            primary: '#FFD700', // Brighter gold
            background: '#000000', // Pure black
            text: {
                light: '#FFFFFF', // Pure white
                dark: '#000000'
            }
        };
    },

    // Dynamic text sizing
    getAccessibleFontSize(baseSize: number, scaleFactor: number): number {
        return baseSize * scaleFactor;
    },

    // Screen reader text
    setAccessibilityText(element: View, text: string) {
        if (isAndroid) {
            element.android.setContentDescription(text);
        } else if (isIOS) {
            element.ios.accessibilityLabel = text;
        }
    }
};

// Implementation example
export class PropertyCard extends GridLayout {
    onLoaded() {
        super.onLoaded();
        
        // Set accessibility text
        accessibilityUtils.setAccessibilityText(
            this.price,
            `Property price: ${this.price.text}`
        );

        // Apply high contrast if needed
        if (this.isHighContrastEnabled) {
            const highContrastTheme = accessibilityUtils.enableHighContrast();
            this.style.backgroundColor = highContrastTheme.background;
            this.price.style.color = highContrastTheme.primary;
        }
    }
}
```

#### Component Guidelines
1. **Consistent Spacing**
   - Use predefined spacing values
   - Maintain consistent padding/margins
   - Follow 8-point grid system

2. **Color Usage**
   - Primary color for CTAs and highlights
   - Background color for main surfaces
   - Text colors for optimal readability
   - Status colors for feedback

3. **Typography Hierarchy**
   - Headings: Bold, larger sizes
   - Body text: Regular weight
   - CTAs: SemiBold weight
   - Labels: Medium weight

4. **Interactive States**
   - Hover: Lighter shade of primary
   - Pressed: Darker shade of primary
   - Disabled: Reduced opacity
   - Focus: Clear visual indicator

5. **Accessibility**
   - WCAG 2.1 compliance
   - High contrast mode support
   - Screen reader compatibility
   - Dynamic text sizing