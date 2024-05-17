"use client";

import * as C from "./style";

export default function Page({ params }: { params: { id: string } }) {
  return <C.Container>{params.id}</C.Container>;
}
