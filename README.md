# 🎬 Flixet

A modern, free movie and TV show streaming aggregator built with Next.js. Stream thousands of movies, TV shows, and anime without any subscription.

## ✨ Features

- 🆓 **100% Free** - No subscription, no account required
- 🎬 **Huge Library** - Thousands of movies, TV shows, and anime
- 📱 **Fully Responsive** - Perfect experience on mobile, tablet, and desktop
- 🔍 **Smart Search** - Instant search with real-time results across movies and TV
- 📚 **Personal Watchlist** - Save your favorite content to watch later
- 🔄 **Multiple Servers** - Switch between streaming sources if one doesn't work
- 📺 **TV Show Support** - Full season and episode selection with OMDB ratings
- 🎨 **Modern UI** - Beautiful dark interface with gold accent design system
- ⚡ **Fast Performance** - Built with Next.js 15 for optimal speed
- 🎯 **Advanced Filters** - Filter by genre, year, rating, and more
- 🚀 **Coming Soon** - Dedicated pages for upcoming movies and airing TV shows
- ♾️ **Infinite Scroll** - Seamlessly load more content as you browse

## To Do

- [x] ~~Continue Watching~~
- [x] ~~Infinite Scroll~~
- [x] ~~Coming Soon Section~~
- [x] ~~Advanced Filters~~
- [ ] Performance Optimizations
- [ ] Random Movie Picker
- [x] ~~Make Watchlist page better~~

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** JavaScript/React
- **Styling:** Inline styles + CSS-in-JS (styled-jsx for pseudo-states)
- **Animation:** Framer Motion
- **State Management:** React Context API
- **Icons:** Lucide React
- **API:** TMDb (The Movie Database) + OMDB
- **Deployment:** Vercel
- **Storage:** LocalStorage for watchlist persistence

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
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

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
│   ├── movie/[id]/           # Movie detail & player pages
│   ├── tv/[id]/              # TV show detail & player pages
│   ├── coming-soon/
│   │   ├── movies/           # Upcoming movies page
│   │   └── tv/               # On-the-air TV shows page
│   ├── watchlist/            # Watchlist page
│   ├── search/               # Search results page
│   └── layout.js             # Root layout
├── components/
│   ├── Header.js             # Navigation header
│   ├── Footer.js             # Footer component
│   ├── MovieCard.js          # Movie card component
│   ├── TVCard.js             # TV show card component
│   ├── MediaGrid.js          # Shared grid engine for all media types
│   ├── MovieGrid.js          # Movie grid (wraps MediaGrid)
│   ├── TVGrid.js             # TV grid (wraps MediaGrid)
│   ├── AnimeGrid.js          # Anime grid (wraps MediaGrid)
│   ├── ComingSoon.js         # Coming soon section (used on movies/tv pages)
│   ├── ComingSoonPage.js     # Full coming soon page (used at /coming-soon/*)
│   ├── EpisodeSelector.js    # Season/episode picker with OMDB ratings
│   ├── SearchResults.js      # Search results with correct card routing
│   ├── AdvancedFilters.js    # Genre, year, rating filters
│   ├── CastSection.js        # Cast display component
│   ├── WatchlistButton.js    # Add/remove watchlist button
│   ├── WatchlistCard.js      # Watchlist item card
│   ├── SearchBar.js          # Search input component
│   └── VideoPlayer.js        # Embedded video player
├── context/
│   └── WatchlistContext.js   # Watchlist state management
├── public/                   # Static assets
└── styles/                   # Global styles
```

## 🎯 Key Features Explained

### Watchlist System

- **Persistent Storage**: Your watchlist is saved locally and persists across sessions
- **Quick Access**: Add/remove items with one click from any page
- **Smart Management**: Automatically prevents duplicates
- **Visual Feedback**: See which items are already in your watchlist

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

- **Multiple Sources**: Automatically embeds content from reliable third-party sources
- **Server Switching**: If one server has issues, try another
- **HD Quality**: Most content available in high definition

### Episode Selector

- **Season & Episode Picker**: Full season/episode navigation for all TV shows
- **OMDB Ratings**: Individual episode ratings fetched and cached per episode
- **Optimized Fetching**: `useCallback` memoization prevents duplicate API calls

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_TMDB_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`
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
| `NEXT_PUBLIC_TMDB_API_KEY` | Your TMDb API key                | ✅ Yes          |
| `NEXT_PUBLIC_SITE_URL`     | Your deployed site URL           | ⚠️ Recommended |

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

---

**Made with ❤️ by [Devajuice]**

⭐ Star this repo if you find it helpful!