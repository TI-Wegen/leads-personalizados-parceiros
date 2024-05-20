import { GetConfigResponse, GetParceiroNomeById } from "@/app/lib/dbQueries";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.formData();

    var conta = data.get("conta") as File;

    return NextResponse.json("Anexado com sucesso.");
  } catch (error) {
    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}
