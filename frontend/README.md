# Multi-Tenant Storefront

A simple multi-tenant storefront application built with React.js where users can select and customize themes for their stores.

## Features

- **Multi-Tenant Support**: Manage multiple stores (tenants) with individual theme settings
- **Theme Selection**: Choose from 3 predefined themes (Modern, Classic, Minimal)
- **Theme Customization**: Edit theme colors, fonts, and styling through an intuitive editor
- **Live Preview**: See your theme changes in real-time on the storefront
- **Persistent Storage**: All theme customizations are saved to localStorage

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Dashboard** (`/dashboard`): 
   - Select a store (tenant)
   - Choose a theme from the available options
   - Click "Edit" to customize theme colors
   - Click "View Storefront" to see your store

2. **Storefront** (`/storefront`):
   - View your store with the selected theme
   - Navigate back to dashboard to make changes

## Themes

- **Modern**: Blue and purple color scheme with rounded corners
- **Classic**: Red and gold color scheme with traditional styling
- **Minimal**: Black and white minimalist design

## Technologies

- React.js 18
- React Router DOM
- Tailwind CSS
- Vite
- JavaScript (ES6+)

