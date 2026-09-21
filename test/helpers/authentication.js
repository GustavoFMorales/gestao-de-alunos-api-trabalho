import "dotenv/config";
import { api } from "./api.js";

export const obterTokenAdmin = async () => {
  let token;
  const response = await api()
    .post("api/auth/login")
    .set("Content-Type", "application/json")
    .send({
      email: process.env.EMAIL_ADMIN,
      senha: process.env.SENHA_ADMIN,
    });
  token = response.body.token;
  return token;
};

export const obterTokenAluno = async () => {
    let tokenAluno;
    const response = await api()
     .post('api/auth/login')
     .set("Content-Type", "application/json")
     .send({
        email: process.env.EMAIL_ALUNO_GUSTAVO,
        senha: process.env.SENHA_ALUNO_GUSTAVO
     });

    tokenAluno = response.body.token
    return tokenAluno;
}


export default { obterTokenAdmin, obterTokenAluno };
