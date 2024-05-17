"use client";

import { Button, Stack } from "@mui/material";
import * as C from "./style";
import { useState } from "react";
import Notiflix from "notiflix";
import { useRouter } from "next/navigation";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const HandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      username === process.env.NEXT_PUBLIC_ADMIN_USER &&
      password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      Notiflix.Notify.success("Login bem-sucedido!");
      router.push("/admin/home");

      var token = Date.now().toString() + "*" + "logged";

      localStorage.setItem("token", token);
    } else {
      Notiflix.Notify.failure("Usuário ou senha incorretos");
    }
  };

  return (
    <C.Container>
      <C.FormLogin onSubmit={HandleSubmit}>
        <h1>Área Admin</h1>
        <Stack direction="column" spacing={2}>
          <C.LoginTextField
            variant="outlined"
            label="Login"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <C.LoginTextField
            variant="outlined"
            label="Senha"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Stack>
      </C.FormLogin>
    </C.Container>
  );
}
