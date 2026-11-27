---
name: Modern Milk Tea Ecosystem
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#59413d'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#8c716b'
  outline-variant: '#e0bfb9'
  surface-tint: '#ac331e'
  primary: '#861705'
  on-primary: '#ffffff'
  primary-container: '#a8301b'
  on-primary-container: '#ffc7bc'
  inverse-primary: '#ffb4a5'
  secondary: '#605e5d'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#666463'
  tertiary: '#004774'
  on-tertiary: '#ffffff'
  tertiary-container: '#005f99'
  on-tertiary-container: '#b4d7ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a5'
  on-primary-fixed: '#3f0400'
  on-primary-fixed-variant: '#8b1b07'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#484646'
  tertiary-fixed: '#cfe5ff'
  tertiary-fixed-dim: '#9acbff'
  on-tertiary-fixed: '#001d34'
  on-tertiary-fixed-variant: '#004a78'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  surface-primary: '#FFFFFF'
  background-neutral: '#EDE9E8'
  brand-primary: '#A8301B'
typography:
  headline-lg:
    fontFamily: K2D
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: K2D
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: K2D
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.25'
  headline-md-mobile:
    fontFamily: K2D
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.25'
  headline-sm:
    fontFamily: K2D
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  subheading:
    fontFamily: K2D
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: K2D
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: K2D
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: K2D
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  caption:
    fontFamily: K2D
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
  button:
    fontFamily: K2D
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies a modern, friendly, and inviting personality tailored for a contemporary beverage experience. The aesthetic balances warm culinary appeal with clean e-commerce utility, evoking a sense of comfort, indulgence, and vibrant energy. 

We adopt a **Minimalism** approach infused with warm tactile elements—relying on generous whitespace, a highly focused color palette, and carefully balanced typography to direct attention to crave-worthy product photography and frictionless ordering flows.

## Colors

The palette is intentionally restrained to highlight the rich, appetizing textures of the beverages. The deep terracotta primary tone (`#A8301B`) drives interactive states, primary CTAs, and active highlights. Crisp white (`#FFFFFF`) serves as the primary surface color for high-contrast readability and card containers, while a soft warm grey (`#EDE9E8`) grounds the experience as a neutral background and structural divider.

## Typography

Powered entirely by **K2D**, the typographic scale utilizes friendly geometric proportions with subtle humanist warmth. Hierarchy is established strictly through variations in size and weight rather than introducing secondary font families. Large display titles adapt responsively for mobile viewports to prevent awkward wrapping, while body text remains optimized for high-density scanning on e-commerce product grids.

## Layout & Spacing

A **fluid grid** system governs the layout, scaling smoothly across mobile (320px+), tablet (768px+), and desktop (1200px+) viewports. Product grids shift dynamically from 1 column on mobile to 2 on tablets and 3 on desktop. Spacing relies on a consistent rhythm built around generous padding to maintain an approachable, uncluttered atmosphere.

## Elevation & Depth

Depth is conveyed through soft, low-opacity ambient shadows and tonal layering rather than heavy borders. Surfaces remain clean and elevated against the neutral background using diffused shadows that impart a friendly, tactile quality without feeling heavy or industrial.

## Shapes

The shape language relies on a **Rounded** profile (`roundedness: 2`), featuring generous corner radii (0.5rem base, scaling up to 1rem–1.5rem for containers and prominent cards). This creates a soft, welcoming silhouette that mirrors the organic curves of beverage cups and pearls, reinforcing the friendly brand narrative.

## Components

- **Buttons:** Primary actions (such as "Đặt ngay") use the `#A8301B` brand color with fully rounded pill or soft-rounded corners, bold K2D typography, and smooth hover elevation. Secondary buttons use ghost styling with neutral borders.
- **Cards:** Product cards feature `#FFFFFF` surfaces against the `#EDE9E8` background, housing imagery with generous internal padding, soft drop shadows, and clearly bounded customization triggers.
- **Input Fields:** Search bars, checkout forms, and option selectors feature clean neutral backgrounds, soft rounded borders, and high-contrast active states.
- **Chips & Tags:** Used for granular product customizations (ice level, sugar level, toppings) with toggle states that invert between neutral and primary brand colors.
- **Navigation & Modals:** Sticky headers with integrated cart counters, user account triggers, and quick-access regional support channels (Zalo, hotline).