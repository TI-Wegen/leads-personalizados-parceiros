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
import FileUploadIcon from "@mui/icons-material/FileUpload";

export default function Page({ params }: { params: { id: string } }) {
  const [anexoSimulador, setAnexoSimulador] = useState(false);
  const [conta, setConta] = useState<File | null>(null);
  const [leadCriado, setLeadCriado] = useState(false);
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
    TextoAgradecimento:
      "VOCÊ ESTÁ A UM PASSO DE RECEBER ATÉ 25% DE DESCONTO NA SUA CONTA DE LUZ, EM BREVE TE RETORNAREMOS.",
    PorcentagemDesconto: "25",
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

      setConfig(data);

      setAnexoSimulador(data.anexoSimulador);

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

  const markedThanksTexts = config.TextoAgradecimento.split("*").map(
    (part, index) => {
      if (index % 2 === 0) {
        return part;
      } else {
        return (
          <C.MarkedText key={index} secondaryColor={config.CorSecundaria}>
            {part}
          </C.MarkedText>
        );
      }
    }
  );

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

    const jsonBody = JSON.stringify(body);

    const formData = new FormData();

    await formData.append("body", jsonBody!);

    if (conta) {
      await formData.append("file", conta);
    }

    const response = await fetch("/api/create-lead", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      Notiflix.Notify.success(data.message);
      await clearFields();
      await trackLead();
      await setInsideLoading(false);
      await setLeadCriado(true);
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

  const handleContaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      setConta(event.target.files[0]);
    }
  };

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
          href={`https://wa.me/55${config.Telefone}?text=Ol%C3%A1,%20vim%20do%20site%20do(a)%20${config.Nome}%20e%20quero%20economizar%20na%20minha%20conta%20de%20energia.`}
          target="_blank"
        >
          <img src={wppImage.src} alt="wppImage" />
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
            secondaryColor={config.CorSecundaria}
            onSubmit={handleSubmit}
          >
            {leadCriado ? (
              <>
                <C.TitleArea>
                  <C.Title>
                    <C.MarkedText secondaryColor={config.CorSecundaria}>
                      OBRIGADO POR SE CADASTRAR!
                    </C.MarkedText>
                  </C.Title>
                  <C.Subtitle>{markedThanksTexts}</C.Subtitle>
                </C.TitleArea>
              </>
            ) : (
              <>
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
                      <C.StyledTextField
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
                        <C.StyledTextField
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
                        <C.StyledTextField
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
                      <C.StyledTextField
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
                    {anexoSimulador && (
                      <>
                        <C.InputArea>
                          <label>Anexar conta (opcional)</label>
                        </C.InputArea>
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
                            Anexar conta
                            <C.VisuallyHiddenInput
                              type="file"
                              onChange={handleContaChange}
                            />
                          </Button>
                          <h4>
                            {conta ? conta.name : "Nenhum arquivo anexado."}
                          </h4>
                        </C.BillsArea>
                      </>
                    )}
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
              </>
            )}
          </C.FormContato>
        </C.ContentRight>
      </C.Content>
    </C.Container>
  );
}
