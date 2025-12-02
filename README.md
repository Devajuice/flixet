# 🎬 Flixet

A free movie and TV show streaming aggregator built with Next.js.

## Features

- 🆓 100% Free - No subscription required
- 🎬 Huge library of movies and TV shows
- 📱 Fully responsive design
- 🔍 Search functionality
- 🔄 Multiple streaming servers
- 📺 Season and episode selection for TV shows

## Tech Stack

- **Framework:** Next.js 15
- **Styling:** CSS-in-JS with styled-jsx
- **Animation:** Framer Motion
- **API:** TMDb (The Movie Database)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- TMDb API key ([Get it here](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/Flixet .git
cd Flixet
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file:

```bash
cp .env.example .env.local
```

4. Add your TMDb API key to `.env.local`:

```bash
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is deployed on Vercel. To deploy your own:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## Environment Variables

| Variable                   | Description            |
| -------------------------- | ---------------------- |
| `NEXT_PUBLIC_TMDB_API_KEY` | Your TMDb API key      |
| `NEXT_PUBLIC_SITE_URL`     | Your deployed site URL |

## License

This project is for educational purposes only.

## Disclaimer

Flixet does not host any video content. All videos are embedded from third-party sources.
