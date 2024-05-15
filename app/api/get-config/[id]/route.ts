import { GetConfigResponse } from "@/app/lib/dbQueries";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    var response = await GetConfigResponse(params.id);

    if (response == null) {
      response = await GetConfigResponse("12");
    }
  } catch (error) {
    return NextResponse.json({
      message: error,
    });
  }
  return NextResponse.json(response);
}
