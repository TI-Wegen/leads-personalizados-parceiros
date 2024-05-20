import { GetLeadData, LeadExists } from "@/app/lib/dbQueries";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    var exist = await LeadExists(params.id);

    if (!exist) {
      return new NextResponse("Não há leads com esse id.", {
        status: 404,
      });
    }

    var response = await GetLeadData(params.id);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}
