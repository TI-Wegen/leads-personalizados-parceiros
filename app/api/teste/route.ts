import {
  GetBackoffice,
  GetIdPlataforma,
  GetInfoCampanhaById,
  GetParceiroResponse,
  VerifyIsBackoffice,
} from "@/app/lib/dbQueries";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    var teste = await GetBackoffice("12");
    return NextResponse.json(teste);
  } catch (error) {
    return NextResponse.json({
      message: "Erro",
    });
  }
}
