import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value; // Gets the token from the cookie.
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Sends a get req to backend.
    const backendRes = await fetch(`${API_BASE}/api/papers/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await backendRes.json(); // Reads the backend resp.
    return NextResponse.json(data, { status: backendRes.status }); // Sends the backend resp to the frontend.
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
