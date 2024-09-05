import { RowDataPacket } from "mysql2/promise";
import { connection2 } from "./dbConnection";

export interface ConfigResponse {
  Id: string;
  IdParceiro: string;
  Nome: string;
  Telefone: string;
  CorPrimaria: string;
  CorSecundaria: string;
  Texto: string;
  TemPixelFacebook: boolean;
  PixelFacebook: string | null;
  TextoAgradecimento: string;
  PorcentagemDesconto: string;
}

export async function GetConfigResponse(
  idParceiro: string
): Promise<ConfigResponse | null> {
  try {
    const sql = `
      SELECT *
      FROM tblleadConfig 
      WHERE idParceiro='${idParceiro}'
    `;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: ConfigResponse = {
        Id: rows[0].Id,
        CorPrimaria: rows[0].CorPrimaria,
        CorSecundaria: rows[0].CorSecundaria,
        IdParceiro: rows[0].IdParceiro,
        Nome: rows[0].Nome,
        PixelFacebook: rows[0].PixelFacebook,
        Telefone: rows[0].Telefone,
        TemPixelFacebook: rows[0].TemPixelFacebook === 1,
        Texto: rows[0].Texto,
        TextoAgradecimento: rows[0].TextoAgradecimento,
        PorcentagemDesconto: rows[0].PorcentagemDesconto,
      };
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function GetConfigResponseById(
  id: string
): Promise<ConfigResponse | null> {
  try {
    const sql = `
            SELECT *
            FROM tblleadConfig 
            WHERE id ='${id}'
        `;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: ConfigResponse = {
        Id: rows[0].Id,
        CorPrimaria: rows[0].CorPrimaria,
        CorSecundaria: rows[0].CorSecundaria,
        IdParceiro: rows[0].IdParceiro,
        Nome: rows[0].Nome,
        PixelFacebook: rows[0].PixelFacebook,
        Telefone: rows[0].Telefone,
        TemPixelFacebook: rows[0].TemPixelFacebook === 1,
        Texto: rows[0].Texto,
        TextoAgradecimento: rows[0].TextoAgradecimento,
        PorcentagemDesconto: rows[0].PorcentagemDesconto,
      };
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function GetAllConfigsResponse(): Promise<
  ConfigResponse[] | null
> {
  try {
    const sql = `
      SELECT *
      FROM tblleadConfig
    `;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: ConfigResponse[] = rows.map((row) => ({
        Id: row.Id,
        CorPrimaria: row.CorPrimaria,
        CorSecundaria: row.CorSecundaria,
        IdParceiro: row.IdParceiro,
        Nome: row.Nome,
        PixelFacebook: row.PixelFacebook,
        Telefone: row.Telefone,
        TemPixelFacebook: row.TemPixelFacebook === 1,
        Texto: row.Texto,
        TextoAgradecimento: row.TextoAgradecimento,
        PorcentagemDesconto: rows[0].PorcentagemDesconto,
      }));
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

interface ParceiroResponse {
  idParceiro: string;
  idParceiroMaster: string;
  idCampanha: string;
  descParceiro: string;
  email: string;
}

export async function GetParceiroResponse(
  idParceiro: string
): Promise<ParceiroResponse | null> {
  try {
    const sql = `
            SELECT idparceiro as idParceiro,
                idparceiromaster as idParceiroMaster,
                idCampanha,
                descparceiro as descParceiro,
                email
            FROM tblcaptador 
            WHERE idparceiro='${idParceiro}' AND ativo='S'
        `;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: ParceiroResponse = {
        descParceiro: rows[0].descParceiro,
        idCampanha: rows[0].idCampanha,
        idParceiro: rows[0].idParceiro,
        idParceiroMaster: rows[0].idParceiroMaster,
        email: rows[0].email,
      };
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export interface CampanhaResponse {
  nomeCampanha: string;
  idCupom: string;
}

export async function GetInfoCampanhaById(
  idCampanha: string
): Promise<CampanhaResponse | null> {
  try {
    const sql = `SELECT desctitulolead AS nomeCampanha, idCupom FROM tblcampanha WHERE idCampanha=${idCampanha} LIMIT 1`;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: CampanhaResponse = {
        idCupom: rows[0].idCupom,
        nomeCampanha: rows[0].nomeCampanha,
      };
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function VerifyIsBackoffice(
  idParceiro: string
): Promise<boolean | null> {
  try {
    const sql = `SELECT 
        CASE 
            WHEN backoffice = 'S' THEN true
                ELSE false
            END AS backoffice_status
        FROM tblcaptador 
        WHERE idparceiro = '${idParceiro}'`;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: boolean = rows[0].backoffice_status === 1;
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function GetIdPlataforma(): Promise<string | null> {
  try {
    const sql = `SELECT idParceiroPlataforma FROM tblsettingsplataforma WHERE idSettings='1'`;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: string = rows[0].idParceiroPlataforma;
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function GetBackoffice(
  idPlataforma: string
): Promise<string | null> {
  try {
    const sql = `   
            SELECT idBackoffice,COUNT(tbllead.idlead) AS total 
            FROM tbllead,tblcaptador 
            WHERE tbllead.idBackoffice = tblcaptador.idparceiro 
            AND backoffice='S' 
            AND ativo='S' 
            AND (statuslead='Conta Anexada' 
            OR statuslead='Aguardando Envio de Conta' 
            OR statuslead='Lead') 
            AND idparceiro != ${idPlataforma} 
            GROUP BY idBackoffice 
            ORDER BY total ASC
        `;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: string = rows[0].idBackoffice;
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export interface CreateNewLeadRequest {
  nomeCompleto: string;
  telefone: string;
  email: string;
  valorConta: string;
  statusLead: string;
  data: string;
  hora: string;
  idCupom: string;
  idCaptador: string;
  timestamp: string;
  economiaEstipulada: string;
  idBackoffice: string;
  tipoLead: string;
  idCampanha: string;
  nomeCampanha: string;
  interesse: string;
  statusCupom: string;
  idCorretorCampanha: string;
}

export async function CreateNewLead(
  createNewLeadRequest: CreateNewLeadRequest
): Promise<string | null> {
  try {
    const sql = `
        INSERT INTO tbllead (
            nomecompleto,
            telefone,
            email,
            valorconta,
            statuslead,
            data,
            hora,
            idCupom,
            idCaptador,
            timestamp,
            economiaestipulada,
            idBackoffice,
            tipoLead,
            idCampanha,
            nomeCampanha,
            interesse,
            statusCupom,
            idCorretorCampanha
        ) VALUES (
            '${createNewLeadRequest.nomeCompleto}',
            '${createNewLeadRequest.telefone}',
            '${createNewLeadRequest.email}',
            '${createNewLeadRequest.valorConta}',
            '${createNewLeadRequest.statusLead}',
            '${createNewLeadRequest.data}',
            '${createNewLeadRequest.hora}',
            '${createNewLeadRequest.idCupom}',
            '${createNewLeadRequest.idCaptador}',
            '${createNewLeadRequest.timestamp}',
            '${createNewLeadRequest.economiaEstipulada}',
            '${createNewLeadRequest.idBackoffice}',
            '${createNewLeadRequest.tipoLead}',
            '${createNewLeadRequest.idCampanha}',
            '${createNewLeadRequest.nomeCampanha}',
            '${createNewLeadRequest.interesse}',
            '${createNewLeadRequest.statusCupom}',
            '${createNewLeadRequest.idCorretorCampanha}'
        )
        `;

    await connection2.query<RowDataPacket[]>(sql);

    return "Criado com sucesso!";
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export interface ParceiroSelectResponse {
  idparceiro: string;
  descparceiro: string;
}

export async function GetAllParceirosResponse(): Promise<
  ParceiroSelectResponse[] | null
> {
  try {
    const sql = `
      SELECT t.idparceiro , t.descparceiro  FROM tblcaptador t WHERE t.ativo = 'S'
    `;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: ParceiroSelectResponse[] = rows.map((row) => ({
        descparceiro: row.descparceiro,
        idparceiro: row.idparceiro,
      }));
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function GetParceiroNomeById(
  idParceiro: string
): Promise<string | null> {
  try {
    const sql = `SELECT t.apelido FROM tblcaptador t WHERE t.idparceiro = ${idParceiro}`;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: string = rows[0].apelido;
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

interface ParceiroExistsResponse {
  existe: boolean;
}

export async function ParceiroExists(
  idParceiro: string
): Promise<ParceiroExistsResponse | null> {
  try {
    const sql = `
      SELECT EXISTS(SELECT * FROM tblcaptador t WHERE idparceiro = ? AND ativo = 'S') AS existe
    `;

    const [rows] = await connection2.query<RowDataPacket[]>(sql, [idParceiro]);

    if (rows.length > 0) {
      const result: ParceiroExistsResponse = {
        existe: rows[0].existe === 1,
      };
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export interface ConfigRequest {
  IdParceiro: string;
  Nome: string;
  Telefone: string;
  CorPrimaria: string;
  CorSecundaria: string;
  Texto: string;
  TemPixelFacebook: boolean;
  PixelFacebook: string | null;
  TextoAgradecimento: string;
  PorcentagemDesconto: string;
}

interface VerifyConfigAlreadyExistsResponse {
  existe: boolean;
}

export async function VerifyConfigAlreadyExists(
  idParceiro: string
): Promise<ParceiroExistsResponse | null> {
  try {
    const sql = `
      SELECT EXISTS(SELECT * FROM tblleadConfig t WHERE idParceiro = ? AND ativo = 'S') AS existe
    `;

    const [rows] = await connection2.query<RowDataPacket[]>(sql, [idParceiro]);

    if (rows.length > 0) {
      const result: VerifyConfigAlreadyExistsResponse = {
        existe: rows[0].existe === 1,
      };
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function CreateConfig(
  request: ConfigRequest
): Promise<string | null> {
  try {
    const sql = `
        INSERT INTO tblleadConfig (
          Id,
          IdParceiro,
          Nome,
          Telefone,
          CorPrimaria,
          CorSecundaria,
          Texto,
          TemPixelFacebook,
          PixelFacebook,
          TextoAgradecimento,
          PorcentagemDesconto
        )
        VALUES ( 
          null,
          '${request.IdParceiro}',
          '${request.Nome}',
          '${request.Telefone}',
          '${request.CorPrimaria}',
          '${request.CorSecundaria}',
          '${request.Texto}',
          '${request.TemPixelFacebook}',
          '${request.PixelFacebook}',
          '${request.TextoAgradecimento}',
          ${request.PorcentagemDesconto}
        );

        `;

    await connection2.query<RowDataPacket[]>(sql);

    return "Criado com sucesso!";
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function GetConfigIdByParceiroId(
  idParceiro: string
): Promise<string | null> {
  try {
    const sql = `SELECT Id FROM tblleadConfig WHERE IdParceiro = ${idParceiro}`;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: string = rows[0].Id;
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function UpdateConfig(
  request: ConfigRequest
): Promise<string | null> {
  try {
    const sql = `
        UPDATE tblleadConfig
        SET 
          IdParceiro='${request.IdParceiro}',
          Nome='${request.Nome}', 
          Telefone='${request.Telefone}', 
          CorPrimaria='${request.CorPrimaria}', 
          CorSecundaria='${request.CorSecundaria}', 
          Texto='${request.Texto}', 
          TemPixelFacebook='${request.TemPixelFacebook}', 
          PixelFacebook='${request.PixelFacebook}',
          TextoAgradecimento='${request.TextoAgradecimento}',
          PorcentagemDesconto='${request.PorcentagemDesconto}'
        WHERE IdParceiro='${request.IdParceiro}';
        `;

    await connection2.query<RowDataPacket[]>(sql);

    return "Editado com sucesso!";
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export interface AnexoLeadRequest {
  idLead: string;
  urlAnexo: string;
}

export async function UpdateAnexoLead(
  request: AnexoLeadRequest
): Promise<string | null> {
  try {
    const sql = `
        UPDATE tbllead SET urlanexo='${request.urlAnexo}', statuslead='Conta Anexada' WHERE idlead='${request.idLead}'
        `;

    await connection2.query<RowDataPacket[]>(sql);

    return "Editado com sucesso!";
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function LeadExists(idLead: string): Promise<boolean | null> {
  try {
    const sql = `SELECT EXISTS(SELECT * FROM tbllead  WHERE idlead = ${idLead} AND statuslead != 'Cancelado') AS existe`;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: boolean = rows[0].existe === 1;
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export interface LeadResponse {
  anexouConta: boolean;
  idLead: string;
  nome: string;
  idParceiro: string;
}

export async function GetLeadData(
  idLead: string
): Promise<LeadResponse | null> {
  try {
    const sql = `
                    SELECT (SELECT t.urlanexo IS NOT NULL) as anexouConta, t.idlead as idLead, t.nomecompleto as nome, t.idCaptador as idParceiro FROM tbllead t WHERE idlead = ${idLead}
                `;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: LeadResponse = {
        anexouConta: rows[0].anexouConta === 1,
        idLead: rows[0].idLead,
        idParceiro: rows[0].idParceiro,
        nome: rows[0].nome,
      };
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function GetLeadIdByTimeStampAndParceiro(
  idParceiro: string,
  timestamp: string
): Promise<string | null> {
  try {
    const sql = `SELECT t.idlead FROM tbllead t WHERE t.idCaptador = ${idParceiro} AND t.timestamp = '${timestamp}'`;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: string = rows[0].idlead;
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function CanUploadBill(
  idParceiro: string
): Promise<boolean | null> {
  try {
    const sql = ` SELECT t.flagAnexoSimulador
                  FROM tblcaptador t
                  WHERE t.IdParceiro = ${idParceiro}`;

    const [rows] = await connection2.query<RowDataPacket[]>(sql);

    if (rows.length > 0) {
      const result: boolean = rows[0].flagAnexoSimulador === "S";
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}
