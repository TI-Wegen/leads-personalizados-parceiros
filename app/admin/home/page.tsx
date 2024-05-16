"use client";

import * as C from "./style";
import useAuth from "@/hooks/useAuth";

export default function Home() {
  useAuth();

  return <C.Container>Logado</C.Container>;
}
