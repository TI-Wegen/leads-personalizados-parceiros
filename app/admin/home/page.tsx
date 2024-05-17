"use client";

import { ConfigResponse } from "@/app/lib/dbQueries";
import * as C from "./style";
import useAuth from "@/hooks/useAuth";
import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";

export default function Page() {
  useAuth();

  const router = useRouter();
  const [rows, setRows] = useState<ConfigResponse[]>([]);

  const goToPage = (id: string) => {
    router.push(`/admin/lead-config/${id}`);
  };

  const getConfigs = async () => {
    try {
      const response = await fetch(`/api/config`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      var data = await response.json();

      console.log(data);

      setRows(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getConfigs();
  }, []);

  const columns: GridColDef[] = [
    { field: "Id", headerName: "ID", flex: 1 },
    { field: "IdParceiro", headerName: "Id Parceiro", flex: 1 },
    { field: "Nome", headerName: "Nome", flex: 1 },
    { field: "Telefone", headerName: "Telefone", flex: 1 },
    {
      field: "options",
      headerName: "Ver mais",
      flex: 1,
      renderCell: (params) => (
        <Button
          onClick={() => goToPage(params.row.Id)}
          variant="contained"
          color="info"
        >
          Ver Mais
        </Button>
      ),
    },
  ];

  return (
    <C.Container>
      <C.Wrapper>
        <Button
          variant="contained"
          color="info"
          startIcon={<AddIcon />}
          onClick={() => router.push(`/admin/lead-config/new`)}
        >
          Novo
        </Button>
        <C.Card>
          <DataGrid
            sx={{
              border: "none",
            }}
            rows={rows}
            getRowId={(row) => row.Id}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </C.Card>
      </C.Wrapper>
    </C.Container>
  );
}
