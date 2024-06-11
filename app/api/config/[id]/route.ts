import {
  CanUploadBill,
  GetConfigResponse,
  GetParceiroNomeById,
} from "@/app/lib/dbQueries";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    var response = await GetConfigResponse(params.id);

    if (response == null) {
      var nome = await GetParceiroNomeById(params.id);
      response = await GetConfigResponse("12");

      if (nome) {
        response!.Texto = `*${nome.toUpperCase()} CONVIDA* VOCÊ A ECONOMIZAR ATÉ *25% EM SUA TARIFA DE ENERGIA.*`;
      }
    }

    var anexoSimulador = await CanUploadBill(params.id);

    if (anexoSimulador == null) {
      throw "Houve um erro ao verificar a possibilidade de enviar conta";
    }

    var fullResponse = {
      ...response,
      anexoSimulador: anexoSimulador,
    };

    return NextResponse.json(fullResponse);
  } catch (error) {
    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}
