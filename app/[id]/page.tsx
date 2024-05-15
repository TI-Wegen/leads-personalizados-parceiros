"use client";

import bg from "../../public/Bg.png";
import Image from "next/image";
import wppImage from "../../public/WhatsApp.png";
import styles from "./page.module.css";
import * as C from "./style";
import {
  Button,
  Stack,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import { ConfigResponse } from "../lib/dbQueries";
import SkeletonLoad from "@/components/Skeleton";

export default function Home({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [valorConta, setValorConta] = useState<string>("");
  const [cellPhone, setCellphone] = useState({
    ddd: "31",
    telefone: "99999-9999",
  });
  const [theme, setTheme] = useState(
    createTheme({
      palette: {
        primary: {
          main: "#ffffff",
        },
        secondary: {
          main: "#ffffff",
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
    })
  );

  const [config, setConfig] = useState<ConfigResponse>({
    Id: "1",
    IdParceiro: "12",
    Nome: "string",
    Telefone: "31999999999",
    CorPrimaria: "#ffffff",
    CorSecundaria: "#000000",
    Logo: "string",
    BgImage: null,
    BgImageMobile: null,
    Texto: "texto",
    TemPixelFacebook: false,
    PixelFacebook: null,
  });

  useEffect(() => {
    const getConfig = async () => {
      try {
        const response = await fetch(`/api/get-config/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        var data = await response.json();

        console.log(data);

        setConfig(data);

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getConfig();
  }, []);

  useEffect(() => {
    setTheme(
      createTheme({
        palette: {
          primary: {
            main: config.CorPrimaria,
          },
          secondary: {
            main: config.CorSecundaria,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                fontWeight: "700",
                color: config.CorPrimaria,
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
      })
    );

    const dddPart = config.Telefone.slice(0, 2);
    const restOfNumber = config.Telefone.slice(2);

    const formattedRest =
      restOfNumber.slice(0, 5) + "-" + restOfNumber.slice(5);

    setCellphone({
      ddd: dddPart,
      telefone: formattedRest,
    });
  }, [config]);

  async function clearFields() {
    setNome("");
    setTelefone("");
    setEmail("");
    setValorConta("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = {
      idParceiro: params.id,
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

  const markedTexts = config.Texto.split("*").map((part, index) => {
    if (index % 2 === 0) {
      return part;
    } else {
      return (
        <C.MarkedText key={index} secondaryColor={config.CorSecundaria}>
          {part}
        </C.MarkedText>
      );
    }
  });

  return loading ? (
    <SkeletonLoad />
  ) : (
    <C.Container
      secondaryColor={config.CorSecundaria}
      bgUrl={`/parceiros/${params.id}/Bg.png`}
    >
      <C.NavbarContainer primaryColor={config.CorPrimaria}>
        <C.NavbarLogo
          src={`/parceiros/${params.id}/Logo.svg`}
          alt="logo"
          width="200"
          height="200"
        />

        <C.Wpp target="_blank">
          <Image src={wppImage} alt="wppImage" />
          <C.WppNumber>
            <C.DDD>{cellPhone.ddd}</C.DDD> {cellPhone.telefone}
          </C.WppNumber>
        </C.Wpp>
      </C.NavbarContainer>
      <C.Content>
        <C.ContentLeft
          secondaryColor={config.CorSecundaria}
          bgUrl={`/parceiros/${params.id}/BgMobile.png`}
        >
          <C.TextDescription>{markedTexts}</C.TextDescription>
        </C.ContentLeft>
        <C.ContentRight>
          <C.FormContato
            primaryColor={config.CorPrimaria}
            onSubmit={handleSubmit}
          >
            <C.TitleArea>
              <C.Title>
                <C.MarkedText secondaryColor={config.CorSecundaria}>
                  CADASTRE-SE{" "}
                </C.MarkedText>
                PARA GARANTIR MAIS ECONOMIA NA{" "}
                <C.MarkedText secondaryColor={config.CorSecundaria}>
                  SUA CONTA DE LUZ{" "}
                </C.MarkedText>
              </C.Title>
              <C.Subtitle>APROVEITE, ECONOMIZAR É GRÁTIS!</C.Subtitle>
            </C.TitleArea>
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
                    color="secondary"
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
                      color="secondary"
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
                      color="secondary"
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
                    color="secondary"
                    required
                    value={valorConta}
                    onChange={(e) => setValorConta(e.target.value)}
                  />
                </div>

                <Button
                  variant="contained"
                  fullWidth
                  color="secondary"
                  type="submit"
                >
                  Solicitar Proposta
                </Button>
              </Stack>
            </ThemeProvider>
          </C.FormContato>
        </C.ContentRight>
      </C.Content>
    </C.Container>
  );
}
