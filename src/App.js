import './App.css';
import SideMenu from "./components/sidemenu";
import {Route, Routes} from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import CadastroFuncionarios from "./pages/funcionarios/cadastro";
import {isAuthenticated} from "./service/auth";
import Login from "./pages/Login";
import React from "react";
import ListagemFuncionarios from "./pages/funcionarios/listagem";
import CadastroEquipamentosLenovo from "./pages/Lenovo/equipamento/cadastro";
import ListagemEquipamentosLenovo from "./pages/Lenovo/equipamento/listagem";



function App() {
    return (
        <div className="wrapper">
            {!isAuthenticated() ? <Login/> : (
                <>
                    <Navbar/>
                    <SideMenu/>
                    <div className="content-wrapper">
                        <Routes>
                            <Route path="/" exact element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/funcionarios/novo" element={<CadastroFuncionarios />} />
                            <Route path="/funcionarios/lista" element={<ListagemFuncionarios />} />
                            <Route path="/funcionarios/editar/:id" element={<CadastroFuncionarios/>}/>
                            <Route path="/lenovo/cadastrar" element={<CadastroEquipamentosLenovo/>}/>
                            <Route path="/lenovo/listar" element={<ListagemEquipamentosLenovo/>}/>
                        </Routes>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
