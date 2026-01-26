import { NextResponse } from "next/server";

type OpenWeatherResp = any; // narrow further if you want
type NormalizedWeather = {
  name: string;
  country?: string;
  temperature?: string; // formatted string
  weather: { main: string; description: string }[];
  wind: { speed: number; deg?: number };
};

const DEFAULT_UNITS = "metric";
const FETCH_TIMEOUT_MS = 8000;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const city = url.searchParams.get("city")?.trim();
    const units = (url.searchParams.get("units") ?? DEFAULT_UNITS).trim();

    if (!city) {
      return NextResponse.json({ error: "Missing required query parameter: city" }, { status: 400 });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      // configuration error — do not expose secrets
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // Build upstream URL safely (do not log it)
    const upstream = new URL("https://api.openweathermap.org/data/2.5/weather");
    upstream.searchParams.set("q", city);
    upstream.searchParams.set("appid", apiKey);
    upstream.searchParams.set("units", units); // use OpenWeather units (metric/imperial)

    // Abort controller for timeout
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const res = await fetch(upstream.toString(), { signal: controller.signal });
    clearTimeout(id);

    if (!res.ok) {
      // try to extract upstream error message
      const body = await res.json().catch(() => null);
      const message = body?.message ?? "OpenWeather API error";
      return NextResponse.json({ error: message }, { status: res.status });
    }

    const data: OpenWeatherResp = await res.json();

    // Normalize shape returned to the client
    const normalized: NormalizedWeather = {
      name: data.name ?? city,
      country: data.sys?.country,
      temperature:
        typeof data.main?.temp === "number" ? Number(data.main.temp).toFixed(1) : undefined,
      weather: Array.isArray(data.weather)
        ? data.weather.map((w: any) => ({
            main: w.main,
            description: w.description,
          }))
        : [],
      wind: {
        speed: data.wind?.speed ?? 0,
        deg: data.wind?.deg,
      },
    };

    // Do not cache by default; set caching headers here if you add caching layer
    return NextResponse.json(normalized, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    if (err.name === "AbortError") {
      return NextResponse.json({ error: "Upstream request timed out" }, { status: 504 });
    }
    // generic internal error — hide internals from clients
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}