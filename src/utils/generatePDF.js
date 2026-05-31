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
    canvas.toDataURL("image/png");

  const pdf =
    new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

  const pdfWidth = 210;

  const pageHeight = 297;

  const imgWidth = pdfWidth;

  const imgHeight =
    (canvas.height * imgWidth) /
    canvas.width;

  let heightLeft =
    imgHeight;

  let position = 0;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    position,
    imgWidth,
    imgHeight
  );

  heightLeft -= pageHeight;

  while (heightLeft > 0) {

    position =
      heightLeft - imgHeight;

    pdf.addPage();

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pageHeight;

  }

  pdf.save("invoice.pdf");

};

export default generatePDF;