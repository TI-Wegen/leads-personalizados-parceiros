"use client";

import Image from "next/image";
import wppImage from "../../../public/WhatsApp.png";
import * as C from "./style";
import { Button, Stack, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import { ConfigResponse } from "../../lib/dbQueries";
import SkeletonLoad from "@/components/Skeleton";
import { useRouter } from "next/navigation";
import FileUploadIcon from "@mui/icons-material/FileUpload";

export default function Page({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
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
    Texto: "texto",
    TemPixelFacebook: false,
    PixelFacebook: null,
  });

  const [conta, setConta] = useState<File | null>(null);

  const handleContaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      setConta(event.target.files[0]);
    }
  };

  const router = useRouter();

  const parceiroExists = async () => {
    try {
      const response = await fetch(`/api/parceiro/existe/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      var existe = await response.json();

      if (!existe) {
        router.push("/12");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getConfig = async () => {
    try {
      const response = await fetch(`/api/config/${params.id}`, {
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

  useEffect(() => {
    parceiroExists();
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
    setConta(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = {};

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

  return loading ? (
    <SkeletonLoad />
  ) : (
    <C.Container
      secondaryColor={config.CorSecundaria}
      bgUrl={`/parceiros/${config.IdParceiro}/Bg.png`}
    >
      <C.NavbarContainer primaryColor={config.CorPrimaria}>
        <C.NavbarLogo
          src={`/parceiros/${config.IdParceiro}/Logo.png`}
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
          bgUrl={`/parceiros/${config.IdParceiro}/BgMobile.png`}
        >
          <C.TextDescription>
            <C.MarkedText secondaryColor={config.CorSecundaria}>
              HEITOR{" "}
            </C.MarkedText>
            OBRIGADO POR ENVIAR SUA SOLICITAÇÃO! <br />
            <br />
            VOCÊ ESTÁ A UM PASSO DE ECONOMIZAR EM{" "}
            <C.MarkedText secondaryColor={config.CorSecundaria}>
              ATÉ 25% NA SUA CONTA DE ENERGIA.{" "}
            </C.MarkedText>
          </C.TextDescription>
        </C.ContentLeft>
        <C.ContentRight>
          <C.FormContato
            primaryColor={config.CorPrimaria}
            onSubmit={handleSubmit}
          >
            <C.TitleArea>
              <C.Title>
                <C.MarkedText secondaryColor={config.CorSecundaria}>
                  {config.Nome.toUpperCase()}
                </C.MarkedText>
                <hr />
                INSIRA SUA CONTA DE LUZ
              </C.Title>
              <C.Subtitle></C.Subtitle>
            </C.TitleArea>
            <ThemeProvider theme={theme}>
              <Stack direction={"column"} spacing={2}>
                <C.BillsArea direction="column" spacing={2}>
                  <Button
                    color="secondary"
                    component="label"
                    sx={{ padding: "10px" }}
                    role={undefined}
                    variant="contained"
                    fullWidth
                    startIcon={<FileUploadIcon />}
                  >
                    Anexar arquivo
                    <C.VisuallyHiddenInput
                      type="file"
                      onChange={handleContaChange}
                    />
                  </Button>
                  <h4>{conta ? conta.name : "Nenhum arquivo anexado."}</h4>
                </C.BillsArea>
                <Button
                  variant="contained"
                  fullWidth
                  color="secondary"
                  type="submit"
                >
                  Enviar
                </Button>
              </Stack>
            </ThemeProvider>
          </C.FormContato>
        </C.ContentRight>
      </C.Content>
    </C.Container>
  );
}
