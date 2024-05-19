import { GetConfigResponseById } from "@/app/lib/dbQueries";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    var response = await GetConfigResponseById(params.id);

    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}
