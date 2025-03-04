export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  createdAt: Date;
  latitude: number;
  longitude: number;
}