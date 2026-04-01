/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import "../../app/global.css";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreatorLayout({
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

    if (currentUser && currentUser.role !== "CREATOR") {
      router.replace("/user");
      return;
    }

    if (currentUser?.role === "CREATOR") {
      setAuthorized(true);
    }
  }, [currentUser, router]);

  if (!authorized) return null;

  return children;
}