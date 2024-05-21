import { ParceiroExists } from "@/app/lib/dbQueries";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    var response = await ParceiroExists(params.id);

    return NextResponse.json(response?.existe);
  } catch (error) {
    console.log(error);
    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}
