import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import api from "../service/api";
import { logout } from "../service/auth";

export default function SideMenu() {
    const [permissao, setPermissao] = useState("");

    useEffect(() => {
        api.get("/user/permissao").then((response) => {
            setPermissao(response.data[0].name);
        });
    }, []);

    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            {/* Logo e Nome */}
            <Link to="/" className="brand-link">
                <img
                    src="/dist/img/logo.png"
                    alt="Logo"
                    className="brand-image elevation-3"
                    style={{ opacity: 0.8 }}
                />
                <span className="brand-text font-weight-light">AgilizaContrato</span>
            </Link>

            {/* Menu */}
            <div className="sidebar">
                <nav className="mt-2">
                    <ul
                        className="nav nav-pills nav-sidebar flex-column"
                        data-widget="treeview"
                        role="menu"
                    >
                        {/* Menu Principal */}
                        <li className="nav-item">
                            <Link to="/" className="nav-link active">
                                <i className="nav-icon fas fa-home"></i>
                                <p>Início</p>
                            </Link>
                        </li>

                        {/* Itens Restritos ao Admin */}
                        {permissao === "ROLE_ADMIN" && (
                            <>
                                {/* Funcionários */}
                                <li className="nav-item menu-closed">
                                    <a href="#" className="nav-link">
                                        <i className="nav-icon fas fa-user"></i>
                                        <p>
                                            Funcionários
                                            <i className="right fas fa-angle-left"></i>
                                        </p>
                                    </a>
                                    <ul className="nav nav-treeview">
                                        <li className="nav-item">
                                            <Link to="/funcionarios/novo" className="nav-link">
                                                <i className="fas fa-plus nav-icon"></i>
                                                <p>Novo</p>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/funcionarios/lista" className="nav-link">
                                                <i className="fas fa-scroll nav-icon"></i>
                                                <p>Listagem</p>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>


                                {/* Documentos */}
                                <li className="nav-item menu-closed">
                                    <a href="#" className="nav-link">
                                        <i className="nav-icon fas fa-file"></i>
                                        <p>
                                            Documentos
                                            <i className="right fas fa-angle-left"></i>
                                        </p>
                                    </a>
                                    <ul className="nav nav-treeview">
                                        <li className="nav-item">
                                            <Link to="/documentos/upload" className="nav-link">
                                                <i className="fas fa-plus nav-icon"></i>
                                                <p>Upload</p>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/documentos/listar" className="nav-link">
                                                <i className="fas fa-scroll nav-icon"></i>
                                                <p>Listagem</p>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/contratos/editor-contrato" className="nav-link">
                                                <i className="fas fa-download"></i>
                                                <p> Download</p>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                                {/* Clientes */}
                                <li className="nav-item menu-closed">
                                    <a href="#" className="nav-link">
                                        <i className="nav-icon fas fa-users"></i>
                                        <p>
                                        Clientes
                                            <i className="right fas fa-angle-left"></i>
                                        </p>
                                    </a>
                                    <ul className="nav nav-treeview">
                                        <li className="nav-item">
                                            <Link to="/clientes/novo" className="nav-link">
                                                <i className="fas fa-plus nav-icon"></i>
                                                <p>Novo</p>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/clientes/listar" className="nav-link">
                                                <i className="fas fa-scroll nav-icon"></i>
                                                <p>Listagem</p>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        )}

                        {/* Sair */}
                        <li className="nav-item">
                            <Link to="#logout" className="nav-link" onClick={logout}>
                                <i className="nav-icon fas fa-door-open"></i>
                                <p>Sair</p>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}
