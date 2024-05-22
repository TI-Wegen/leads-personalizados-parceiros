"use client";

import Image from "next/image";
import wppImage from "../../public/WhatsApp.png";
import * as C from "./style";
import {
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import { ConfigResponse } from "../lib/dbQueries";
import SkeletonLoad from "@/components/Skeleton";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  const [insideLoading, setInsideLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [telefoneSemMascara, setTelefoneSemMascara] = useState<string>("");
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
    Texto: "texto",
    TemPixelFacebook: false,
    PixelFacebook: null,
  });

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
    } catch (error) {}
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

    if (config.TemPixelFacebook) {
      import("react-facebook-pixel")
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.init(config.PixelFacebook!);
          ReactPixel.pageView();
        });
    }
  }, [config]);

  async function trackLead() {
    if (config.TemPixelFacebook) {
      import("react-facebook-pixel")
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.track("Lead");
        });
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

  async function clearFields() {
    setNome("");
    setTelefone("");
    setEmail("");
    setValorConta("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await setInsideLoading(true);

    const body = {
      idParceiro: params.id,
      nome: nome,
      telefone: telefoneSemMascara,
      email: email,
      valorConta: valorConta.replace(",", "."),
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
      await trackLead();
      await setInsideLoading(false);
    } else {
      Notiflix.Notify.failure("Houve um erro ao criar seu contato.");
      await setInsideLoading(false);
    }
  }

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    // Limpar o valor, removendo todos os caracteres não numéricos
    const cleanedValue = value.replace(/\D/g, "");

    // Formatar o valor conforme necessário
    let formattedValue = "";
    if (cleanedValue.length <= 10) {
      formattedValue = cleanedValue.replace(
        /(\d{2})(\d{0,4})(\d{0,4})/,
        "($1) $2-$3"
      );
    } else {
      formattedValue = cleanedValue.replace(
        /(\d{2})(\d{0,5})(\d{0,4})/,
        "($1) $2-$3"
      );
    }

    // Aqui você pode salvar o valor formatado e o valor limpo (sem máscara)
    setTelefone(formattedValue);
    setTelefoneSemMascara(cleanedValue); // Essa função você precisará definir no seu state
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formattedValue = value
      .replace(/\D/g, "")
      .replace(/(\d)(\d{2})$/, "$1,$2");
    setValorConta(formattedValue);
  };

  return loading ? (
    <SkeletonLoad />
  ) : (
    <C.Container
      secondaryColor={config.CorSecundaria}
      bgUrl={`/parceiros/${config.IdParceiro}/Bg.png`}
    >
      <C.NavbarContainer primaryColor={config.CorPrimaria}>
        <img src={`/parceiros/${config.IdParceiro}/Logo.png`} alt="logo" />

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
                <C.InputArea>
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
                </C.InputArea>
                <Stack spacing={2} direction="row">
                  <C.InputArea>
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
                  </C.InputArea>
                  <C.InputArea>
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
                      onChange={handlePhoneChange}
                      inputProps={{
                        maxLength: 15,
                        minLength: 15,
                      }}
                    />
                  </C.InputArea>
                </Stack>
                <C.InputArea>
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
                    onChange={handleValorChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    }}
                    inputProps={{
                      maxLength: 10,
                      minLength: 3,
                    }}
                  />
                </C.InputArea>

                <Button
                  variant="contained"
                  fullWidth
                  color="secondary"
                  type="submit"
                >
                  {insideLoading ? (
                    <CircularProgress color="primary" size={22} />
                  ) : (
                    "Solicitar Proposta"
                  )}
                </Button>
              </Stack>
            </ThemeProvider>
          </C.FormContato>
        </C.ContentRight>
      </C.Content>
    </C.Container>
  );
}
