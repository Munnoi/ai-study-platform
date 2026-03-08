import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:8000";

// When the frontend sends: POST /api/upload
// this function runs.
export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value; // Reads token from the cookie.
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData(); // Reads the multipart/form-data from request body.

    // Sends request to backend.
    const backendRes = await fetch(`${API_BASE}/api/papers/upload/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await backendRes.json(); // Reads the JSON response from backend.
    return NextResponse.json(data, { status: backendRes.status }); // Return the backend reponse to the frontend.
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
