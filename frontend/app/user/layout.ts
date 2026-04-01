/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser } = useAppSelector((state) => state.auth);

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    if (currentUser?.role === "CREATOR") {
      router.replace("/creator");
      return;
    }

    setAuthorized(true);
  }, [currentUser, router]);

  if (!authorized) return null;

  return children;
}