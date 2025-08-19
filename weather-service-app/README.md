# Getting Started with Create React App

This app uses the [OpenWeatherMap](https://openweathermap.org/current) API to display current weather for a city.  
**Temperature is displayed in Celsius.**

## Features
- City input
- Current weather (city name, temperature, condition with icon, description)
- Error and loading states
- API key secured via Next.js API route

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

# Next.js Weather App



## Setup

1. Clone the repo
2. Add `.env.local` in root:
    ```
    OPENWEATHER_API_KEY=your_api_key_here
    ```
3. Run:
    ```
    npm install
    npm run dev
    ```
4. Open [http://localhost:3000](http://localhost:3000)

## Styling

- Uses CSS Modules for simple, clean design.

## API Key Security

- The API key is stored server-side and never exposed to the frontend. All requests go through `/api/weather`.
