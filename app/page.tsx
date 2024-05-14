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

export default function Home() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#f1f1f1",
      },
      secondary: {
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
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: "rgba(255,255,255,0.8)",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: "#ffffff",
            "& label.Mui-focused": {
              color: "#ffffff",
            },
            "&.MuiInput-underline:after": {
              borderBottomColor: "#ffffff",
            },
            "&.MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ffffff",
              },
              "&:hover fieldset": {
                borderColor: "#ffffff",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ffffff",
              },
            },
          },
          input: {
            color: "#f1f1f1",
          },
        },
      },
    },
  });

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
          <form id="form" className={styles.form_contato} method="post">
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
                <TextField
                  id="outlined-basic"
                  label="Nome Completo"
                  variant="outlined"
                  fullWidth
                  color="primary"
                />
                <Stack spacing={2} direction="row">
                  <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    color="primary"
                    type="email"
                  />
                  <TextField
                    id="outlined-basic"
                    label="Telefone"
                    variant="outlined"
                    fullWidth
                    color="primary"
                  />
                </Stack>
                <TextField
                  id="outlined-basic"
                  label="Valor médio da conta"
                  variant="outlined"
                  fullWidth
                  color="primary"
                  type="number"
                />
                <Button variant="contained" fullWidth color="secondary">
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
