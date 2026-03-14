"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Question {
  id: number;
  question_number: number;
  question_text: string;
  answer: string;
  marks: number | null;
}

interface Paper {
  id: number;
  title: string;
  status: string;
  uploaded_at: string;
  questions: Question[];
}

export default function Home() {
  const router = useRouter();
  const [papers, setPapers] = useState<Paper[]>([]);

  useEffect(() => {
    fetch("/api/papers/list/")
      .then((res) => (res.ok ? res.json() : []))
      .then(setPapers)
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/users/logout/", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div>
      <header className="flex flex-row justify-between px-4 py-2">
        <div>
          <h1 className="text-2xl">CheetSheet</h1>
        </div>
        <nav className="flex flex-row gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "outline" })}
            >
              Kannan
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </nav>
      </header>
      <main className="flex flex-col gap-4 p-4 items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-row gap-4 items-center text-4xl md:text-6xl tracking-tight font-bold mb-4">
          <h2>Understand </h2>
          <h2 className="text-primary">Anything</h2>
        </div>
        <p className="text-muted-foreground">
          Research, understand and solve any question with the help of AI.
          Create your own cheatsheet for any question paper.
        </p>
        <div className="flex flex-row items-center justify-center gap-4 w-full">
          <Button className="text-lg min-w-36">Try it</Button>
          <Button variant={"outline"} className="text-lg min-w-36">
            Prizing
          </Button>
        </div>
      </main>
    </div>
  );
}
