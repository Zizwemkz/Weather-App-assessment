"use client";

import React, { useRef, useState, useTransition } from "react";
import styles from "./Weather.module.css";
import type { NormalizedWeather } from "./lib/types.ts";

// small helper: format numbers for locale
const formatNumber = (value: number | string | undefined, locale = navigator.language) =>
  value == null ? "" : new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(Number(value));

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [useQuickSearch, setUseQuickSearch] = useState(false);
  const [country, setCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [weather, setWeather] = useState<NormalizedWeather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const abortRef = useRef<AbortController | null>(null);

  // example quick list 
  const countries: Record<string, string[]> = {
    "South Africa": ["Durban", "Cape Town", "Johannesburg", "Pretoria"],
    "USA": ["New York", "Los Angeles", "Chicago", "Miami"],
    "UK": ["London", "Manchester", "Birmingham", "Liverpool"],
    "France": ["Paris", "Lyon", "Marseille", "Nice"],
    "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt"],
    "India": ["Delhi", "Mumbai", "Bangalore", "Chennai"],
    "Japan": ["Tokyo", "Osaka", "Kyoto", "Sapporo"],
  };

  const fetchWeather = async (cityName: string) => {
    // cancel previous request if any
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    startTransition(async () => {
      setError(null);
      setWeather(null);
      try {
        const res = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}&units=metric`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error ?? "Failed to fetch weather");
        }
        const data = await res.json();
        setWeather(data);
      } catch (err: any) {
        if (err.name === "AbortError") {
          // ignore aborted request
          return;
        }
        setError(err.message ?? "Unknown error");
      } finally {
        // no-op; isPending reflects pending state
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCity = useQuickSearch ? selectedCity.trim() : city.trim();
    if (!targetCity) {
      setError("Please enter or select a city");
      return;
    }
    fetchWeather(targetCity);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerImage}>
        {/* Consider replacing with next/image for optimization */}
        <img src="/weather-image2.jpg" alt="Clouds and sky" />
      </div>

      <h2>Weather Information</h2>

      <form onSubmit={handleSubmit} className={styles.form} aria-labelledby="weather-form-title">
        <div className={styles.checkboxLabel}>
          <input
            id="quick-search-toggle"
            type="checkbox"
            checked={useQuickSearch}
            onChange={() => {
              setUseQuickSearch((v) => !v);
              setCountry("");
              setSelectedCity("");
              setCity("");
              setError(null);
            }}
            aria-checked={useQuickSearch}
          />
          <label htmlFor="quick-search-toggle">Quick Search</label>
        </div>

        {useQuickSearch ? (
          <>
            <label className="visually-hidden" htmlFor="country-select">
              Country
            </label>
            <select
              id="country-select"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setSelectedCity("");
              }}
              className={styles.input}
              aria-required
            >
              <option value="">Select Country</option>
              {Object.keys(countries).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {country && (
              <>
                <label className="visually-hidden" htmlFor="city-select">
                  City
                </label>
                <select
                  id="city-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className={styles.input}
                  aria-required
                >
                  <option value="">Select City</option>
                  {countries[country].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </>
            )}
          </>
        ) : (
          <>
            <label className="visually-hidden" htmlFor="city-input">
              City name
            </label>
            <input
              id="city-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={styles.input}
              placeholder="Enter city name"
              required
            />
          </>
        )}

        <button
          type="submit"
          className={styles.button}
          disabled={
            isPending ||
            (!useQuickSearch && city.trim() === "") ||
            (useQuickSearch && selectedCity.trim() === "")
          }
          aria-busy={isPending}
        >
          {isPending ? "Loading..." : "Get Weather"}
        </button>
      </form>

      <div className="small mt-2">Tip: Try "Cape Town", "Johannesburg", or "London".</div>

      {error && <div className={styles.error}>Error: {error}</div>}

      {weather && (
        <div className={styles.weather} role="region" aria-live="polite">
          <p>
            <strong>City:</strong> {weather.name}
            {weather.country ? `, ${weather.country}` : ""}
          </p>
          {weather.weather[0] && (
            <>
              <p>
                <strong>Main:</strong> {weather.weather[0].main}
              </p>
              <p>
                <strong>Description:</strong> {weather.weather[0].description}
              </p>
            </>
          )}
          <p>
            <strong>Temperature:</strong>{" "}
            <span className={styles.temp}>{formatNumber(weather.temperature)} °C</span>
          </p>
          <p>
            <strong>Wind:</strong> {formatNumber(weather.wind.speed)} m/s {weather.wind.deg ? `at ${formatNumber(weather.wind.deg)}°` : ""}
          </p>
        </div>
      )}

      <div className={styles.footerImage}>
        <img src="/weather-image3.jpg" alt="Sunset horizon" />
      </div>
    </div>
  );
}