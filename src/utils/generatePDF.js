import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const generatePDF = async () => {

  const invoice =
    document.getElementById(
      "invoice-preview"
    );

  if (!invoice) return;

  const canvas =
    await html2canvas(invoice, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

  const imgData =
    canvas.toDataURL(
      "image/jpeg",
      1.0
    );

  const pdf =
    new jsPDF(
      "p",
      "mm",
      "a4"
    );

  const pdfWidth = 210;

  const pageHeight = 297;

  const imgWidth = pdfWidth;

  let imgHeight =
    (canvas.height * imgWidth) /
    canvas.width;

  // FIT INSIDE SINGLE PAGE

  if (
    imgHeight >
    pageHeight
  ) {

    imgHeight =
      pageHeight - 5;

  }

  pdf.addImage(
    imgData,
    "JPEG",
    0,
    0,
    imgWidth,
    imgHeight
  );

  pdf.save("invoice.pdf");

};

export default generatePDF;