import authOptions from "@/app/lib/authOptions";
import { GetAllParceirosResponse } from "@/app/lib/dbQueries";
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
    var response = await GetAllParceirosResponse();

    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse("Houve um erro durante sua requisição.", {
      status: 500,
    });
  }
}
