import { AnexoLeadRequest, UpdateAnexoLead } from "@/app/lib/dbQueries";
import { NextResponse } from "next/server";
import { Client } from "basic-ftp";
import fs from "fs/promises";
import path from "path";
import { GeraTimeStamp } from "@/app/lib/util";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.formData();

    var conta = data.get("conta") as File;

    console.log("1 - Reconheceu conta");

    if (!conta) {
      throw new Error("Arquivo corrompido.");
    }

    var contaBuffer = new Uint8Array(await conta.arrayBuffer());

    console.log("2 - Transformou conta em buffer");

    const client = new Client();

    await client.access({
      host: process.env.FTP_HOST,
      port: Number(process.env.FTP_PORT),
      user: process.env.FTP_USER,
      password: process.env.FTP_PWD,
    });

    console.log("3 - Criou o client FTP");

    var timestamp = GeraTimeStamp();

    var fileName = `${timestamp}.${conta.name.split(".").pop()}`;

    const dirPath = path.join(process.cwd(), "public", "temp", fileName);

    await fs.writeFile(dirPath, contaBuffer);

    console.log("4 - Criou o arquivo local");

    await client.uploadFrom(dirPath, fileName);

    console.log("5 - Enviou ao ftp");

    await fs.unlink(dirPath);

    console.log("6 - Apagou do local");

    var body: AnexoLeadRequest = {
      idLead: params.id,
      urlAnexo: fileName,
    };

    await UpdateAnexoLead(body);

    console.log("7 - Colocou url no banco de dados");

    return NextResponse.json("Anexado com sucesso.");
  } catch (error) {
    console.log(error);

    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}
