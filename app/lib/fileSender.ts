import { Client } from "basic-ftp";
import fs from "fs/promises";
import path from "path";
import { GeraTimeStamp } from "./util";
import { AnexoLeadRequest, UpdateAnexoLead } from "./dbQueries";

export async function SendBillToServer(idLead: string, conta: File) {
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
    idLead: idLead,
    urlAnexo: fileName,
  };

  await UpdateAnexoLead(body);

  console.log("7 - Colocou url no banco de dados");
}
