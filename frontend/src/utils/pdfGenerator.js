import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generates and downloads a PDF file of user books.
 * @param {string} userName - The user's name.
 * @param {Array} books - An array of book objects.
 */
export function generateBooksPDF(userName, books) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  // Add header with logo and title
  if (typeof window !== "undefined") {
    const favicon =
      document.querySelector('link[rel="icon"]')?.href ||
      document.querySelector('link[rel="shortcut icon"]')?.href;

    if (favicon) {
      // Add logo (left side)
      doc.addImage(favicon, "PNG", margin, 10, 20, 20);
    }
  }

  // Add "Knitnox" text in orange (right side)
  doc.setFontSize(24);
  doc.setTextColor(255, 165, 0); // Orange color
  doc.text(
    "KnitNox",
    pageWidth - margin - 30, // Right-aligned with margin
    25,
    { align: "right" }
  );

  // Add divider line
  doc.setDrawColor(255, 165, 0); // Orange color
  doc.setLineWidth(0.5);
  doc.line(margin, 35, pageWidth - margin, 35);

  // Add main title below header with proper spacing
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text(`${userName}'s Books List (${books.length})`, margin, 50); // Increased Y position to 50

  const tableData = books.map((book, index) => [
    index + 1,
    book.title,
    book.author,
    book.publishYear,
    book.price,
  ]);

  const totalPrice = books.reduce(
    (sum, book) => sum + parseFloat(book.price || 0),
    0
  );

  tableData.push([
    {
      content: "Total in BDT",
      colSpan: 4,
      styles: { halign: "right", fontStyle: "bold" },
    },
    {
      content: totalPrice.toFixed(2),
      styles: { fontStyle: "bold", halign: "right" },
    },
  ]);

  autoTable(doc, {
    head: [["No.", "Title", "Author", "Publish Year", "Price (BDT)"]], // Added BDT
    body: tableData,
    startY: 60, // Increased startY to provide more space after header
    margin: { left: margin, right: margin }, // Added side margins
    styles: {
      cellPadding: 2,
      fontSize: 10,
      valign: "middle",
      halign: "center",
    },
    columnStyles: {
      4: { halign: "right" },
    },
    headStyles: {
      fillColor: [255, 165, 0],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  doc.save(`${userName}_books_list.pdf`);
}
