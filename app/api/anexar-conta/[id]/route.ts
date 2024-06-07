import { AnexoLeadRequest, UpdateAnexoLead } from "@/app/lib/dbQueries";
import { NextResponse } from "next/server";
import { Client } from "basic-ftp";
import fs from "fs/promises";
import path from "path";
import { GeraTimeStamp } from "@/app/lib/util";
import { SendBillToServer } from "@/app/lib/fileSender";

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

    await SendBillToServer(params.id, conta);

    return NextResponse.json("Anexado com sucesso.");
  } catch (error) {
    console.log(error);

    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}
