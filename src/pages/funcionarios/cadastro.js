import PageTitle from "../../components/pagetitle";
import { useEffect, useState } from "react";
import React from "react";
import api from "../../service/api";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function CadastroFuncionarios() {
  const [cargos, setCargos] = useState([]);
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const { id } = useParams(); // Get the ID from the route params
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cargos and check if editing
    api.get("/funcionario/cargos").then((response) => {
      setCargos(response.data);
      setCargo(response.data[0]);
    });

    if (id) {
      buscarFuncionario(id); // If editing, load the employee's data
    }
  }, [id]);

  async function buscarFuncionario(id) {
    try {
      const response = await api.get(`/funcionario/listar/${id}`); // Updated endpoint
      setNome(response.data.nome);
      setUsername(response.data.username);
      setTelefone(response.data.telefone);
      setEmail(response.data.email);
      setSenha(response.data.senha);
      setCargo(response.data.cargo);
    } catch (error) {
      console.error("Error fetching funcionario details:", error);
      Swal.fire({
        title: "Erro!",
        text: "Falha ao carregar os dados do funcionário. Tente novamente.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      nome,
      username,
      telefone,
      email,
      senha,
      funcao: cargo,
    };

    if (id) {
      // Edit mode
      api.put("/funcionario/alterar", payload) // Updated endpoint
        .then((response) => {
          Swal.fire({
            title: "Sucesso!",
            text: "Funcionário atualizado com sucesso!",
            icon: "success",
            confirmButtonText: "Ok",
          }).then(() => navigate("/funcionarios/lista"));
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            title: "Erro!",
            text: "Falha ao atualizar o funcionário.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        });
    } else {
      // Create mode
      api.post("/funcionario/cadastrar", payload)
        .then((response) => {
          Swal.fire({
            title: "Sucesso!",
            text: "Funcionário cadastrado com sucesso!",
            icon: "success",
            confirmButtonText: "Ok",
          }).then(() => navigate("/funcionarios/lista"));
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            title: "Erro!",
            text: "Falha ao cadastrar o funcionário.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        });
    }
  }

  return (
    <>
      <PageTitle title={id ? "Editar Funcionário" : "Cadastrar Funcionário"} />
      <div className="content">
        <div className="container-fluid">
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">
                {id ? "Editar Funcionário" : "Cadastrar Funcionário"}
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="nome_funcionario">Nome do funcionário</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome_funcionario"
                    required
                    placeholder="Insira o nome do funcionário"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="usuario_funcionario">Usuário</label>
                  <input
                    type="text"
                    className="form-control"
                    id="usuario_funcionario"
                    required
                    placeholder="Insira um nome de usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="telefone"
                    required
                    placeholder="Insira o telefone do funcionário"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Endereço de email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    required
                    placeholder="Insira um email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="senha">Senha</label>
                  <input
                    type="password"
                    className="form-control"
                    id="senha"
                    required
                    placeholder="Insira a senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cargo">Cargo</label>
                  <select
                    className="form-control"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                  >
                    {cargos.map((cargo) => (
                      <option key={cargo} value={cargo}>
                        {cargo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="card-footer">
                <button type="submit" className="btn btn-primary">
                  {id ? "Salvar Alterações" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}