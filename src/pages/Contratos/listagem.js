import PageTitle from "../../components/pagetitle";
import { useEffect, useState } from "react";
import React from "react";
import api from "../../service/api";
import { useNavigate } from "react-router-dom";

export default function ListagemClientes() {
    const [clientes, setClientes] = useState([]);
    const [nomeFiltro, setNomeFiltro] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        buscarClientes();
    }, []);

    async function buscarClientes(nome = "") {
        const url = nome ? `/clientes?nome=${nome}` : "/cliente/listar";
        await api.get(url).then((response) => {
            setClientes(response.data);
        }).catch((error) => {
            console.error("Erro ao buscar clientes:", error);
        });
    }

    async function deletarCliente(id) {
        await api.delete(`/cliente/${id}`).then(() => {
            buscarClientes(nomeFiltro); // Atualiza a lista após exclusão
        }).catch((error) => {
            console.error("Erro ao deletar cliente:", error);
        });
    }

    function editarCliente(id) {
        navigate(`/cliente/editar/${id}`);
    }

    function handleFiltro(e) {
        const nome = e.target.value;
        setNomeFiltro(nome);
        buscarClientes(nome);
    }

    return (
        <>
            <PageTitle title="Clientes" />
            <div className="content">
                <div className="container-fluid">
                    <div className="card card-primary">
                        <div className="card-header">
                            <h3 className="card-title">Lista de Clientes</h3>
                        </div>

                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="filtroNome">Filtrar por Nome</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="filtroNome"
                                    placeholder="Digite o nome do cliente"
                                    value={nomeFiltro}
                                    onChange={handleFiltro}
                                />
                            </div>

                            <table className="table table-sm">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nome</th>
                                    <th>CPF/CNPJ</th>
                                    <th>Cidade</th>
                                    <th>Estado</th>
                                    <th>Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {clientes.length > 0 ? (
                                    clientes.map((cliente) => (
                                        <tr key={cliente.id}>
                                            <td>{cliente.id}</td>
                                            <td>{cliente.razaoSocial}</td>
                                            <td>{cliente.cnpjCpf}</td>
                                            <td>{cliente.cidade}</td>
                                            <td>{cliente.estado}</td>
                                            <td>
                                                <div className="btn-group">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={() => editarCliente(cliente.id)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={() => deletarCliente(cliente.id)}
                                                    >
                                                        Excluir
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            Nenhum cliente encontrado.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
