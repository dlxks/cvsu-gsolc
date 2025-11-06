"use client";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver"

export async function exportExcelFile(
  data: any[],
  sheetName: string,
  fileName: string
) {
  if (!data.length) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  // === Header Row ===
  const headers = Object.keys(data[0]);
  const headerRow = sheet.addRow(headers);

  // Style headers
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF3B82F6" }, // Blue background
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // === Data Rows ===
  data.forEach((row) => {
    const rowValues = headers.map((key) => {
      const value = row[key] ?? "";
      // Format date fields
      if (key.toLowerCase().includes("created") && value) {
        return new Date(value).toLocaleString();
      }
      return value;
    });

    const excelRow = sheet.addRow(rowValues);

    excelRow.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "left" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // === Auto-width columns ===
  sheet.columns.forEach((column) => {
    let maxLength = 10;
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const length = cell.value ? cell.value.toString().length : 0;
      if (length > maxLength) maxLength = length;
    });
    column.width = maxLength + 2; // Add padding
  });

  // Write buffer and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}-${new Date().toISOString()}.xlsx`);
}
