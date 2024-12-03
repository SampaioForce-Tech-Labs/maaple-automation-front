import './App.css';
import SideMenu from "./components/sidemenu";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import CadastroFuncionarios from "./pages/funcionarios/cadastro";
import ListagemFuncionarios from "./pages/funcionarios/listagem";
import CadastroClientes from "./pages/Contratos/cadastro";
import ListagemClientes from "./pages/Contratos/listagem";
import Login from "./pages/Login";
import { isAuthenticated } from "./service/auth";
import EditorContrato from "./pages/Contratos/EditorContrato";
import CadastroDocumento from "./pages/Documentos/UploadDocumento";
import ListagemDocumentos from "./pages/Documentos/ListarDocumentos";

import React from "react";

function App() {
    return (
        <div className="wrapper">
            {/* Verificação de Autenticação */}
            {!isAuthenticated() ? (
                <Login />
            ) : (
                <>
                    {/* Barra de Navegação e Menu Lateral */}
                    <Navbar />
                    <SideMenu />

                    <div className="content-wrapper">
                        <Routes>
                            {/* Página Inicial */}
                            <Route path="/" exact element={<Home />} />

                            {/* Rotas do Editor Contrato */}
                            <Route path="/contratos/editor-contrato" exact element={<EditorContrato />} />

                            {/* Rotas de Funcionários */}
                            <Route path="/funcionarios/novo" element={<CadastroFuncionarios />} />
                            <Route path="/funcionarios/lista" element={<ListagemFuncionarios />} />
                            <Route path="/funcionarios/editar/:id" element={<CadastroFuncionarios />} />

                            {/* Rotas de Documentos */}
                            <Route path="/documentos/upload" element={<CadastroDocumento />} />
                            <Route path="/documentos/listar" element={<ListagemDocumentos />} />

                            {/* Rotas de Clientes */}
                            <Route path="/clientes/novo" element={<CadastroClientes />} />
                            <Route path="/clientes/listar" element={<ListagemClientes />} />

                            {/* Página de Login */}
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
