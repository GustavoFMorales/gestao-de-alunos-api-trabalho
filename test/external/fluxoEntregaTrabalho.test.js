import { expect } from "chai";
import { obterTokenAdmin, obterTokenAluno } from "../helpers/authentication.js";
import { api } from "../helpers/api.js";
import massaDeTestes from "../fixtures/entregaTrabalho.json" with { type: "json" };

describe("Fluxo entrega de trabalho", () => {
  let tokenAdmin;
  let tokenAluno;
  let alunoId;
  let disciplinaId;
  let trabalhoId;

  beforeEach(async () => {
    tokenAdmin = await obterTokenAdmin();
    alunoId = null;
    disciplinaId = null;
    trabalhoId = null;
  });

  // Remove o que o teste criou, para que a suíte possa ser executada novamente.
  afterEach(async () => {
    const remover = async (recurso, id) => {
      if (!id) return;
      await api()
        .delete(`api/admin/${recurso}/${id}`)
        .set("Authorization", `Bearer ${tokenAdmin}`);
    };

    await remover("trabalhos", trabalhoId);
    await remover("alunos", alunoId);
    await remover("disciplinas", disciplinaId);
  });

  massaDeTestes.forEach((dados) => {
    it(dados.testTitle, async () => {
      const cadastroAlunoResponse = await api()
        .post("api/admin/alunos")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send(dados.dadosAluno);
      expect(cadastroAlunoResponse.status).to.equal(201);
      alunoId = cadastroAlunoResponse.body.id;

      const cadastroDisciplinaResponse = await api()
        .post("api/admin/disciplinas")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send(dados.dadosDisciplina);
      expect(cadastroDisciplinaResponse.status).to.equal(201);
      disciplinaId = cadastroDisciplinaResponse.body.id;

      const matriculaAlunoDisciplinaResponse = await api()
        .post(`api/admin/disciplinas/${disciplinaId}/matriculas`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
          alunoId: alunoId,
        });
      expect(matriculaAlunoDisciplinaResponse.status).to.equal(201);

      tokenAluno = await obterTokenAluno(dados.dadosLoginAluno);

      const entregaTrabalhoAlunoResponse = await api()
        .post(`api/alunos/${alunoId}/trabalhos`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${tokenAluno}`)
        .send({ ...dados.dadosTrabalho, disciplinaId });
      expect(entregaTrabalhoAlunoResponse.status).to.equal(201);
      trabalhoId = entregaTrabalhoAlunoResponse.body.id;
    });
  });
});
