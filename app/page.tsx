"use client";

import Navbar from "@/components/Navbar/navbar";
import styles from "./page.module.css";
import {
  Button,
  Stack,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useState } from "react";
import Notiflix from "notiflix";

export default function Home() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#94c11f",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: "700",
            color: "#ffffff",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: "#333333",
            backgroundColor: "#ffffff",
          },
        },
      },
    },
  });

  const [nome, setNome] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [valorConta, setValorConta] = useState<string>("");

  async function clearFields() {
    setNome("");
    setTelefone("");
    setEmail("");
    setValorConta("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = {
      nome: nome,
      telefone: telefone,
      email: email,
      valorConta: valorConta,
    };

    const response = await fetch("/api/create-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      Notiflix.Notify.success(data.message);
      await clearFields();
    } else {
      Notiflix.Notify.failure("Houve um erro ao criar seu contato.");
    }
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.content_left}>
          <h2 className={styles.text_description}>
            <span className={styles.text_green}>O TRAMONTE CONVIDA </span>
            VOCÊ A ECONOMIZAR ATÉ{" "}
            <span className={styles.text_green}>
              25% EM SUA TARIFA DE ENERGIA.{" "}
            </span>
          </h2>
        </div>
        <div className={styles.content_right}>
          <form className={styles.form_contato} onSubmit={handleSubmit}>
            <div className={styles.title_area}>
              <h4 className={styles.title_area_title}>
                <span className={styles.text_green}>CADASTRE-SE </span>
                PARA GARANTIR MAIS ECONOMIA NA{" "}
                <span className={styles.text_green}>SUA CONTA DE LUZ </span>
              </h4>
              <p className={styles.title_area_subtitle}>
                APROVEITE, ECONOMIZAR É GRÁTIS!
              </p>
            </div>
            <ThemeProvider theme={theme}>
              <Stack direction="column" spacing={2}>
                <div className={styles.input_area}>
                  <label>Nome</label>
                  <TextField
                    id="nome"
                    name="nome"
                    placeholder="Nome"
                    variant="outlined"
                    fullWidth
                    color="primary"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
                <Stack spacing={2} direction="row">
                  <div className={styles.input_area}>
                    <label>Email</label>
                    <TextField
                      id="email"
                      name="email"
                      placeholder="Email"
                      variant="outlined"
                      fullWidth
                      color="primary"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className={styles.input_area}>
                    <label>Telefone</label>
                    <TextField
                      id="telefone"
                      name="telefone"
                      placeholder="Telefone"
                      variant="outlined"
                      fullWidth
                      color="primary"
                      required
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                    />
                  </div>
                </Stack>
                <div className={styles.input_area}>
                  <label>Valor médio da conta</label>
                  <TextField
                    id="valor"
                    name="valor"
                    placeholder="Valor médio da conta"
                    variant="outlined"
                    fullWidth
                    color="primary"
                    required
                    value={valorConta}
                    onChange={(e) => setValorConta(e.target.value)}
                  />
                </div>

                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  type="submit"
                >
                  Solicitar Proposta
                </Button>
              </Stack>
            </ThemeProvider>
          </form>
        </div>
      </div>
    </div>
  );
}
