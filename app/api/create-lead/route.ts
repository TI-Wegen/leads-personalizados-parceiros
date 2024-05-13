import {
  CampanhaResponse,
  CreateNewLead,
  CreateNewLeadRequest,
  GetBackoffice,
  GetIdPlataforma,
  GetInfoCampanhaById,
  GetParceiroResponse,
  VerifyIsBackoffice,
} from "@/app/lib/dbQueries";
import { GetDatas } from "@/app/lib/util";
import { NextResponse } from "next/server";

interface BodyRequest {
  nome: string;
  email: string;
  telefone: string;
  valorConta: string;
}

export async function POST(req: Request) {
  var idParceiro = process.env.ID_PARCEIRO;

  try {
    var parceiroResponse = await GetParceiroResponse();
  } catch (error) {
    return NextResponse.json({
      message: error,
    });
  }

  var campanhaResponse: CampanhaResponse = {
    idCupom: "0",
    nomeCampanha: "Comercial",
  };

  try {
    var response = await GetInfoCampanhaById(parceiroResponse.idCampanha);

    if (!response || Object.keys(response).length > 0) {
      campanhaResponse = response;
    }
  } catch (error) {
    return NextResponse.json({
      message: error,
    });
  }

  var idBackoffice = "12";

  try {
    var isBackoffice = await VerifyIsBackoffice();
  } catch (error) {
    return NextResponse.json({
      message: error,
    });
  }

  if (isBackoffice) {
    idBackoffice = idParceiro!;
  } else {
    try {
      var idPlataforma = await GetIdPlataforma();

      idBackoffice = await GetBackoffice(idPlataforma);
    } catch (error) {
      return NextResponse.json({
        message: error,
      });
    }
  }

  const data = await req.json();

  var datas = GetDatas();

  var createNewLeadRequest: CreateNewLeadRequest = {
    nomeCompleto: data.nome,
    telefone: data.telefone,
    email: data.email,
    valorConta: data.valorConta,
    statusLead: "Lead",
    data: datas.data,
    hora: datas.horas,
    idCupom: campanhaResponse.idCupom,
    idCaptador: idParceiro!,
    timestamp: datas.timestamp,
    economiaEstipulada: "0",
    idBackoffice: idBackoffice,
    tipoLead: "Comercial",
    idCampanha: parceiroResponse.idCampanha,
    nomeCampanha: campanhaResponse.nomeCampanha,
    interesse: "C /",
    statusCupom: "Solicitado",
    idCorretorCampanha: "0",
  };

  try {
    var createLeadResult = await CreateNewLead(createNewLeadRequest);
    return NextResponse.json({
      message: createLeadResult,
    });
  } catch (error) {
    return NextResponse.json({
      message: error,
    });
  }
}
