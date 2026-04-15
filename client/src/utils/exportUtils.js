import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Export data to CSV
 * @param {Array} data - Array of objects
 * @param {string} fileName - Name of the file
 */
export const exportToCSV = (data, fileName = "export.csv") => {
    if (!data || !data.length) return;
    
    // Flatten data if needed (optional, depends on depth)
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName.endsWith(".csv") ? fileName : `${fileName}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

/**
 * Export data to PDF Table
 * @param {Array} headers - Array of strings or objects for column names
 * @param {Array} data - Array of arrays (rows)
 * @param {string} fileName - Name of the file
 * @param {string} title - Title on the PDF
 */
export const exportToPDF = (headers, data, fileName = "export.pdf", title = "Exported Report") => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    
    // Add date
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    autoTable(doc, {
        head: [headers],
        body: data,
        startY: 35,
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [100, 108, 255] }, // Matches primary-color
    });


    doc.save(fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`);
};
