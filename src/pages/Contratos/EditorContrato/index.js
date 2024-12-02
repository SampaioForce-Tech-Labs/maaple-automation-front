import React, { useState } from 'react';
import api from '../../../service/api';
  
const ContractEditorPage = () => {
  const [razaoSocial, setRazaoSocial] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = async (event) => {
    try {
      setError('');
      const file = event.target.files[0];
      const pdfConverter = new window.PDFConverter();
      const htmlContent = await pdfConverter.convertPDFtoHTML(file, razaoSocial, api);
      document.getElementById('editableContent').innerHTML = htmlContent;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Cliente não encontrado na base de dados');
      } else {
        setError('Erro ao processar arquivo. Verifique o nome do cliente.');
      }
    }
  };

  const handleSavePDF = async () => {
    const pdfConverter = new window.PDFConverter();
    const htmlContent = document.querySelector('.contract-container').innerHTML;
    const pdfBlob = await pdfConverter.convertHTMLtoPDF(htmlContent);
    
    // Create download link
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contract.pdf';
    link.click();
  };

  return (
    <div id="contractEditor">
      <div className="contract-container">
        <input 
          type="text" 
          placeholder="Digite a razão social" 
          value={razaoSocial}
          onChange={(e) => setRazaoSocial(e.target.value)}
        />
        <input type="file" id="pdfUpload" accept=".pdf" onChange={handleFileUpload} />
        <div id="editableContent" style={{
          margin: 0,
          padding: 0,
          lineHeight: 1,
          display: 'block'
        }}></div>
        <button id="savePDF" onClick={handleSavePDF}>Save as PDF</button>
      </div>
    </div>
  );
};
export default ContractEditorPage;