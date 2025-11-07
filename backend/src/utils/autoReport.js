import cron from "node-cron";
import fs from "fs";
import PDFDocument from "pdfkit";

export const startAutoReport = () => {
  // Schedule: 1st of every month at midnight
  cron.schedule("0 0 1 * *", () => {
    const doc = new PDFDocument();
    const fileName = `auto-report-${new Date().toISOString().slice(0, 10)}.pdf`;

    doc.pipe(fs.createWriteStream(fileName));

    doc.fontSize(20).text("📅 Automated Monthly Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`);
    doc.end();

    console.log("✅ Auto report generated:", fileName);
  });
};
