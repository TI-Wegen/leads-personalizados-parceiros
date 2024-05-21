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
import { LeadEmail, sendLeadEmail } from "@/app/lib/maillSender";
import { GetDatas } from "@/app/lib/util";
import { NextResponse } from "next/server";

interface BodyRequest {
  nome: string;
  email: string;
  telefone: string;
  valorConta: string;
}

export async function POST(req: Request) {
  const data = await req.json();

  var idParceiro = data.idParceiro;

  try {
    var parceiroResponse = await GetParceiroResponse(idParceiro);

    var campanhaResponse: CampanhaResponse = {
      idCupom: "0",
      nomeCampanha: "Comercial",
    };

    if (parceiroResponse == null) {
      throw "Parceiro não encontrado.";
    }

    var response = await GetInfoCampanhaById(parceiroResponse.idCampanha);

    if (response == null) {
      throw "Campanha não encontrada.";
    }

    if (!response || Object.keys(response).length > 0) {
      campanhaResponse = response;
    }

    var idBackoffice = "12";

    var isBackoffice = await VerifyIsBackoffice(idParceiro);

    if (isBackoffice) {
      idBackoffice = idParceiro!;
    } else {
      var idPlataforma = await GetIdPlataforma();

      if (idPlataforma == null) {
        throw "Plataforma não encontrada.";
      }

      var backofficeResponse = await GetBackoffice(idPlataforma);

      if (backofficeResponse == null) {
        throw "Backoffice não encontrado.";
      }

      idBackoffice = backofficeResponse;
    }

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

    var createLeadResult = await CreateNewLead(createNewLeadRequest);

    var leadEmail: LeadEmail = {
      nomeCliente: data.nome,
      emailCliente: data.email,
      nomeParceiro: "Tramonte",
      corPrimaria: "#16663c",
      nomePlataforma: "WeGen",
      urlLogo: "https://app.wegen.com.br/Assets/img/WhatsApp.png",
    };

    await sendLeadEmail(leadEmail);

    return NextResponse.json({
      message: createLeadResult,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Não foi possível criar seu contato.", {
      status: 500,
    });
  }
}
