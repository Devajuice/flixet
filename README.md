# 🎬 Flixet

A modern, free movie and TV show streaming aggregator built with Next.js. Stream thousands of movies and TV shows without any subscription.

## ✨ Features

- 🆓 **100% Free** - No subscription, no account required
- 🎬 **Huge Library** - Thousands of movies and TV shows
- 📱 **Fully Responsive** - Perfect experience on mobile, tablet, and desktop
- 🔍 **Smart Search** - Instant search with real-time results across movies and TV
- 📚 **Personal Watchlist** - Save your favorite content to watch later
- 🔄 **Multiple Servers** - Switch between streaming sources if one doesn't work
- 📺 **TV Show Support** - Full season and episode selection with OMDB ratings
- ⭐ **External Ratings** - IMDb, Rotten Tomatoes, and Metacritic scores on movie/TV detail pages (via OMDB, when available)
- ⏱️ **Movie End Time** - Movie pages show estimated finish time based on runtime and your device’s current time
- 🎨 **Modern UI** - Cinematic dark/glass interface with a neutral palette, white primary actions, and yellow rating accents
- 💊 **Floating Navbar** - A pill-shaped, glass-morphism navbar that floats and stays centered while scrolling
- 📱 **Bottom Sheet Menu** - Mobile bottom sheet menu optimized for one-handed use
- 🏠 **Cinematic Home** - Auto-rotating hero carousel, genre card grid, and uniform content rows
- 🏷️ **Split-Tile Cards** - Poster + info-bar cards used consistently across home rows and catalog grids
- 🗂️ **Rich Browse Pages** - Movies and TV share a redesigned catalog page with a genre rail, inline sort dropdown, slide-in filter drawer, and an Infinite/Pages view toggle
- ⚡ **Fast Performance** - Built with Next.js 16 (App Router, Turbopack) with optimized font loading
- 🎯 **Advanced Filters** - Filter by genre, rating, decade presets, a dual-thumb year slider, or an exact release-date range
- 🚀 **Coming Soon** - Dedicated pages for upcoming movies and airing TV shows
- ♾️ **Infinite Scroll** - Seamlessly load more content as you browse
- 🎞️ **Continue Watching** - Pick up right where you left off with episode tracking
- 🖼️ **Image Handling** - Next.js `Image` with unoptimized delivery for TMDB assets to avoid Vercel image-transformation quota issues
- ♿️ **Accessibility** - Focus states, skip-to-content, reduced-motion support, and ARIA improvements
- 💫 **Loading Skeletons** - Smooth loading states with shimmer animations
- 🧯 **Route Resilience** - Route-level loading/error boundaries for key pages
- ⌨️ **Debounced Search** - Optimized search input with 300ms delay
- 🎭 **Actor Pages** - Dedicated pages with filmography split into Known For / Movies / TV
- 🔥 **Top Rated & Trending TV** - Sort the TV browse page by rating or popularity
- 🕘 **Recently Viewed** - Quickly jump back to titles you watched recently
- 🔗 **Share Buttons** - Share movies and shows via native share or copy link
- 🎲 **Random Picker** - One-click random movie/TV show discovery
- 📈 **Real Progress Tracking** - Watch time measured and stored as viewing progress
- 🔔 **Toast Notifications** - Non-blocking feedback for share, watchlist, and error states, with optional undo actions
- 💬 **Rich Tooltips** - Contextual hints on hover *and* keyboard focus, flipping automatically at screen edges
- 📑 **FAQ Accordions** - Collapsible "Quick answers" panels on the Terms, Privacy, and DMCA pages
- 🔢 **Paged Browsing** - Toggle the catalog between infinite scroll and page-number pagination
- 🎚️ **Range Slider** - Dual-thumb year filter, fully keyboard-operable, debounced so a drag costs one request
- 📅 **Date Range Picker** - Calendar popover for exact release-date filtering (single or from/to range)

## To Do

- [x] ~~Continue Watching~~
- [x] ~~Infinite Scroll~~
- [x] ~~Coming Soon Section~~
- [x] ~~Advanced Filters~~
- [x] ~~Mobile Responsive Design~~
- [x] ~~Make Watchlist page better~~
- [x] ~~Next.js Image Optimization~~
- [x] ~~Accessibility Improvements~~
- [x] ~~Loading Skeleton States~~
- [x] ~~Debounced Search~~
- [x] ~~Random Movie Picker~~
- [x] ~~Actor/Person Pages~~
- [x] ~~Top Rated & Trending TV~~
- [x] ~~Recently Viewed~~
- [x] ~~Share Buttons~~
- [x] ~~Real Progress Tracking~~
- [x] ~~Visual Redesign (blue theme, home + navbar + browse pages)~~
- [x] ~~Floating Pill Navbar~~
- [x] ~~Amber/Orange Color Scheme (black base)~~
- [x] ~~Mobile Bottom Sheet Menu~~
- [x] ~~Split-Tile Card Redesign (home rows + catalog grids)~~
- [x] ~~Episode List Improvements (2-column grid, compact mobile cards)~~
- [x] ~~UI Primitives (toast, tooltip, accordion, pagination, range slider, calendar)~~
- [x] ~~Paged Browsing Mode (toggle alongside infinite scroll)~~

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) with Turbopack
- **Language:** JavaScript/React
- **Styling:** In-line styles + CSS-in-JS (styled-jsx) + Global CSS with design tokens
- **Animation:** Framer Motion
- **State Management:** React Context API
- **Icons:** Lucide React
- **API:** TMDB (The Movie Database) + OMDB
- **Deployment:** Vercel
- **Storage:** LocalStorage for watchlist and continue watching persistence
- **Image Delivery:** Next.js `Image` with TMDB direct (unoptimized) loading to avoid Vercel image-transform quota issues

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- TMDb API key ([Get it free here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/Flixet.git
cd Flixet
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

3. **Create environment file:**

Create a `.env.local` file in the root directory:

```bash
TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key_here
NEXT_PUBLIC_TMDB_REGION=IN
```

> `TMDB_API_KEY` is read server-side only. Browser requests go through the
> `/api/tmdb/[...path]` proxy, which caches responses and keeps the key out of
> the client bundle.

4. **Run the development server:**

```bash
npm run dev
# or
yarn dev
```

5. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```bash
Flixet/
├── app/
│   ├── movie/[id]/           # Movie detail page
│   ├── tv/[id]/              # TV show detail page (episodes, seasons, metadata)
│   ├── person/[id]/          # Actor/person detail page (filmography tabs)
│   ├── movies/               # Browse movies with filters
│   ├── tv/                   # Browse TV shows (incl. Top Rated / Trending sorts)

│   ├── coming-soon/
│   │   ├── movies/           # Upcoming movies page
│   │   └── tv/               # On-the-air TV shows page
│   ├── watchlist/            # Watchlist page
│   ├── search/               # Search results page
│   ├── page.js               # Home page
│   ├── globals.css           # Global styles, design tokens, media queries
│   └── layout.js             # Root layout
├── components/
│   ├── Header.js             # Floating pill navbar + mobile bottom sheet menu (active-link highlight)
│   ├── Footer.js             # Footer with links and disclaimer
│   ├── SearchBar.js          # Search input with dropdown (debounced)
│   ├── ScrollRow.js          # Horizontal scrollable row (inline section header)
│   ├── MediaCard.js          # Universal media card (Next.js Image)
│   ├── CatalogPage.js        # Shared Movies/TV browse template (genre rail, sort, filter drawer)
│   ├── VideoPlayer.js        # Embedded video player with server switching (lazy-loaded)
│   ├── WatchlistButton.js    # Add/remove watchlist button (tooltip + toast)
│   ├── ContinueWatchingSection.js  # Resume watching section
│   ├── Skeleton.js          # Reusable loading skeleton components
│   ├── SearchResults.js     # Search results grid
│   ├── RandomPicker.js       # Random movie/TV picker (header + mobile menu)
│   ├── ShareButton.js        # Share / copy-link button
│   ├── ToastContainer.js     # Toast stack renderer (messenger)
│   ├── Tooltip.js            # Viewport-fixed tooltip with edge flipping
│   ├── Accordion.js          # Collapsible panels with roving arrow-key nav
│   ├── Pagination.js         # Page-number pager with elision
│   ├── RangeSlider.js        # Dual-thumb min/max slider
│   ├── Calendar.js           # Date / date-range calendar popover
├── app/api/tmdb/[...path]/  # Server-side TMDB proxy (caches, hides API key)
├── lib/
│   ├── tmdb.js              # Server-side TMDB helpers (revalidated fetch)
│   ├── tmdbClient.js        # Browser helpers that call the /api/tmdb proxy
│   └── utils.js             # Date/runtime/text formatting
├── context/
│   ├── WatchlistContext.js   # Watchlist state management
│   ├── ContinueWatchingContext.js  # Continue watching state
│   ├── HistoryContext.js     # Recently viewed history state
│   └── ToastContext.js       # Toast queue + useToastActions() helpers
├── public/                   # Static assets (icons, images)
└── .env.local                # Environment variables
```

## 🎯 Key Features Explained

### Watchlist System

- **Persistent Storage**: Your watchlist is saved locally and persists across sessions
- **Quick Access**: Add/remove items with one click from any page
- **Smart Management**: Automatically prevents duplicates
- **Visual Feedback**: See which items are already in your watchlist

### Continue Watching

- **Episode Tracking**: Remembers the last season and episode for TV shows
- **Deep Linking**: Clicking a continue watching item takes you directly to the right episode
- **Real Progress**: Viewing time is measured while the player is open and stored as watch progress (capped at 99%)

### Search Functionality

- **Real-time Results**: Instant search as you type
- **Multi-type Search**: Search both movies and TV shows simultaneously
- **Correct Card Routing**: TV results render as TV cards, movies as movie cards
- **Rich Previews**: See posters, ratings, and release dates in results

### Coming Soon

- **Movies**: Upcoming theatrical releases via TMDb's upcoming endpoint
- **TV Shows**: Currently airing series via TMDb's on-the-air endpoint
- **Infinite Scroll**: Load more results as you reach the bottom of the page
- **Stats Bar**: Total results count and active date range at a glance

### Streaming

- **Multiple Sources**: Embedded playback from third-party providers with in-player server switching
- **Default Player**: CineSrc by default, with a loading hint to try another server if playback stalls
- **Server Options**: CineSrc, VidCore, VidLink, VidEasy, VidSrc, AutoEmbed (TV), and 2embed (availability varies by title/region)
- **HD Quality**: Most content available in high definition

### Ratings & Movie Details

- **TMDB + OMDB Ratings**: Detail pages show TMDB scores and, when available via OMDB, IMDb, Rotten Tomatoes, and Metacritic
- **End Time Estimate**: Movie pages display an estimated finish time based on runtime and your device’s current time
- **Episode Ratings**: TV episode ratings fetched and cached via OMDB where available

### Actor / Person Pages

- **Filmography Tabs**: Known For, Movies, and TV split via TMDb `combined_credits`
- **Deep Links**: Cast cards on movie and TV pages link directly to the actor's page
- **Rich Details**: Biography, known-for credits, and more

### Top Rated & Trending TV

- **Sort Modes**: Toggle between Top Rated (`vote_average.desc`) and Trending (`popularity.desc`)
- **Quick Access**: Switch sorts from the header dropdown or the mobile menu

### Visual Design & UX

- **Cinematic dark theme**: Navy/near-black backgrounds with subtle gradients, glass surfaces, white primary actions, and yellow rating accents
- **Cinematic home page**: Auto-rotating hero carousel and genre quick-links with uniform, catalog-sized content cards across home rows
- **Floating pill navbar**: Centered, glass-morphism navbar that floats/stays centered while scrolling, with an active filled-pill link state
- **Mobile bottom sheet menu**: Bottom sheet navigation with quick-access tiles and actions
- **Split-tile cards**: Uniform poster + info-bar cards in home rows and catalog grids (home rows sized to match catalog cards)
- **Episode list improvements**: Responsive 2-column episode grid on desktop and compact mobile episode cards
- **Shared browse template** (`CatalogPage.js`): Movies and TV share one browse experience (genre rail, sort dropdown, filter drawer, animated grid transitions, empty/end states)
- **Route resilience**: Loading and error boundaries for key routes (details/search/app-level fallbacks)

### Recently Viewed

- **Automatic Tracking**: Movies and shows you open are added to your history
- **Home Page Row**: Jump back to recently viewed titles from the home page
- **LocalStorage**: Persists across sessions (capped at 30 entries, removable)

### Random Picker

- **One-Click Discovery**: Picks a random movie or TV show and takes you straight to it
- **Available Anywhere**: Header button on desktop and menu item on mobile

### Share Buttons

- **Native Share**: Uses the Web Share API where supported
- **Copy Link**: Falls back to copying the shareable URL with "Copied!" feedback

### Episode Selector

- **Season & Episode Navigation**: Full season/episode selection with arrow navigation
- **2-Column Episode Grid**: Episode cards render in a responsive 2-column grid on desktop for a denser, scan-friendly list (single column below 768px)
- **Compact Mobile Cards**: On small screens each episode collapses to a slim horizontal row (small thumbnail, single-line title, rating + runtime) instead of the tall stacked layout
- **OMDB Ratings**: Individual episode ratings fetched and cached per episode
- **Optimized Fetching**: `useCallback` memoization prevents duplicate API calls
- **Deep Link Support**: URL query params (`?season=1&episode=3`) for direct episode access

### Responsive Design

- **Mobile-first approach**: All components optimized for touch interaction
- **CSS Media Queries**: Breakpoints at 1024px, 768px, and 480px
- **Design Tokens**: Consistent theming via CSS custom properties (`--accent`, `--bg`, `--radius-*`)
- **Touch-friendly**: Minimum 40px tap targets on all interactive elements
- **Bottom Sheet Filter**: Filter modal converts to bottom sheet on very small screens
- **Responsive Grids**: Browse grids adapt from 4-column → 2-column → 1-column
- **Overflow Handling**: Long titles and metadata properly truncate on all screen sizes
- **Mobile Padding**: Consistent container padding across all pages (search, movies, TV shows)

### UI Primitives

Hand-rolled, dependency-free components in `components/` that cover the
interactions this app needed but had no library for. Each one reads the design
tokens from `app/globals.css`, so they inherit the amber/black theme with no
per-component theming.

| Component | Replaces | Used by |
| --------- | -------- | ------- |
| `ToastContainer.js` + `context/ToastContext.js` | jQuery EasyUI `messager` | Share, watchlist, random picker, filters |
| `Tooltip.js` | `tooltip` | `WatchlistButton`, `RandomPicker` |
| `Accordion.js` | `accordion` | Terms, Privacy, DMCA "Quick answers" |
| `Pagination.js` | `pagination` | `CatalogPage` (Movies / TV) |
| `RangeSlider.js` | `slider` | `CatalogPage` year filter |
| `Calendar.js` | `calendar` / `datebox` | `CatalogPage` release-date filter |

**Toast notifications** — mounted once at the root via `ToastProvider`
(`app/layout.js:81`). `useToastActions()` exposes `success / error / warning /
info / progress` plus `update` and `dismiss`.

- Stacks bottom-right on desktop, bottom-centre above the mobile nav on small screens
- Auto-dismiss countdown **pauses on hover** so long messages stay readable
- Optional `action` button — the watchlist uses it for a one-tap **Undo**
- Capped at 4; the oldest is dropped so new messages always get screen time
- Errors announce assertively via `role="alert"`, everything else politely

**Tooltips** — replace the native `title=` attributes that cannot be styled and
do not show on keyboard focus.

- Shown on hover **and** on focus, so they are reachable without a mouse
- Position `fixed` and re-measured on scroll/resize, so they escape the
  `overflow-x: auto` of horizontal scroll rows
- Flip to the opposite side near viewport edges; dismiss on `Escape`

**Accordions** — used for the "Quick answers" block on the three legal pages.

- `aria-expanded` + `aria-controls` on each header, panel exposed as a
  `role="region"` labelled by its header
- Roving `↑`/`↓`/`Home`/`End` keyboard navigation between headers
- Height-animated panels via framer-motion's `height: auto`

**Pagination** — an opt-in alternative to infinite scroll on the catalog pages.

- Toolbar toggle switches between **Infinite** and **Pages**
- Elides the middle of long ranges (`1 2 3 … 500`) and clamps to 500 pages, the
  same ceiling the infinite-scroll observers use
- Shows a `Showing X–Y of Z` range and marks the current page with `aria-current`

**Range slider** — dual-thumb year filter replacing single-decade presets.

- Dragging anywhere on the track moves the nearer thumb
- Full keyboard support (`←/→` step, `PageUp/PageDown` jump, `Home/End` snap)
- Each thumb is a focusable `role="slider"` with `aria-valuetext`
- **Debounced 350ms** before it hits TMDb — sweeping the track costs one request,
  not one per frame

**Date range picker** — exact release-date filtering.

- Single or from/to range mode; the range highlight inverts between endpoints
- Month grid built from plain year/month/day integers rather than `Date`, and
  "today" resolved through `useSyncExternalStore`, so there is no timezone drift
  between server and client markup
- Arrow keys move day-to-day across month boundaries; `PageUp`/`PageDown` flip months
- Preset chips, the slider and the calendar all write to one `dateFilter`, so
  they stay in sync no matter which one you use last

### Accessibility

- **Keyboard Navigation**: `:focus-visible` styles for all interactive elements
- **Skip to Content**: Hidden link for screen readers to skip navigation
- **ARIA Labels**: Proper labeling on search input, buttons, and controls
- **Reduced Motion**: Respects `prefers-reduced-motion` user setting
- **Screen Reader Support**: `.sr-only` utility class for screen reader-only content
- **Tooltips on Focus**: `Tooltip` opens on keyboard focus, not just hover, and closes on `Escape`
- **Composite Widgets**: Accordion headers use `aria-expanded`/`aria-controls` with roving arrow-key navigation; the slider exposes each thumb as `role="slider"` with `aria-valuetext`; the calendar uses `role="grid"`/`gridcell`; the pager marks the current page with `aria-current="page"`
- **Live Regions**: Toasts announce politely, errors assertively
- **No Keyboard Traps**: Every new popover closes on `Escape` and on outside click

### Performance Optimizations

- **Direct TMDB image delivery**: `next/image` runs with `unoptimized: true` (bypassing Vercel image transformations) to avoid transformation quota/402 issues while still using appropriately sized TMDB assets
- **Optimized font loading**: Plus Jakarta Sans loaded via `next/font` for better performance and layout stability
- **Debounced Search**: 300ms delay prevents unnecessary API calls while typing
- **Loading Skeletons**: Reusable skeleton components with shimmer animations
- **Memoized Callbacks**: `useCallback` for expensive operations like fetch functions

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `TMDB_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_OMDB_API_KEY` (optional, for episode ratings)
   - `NEXT_PUBLIC_TMDB_REGION` (optional, for watch providers)
5. Click Deploy!

### Deploy to Other Platforms

This is a standard Next.js app and can be deployed to:

- Netlify
- Railway
- Render
- DigitalOcean App Platform

## 🔑 Environment Variables

| Variable                   | Description                      | Required        |
| -------------------------- | -------------------------------- | --------------- |
| `TMDB_API_KEY`             | Your TMDb API key (server-side)  | ✅ Yes          |
| `NEXT_PUBLIC_SITE_URL`     | Your deployed site URL           | ⚠️ Recommended |
| `NEXT_PUBLIC_OMDB_API_KEY` | Your OMDB API key (episode ratings) | ⚠️ Recommended |
| `NEXT_PUBLIC_TMDB_REGION`  | TMDb region for watch providers (e.g. `IN`, `US`, `GB`) | ⚠️ Optional |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is for educational purposes only. Not intended for commercial use.

## ⚠️ Disclaimer

**Important Legal Notice:**

- Flixet does **NOT** host any video content
- All videos are embedded from third-party sources
- Content availability depends on third-party streaming services
- Users are responsible for ensuring their use complies with local laws
- This project is for educational and demonstration purposes

## 🙏 Acknowledgments

- [TMDb](https://www.themoviedb.org/) for the comprehensive movie database API
- [OMDB](https://www.omdbapi.com/) for episode-level ratings
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide](https://lucide.dev/) for beautiful icons
- [Next.js](https://nextjs.org/) team for the amazing framework

## 📧 Support

If you have any questions or run into issues:

- Open an issue on GitHub
- Check existing issues for solutions

## 🎓 Learning Resources

Built this while learning:

- Next.js App Router
- React Context API & hooks (`useCallback`, `useEffect` dependency management)
- Inline styles vs CSS-in-JS scoping in Next.js
- Infinite scroll with IntersectionObserver
- Third-party API integration (TMDb + OMDB)
- CSS custom properties for design systems
- Responsive design with media queries and fluid typography

## 🎨 Design System

Flixet uses a consistent design system defined in `app/globals.css`:

### Color Tokens
- `--bg`, `--bg-secondary`, `--bg-tertiary`, `--bg-elevated` - Cinematic navy/near-black backgrounds
- `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-muted` - Text hierarchy
- `--accent`, `--accent-hover`, `--accent-subtle`, `--accent-border` - Neutral/white action accents
- `--gold` (#f5c518), `--gold-subtle`, `--gold-border` - Rating highlights (IMDb/stars)
- `--border`, `--border-hover`, `--surface`, `--glass-*` - Borders and glass surfaces

### Typography
- Font: Plus Jakarta Sans (300–900 weights, loaded via `next/font`)
- Scale: `--text-xs` (0.75rem) → `--text-4xl` (2.25rem)
- Weights: `--font-light` through `--font-extrabold`

### Spacing & Layout
- `--space-1` → `--space-20` - Consistent spacing scale
- `--radius-sm` → `--radius-hero` / `--radius-full` - Border radius tokens
- `--shadow-sm` → `--shadow-xl` - Shadow depth tokens
- `--transition-fast`, `--transition-base`, `--transition-slow` - Animation timing (150–250ms)

---

**Made with ❤️ by [Devajuice]**

⭐ Star this repo if you find it helpful!
