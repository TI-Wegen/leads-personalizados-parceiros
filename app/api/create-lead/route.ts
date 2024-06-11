import {
  CampanhaResponse,
  CreateNewLead,
  CreateNewLeadRequest,
  GetBackoffice,
  GetConfigResponse,
  GetIdPlataforma,
  GetInfoCampanhaById,
  GetLeadIdByTimeStampAndParceiro,
  GetParceiroResponse,
  VerifyIsBackoffice,
} from "@/app/lib/dbQueries";
import { SendBillToServer } from "@/app/lib/fileSender";
import {
  LeadEmail,
  LeadParceiroEmail,
  sendLeadEmail,
  sendLeadParceiroEmail,
} from "@/app/lib/maillSender";
import { GetDatas } from "@/app/lib/util";
import { NextResponse } from "next/server";

interface BodyRequest {
  nome: string;
  email: string;
  telefone: string;
  valorConta: string;
}

export async function POST(req: Request) {
  const dataFormData = await req.formData();

  try {
    var file = dataFormData.get("file") as File;
    var body = dataFormData.get("body");

    if (body == null) {
      throw "Body não encontrado.";
    }

    var jsonBody = JSON.parse(body as string);

    var idParceiro = jsonBody.idParceiro;

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
      nomeCompleto: jsonBody.nome,
      telefone: jsonBody.telefone,
      email: jsonBody.email,
      valorConta: jsonBody.valorConta,
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
      nomeCampanha: "economia.wegen.com.br",
      interesse: "C /",
      statusCupom: "Solicitado",
      idCorretorCampanha: "0",
    };

    var config = await GetConfigResponse(idParceiro);

    if (config == null) {
      config = await GetConfigResponse("12");
    }

    var createLeadResult = await CreateNewLead(createNewLeadRequest);

    var leadId = await GetLeadIdByTimeStampAndParceiro(
      createNewLeadRequest.idCaptador,
      createNewLeadRequest.timestamp
    );

    if (leadId == null) {
      throw "Id não encontrado.";
    }

    if (!file) {
      var leadEmail: LeadEmail = {
        nomeCliente: jsonBody.nome,
        emailCliente: jsonBody.email,
        nomeParceiro: jsonBody.Nome,
        corPrimaria: config!.CorPrimaria,
        nomePlataforma: "WeGen",
        urlLogo: `${process.env.SITE_URL}/parceiros/${
          config!.IdParceiro
        }/Logo.png`,
        urlAnexarConta: `${process.env.SITE_URL}/anexar-conta/${leadId}`,
      };

      await sendLeadEmail(leadEmail);
    } else {
      await SendBillToServer(leadId, file);
    }

    var leadParceiroEmail: LeadParceiroEmail = {
      corPrimaria: config!.CorPrimaria,
      emailParceiro: parceiroResponse.email,
      nomeParceiro: parceiroResponse.descParceiro,
      nomePlataforma: "WeGen",
      urlLogo: `${process.env.SITE_URL}/parceiros/${
        config!.IdParceiro
      }/Logo.png`,
    };

    await sendLeadParceiroEmail(leadParceiroEmail);

    return NextResponse.json({
      message: createLeadResult,
    });
  } catch (error) {
    return new NextResponse("Não foi possível criar seu contato.", {
      status: 500,
    });
  }
}
