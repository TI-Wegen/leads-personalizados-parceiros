import {
  ConfigRequest,
  CreateConfig,
  GetAllConfigsResponse,
  GetConfigIdByParceiroId,
} from "@/app/lib/dbQueries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    var response = await GetAllConfigsResponse();

    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  try {
    var configReq: ConfigRequest = {
      IdParceiro: data.IdParceiro,
      CorPrimaria: data.CorPrimaria,
      CorSecundaria: data.CorSecundaria,
      Nome: data.Nome,
      Texto: data.Texto,
      Telefone: data.Telefone,
      TemPixelFacebook: data.TemPixelFacebook,
      PixelFacebook: data.PixelFacebook,
    };

    await CreateConfig(configReq);

    return NextResponse.json("OK");
  } catch (error) {
    console.log(error);

    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}
