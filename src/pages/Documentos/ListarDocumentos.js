import React, { useState, useEffect } from "react";
import api from "../../service/api";
import "./ListarDocumentos.css";
import pdfIcon from "../../assets/pdf-icon.png";

const ListarDocumentos = () => {
    const [documentos, setDocumentos] = useState([]);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                const response = await api.get("/documentos/listar");
                console.log("Documentos recebidos:", response.data);
                setDocumentos(response.data);
                setErro(null);  // Clear the error message
            } catch (err) {
                console.error("Erro ao listar documentos:", err);
                setErro("Não foi possível carregar os documentos.");
            }
        };
        fetchDocumentos();
    }, []);

    const handleDownload = async (documentoId, documentoNome) => {
        try {
            // Remove BsonObjectId{value= from the ID if present
            const cleanId = documentoId.toString().replace(/BsonObjectId{value=/, '').replace(/}$/, '');
            
            const response = await api.get(`/documentos/download/${cleanId}`, {
                responseType: "blob",
            });
            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", documentoNome);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                console.error("Erro ao baixar o documento:", response.status);
                setErro("Erro ao tentar baixar o documento.");
            }
        } catch (err) {
            console.error("Erro ao baixar documento:", err);
            setErro("Erro ao tentar baixar o documento.");
        }
    };
    return (
        <div className="container">
            <h2>Documentos</h2>
            {erro && <p className="error">{erro}</p>}
            <ul className="listagem">
                {documentos.length > 0 ? (
                    documentos.map((doc) => (
                        <li key={doc.id}>
                            <img src={pdfIcon} alt="PDF Icon" />
                            {doc.nome}
                            <button className="button" onClick={() => handleDownload(doc.id, doc.nome)}>Baixar</button>
                        </li>
                    ))
                ) : (
                    <p>Sem documentos disponíveis</p>
                )}
            </ul>
        </div>
    );
};

export default ListarDocumentos;