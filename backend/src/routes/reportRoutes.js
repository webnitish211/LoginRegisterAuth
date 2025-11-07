import express from "express";
import fs from "fs";
import PDFDocument from "pdfkit";
import { Parser } from "json2csv";

const router = express.Router();

const analytics = {
  totalUsers: 2543,
  activeUsers: 1875,
  monthlyRevenue: [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 14500 },
    { month: "Mar", revenue: 9800 },
    { month: "Apr", revenue: 16700 },
    { month: "May", revenue: 21000 },
    { month: "Jun", revenue: 18500 },
    { month: "Jul", revenue: 23000 },
  ],
  growthRate: 12.4,
};


// Generate PDF
// Generate PDF (Direct Stream)
router.get("/pdf", (req, res) => {
  const doc = new PDFDocument();

  // Set headers to force download
  res.setHeader("Content-Disposition", "attachment; filename=Business_Report.pdf");
  res.setHeader("Content-Type", "application/pdf");

  // Pipe PDF directly to response
  doc.pipe(res);

  doc.fontSize(20).text("Monthly Business Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Total Users: ${analytics.totalUsers}`);
  doc.text(`Active Users: ${analytics.activeUsers}`);
  doc.text(`Growth Rate: ${analytics.growthRate}%`);
  doc.moveDown().text("Revenue Summary:", { underline: true });
  analytics.monthlyRevenue.forEach((item) => {
    doc.text(`${item.month}: $${item.revenue}`);
  });

  doc.end();
});


// Generate CSV
router.get("/csv", (req, res) => {
  const parser = new Parser();
  const csv = parser.parse(analytics.monthlyRevenue);
  fs.writeFileSync("report.csv", csv);

  res.download("report.csv", "Business_Report.csv", () => {
    fs.unlinkSync("report.csv");
  });
});

export default router;
