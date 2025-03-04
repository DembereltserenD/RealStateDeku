# Deku Real Estate App

A mobile real estate application built with NativeScript and Supabase.

## Features

- Browse property listings with advanced filtering
- View property details with image galleries
- Save favorite properties
- User authentication
- Interactive map view of properties
- Search functionality

## Setup Instructions

### Prerequisites

- Node.js (LTS version)
- NativeScript CLI
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a Supabase project and update the credentials in `app/services/supabase.ts`
4. Run the migrations in the `supabase/migrations` folder to set up your database schema
5. Run the application:
   ```
   ns run android
   ```
   or
   ```
   ns run ios
   ```

## Project Structure

- `app/`: Main application code
  - `models/`: Data models
  - `services/`: API and data services
  - `views/`: UI components and screens
- `supabase/`: Supabase configuration and migrations

## Database Schema

The application uses the following tables:

- `properties`: Stores property listings
- `user_favorites`: Junction table for user favorites

## Development

### Adding New Features

1. Create or modify the appropriate model in `app/models/`
2. Update or create services in `app/services/`
3. Create the UI components in `app/views/`
4. Update the navigation as needed

### Styling

The application uses TailwindCSS for styling. Modify the `tailwind.config.js` file to customize the theme.

## Deployment

1. Build the application for production:
   ```
   ns build android --release
   ```
   or
   ```
   ns build ios --release
   ```

2. Follow the platform-specific instructions for publishing to app stores.

## License

MIT