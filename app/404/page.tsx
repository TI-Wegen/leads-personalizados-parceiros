"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    alert("redirecionando");
    router.push("/404_");
  }, []);

  return null;
}
