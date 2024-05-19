import connection from "@/app/lib/dbConnection";

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
}

export async function GetConfigResponse(
  idParceiro: string
): Promise<ConfigResponse> {
  try {
    const result: ConfigResponse = await new Promise((resolve, reject) => {
      connection.query(
        `
            SELECT *
            FROM tblleadConfig 
            WHERE idParceiro='${idParceiro}'
        `,
        [],
        (error, result: ConfigResponse[]) => {
          if (error) {
            reject(error);
          }
          resolve(result[0]);
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function GetConfigResponseById(
  id: string
): Promise<ConfigResponse> {
  try {
    const result: ConfigResponse = await new Promise((resolve, reject) => {
      connection.query(
        `
            SELECT *
            FROM tblleadConfig 
            WHERE id ='${id}'
        `,
        [],
        (error, result: ConfigResponse[]) => {
          if (error) {
            reject(error);
          }
          resolve(result[0]);
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function GetAllConfigsResponse(): Promise<ConfigResponse[]> {
  try {
    const result: ConfigResponse[] = await new Promise((resolve, reject) => {
      connection.query(
        `
            SELECT *
            FROM tblleadConfig
        `,
        [],
        (error, result: ConfigResponse[]) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
}

interface ParceiroResponse {
  idParceiro: string;
  idParceiroMaster: string;
  idCampanha: string;
  descParceiro: string;
}

export async function GetParceiroResponse(
  idParceiro: string
): Promise<ParceiroResponse> {
  try {
    const result: ParceiroResponse = await new Promise((resolve, reject) => {
      connection.query(
        `
            SELECT idparceiro as idParceiro,
                idparceiromaster as idParceiroMaster,
                idCampanha,
                descparceiro as descParceiro 
            FROM tblcaptador 
            WHERE idparceiro='${idParceiro}' AND ativo='S'
        `,
        [],
        (error, result: ParceiroResponse[]) => {
          if (error) {
            reject(error);
          }
          resolve(result[0]);
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export interface CampanhaResponse {
  nomeCampanha: string;
  idCupom: string;
}

export async function GetInfoCampanhaById(
  idCampanha: string
): Promise<CampanhaResponse> {
  try {
    const result: CampanhaResponse = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT desctitulolead AS nomeCampanha, idCupom FROM tblcampanha WHERE idCampanha=${idCampanha} LIMIT 1`,
        [],
        (error, result: CampanhaResponse[]) => {
          if (error) {
            reject(error);
          }
          resolve(result[0]);
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function VerifyIsBackoffice(idParceiro: string): Promise<boolean> {
  try {
    const result: boolean = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT 
        CASE 
            WHEN backoffice = 'S' THEN true
                ELSE false
            END AS backoffice_status
        FROM tblcaptador 
        WHERE idparceiro = '${idParceiro}'`,
        [],
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result.length > 0) {
            const backofficeStatus = result[0].backoffice_status;
            resolve(backofficeStatus);
          } else {
            resolve(false);
          }
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function GetIdPlataforma(): Promise<string> {
  try {
    const result: string = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT idParceiroPlataforma FROM tblsettingsplataforma WHERE idSettings='1'`,
        [],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result[0].idParceiroPlataforma);
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function GetBackoffice(idPlataforma: string): Promise<string> {
  try {
    const result: string = await new Promise((resolve, reject) => {
      connection.query(
        `   
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
        `,
        [],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result[0].idBackoffice);
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
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
): Promise<string> {
  try {
    await new Promise<void>((resolve, reject) => {
      connection.query(
        `
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
        `,
        (error, result) => {
          if (error) {
            reject(error);
            return "Erro ao criar lead";
          }
          resolve();
        }
      );
    });
    return "Criado com sucesso";
  } catch (error) {
    throw error;
  }
}

export interface ParceiroSelectResponse {
  idparceiro: string;
  descparceiro: string;
}

export async function GetAllParceirosResponse(): Promise<
  ParceiroSelectResponse[]
> {
  try {
    const result: ParceiroSelectResponse[] = await new Promise(
      (resolve, reject) => {
        connection.query(
          `
            SELECT t.idparceiro , t.descparceiro  FROM tblcaptador t
        `,
          [],
          (error, result: ParceiroSelectResponse[]) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          }
        );
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

export async function GetParceiroNomeById(idParceiro: string): Promise<string> {
  try {
    const result: string = await new Promise((resolve, reject) => {
      connection.query(
        `
            SELECT t.descparceiro  FROM tblcaptador t WHERE t.idparceiro = ${idParceiro}
        `,
        [],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result[0].descparceiro);
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function ParceiroExists(idParceiro: string): Promise<string> {
  try {
    const result: string = await new Promise((resolve, reject) => {
      connection.query(
        `
            SELECT EXISTS(SELECT * FROM tblcaptador WHERE idparceiro = ${idParceiro}) AS existe;
        `,
        [],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result[0].existe);
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
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
}

export async function CreateConfig(request: ConfigRequest): Promise<string> {
  try {
    await new Promise<void>((resolve, reject) => {
      connection.query(
        `
        INSERT INTO tblleadConfig (
          Id,
          IdParceiro,
          Nome,
          Telefone,
          CorPrimaria,
          CorSecundaria,
          Texto,
          TemPixelFacebook,
          PixelFacebook
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
          '${request.PixelFacebook}'
        );

        `,
        (error, result) => {
          if (error) {
            reject(error);
            return "Erro ao criar config";
          }
          resolve();
        }
      );
    });
    return "Criado com sucesso";
  } catch (error) {
    throw error;
  }
}

export async function GetConfigIdByParceiroId(
  idParceiro: string
): Promise<string> {
  try {
    const result: string = await new Promise((resolve, reject) => {
      connection.query(
        `
            SELECT Id  FROM tblleadConfig WHERE IdParceiro = ${idParceiro}
        `,
        [],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result[0].Id);
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function UpdateConfig(request: ConfigRequest): Promise<string> {
  try {
    await new Promise<void>((resolve, reject) => {
      connection.query(
        `
        UPDATE tblleadConfig
        SET 
          IdParceiro='${request.IdParceiro}',
          Nome='${request.Nome}', 
          Telefone='${request.Telefone}', 
          CorPrimaria='${request.CorPrimaria}', 
          CorSecundaria='${request.CorSecundaria}', 
          Texto='${request.Texto}', 
          TemPixelFacebook='${request.TemPixelFacebook}', 
          PixelFacebook='${request.PixelFacebook}'
        WHERE IdParceiro='${request.IdParceiro}';
        `,
        (error, result) => {
          if (error) {
            reject(error);
            return "Erro ao editar config";
          }
          resolve();
        }
      );
    });
    return "Editado com sucesso";
  } catch (error) {
    throw error;
  }
}
