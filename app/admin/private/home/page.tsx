"use client";

import { ConfigResponse } from "@/app/lib/dbQueries";
import * as C from "./style";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { signOut } from "next-auth/react";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Page() {
  const router = useRouter();
  const [rows, setRows] = useState<ConfigResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const goToPage = (id: string) => {
    router.push(`/admin/private/lead-config/${id}`);
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

      setRows(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
        <C.Header>
          <IconButton onClick={() => signOut()}>
            <LogoutIcon />
          </IconButton>
          <Button
            variant="contained"
            color="info"
            startIcon={<AddIcon />}
            onClick={() => router.push(`/admin/private/lead-config/new`)}
          >
            Novo
          </Button>
        </C.Header>
        <C.Card>
          {loading ? (
            <C.LoadingWrapper>
              <CircularProgress />
            </C.LoadingWrapper>
          ) : (
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
          )}
        </C.Card>
      </C.Wrapper>
    </C.Container>
  );
}
