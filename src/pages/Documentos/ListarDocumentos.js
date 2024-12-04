import React, {useState, useEffect} from "react";
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
                setErro(null);
            } catch (err) {
                console.error("Erro ao listar documentos:", err);
                setErro("Não foi possível carregar os documentos.");
            }
        };
        fetchDocumentos();
    }, []);

    const handleDownload = async (documentoId, documentoNome) => {
        try {
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

    const handleDelete = async (documentoId) => {
        try {
            const cleanId = documentoId.toString().replace(/BsonObjectId{value=/, '').replace(/}$/, '');

            const response = await api.delete(`/documentos/delete/${cleanId}`);
            if (response.status === 200) {
                console.log("Documento deletado com sucesso.");
                const newDocumentos = documentos.filter((doc) => doc.id !== documentoId);
                setDocumentos(newDocumentos);
                setErro(null);
            } else {
                console.error("Erro ao deletar o documento:", response.status);
                setErro("Erro ao tentar deletar o documento.");
            }
        } catch (err) {
            console.error("Erro ao deletar documento:", err);
            setErro("Erro ao tentar deletar o documento.");
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
                            <img src={pdfIcon} alt="PDF Icon"/>
                            {doc.nome}
                            <button className="button" onClick={() => handleDownload(doc.id, doc.nome)}>Baixar</button>
                            <button className="buttonDelete" onClick={() => handleDelete(doc.id, doc.nome)}>Delete
                            </button>
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