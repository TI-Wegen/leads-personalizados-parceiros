import nodemailer from "nodemailer";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  pool: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export interface LeadEmail {
  emailCliente: string;
  nomePlataforma: string;
  nomeCliente: string;
  nomeParceiro: string;
  corPrimaria: string;
  urlLogo: string;
  urlAnexarConta: string;
}

export async function sendLeadEmail(leadEmail: LeadEmail) {
  const html = await ejs.renderFile("./public/mailTemplate/leadTemplate.ejs", {
    nomePlataforma: leadEmail.nomePlataforma,
    nomeCliente: leadEmail.nomeCliente,
    nomeParceiro: leadEmail.nomeParceiro,
    corPrimaria: leadEmail.corPrimaria,
    urlLogo: leadEmail.urlLogo,
    urlAnexarConta: leadEmail.urlAnexarConta,
  });

  let info = await transporter.sendMail({
    from: `${leadEmail.nomeParceiro} <seuemail@gmail.com>`,
    to: leadEmail.emailCliente,
    subject: "Solicitação de proposta de energia",
    html: html,
  });

  console.log("Email enviado: " + info.response);
}

export interface LeadParceiroEmail {
  emailParceiro: string;
  nomePlataforma: string;
  nomeParceiro: string;
  corPrimaria: string;
  urlLogo: string;
}

export async function sendLeadParceiroEmail(
  leadParceiroEmail: LeadParceiroEmail
) {
  const html = await ejs.renderFile(
    "./public/mailTemplate/leadParceiroTemplate.ejs",
    {
      nomePlataforma: leadParceiroEmail.nomePlataforma,
      nomeParceiro: leadParceiroEmail.nomeParceiro,
      corPrimaria: leadParceiroEmail.corPrimaria,
      urlLogo: leadParceiroEmail.urlLogo,
    }
  );

  let info = await transporter.sendMail({
    from: `WeGen <seuemail@gmail.com>`,
    to: leadParceiroEmail.emailParceiro,
    subject: "Nova lead cadastrada",
    html: html,
  });

  console.log("Email enviado: " + info.response);
}
