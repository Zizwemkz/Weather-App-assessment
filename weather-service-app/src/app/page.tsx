"use client";

import React, { useState } from "react";
import styles from "./Weather.module.css";

type WeatherResponse = {
  name: string;
  country: string;
  temperature: string; // °C
  weather: { main: string; description: string }[];
  wind: { speed: number; deg: number };
};

// Hardcoded countries and cities
const countries: Record<string, string[]> = {
  "South Africa": ["Durban", "Cape Town", "Johannesburg", "Pretoria"],
  "USA": ["New York", "Los Angeles", "Chicago", "Miami"],
  "UK": ["London", "Manchester", "Birmingham", "Liverpool"],
  "France": ["Paris", "Lyon", "Marseille", "Nice"],
  "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt"],
  "India": ["Delhi", "Mumbai", "Bangalore", "Chennai"],
  "Japan": ["Tokyo", "Osaka", "Kyoto", "Sapporo"],
};

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [useQuickSearch, setUseQuickSearch] = useState(false);

  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const res = await fetch(`/api/weather?city=${cityName}`);
      if (!res.ok) throw new Error("Failed to fetch weather");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setWeather(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (useQuickSearch) {
      if (selectedCity.trim()) {
        fetchWeather(selectedCity.trim());
      }
    } else {
      if (city.trim()) {
        fetchWeather(city.trim());
      }
    }
  };

  return (
    <div className={styles.container}>

     <div className={styles.headerImage}>
      <img src="/weather-image2.jpg" alt="Weather header" />
     </div>

      <h2>Weather Information</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
  
      {/* Toggle search mode */}
      <label >
        <input
          type="checkbox"
          checked={useQuickSearch}
          onChange={() => {
            setUseQuickSearch(!useQuickSearch);
            setCountry("");
            setSelectedCity("");
            setCity("");
          }}
        />
        Quick Search
      </label>

        {/* If quick search is enabled */}
        {useQuickSearch ? (
          <>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setSelectedCity(""); // reset city when country changes
              }}
              className={styles.input}
              required
            >
              <option value="">Select Country</option>
              {Object.keys(countries).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {country && (
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className={styles.input}
                required
              >
                <option value="">Select City</option>
                {countries[country].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            )}
          </>
        ) : (
          // search (textbox)
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={styles.input}
            placeholder="Enter city name"
            required
          />
        )}

        <button
          type="submit"
          className={styles.button}
          disabled={
            loading ||
            (!useQuickSearch && city.trim() === "") ||
            (useQuickSearch && selectedCity.trim() === "")
          }
        >
          Get Weather
        </button>
      </form>
      <div className="small mt-2">Tip: Try "Cape Town", "Johannesburg", or "London".</div>
      {error && <div className={styles.error}>Error: {error}</div>}
      {loading && <p>Loading...</p>}
      {weather && (
        <div className={styles.weather}>
          <p>
            <strong>City:</strong> {weather.name}, {weather.country}
          </p>
          <p>
            <strong>Main:</strong> {weather.weather[0].main}
          </p>
          <p>
            <strong>Description:</strong> {weather.weather[0].description}
          </p>
          <p>
            <strong>Temperature:</strong> <span className={styles.temp}> {weather.temperature} °C</span>
          </p>
          <p>
            <strong>Wind:</strong> {weather.wind.speed} m/s at {weather.wind.deg}°
          </p>
        </div>
      )}
       {/* Footer image */}
    <div className={styles.footerImage}> 
      <img src="/weather-image3.jpg" alt="Weather footer" />
    </div>
    </div>
  );
}
