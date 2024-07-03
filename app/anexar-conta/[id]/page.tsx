"use client";

import Image from "next/image";
import wppImage from "../../../public/WhatsApp.png";
import * as C from "./style";
import {
  Button,
  CircularProgress,
  Stack,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import { ConfigResponse, LeadResponse } from "../../lib/dbQueries";
import SkeletonLoad from "@/components/Skeleton";
import { useRouter } from "next/navigation";
import FileUploadIcon from "@mui/icons-material/FileUpload";

export default function Page({ params }: { params: { id: string } }) {
  const [insideLoading, setInsideLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState<LeadResponse | null>(null);
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
    TextoAgradecimento: "",
    PorcentagemDesconto: "25",
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

  const getLead = async () => {
    try {
      const response = await fetch(`/api/lead/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        router.push("/12");
      }

      var data = await response.json();

      setLead(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getConfig = async (idParceiro: string | undefined) => {
    if (idParceiro != null) {
      try {
        const response = await fetch(`/api/config/${idParceiro}`, {
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
    }
  };

  useEffect(() => {
    getLead();
  }, []);

  useEffect(() => {
    getConfig(lead?.idParceiro);
  }, [lead]);

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
    await setInsideLoading(true);

    const formData = new FormData();

    await formData.append("conta", conta!);

    const response = await fetch(`/api/anexar-conta/${params.id}`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      Notiflix.Notify.success(data);
      await clearFields();
      await getLead();
      await setInsideLoading(false);
    } else {
      Notiflix.Notify.failure("Houve um erro ao criar seu contato.");
      await setInsideLoading(false);
    }
  }

  return loading ? (
    <SkeletonLoad />
  ) : (
    <C.Container
      primaryColor={config.CorPrimaria}
      secondaryColor={config.CorSecundaria}
      bgUrl={`/parceiros/${config.IdParceiro}/Bg.png`}
    >
      <C.NavbarContainer primaryColor={config.CorPrimaria}>
        <img src={`/parceiros/${config.IdParceiro}/Logo.png`} alt="logo" />

        <C.Wpp
          href={`https://wa.me/55${config.Telefone}?text=Ol%C3%A1,%20vim%20do%20site%20do(a)%20${config.Nome}%20e%20quero%20economizar%2025%%20na%20minha%20conta%20de%20energia.`}
          target="_blank"
        >
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
              {lead?.nome.toUpperCase()}{" "}
            </C.MarkedText>
            OBRIGADO POR ENVIAR SUA SOLICITAÇÃO! <br />
            <br />
            VOCÊ ESTÁ A UM PASSO DE ECONOMIZAR EM{" "}
            <C.MarkedText secondaryColor={config.CorSecundaria}>
              ATÉ {config.PorcentagemDesconto}% NA SUA CONTA DE ENERGIA.{" "}
            </C.MarkedText>
          </C.TextDescription>
        </C.ContentLeft>
        <C.ContentRight>
          <C.FormContato
            primaryColor={config.CorPrimaria}
            onSubmit={handleSubmit}
          >
            {insideLoading ? (
              <ThemeProvider theme={theme}>
                <C.TitleArea>
                  <CircularProgress color="secondary" />
                </C.TitleArea>
              </ThemeProvider>
            ) : lead?.anexouConta ? (
              <C.TitleArea>
                <C.Title>
                  <C.MarkedText secondaryColor={config.CorSecundaria}>
                    OBRIGADO POR ANEXAR SUA CONTA!
                  </C.MarkedText>
                </C.Title>
                <C.Subtitle>
                  ENTRAREMOS EM CONTATO EM BREVE COM UMA PROPOSTA
                </C.Subtitle>
              </C.TitleArea>
            ) : (
              <>
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
              </>
            )}
          </C.FormContato>
        </C.ContentRight>
      </C.Content>
    </C.Container>
  );
}
