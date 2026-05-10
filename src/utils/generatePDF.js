import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const generatePDF = async () => {

  const invoice =
    document.getElementById("invoice-preview");

  if (!invoice) return;

  // HIGH QUALITY CANVAS
  const canvas = await html2canvas(invoice, {
    scale: 4,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData =
    canvas.toDataURL("image/png");

  // CREATE PDF
  const pdf =
    new jsPDF("p", "mm", "a4");

  // A4 SIZE
  const pdfWidth = 210;
  const pdfHeight = 297;

  // IMAGE SIZE
  const imgWidth = pdfWidth;

  const imgHeight =
    (canvas.height * imgWidth) / canvas.width;

  // CENTER PDF CONTENT
  const yPosition =
    (pdfHeight - imgHeight) / 2;

  // ADD IMAGE
  pdf.addImage(
    imgData,
    "PNG",
    0,
    yPosition,
    imgWidth,
    imgHeight,
    undefined,
    "FAST"
  );

  // DOWNLOAD
  pdf.save("invoice.pdf");
};

export default generatePDF;