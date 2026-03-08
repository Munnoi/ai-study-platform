import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const token = (await cookies()).get("token")?.value;

  if (!token) { // If token is not present in the cookie, redirect to /login
    redirect("/login");
  }

  return <>{children}</>; // Render the children if token is present
}
