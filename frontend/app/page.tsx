"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/users/logout/", {
      method: "POST",
    });
    router.replace("/login");
    router.refresh();
  }
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Home page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
