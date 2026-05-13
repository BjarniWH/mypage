# Web Bureau App - Setup Complete ✨

A professional, modern web bureau application built with Angular, featuring glass morphism design, warm color palette, and smooth GSAP animations.

## Features Included

✅ **Pages**

- Home - Hero section with floating cards, feature cards, and animations
- About - Team story, stats display, and core values
- Portfolio - Showcase of 6 sample projects with hover effects
- Contact - Professional contact form with validation and info cards

✅ **Design System**

- Glass morphism UI components with backdrop blur effects
- Warm color palette (warm yellows, oranges, and amber tones)
- Responsive grid layouts for all screen sizes
- Smooth transitions and hover effects throughout

✅ **Theme Support**

- Dark and Light mode toggle in navigation
- Theme preference persisted to localStorage
- System preference detection as fallback
- Smooth transitions between themes

✅ **Animations**

- GSAP animations for hero elements
- Staggered animations for cards and lists
- Floating animations for visual interest
- Smooth page transitions

## Project Structure

```
apps/web-bureau/
├── src/
│   ├── app/
│   │   ├── layout/
│   │   │   ├── layout.component.ts (Navigation & Footer)
│   │   │   └── layout.component.scss
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── about/
│   │   │   ├── portfolio/
│   │   │   └── contact/
│   │   ├── services/
│   │   │   └── theme.service.ts (Dark/Light mode)
│   │   ├── app.routes.ts
│   │   └── app.ts
│   ├── styles.scss (Global styles)
│   └── main.ts
└── vite.config.mts

```

## Technologies Used

- **Angular 21.1.1** - Modern standalone components
- **GSAP** - Smooth animations
- **SCSS** - Advanced styling with variables and mixins
- **TypeScript** - Type safety
- **Reactive Forms** - Contact form validation
- **Nx** - Monorepo management

## Color Palette

### Light Mode

- Primary: #f5a962 (Warm Orange)
- Secondary: #ff9456 (Warm Coral)
- Accent: #fff5e6 (Warm Cream)
- Text Dark: #2d2d2d
- Background: #fafaf8

### Dark Mode

- Primary: #ff9d6a
- Secondary: #f5a962
- Background: #1a1a1a
- Text: #f5f5f5

## Getting Started

```bash
# Serve the app in development mode
nx serve web-bureau

# Build for production
nx build web-bureau

# Run tests
nx test web-bureau

# Run e2e tests
nx e2e web-bureau-e2e
```

The app will be available at `http://localhost:4200`

## Key Files

- **Layout**: `apps/web-bureau/src/app/layout/layout.component.ts` - Main navigation and footer
- **Theme Service**: `apps/web-bureau/src/app/services/theme.service.ts` - Dark/light mode management
- **Global Styles**: `apps/web-bureau/src/styles.scss` - CSS variables and glass morphism base
- **Routes**: `apps/web-bureau/src/app/app.routes.ts` - Application routing configuration

## Customization Tips

1. **Colors**: Update CSS variables in `styles.scss` `:root` selector
2. **Fonts**: Modify font-family in global styles
3. **Effects**: Adjust GSAP animation parameters in each page component
4. **Content**: Replace placeholder text and images in each page component

---

Created with ❤️ using Angular and GSAP
