import React, { useState } from "react";
import api from "../../service/api";
import './style.css';

const UploadDocumento = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Por favor, selecione um arquivo.");
            setMessageType("error");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/documentos/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage("Documento enviado com sucesso!");
            setMessageType("success");
        } catch (err) {
            setMessage("Erro ao enviar o documento.");
            setMessageType("error");
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload de Documento</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Enviar Documento</button>
            <p className={messageType}>{message}</p>
        </div>
    );
};

export default UploadDocumento;
