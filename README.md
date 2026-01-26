# Weather-App-assessment (Next.js App Router)
Weather-App-assessment

A small weather application built with **Next.js (App Router)** .  
It fetches current weather from **OpenWeatherMap** and demonstrates safe API key handling via a Next.js API Route.

## Features

- City input with validation
- Displays city, country, temperature, condition, description, and an icon
- **Loading** indicator while fetching
- **Robust error handling** (invalid city, network/API errors, rate limits)
- API key secured via Next.js API route
  > **Note:** The default unit is **Celsius** (metric).

## Tech

- Framework: **Next.js 14** (App Router, TypeScript)
- Styling: Minimal CSS (globals + lightweight utility classes)
- State: React `useState`
- API: **OpenWeatherMap Current Weather Data API**
- Security: API Key is **not** exposed to the client; requests are proxied through a Next.js **API Route**

---

## Getting Started (Local)

1. Clone the repository:
  ```bash
   https://github.com/Zizwemkz/Weather-App-assessment
   ```

> Requirements: **Node.js 18+** and **npm** (or **pnpm**/**yarn**)

1. **Clone or download** this repository into a folder, then open it in your terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` by copying `.env.example` and fill in your key:
   ```bash
   cp .env.example .env.local
   # then edit .env.local and set your actual OPENWEATHER_API_KEY
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Visit **http://localhost:3000** and search for a city.

### Where to get an API Key
Sign up for a free key at https://openweathermap.org/current and put it in `.env.local` as:
```
OPENWEATHER_API_KEY=YOUR_KEY
```

Optional default:
```
# UI defaults to metric already; provided for clarity only.
DEFAULT_UNITS=metric
```

---

## Project Structure

```
simple-weather-nextjs/
├── app/
│   ├── api/
│   │   └── weather/
│   │       └── route.ts        # Server-side proxy to OpenWeather (hides API key)
│   ├── globals.css              # Minimal styling + spinner & utility classes
│   ├── layout.tsx               # App shell
│   └── page.tsx                 # Client page with form, loading, and results
├── lib/
│   └── types.ts                 # Shared TS types
├── .env.local                 # Sample env file
├── package.json
├── tsconfig.json
└── README.md
```

---

## Design Notes

- **API Route (`/api/weather`)**  
  - Validates inputs (`city`, `units`), calls OpenWeather, normalizes response.  
  - Returns detailed error messages from the upstream API when available.  
  - Keeps your **OPENWEATHER_API_KEY** on the server, never in the browser.

- **UX**  
  - Clear loading spinner and status text.  
  - Informative error messages (invalid city, network failures).  
  - Basic, readable layout without heavy UI libraries to keep the focus on functionality.

- **Styling**  
  - Vanilla CSS with a few utility classes; easy to extend with CSS Modules or Tailwind if desired.

---

## Common Issues & Troubleshooting

- **`Server is missing OPENWEATHER_API_KEY`**  
  Make sure `.env.local` exists with your key and restart the dev server.

- **City not found**  
  Check the city spelling. Try including country if ambiguous (e.g., "Paris,FR").

- **429 / Rate limited**  
  Free OpenWeather plans may rate-limit. Wait a bit and retry.
