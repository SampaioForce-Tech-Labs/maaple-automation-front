import React, { useEffect, useState } from "react";
import PageTitle from "../../components/pagetitle";
import api from "../../service/api";
import { useParams } from "react-router-dom";

export default function DocumentosCliente() {
    const { id } = useParams();
    const [documentos, setDocumentos] = useState([]);
    const [clienteDados, setClienteDados] = useState(null);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        async function fetchClienteDados() {
            try {
                const response = await api.get(`/cliente/${id}`);
                setClienteDados(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados do cliente:", error);
                setErro("Não foi possível carregar os dados do cliente.");
            }
        }

        async function fetchDocumentos() {
            try {
                const response = await api.get("/documentos/listar");
                setDocumentos(response.data);
            } catch (error) {
                console.error("Erro ao buscar documentos:", error);
                setErro("Não foi possível carregar os documentos.");
            }
        }

        fetchClienteDados();
        fetchDocumentos();
    }, [id]);

    const handleDownload = async (documentoId, documentoNome) => {
        try {
            if (!clienteDados) {
                setErro("Os dados do cliente ainda não foram carregados.");
                return;
            }

            const cleanId = documentoId.toString().replace(/BsonObjectId{value=/, "").replace(/}$/, "");
            const response = await api.get(`/documentos/download/${cleanId}`, {
                responseType: "blob",
            });

            if (response.status !== 200) {
                console.error("Erro ao baixar o documento:", response.status);
                setErro("Erro ao tentar baixar o documento.");
                return;
            }

            const pdfBlob = response.data;

            // Aqui, o processamento do PDF para HTML deve ser feito de maneira correta.
            const pdfConverter = new window.PDFConverter();

            // Verifique se o PDFConverter tem um método válido para processar.
            const htmlContent = await pdfConverter.convertPDFtoHTML(pdfBlob, clienteDados.razaoSocial, api);

            if (!htmlContent) {
                setErro("Falha ao converter PDF para HTML.");
                return;
            }

            const editableContentElement = document.getElementById('editableContent');
            if (!editableContentElement) {
                console.error("Elemento 'editableContent' não encontrado.");
                setErro("Elemento 'editableContent' não encontrado.");
                return;
            }

            // Inserindo o conteúdo HTML gerado no elemento
            editableContentElement.innerHTML = htmlContent;

            // Se o conteúdo HTML for gerado corretamente, converta de volta para PDF
            const updatedPdfBlob = await pdfConverter.convertHTMLtoPDF(htmlContent);

            const url = window.URL.createObjectURL(updatedPdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", documentoNome);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Erro ao processar o download:", err);
            setErro("Erro ao processar o download do documento.");
        }
    };

    return (
        <>
            <PageTitle title="Documentos do Cliente" />
            <div className="content">
                <div className="container-fluid">
                    <div className="card card-primary">
                        <div className="card-header">
                            <h3 className="card-title">Documentos</h3>
                        </div>
                        <div className="card-body">
                            {erro && <p className="error">{erro}</p>}
                            <table className="table table-sm">
                                <thead>
                                <tr>
                                    <th>Nome do Documento</th>
                                    <th>Ação</th>
                                </tr>
                                </thead>
                                <tbody>
                                {documentos.length > 0 ? (
                                    documentos.map((documento) => (
                                        <tr key={documento.id}>
                                            <td>{documento.nome}</td>
                                            <td>
                                                <button
                                                    className="button"
                                                    onClick={() =>
                                                        handleDownload(documento.id, documento.nome)
                                                    }
                                                >
                                                    Preencher e Baixar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-center">
                                            Nenhum documento encontrado.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            <div id="editableContent" style={{ display: 'none' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
