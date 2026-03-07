"use client";

import Form from "@/app/components/Form";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function RegisterPage() {
  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    const res = await fetch(`${API_BASE}/api/users/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        console.error("Registration failed");
    } else {
        console.log("Registration successful");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Register Page</h1>
      <Form onSubmit={onSubmitHandler} page="register" />
    </div>
  );
}
