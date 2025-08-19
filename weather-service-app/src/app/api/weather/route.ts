import { console } from "inspector";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!city || !apiKey) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  //const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}`;
  console.log(apiUrl);
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return NextResponse.json({ error: "OpenWeather API error" }, { status: res.status });
    }
    const data = await res.json();
    // Only send the fields you need
    return NextResponse.json({
      name: data.name,
      weather: data.weather.map((w: any) => ({
        main: w.main,
        description: w.description,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}