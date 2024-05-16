import nodemailer from "nodemailer";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "comunicado@wegen.com.br",
    pass: "imdqvkuqwqsmgjeb",
  },
});

export interface LeadEmail {
  emailCliente: string;
  nomePlataforma: string;
  nomeCliente: string;
  nomeParceiro: string;
  corPrimaria: string;
  urlLogo: string;
}

export async function sendLeadEmail(leadEmail: LeadEmail) {
  const html = await ejs.renderFile("./public/mailTemplate/leadTemplate.ejs", {
    nomePlataforma: leadEmail.nomePlataforma,
    nomeCliente: leadEmail.nomeCliente,
    nomeParceiro: leadEmail.nomeParceiro,
    corPrimaria: leadEmail.corPrimaria,
    urlLogo: leadEmail.urlLogo,
  });

  let info = await transporter.sendMail({
    from: `${leadEmail.nomeParceiro} <seuemail@gmail.com>`,
    to: leadEmail.emailCliente,
    subject: "Solicitação de proposta de energia",
    html: html,
  });

  console.log("Email enviado: " + info.response);
}
