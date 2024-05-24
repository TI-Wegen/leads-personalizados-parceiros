import authOptions from "@/app/lib/authOptions";
import {
  ConfigRequest,
  CreateConfig,
  GetAllConfigsResponse,
  UpdateConfig,
} from "@/app/lib/dbQueries";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    var response = await GetAllConfigsResponse();

    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

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

    return NextResponse.json("Criado com sucesso.");
  } catch (error) {
    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
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

    await UpdateConfig(configReq);

    return NextResponse.json("Editado com sucesso.");
  } catch (error) {
    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}
