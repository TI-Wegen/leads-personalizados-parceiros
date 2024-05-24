"use client";

import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import * as C from "./style";
import { useEffect, useState } from "react";
import { ParceiroSelectResponse } from "@/app/lib/dbQueries";
import useAuth from "@/hooks/useAuth";
import { MuiColorInput } from "mui-color-input";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useRouter } from "next/navigation";
import Notiflix from "notiflix";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Page({ params }: { params: { id: string } }) {
  useAuth();

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [idParceiro, setIdParceiro] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telefoneSemMascara, setTelefoneSemMascara] = useState<string>("");
  const [corPrimaria, setCorPrimaria] = useState("#ffffff");
  const [corSecundaria, setCorSecundaria] = useState("#ffffff");
  const [texto, setTexto] = useState("");
  const [temPixelFacebook, setTemPixelFacebook] = useState(false);
  const [pixelFacebook, setPixelFacebook] = useState<string | null>(null);

  const [logoUrl, setLogoUrl] = useState<string | null | undefined>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);

  const [bgUrl, setBgUrl] = useState<string | null | undefined>(null);
  const [selectedBg, setSelectedBg] = useState<File | null>(null);

  const [bgMobileUrl, setBgMobileUrl] = useState<string | null | undefined>(
    null
  );
  const [selectedBgMobile, setSelectedBgMobile] = useState<File | null>(null);

  const [options, setOptions] = useState<OptionsType[]>([]);

  interface OptionsType {
    label: string;
    value: string;
  }

  const getOptions = async () => {
    try {
      const response = await fetch(`/api/parceiro`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      var data = await response.json();

      setOptions(
        data.map((partner: ParceiroSelectResponse) => ({
          label: `${partner.idparceiro} - ${partner.descparceiro}`,
          value: partner.idparceiro,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    await getOptions();

    const response = await fetch(`/api/config/get/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      var data = await response.json();

      await setIdParceiro(data.IdParceiro);
      setNome(data.Nome);
      setTelefone(data.Telefone);
      setCorPrimaria(data.CorPrimaria);
      setCorSecundaria(data.CorSecundaria);
      setTexto(data.Texto);
      setTemPixelFacebook(data.TemPixelFacebook);
      setPixelFacebook(data.PixelFacebook);

      setLoading(false);
    }
  };

  useEffect(() => {
    if (!temPixelFacebook) {
      setPixelFacebook(null);
    }
  }, [temPixelFacebook]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    loadFoneMask(telefone);
  }, [telefone]);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) {
        setLogoUrl(e.target!.result?.toString());
      };
      reader.readAsDataURL(event.target.files[0]);
      setSelectedLogo(event.target.files[0]);
    }
  };

  const handleBgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) {
        setBgUrl(e.target!.result?.toString());
      };
      reader.readAsDataURL(event.target.files[0]);
      setSelectedBg(event.target.files[0]);
    }
  };

  const handleBgMobileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) {
        setBgMobileUrl(e.target!.result?.toString());
      };
      reader.readAsDataURL(event.target.files[0]);
      setSelectedBgMobile(event.target.files[0]);
    }
  };

  const editConfig = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    var body = {
      IdParceiro: idParceiro,
      CorPrimaria: corPrimaria,
      CorSecundaria: corSecundaria,
      Nome: nome,
      Texto: texto,
      Telefone: telefoneSemMascara,
      TemPixelFacebook: temPixelFacebook,
      PixelFacebook: pixelFacebook,
    };

    const response = await fetch("/api/config", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const formData = new FormData();

      formData.append("logo", selectedLogo!);
      formData.append("bg", selectedBg!);
      formData.append("bgMobile", selectedBgMobile!);

      const imagesResponse = await fetch(
        `/api/config/save-images/${body.IdParceiro}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (imagesResponse.ok) {
        Notiflix.Notify.success("Editado com sucesso!");
        router.back();
        setLoading(false);
      } else {
        Notiflix.Notify.failure(
          "Houve um erro ao criar as imagens do parceiro."
        );
        setLoading(false);
      }
    } else {
      Notiflix.Notify.failure("Houve um erro ao criar a config do parceiro.");
      setLoading(false);
    }
  };

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

  const loadFoneMask = async (tel: string) => {
    console.log("AQUI");
    console.log(tel);

    if (tel != undefined) {
      // Limpar o valor, removendo todos os caracteres não numéricos
      const cleanedValue = tel.replace(/\D/g, "");

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
    }
  };
  return (
    <C.Container>
      <C.Wrapper onSubmit={editConfig}>
        <C.Card>
          {loading ? (
            <C.LoadingWrapper>
              <CircularProgress />
            </C.LoadingWrapper>
          ) : (
            <>
              <C.FullWidthStack
                direction={"row"}
                spacing={2}
                alignItems={"center"}
              >
                <IconButton color="primary" onClick={() => router.back()}>
                  <ArrowBackIcon />
                </IconButton>
                <h3>Editar configuração de lead</h3>
              </C.FullWidthStack>
              <C.FullWidthStack direction={"column"} spacing={2}>
                <C.FullWidthStack direction={"row"} spacing={2}>
                  <Autocomplete
                    readOnly
                    disablePortal
                    fullWidth
                    value={
                      idParceiro
                        ? options.find((x) => x.value == idParceiro)
                        : null
                    }
                    options={options}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        console.log("Valor selecionado:", newValue.value);
                        setIdParceiro(newValue.value);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Parceiro" />
                    )}
                  />
                </C.FullWidthStack>
                <C.FullWidthStack direction={"row"} spacing={2}>
                  <TextField
                    label="Nome"
                    fullWidth
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                  <TextField
                    label="Telefone"
                    fullWidth
                    value={telefone}
                    onChange={handlePhoneChange}
                    inputProps={{
                      maxLength: 15,
                      minLength: 15,
                    }}
                  />
                </C.FullWidthStack>
                <C.FullWidthStack direction={"row"} spacing={2}>
                  <TextField
                    multiline
                    rows={4}
                    label="Texto"
                    fullWidth
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                  />
                  <C.TextWarning>
                    Ao colocar textos entre <span>* *</span> eles ficarão
                    destacados. <br />
                    Ex: Tenha desconto na sua <span>*energia*</span>!
                  </C.TextWarning>
                </C.FullWidthStack>
                <C.FullWidthStack direction={"row"} spacing={2}>
                  <C.CheckboxWrapper>
                    <Checkbox
                      checked={temPixelFacebook}
                      onChange={(e) => setTemPixelFacebook(e.target.checked)}
                    />
                    <label>Tem pixel do facebook?</label>
                  </C.CheckboxWrapper>
                  {temPixelFacebook ? (
                    <TextField
                      label="Pixel Facebook"
                      fullWidth
                      value={pixelFacebook}
                      onChange={(e) => setPixelFacebook(e.target.value)}
                    />
                  ) : null}
                </C.FullWidthStack>
                <C.FullWidthStack direction={"row"} spacing={2}>
                  <MuiColorInput
                    label="Cor Primária"
                    sx={{ width: "100%" }}
                    format="hex"
                    value={corPrimaria}
                    onChange={(e) => setCorPrimaria(e)}
                  />
                  <MuiColorInput
                    label="Cor Secundária"
                    sx={{ width: "100%" }}
                    format="hex"
                    value={corSecundaria}
                    onChange={(e) => setCorSecundaria(e)}
                  />
                </C.FullWidthStack>
                <h3>Imagens</h3>
                <C.FullWidthStack direction={"row"} spacing={2}>
                  <C.ButtonDiv>
                    <Button
                      component="label"
                      sx={{ padding: "10px" }}
                      role={undefined}
                      variant="contained"
                      fullWidth
                      startIcon={<FileUploadIcon />}
                    >
                      Upload Logo
                      <C.VisuallyHiddenInput
                        type="file"
                        onChange={handleLogoChange}
                      />
                    </Button>
                  </C.ButtonDiv>

                  <C.ImageDiv>
                    {logoUrl ? (
                      <img src={logoUrl} alt="Uploaded" />
                    ) : (
                      <img src={`/parceiros/${idParceiro}/Logo.png`} />
                    )}
                  </C.ImageDiv>
                </C.FullWidthStack>
                <C.FullWidthStack direction={"row"} spacing={2}>
                  <C.ButtonDiv>
                    <Button
                      component="label"
                      sx={{ padding: "10px" }}
                      role={undefined}
                      variant="contained"
                      fullWidth
                      startIcon={<FileUploadIcon />}
                    >
                      Upload Background
                      <C.VisuallyHiddenInput
                        type="file"
                        onChange={handleBgChange}
                      />
                    </Button>
                  </C.ButtonDiv>

                  <C.ImageDiv>
                    {bgUrl ? (
                      <img src={bgUrl} alt="Uploaded" />
                    ) : (
                      <img src={`/parceiros/${idParceiro}/Bg.png`} alt="img" />
                    )}
                  </C.ImageDiv>
                </C.FullWidthStack>
                <C.FullWidthStack direction={"row"} spacing={2}>
                  <C.ButtonDiv>
                    <Button
                      component="label"
                      sx={{ padding: "10px" }}
                      role={undefined}
                      variant="contained"
                      fullWidth
                      startIcon={<FileUploadIcon />}
                    >
                      Upload Background Mobile
                      <C.VisuallyHiddenInput
                        type="file"
                        onChange={handleBgMobileChange}
                      />
                    </Button>
                  </C.ButtonDiv>

                  <C.ImageDiv>
                    {bgMobileUrl ? (
                      <img src={bgMobileUrl} alt="Uploaded" />
                    ) : (
                      <img
                        src={`/parceiros/${idParceiro}/BgMobile.png`}
                        alt="img"
                      />
                    )}
                  </C.ImageDiv>
                </C.FullWidthStack>
                <C.ButtonArea>
                  <Button variant="contained" color="success" type="submit">
                    Salvar
                  </Button>
                </C.ButtonArea>
              </C.FullWidthStack>
            </>
          )}
        </C.Card>
      </C.Wrapper>
    </C.Container>
  );
}
