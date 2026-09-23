import "dotenv/config";
import { api } from "./api.js";

export const obterTokenAdmin = async () => {
  const response = await api()
    .post("api/auth/login")
    .set("Content-Type", "application/json")
    .send({
      email: process.env.EMAIL_ADMIN,
      senha: process.env.SENHA_ADMIN,
    });

  return response.body.token;
};

// Sem argumento, usa as credenciais do .env; com argumento, usa as da massa de testes.
export const obterTokenAluno = async (credenciais) => {
  const { email, senha } = credenciais ?? {
    email: process.env.EMAIL_ALUNO_GUSTAVO,
    senha: process.env.SENHA_ALUNO_GUSTAVO,
  };

  const response = await api()
    .post("api/auth/login")
    .set("Content-Type", "application/json")
    .send({ email, senha });

  return response.body.token;
};

export default { obterTokenAdmin, obterTokenAluno };
