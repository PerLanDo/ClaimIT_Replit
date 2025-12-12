# ClaimIT - Design Guidelines

## Design Approach
**Reference-Based**: University campus application with established design patterns. Drawing inspiration from modern campus applications and lost-and-found platforms while maintaining MSU-IIT brand identity.

## Color System

### Light Mode (Default)
- **Primary (Maroon)**: `#800000` - All primary actions, headings, and CTAs
- **Secondary (Gold)**: `#FFD700` - Highlights, active states, secondary elements
- **Background**: `linear-gradient(135deg, #F5F5F5 0%, #FAFAFA 100%)`
- **Card Background**: `#FFFFFF`
- **Text Primary**: `#333333`
- **Text Secondary**: `#555555`
- **Borders**: `#E0E0E0`

### Dark Mode
- **Primary (Bright Maroon)**: `#C92A2A` - Enhanced visibility
- **Secondary (Gold)**: `#FFD43B` - Bright contrast
- **Background**: `linear-gradient(135deg, #1A1B1E 0%, #25262B 100%)`
- **Card Background**: `#25262B`
- **Content Background**: `#2C2E33`
- **Text Primary**: `#F1F3F5`
- **Text Secondary**: `#CED4DA`
- **Borders**: `#373A40`

### Gradients
- **Primary**: Light: `linear-gradient(135deg, #800000 0%, #A00000 50%, #600000 100%)` | Dark: `linear-gradient(135deg, #C92A2A 0%, #A61E1E 50%, #800000 100%)`
- **Gold**: Light: `linear-gradient(135deg, #FFD700 0%, #FFDF40 50%, #D4A745 100%)` | Dark: `linear-gradient(135deg, #FFD43B 0%, #FFC107 50%, #FF9800 100%)`

## Typography
- **Headings**: Bold, 32px (H1), 24px (H2), 18px (H3)
- **Body**: Regular, 16px
- **Small Text**: 14px for metadata, timestamps
- **Font Weight**: 400 (regular), 600 (semibold), 700 (bold)

## Spacing System
Use Tailwind units: **2, 4, 6, 8, 12, 16, 20, 24** for consistent spacing
- Component padding: `p-4` to `p-6`
- Section spacing: `mb-8` to `mb-12`
- Card spacing: `p-6`

## Shadows
- **Small**: Light: `0 2px 8px rgba(128, 0, 0, 0.08)` | Dark: `0 2px 8px rgba(0, 0, 0, 0.6)`
- **Medium**: Light: `0 4px 20px rgba(128, 0, 0, 0.12)` | Dark: `0 4px 20px rgba(0, 0, 0, 0.7)`
- **Large**: Light: `0 10px 40px rgba(128, 0, 0, 0.15)` | Dark: `0 10px 40px rgba(0, 0, 0, 0.8)`

## Component Specifications

### Login Screen
- Centered vertical layout
- MSU-IIT logo at top (100px height with maroon border)
- "ClaimIT" branding below logo
- "Sign in with My.IIT" button (gold gradient, full width)
- Footer: "Managed by SID & ICTC" (small text, bottom)

### Dashboard
- **Top Bar**: Search bar (centered), Profile avatar (right), Notification bell with badge (right)
- **Tab Navigation**: "LOST" | "FOUND" | "ALL" with gold underline on active
- **Item Grid**: 2 columns mobile, 3-4 columns desktop
- **Item Cards**: Rounded 12px, medium shadow, 16:9 thumbnail, status badge (top-left: LOST=red, FOUND=gold), title, location (pin icon), date (clock icon)
- **FAB**: Maroon circle with white + icon, bottom-right corner

### Report Item
- **Toggle**: Segmented control - "I LOST something" (red active) / "I FOUND something" (gold active)
- **Form Fields**: Title, Category dropdown, Location, Description (textarea)
- **Photo Upload**: Dashed border zone, camera icon, "Photo Upload Zone" text
- **Wallet Warning**: Yellow banner with alert icon - "For Wallets: Upload photo of EXTERIOR only"
- **Found Options**: Two large buttons with icons - "Turn over to SID" (building icon) | "Keep for Peer-to-Peer" (handshake icon)

### Item Details
- Back button (top-left)
- Hero image (16:9, full-width)
- Content card with padding
- Title (large, bold), Reporter (avatar + name), Metadata (date, location with icons), Description
- Expandable "Show Item QR" section
- Action buttons (fixed bottom): "Claim This Item" (gold, primary) + "Message Finder" (outline, secondary)

### Claims Modal
- Overlay with backdrop blur
- Card with rounded corners
- "Proof of Ownership" textarea (min 50 chars)
- Optional file upload
- Submit button (gold gradient)

### Admin Dashboard (Tablet-Optimized)
- **Stats Grid**: 4 cards - Total Items, Pending Claims, Returned, Recovery Rate (with mini trend graphs)
- **Recent Activity Table**: Date, Item, Location, Status columns with color-coded badges
- Clean table design with alternating row colors

## Images
**Use real campus imagery where applicable:**
- Login screen: MSU-IIT campus photo or iconic building as subtle background
- Item thumbnails: Actual lost/found item photos uploaded by users
- Profile avatars: User photos from university system

## Interactions
- Theme auto-detection on load with manual toggle
- Smooth theme transitions (200ms ease-in-out)
- Minimal animations - focus on performance
- Real-time updates for messages and notifications
- Mobile-first responsive breakpoints