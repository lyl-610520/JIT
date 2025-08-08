import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const key = process.env.WEATHER_API_KEY || "";
    if (!key) {
      return new Response(JSON.stringify({ error: "No WEATHER_API_KEY" }), { status: 500 });
    }

    // prefer client geolocation 'q' (lat,lon) else fallback to auto:ip
    const query = q && q.length > 0 ? q : "auto:ip";
    const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURIComponent(query)}&aqi=no`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "weather failed";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}