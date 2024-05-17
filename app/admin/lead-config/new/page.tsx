"use client";

import { Autocomplete, TextField } from "@mui/material";
import * as C from "./style";
import { useEffect, useState } from "react";
import { ParceiroSelectResponse } from "@/app/lib/dbQueries";
import useAuth from "@/hooks/useAuth";

export default function Page() {
  useAuth();
  const [options, setOptions] = useState<ParceiroSelectResponse[]>([]);

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
    getOptions();
  }, []);

  return (
    <C.Container>
      <C.Wrapper>
        <C.Card>
          <h3>Criar nova configuração de lead</h3>
          <C.FullWidthStack direction={"column"} spacing={2}>
            <C.FullWidthStack direction={"row"} spacing={2}>
              <TextField label="Nome" fullWidth />
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={options}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Parceiro" />
                )}
              />
            </C.FullWidthStack>
            <C.FullWidthStack direction={"row"} spacing={2}>
              <TextField label="Telefone" fullWidth />
              <TextField label="Nome" fullWidth />
            </C.FullWidthStack>
          </C.FullWidthStack>
        </C.Card>
      </C.Wrapper>
    </C.Container>
  );
}
