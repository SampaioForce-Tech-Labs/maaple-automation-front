import React, { useState } from "react";
import PageTitle from "../../components/pagetitle";
import api from "../../service/api";
import Swal from "sweetalert2";

export default function UploadPlanilha() {
    const [file, setFile] = useState(null);

    function handleFileChange(e) {
        setFile(e.target.files[0]);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!file) {
            Swal.fire({
                title: "Erro",
                text: "Por favor, selecione uma planilha para upload.",
                icon: "error",
                confirmButtonText: "Ok",
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/cliente/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                Swal.fire({
                    title: "Sucesso!",
                    text: response.data,
                    icon: "success",
                    confirmButtonText: "Ok",
                });
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    Swal.fire({
                        title: "Erro",
                        text: "Acesso negado: permissões insuficientes.",
                        icon: "error",
                        confirmButtonText: "Ok",
                    });
                } else if (error.response.status === 303) {
                    Swal.fire({
                        title: "Erro",
                        text: "Redirecionamento detectado. Verifique a URL.",
                        icon: "error",
                        confirmButtonText: "Ok",
                    });
                } else {
                    Swal.fire({
                        title: "Erro",
                        text: `Erro ${error.response.status}: ${error.response.data}`,
                        icon: "error",
                        confirmButtonText: "Ok",
                    });
                }
            } else if (error.request) {
                Swal.fire({
                    title: "Erro",
                    text: "Nenhuma resposta do servidor. Verifique sua conexão.",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            } else {
                Swal.fire({
                    title: "Erro",
                    text: "Ocorreu um erro ao enviar a planilha. Tente novamente.",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
            console.error(error);
        }
    }

    return (
        <>
            <PageTitle title="Upload de Planilha" />
            <div className="content">
                <div className="container-fluid">
                    <div className="card card-primary">
                        <div className="card-header">
                            <h3 className="card-title">Enviar Planilha de Clientes</h3>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="file">Selecione o arquivo</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="file"
                                        accept=".xlsx, .xls"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            <div className="card-footer">
                                <button type="submit" className="btn btn-primary">
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}