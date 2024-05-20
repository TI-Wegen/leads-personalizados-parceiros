interface DataHoras {
  data: string;
  horas: string;
  timestamp: string;
}

export function GetDatas(): DataHoras {
  var dataHoras: DataHoras = {
    data: GeraData(),
    horas: GeraHoras(),
    timestamp: GeraTimeStamp(),
  };

  return dataHoras;
}

function GeraData() {
  const dataAtual = new Date().toISOString().split("T")[0];

  return dataAtual;
}

function GeraHoras() {
  const horaAtual = new Date().toISOString().split("T")[1].substring(0, 5);

  return horaAtual;
}

export function GeraTimeStamp() {
  const agora = new Date();
  const year = String(agora.getFullYear()).padStart(2, "0");
  const month = String(agora.getMonth() + 1).padStart(2, "0");
  const day = String(agora.getDate()).padStart(2, "0");
  const hours = String(agora.getHours()).padStart(2, "0");
  const minutes = String(agora.getMinutes()).padStart(2, "0");
  const seconds = String(agora.getSeconds()).padStart(2, "0");
  const milliseconds = String(agora.getMilliseconds()).padStart(6, "0");

  const formattedDate = `${day}${month}${year}${hours}${minutes}${seconds}${milliseconds}`;

  return formattedDate;
}
