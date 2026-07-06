import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:5000";

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [filtro, setFiltro] = useState("Listar todas");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    async function carregarTarefas() {
      const resposta = await fetch(`${API_URL}/tarefas`);
      const dados = await resposta.json();
      setTarefas(dados);
    } carregarTarefas();}, []);

  async function criarTarefa(event) {
    event.preventDefault();
    if (!titulo.trim()) return;
    const novaTarefa = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      status: "Pendente",
    };
    const resposta = await fetch(`${API_URL}/tarefas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novaTarefa),
    });
    const dados = await resposta.json();
    setTarefas([...dados, ...tarefas]);
    setTitulo("");
    setDescricao("");
    setModalAberto(false);
  }

  async function alterarStatus(id) {
    const tarefaAtual = tarefas.find((tarefa) => tarefa.id === id);
    const novoStatus = tarefaAtual.status === "Concluída" ? "Pendente" : "Concluída";

    const resposta = await fetch(`${API_URL}/tarefas/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: novoStatus }),
    });
    const tarefaAtualizada = await resposta.json();
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? tarefaAtualizada : tarefa
      )
    );
  }

  async function deletarTarefa(id) {
    await fetch(`${API_URL}/tarefas/${id}`, {
      method: "DELETE",
    });
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  }

  const tarefasFiltradas = useMemo(() => {
    if (filtro === "Pendentes") {
      return tarefas.filter((tarefa) => tarefa.status === "Pendente");
    }
    if (filtro === "Concluídas") {
      return tarefas.filter((tarefa) => tarefa.status === "Concluída");
    }
    return tarefas;
  }, [tarefas, filtro]);

  const totalPendentes = tarefas.filter(
    (tarefa) => tarefa.status === "Pendente"
  ).length;

  const totalConcluidas = tarefas.filter(
    (tarefa) => tarefa.status === "Concluída"
  ).length;

  return (
    <main className="app">
      <header className="topo">
        <button className="botao-novo" onClick={() => setModalAberto(true)}>
          + Nova task
        </button>

        <h1>TeamTask.</h1>

        <select value={filtro} onChange={(event) => setFiltro(event.target.value)}>
          <option>Listar todas</option>
          <option>Pendentes</option>
          <option>Concluídas</option>
        </select>
      </header>

      <section className="linha-status">
        <span>{tarefas.length} tarefas</span>
        <span>{totalPendentes} pendentes</span>
        <span>{totalConcluidas} concluídas</span>
      </section>

      <section className="grade">
        {tarefasFiltradas.map((tarefa) => (
          <article
            className={`pasta ${
              tarefa.status === "Concluída" ? "concluída" : ""
            }`}
            key={tarefa.id}
          >
            <div className="aba" />

            <div className="conteudo-pasta">
              <div className="etiqueta-arquivo">
                <div className="campo">
                  <span>Título</span>
                  {tarefa.titulo}
                </div>

                <div className="campo">
                  <span>Descrição</span>
                  <p>{tarefa.descricao || "Sem descricao."}</p>
                </div>
              </div>

              <div className="botoes-card">
                <button
                  className="botao-concluir"
                  onClick={() => alterarStatus(tarefa.id)}
                >
                  {tarefa.status === "Concluída"
                    ? "Voltar para pendente"
                    : "Marcar como concluída"}
                </button>

                <button
                  className="botao-deletar"
                  onClick={() => deletarTarefa(tarefa.id)}
                >
                  Excluir tarefa
                </button>
              </div>
            </div>
          </article>
        ))}

        {tarefasFiltradas.length === 0 && (
          <div className="vazio">Nenhuma tarefa encontrada.</div>
        )}
      </section>

      {modalAberto && (
        <div className="modal">
          <form className="formulario" onSubmit={criarTarefa}>
            <div className="topo-formulario">
              <h2>Nova tarefa</h2>

              <button type="button" onClick={() => setModalAberto(false)}>
                x
              </button>
            </div>

            <label>
              Titulo
              <input
                type="text"
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
              />
            </label>

            <label>
              Descricao
              <textarea
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
              />
            </label>

            <button className="salvar" type="submit">
              Criar tarefa
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

export default App;