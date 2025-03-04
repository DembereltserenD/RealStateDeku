/*
  # Create properties and user_favorites tables

  1. New Tables
    - `properties`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `price` (numeric, not null)
      - `location` (text, not null)
      - `description` (text)
      - `images` (text array)
      - `bedrooms` (integer)
      - `bathrooms` (integer)
      - `area` (numeric)
      - `created_at` (timestamp with time zone)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `property_type` (text)
      - `status` (text, default 'available')
      - `agent_id` (uuid, references auth.users)
    - `user_favorites`
      - `user_id` (uuid, references auth.users)
      - `property_id` (uuid, references properties)
      - `created_at` (timestamp with time zone)
    - `property_views`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `user_id` (uuid, references auth.users)
      - `viewed_at` (timestamp with time zone)
      - `ip_address` (text)
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to properties
    - Add policies for agents to manage properties
    - Add policies for users to manage their own favorites
    - Add policies for users to view their own views
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    images TEXT[], -- Array of image URLs
    bedrooms INTEGER,
    bathrooms INTEGER,
    area NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    latitude NUMERIC,
    longitude NUMERIC,
    property_type TEXT,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'pending')),
    agent_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policies for properties
CREATE POLICY "Allow public read access" ON properties
    FOR SELECT USING (true);

CREATE POLICY "Allow agents to create properties" ON properties
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Allow agents to update their properties" ON properties
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = agent_id)
    WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Allow agents to delete their properties" ON properties
    FOR DELETE
    TO authenticated
    USING (auth.uid() = agent_id);

-- User Favorites Junction Table
CREATE TABLE IF NOT EXISTS user_favorites (
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    property_id UUID REFERENCES properties(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, property_id)
);

-- Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Policies for user_favorites
CREATE POLICY "Users can manage their own favorites" ON user_favorites
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Property Views Table (for analytics)
CREATE TABLE IF NOT EXISTS property_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT
);

-- Enable RLS
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

-- Policies for property_views
CREATE POLICY "Allow authenticated users to view their own views" ON property_views
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Allow creating view records" ON property_views
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Insert sample data
INSERT INTO properties (title, price, location, description, images, bedrooms, bathrooms, area, property_type, latitude, longitude)
VALUES 
    ('Modern Downtown Apartment', 450000, '123 Main St, Anytown, USA', 
    'Beautiful modern apartment in the heart of downtown', 
    ARRAY['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'],
    3, 2, 2000, 'Apartment', 37.7749, -122.4194),
    
    ('Suburban Family Home', 550000, '456 Oak Ave, Somewhere, USA',
    'Spacious family home in a quiet neighborhood',
    ARRAY['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'],
    4, 3, 2500, 'House', 37.7833, -122.4167),
    
    ('Cozy Studio', 350000, '789 Pine Rd, Elsewhere, USA',
    'Perfect starter home or investment property',
    ARRAY['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
    2, 2, 1500, 'Studio', 37.7855, -122.4001);