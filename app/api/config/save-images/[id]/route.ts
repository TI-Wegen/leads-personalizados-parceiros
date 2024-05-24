import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { GetConfigIdByParceiroId } from "@/app/lib/dbQueries";
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/lib/authOptions";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    var existConfig = await GetConfigIdByParceiroId(params.id);

    if (!existConfig) {
      return new NextResponse("Não existe config para este parceiro.", {
        status: 404,
      });
    }

    const data = await req.formData();

    var logo = data.get("logo") as File;

    var logoBuffer = new Uint8Array(await logo.arrayBuffer());

    var bg = data.get("bg") as File;

    var bgBuffer = new Uint8Array(await bg.arrayBuffer());

    var bgMobile = data.get("bgMobile") as File;

    var bgMobileBuffer = new Uint8Array(await bgMobile.arrayBuffer());

    //Cria pasta nova com o id do parceiro

    const dirPath = path.join(process.cwd(), "public", "parceiros", params.id);

    await fs.mkdir(dirPath, { recursive: true });

    // Finaliza criação da pasta

    //Cria os arquivos na pasta

    const logoFilePath = path.join(dirPath, "Logo.png");

    fs.writeFile(logoFilePath, logoBuffer);

    const bgFilePath = path.join(dirPath, "Bg.png");

    fs.writeFile(bgFilePath, bgBuffer);

    const bgMobileFilePath = path.join(dirPath, "BgMobile.png");

    fs.writeFile(bgMobileFilePath, bgMobileBuffer);

    //Finaliza criação dos arquivos

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const data = await req.formData();

    var logo = data.get("logo") as File;

    var bg = data.get("bg") as File;

    var bgMobile = data.get("bgMobile") as File;

    //Busca url com o id do parceiro

    const dirPath = path.join(process.cwd(), "public", "parceiros", params.id);

    // Finaliza criação da url

    //Atualiza os arquivos na pasta

    if (logo.name !== undefined) {
      var logoBuffer = new Uint8Array(await logo.arrayBuffer());

      const logoFilePath = path.join(dirPath, "Logo.png");

      fs.writeFile(logoFilePath, logoBuffer);
    }

    if (bg.name !== undefined) {
      var bgBuffer = new Uint8Array(await bg.arrayBuffer());

      const bgFilePath = path.join(dirPath, "Bg.png");

      fs.writeFile(bgFilePath, bgBuffer);
    }

    if (bgMobile.name !== undefined) {
      var bgMobileBuffer = new Uint8Array(await bgMobile.arrayBuffer());

      const bgMobileFilePath = path.join(dirPath, "BgMobile.png");

      fs.writeFile(bgMobileFilePath, bgMobileBuffer);
    }

    //Finaliza atualização dos arquivos

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}
