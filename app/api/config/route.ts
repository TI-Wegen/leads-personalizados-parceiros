import { GetAllConfigsResponse } from "@/app/lib/dbQueries";
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

export async function POST() {
  try {
    var response = await GetAllConfigsResponse();

    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}
