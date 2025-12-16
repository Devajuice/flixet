# 🎬 Flixet

A modern, free movie and TV show streaming aggregator built with Next.js. Stream thousands of movies, TV shows, and anime without any subscription.

## ✨ Features

- 🆓 **100% Free** - No subscription, no account required
- 🎬 **Huge Library** - Thousands of movies, TV shows, and anime
- 📱 **Fully Responsive** - Perfect experience on mobile, tablet, and desktop
- 🔍 **Smart Search** - Instant search with real-time results
- 📚 **Personal Watchlist** - Save your favorite content to watch later
- 🔄 **Multiple Servers** - Switch between streaming sources if one doesn't work
- 📺 **TV Show Support** - Full season and episode selection
- 🎨 **Modern UI** - Beautiful, Netflix-inspired interface
- ⚡ **Fast Performance** - Built with Next.js 15 for optimal speed
- 🎯 **Genre Filtering** - Browse by action, comedy, drama, and more

## To Do

- [x] ~~Continue Watching~~
- [x] ~~Infinite Scroll~~
- [x] ~~Coming Soon Section~~
- [ ] Performance Optimizations
- [ ] Random Movie Picker
- [x] ~~Advanced Filters~~

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** JavaScript/React
- **Styling:** CSS-in-JS with styled-jsx
- **Animation:** Framer Motion
- **State Management:** React Context API
- **Icons:** Lucide React
- **API:** TMDb (The Movie Database)
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

Create a `.env.local` file in the root directory and add your TMDb API key:

4. **Add your TMDb API key to `.env.local`:**

```bash
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. **Run the development server:**

```bash
npm run dev
# or
yarn dev
```

6. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```bash
Flixet/
├── app/
│ ├── movie/[id]/ # Movie detail pages
│ ├── tv/[id]/ # TV show detail pages
│ ├── watchlist/ # Watchlist page
│ └── layout.js # Root layout
├── components/
│ ├── Header.js # Navigation header
│ ├── Footer.js # Footer component
│ ├── MovieCard.js # Movie card component
│ ├── TVCard.js # TV show card component
│ ├── WatchlistButton.js # Add to watchlist button
│ ├── WatchlistCard.js # Watchlist item card
│ └── SearchBar.js # Search component
├── context/
│ └── WatchlistContext.js # Watchlist state management
├── public/ # Static assets
└── styles/ # Global styles
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
- **Rich Previews**: See posters, ratings, and release dates in results

### Streaming

- **Multiple Sources**: Automatically embeds content from reliable third-party sources
- **Server Switching**: If one server has issues, try another
- **HD Quality**: Most content available in high definition

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

| Variable                   | Description                      | Required |
| -------------------------- | -------------------------------- | -------- |
| `NEXT_PUBLIC_TMDB_API_KEY` | Your TMDb API key                | ✅ Yes   |
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
- React Context API
- CSS-in-JS patterns
- LocalStorage management
- Third-party API integration

---

**Made with ❤️ by [Devajuice]**

⭐ Star this repo if you find it helpful!
