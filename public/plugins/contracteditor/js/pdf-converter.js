class PDFConverter {
    async convertPDFtoHTML(pdfFile, razaoSocial, api) {
        const response = await api.get(`/cliente/filtro/${razaoSocial}`);
        const clientData = await response.data;

        // Define specific placeholders that match exactly with the PDF text
        const fieldMappings = {
            '"EDITABLE_NOME"': clientData.razaoSocial,
            '"EDITABLE_CPF"': clientData.cnpjCpf,
            '"EDITABLE_ENDERECO"': clientData.endereco,
            '"EDITABLE_BAIRRO"': clientData.bairro,
            '"EDITABLE_CIDADE_ESTADO"': `${clientData.cidade}/${clientData.estado}`,
            '"EDITABLE_CEP"': clientData.cep,
            '"EDITABLE_EMAIL"': clientData.email,
            '"EDITABLE_TELEFONE"': clientData.telefone
        };

        const pdfData = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        let htmlContent = '<div style="margin:0; padding:0; line-height:1;">';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({scale: 1.5});
            const textContent = await page.getTextContent();
            
            const lineGroups = {};
            textContent.items.forEach(item => {
                const y = Math.round(viewport.height - item.transform[5]);
                if (!lineGroups[y]) {
                    lineGroups[y] = [];
                }
                lineGroups[y].push(item);
            });
            
            const textItems = Object.keys(lineGroups)
                .sort((a, b) => a - b)
                .map(y => {
                    const line = lineGroups[y].sort((a, b) => a.transform[4] - b.transform[4]);
                    let text = line.map(item => item.str).join('');
                    
                    Object.entries(fieldMappings).forEach(([placeholder, value]) => {
                        text = text.replace(placeholder, value || '');
                    });

                    return `<div style="position: absolute; left: ${line[0].transform[4]}px; top: ${y}px; 
                        font-size: ${line[0].fontSize}px; font-family: ${line[0].fontName};">
                        ${text}
                    </div>`;
                }).join('');
            
            htmlContent += `<div class="pdf-page" style="position: relative; width: ${viewport.width}px; height: ${viewport.height}px; margin: 0; padding: 0; page-break-after: always;">
                ${textItems}
            </div>`;
        }
        
        htmlContent += '</div>';
        return htmlContent;
    }

    async convertHTMLtoPDF(htmlContent) {
        const element = document.getElementById('editableContent');
        const pdfDoc = await html2pdf()
            .from(element)
            .set({
                margin: [10, 10],
                filename: 'contract.pdf',
                pagebreak: { mode: 'avoid-all' },
            jsPDF: { 
                unit: 'pt',
                format: 'a4',
                orientation: 'portrait'
            },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true
            }
        })
        .outputPdf();
            
        return new Blob([pdfDoc], { type: 'application/pdf' });
    }
   
    async saveAsPDF(filename) {
        const htmlContent = document.querySelector('.contract-container').innerHTML;
        const pdf = await this.convertHTMLtoPDF(htmlContent);
    }
}

window.PDFConverter = PDFConverter;