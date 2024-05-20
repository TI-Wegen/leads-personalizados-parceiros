"use client";

import { Autocomplete, Button, Checkbox, TextField } from "@mui/material";
import * as C from "./style";
import { useEffect, useState } from "react";
import { ConfigRequest, ParceiroSelectResponse } from "@/app/lib/dbQueries";
import useAuth from "@/hooks/useAuth";
import { MuiColorInput } from "mui-color-input";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useRouter } from "next/navigation";
import Notiflix from "notiflix";

export default function Page() {
  useAuth();

  const router = useRouter();

  const [idParceiro, setIdParceiro] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
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

  useEffect(() => {
    if (!temPixelFacebook) {
      setPixelFacebook(null);
    }
  }, [temPixelFacebook]);

  useEffect(() => {
    getOptions();
  }, []);

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

  const createNewConfig = async () => {
    var body = {
      IdParceiro: idParceiro,
      CorPrimaria: corPrimaria,
      CorSecundaria: corSecundaria,
      Nome: nome,
      Texto: texto,
      Telefone: telefone,
      TemPixelFacebook: temPixelFacebook,
      PixelFacebook: pixelFacebook,
    };

    const response = await fetch("/api/config", {
      method: "POST",
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
          method: "POST",
          body: formData,
        }
      );

      if (imagesResponse.ok) {
        Notiflix.Notify.success("Criado com sucesso!");
        router.back();
      } else {
        Notiflix.Notify.failure(
          "Houve um erro ao criar as imagens do parceiro."
        );
      }
    } else {
      Notiflix.Notify.failure("Houve um erro ao criar a config do parceiro.");
    }
  };

  return (
    <C.Container>
      <C.Wrapper>
        <C.Card>
          <h3>Criar nova configuração de lead</h3>
          <C.FullWidthStack direction={"column"} spacing={2}>
            <C.FullWidthStack direction={"row"} spacing={2}>
              <Autocomplete
                disablePortal
                fullWidth
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
                onChange={(e) => setTelefone(e.target.value)}
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
              {temPixelFacebook && (
                <TextField
                  label="Pixel Facebook"
                  fullWidth
                  value={pixelFacebook}
                  onChange={(e) => setPixelFacebook(e.target.value)}
                />
              )}
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
                  <C.CustomImage src={logoUrl} alt="Uploaded" />
                ) : (
                  <AddIcon />
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
                  <C.CustomImage src={bgUrl} alt="Uploaded" />
                ) : (
                  <AddIcon />
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
                  <C.CustomImage src={bgMobileUrl} alt="Uploaded" />
                ) : (
                  <AddIcon />
                )}
              </C.ImageDiv>
            </C.FullWidthStack>
            <C.ButtonArea>
              <Button
                variant="contained"
                color="success"
                onClick={() => createNewConfig()}
              >
                Criar
              </Button>
            </C.ButtonArea>
          </C.FullWidthStack>
        </C.Card>
      </C.Wrapper>
    </C.Container>
  );
}
