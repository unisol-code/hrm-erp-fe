import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const PAGE_MARGIN = 6; // mm
const BLACK = [0, 0, 0];
const WHITE = [255, 255, 255];
const GOLD = [160, 139, 75];

/**
 * Loads an image URL and returns { dataUrl, width, height } (or null on failure).
 * The image server must allow CORS, otherwise the logo is simply skipped.
 */
export const loadImageAsDataURL = (src) =>
  new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const width = img.naturalWidth || 300;
        const height = img.naturalHeight || 100;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve({ dataUrl: canvas.toDataURL("image/png"), width, height });
      } catch (error) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

/**
 * Builds the payslip for a given scale factor `k` (1 = normal size).
 * The caller shrinks `k` until everything fits on one page.
 */
const buildDoc = (data, k) => {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const pageW = doc.internal.pageSize.getWidth();
  const left = PAGE_MARGIN;
  const W = pageW - PAGE_MARGIN * 2;

  const fs = 7.5 * k;
  const padV = 0.9 * k;
  const padH = 1.4 * k;
  const gap = 1.4 * k;

  const base = {
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: fs,
      cellPadding: { top: padV, bottom: padV, left: padH, right: padH },
      lineColor: BLACK,
      lineWidth: 0.2,
      textColor: BLACK,
      fillColor: WHITE,
      valign: "middle",
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: WHITE,
      textColor: BLACK,
      fontStyle: "bold",
      lineColor: BLACK,
      lineWidth: 0.2,
    },
    footStyles: {
      fillColor: WHITE,
      textColor: BLACK,
      fontStyle: "bold",
      lineColor: BLACK,
      lineWidth: 0.2,
    },
  };

  // draws one table at (x, startY) with the given width and returns its bottom Y
  const table = (x, startY, width, cfg) => {
    autoTable(doc, {
      ...base,
      ...cfg,
      startY,
      tableWidth: width,
      margin: {
        left: x,
        right: pageW - x - width,
        top: PAGE_MARGIN,
        bottom: PAGE_MARGIN,
      },
    });
    return doc.lastAutoTable.finalY;
  };

  const boldCols = (cols) => (hook) => {
    if (hook.section === "body" && cols.includes(hook.column.index)) {
      hook.cell.styles.fontStyle = "bold";
    }
  };

  const outline = (x, y1, width, y2) => {
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.2);
    doc.rect(x, y1, width, y2 - y1);
  };

  let y = PAGE_MARGIN;

  // ---------- Header: logo, company name, address ----------
  const logoH = 11 * k;
  if (data.logo) {
    const ratio = data.logo.width / data.logo.height;
    const logoW = Math.min(logoH * ratio, 60);
    doc.addImage(
      data.logo.dataUrl,
      "PNG",
      (pageW - logoW) / 2,
      y,
      logoW,
      logoH
    );
  }
  // doc.setFont("times", "bold");
  // doc.setFontSize(9 * k);
  // doc.setTextColor(...GOLD);
  // doc.text(String(data.companyName), pageW / 2, y + logoH + 3.6 * k, {
  //   align: "center",
  // });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5 * k);
  doc.setTextColor(...BLACK);
  const addressLines = doc.splitTextToSize(String(data.companyAddress), W * 0.32);
  doc.text(addressLines, pageW - PAGE_MARGIN, y + 2.5 * k, { align: "right" });

  y += logoH + 6.5 * k;

  // ---------- Title bar ----------
  const titleH = 5.6 * k;
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.5);
  doc.line(left, y, left + W, y);
  doc.line(left, y + titleH, left + W, y + titleH);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fs + 1 * k);
  doc.text(String(data.title), pageW / 2, y + titleH / 2, {
    align: "center",
    baseline: "middle",
  });
  y += titleH + gap;

  // ---------- Employee information ----------
  const infoCols = {
    0: { cellWidth: W * 0.12 },
    1: { cellWidth: W * 0.38 },
    2: { cellWidth: W * 0.12 },
    3: { cellWidth: W * 0.38 },
  };
  y = table(left, y, W, {
    body: data.employeeInfoRows,
    columnStyles: infoCols,
    didParseCell: boldCols([0, 2]),
  });
  y += gap;

  // ---------- Bank information ----------
  y = table(left, y, W, {
    body: data.bankInfoRows,
    columnStyles: infoCols,
    didParseCell: boldCols([0, 2]),
  });
  y += gap;

  // ---------- Attendance ----------
  y = table(left, y, W, {
    body: [data.attendanceRow],
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 38 },
      2: { cellWidth: 28 },
      3: { cellWidth: 38 },
      4: { cellWidth: 28 },
      5: { cellWidth: W - 160 },
    },
    didParseCell: boldCols([0, 2, 4]),
  });
  y += gap;

  // ---------- Earnings | Deductions ----------
  const half = W / 2;
  const numW = 22;
  const earnDedCols = {
    0: { cellWidth: half - numW * 2 },
    1: { cellWidth: numW, halign: "right" },
    2: { cellWidth: numW, halign: "right" },
  };
  const earnEnd = table(left, y, half, {
    head: [
      [{ content: "Earnings", colSpan: 3, styles: { halign: "center" } }],
      [
        "Component",
        { content: "Normal", styles: { halign: "right" } },
        { content: "Adjustment", styles: { halign: "right" } },
      ],
    ],
    body: data.earnings.rows,
    foot: [
      [
        "Total Earnings",
        { content: data.earnings.total, styles: { halign: "right" } },
        "",
      ],
    ],
    showFoot: "lastPage",
    columnStyles: earnDedCols,
  });
  const dedEnd = table(left + half, y, half, {
    head: [
      [{ content: "Deductions", colSpan: 3, styles: { halign: "center" } }],
      [
        "Deduction",
        { content: "Normal", styles: { halign: "right" } },
        { content: "Adjustment", styles: { halign: "right" } },
      ],
    ],
    body: data.deductions.rows,
    foot: [
      [
        "Total Deductions",
        { content: data.deductions.total, styles: { halign: "right" } },
        "",
      ],
    ],
    showFoot: "lastPage",
    columnStyles: earnDedCols,
  });
  const earnDedBottom = Math.max(earnEnd, dedEnd);
  outline(left, y, W, earnDedBottom);
  y = earnDedBottom + gap;

  // ---------- Net salary ----------
  y = table(left, y, W, {
    body: [[data.net.label, data.net.amount, `- ${data.net.words}`]],
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 32, halign: "right" },
      2: { cellWidth: W - 70 },
    },
    didParseCell: boldCols([0, 1]),
  });
  y += gap;

  // ---------- Reimbursements | PF & Pension ----------
  const reimbEnd = table(left, y, half, {
    head: [
      [{ content: "Reimbursements", colSpan: 4, styles: { halign: "left" } }],
      [
        `For Yr year ${data.reimbursement.year}`,
        "Particular",
        { content: "Normal", styles: { halign: "right" } },
        { content: "Annual", styles: { halign: "right" } },
      ],
    ],
    body: data.reimbursement.rows,
    columnStyles: {
      0: { cellWidth: 27 },
      1: { cellWidth: half - 27 - 36 },
      2: { cellWidth: 18, halign: "right" },
      3: { cellWidth: 18, halign: "right" },
    },
  });
  const pfEnd = table(left + half, y, half, {
    head: [
      [{ content: "PF & Pension Balance", colSpan: 3, styles: { halign: "left" } }],
      [
        { content: "PF Balance (Company)", styles: { halign: "center" } },
        { content: "PF Balance (Member)", styles: { halign: "center" } },
        { content: "Pension Balance", styles: { halign: "center" } },
      ],
    ],
    body: [
      [
        { content: data.pf.company, styles: { halign: "right" } },
        { content: data.pf.member, styles: { halign: "right" } },
        { content: data.pf.pension, styles: { halign: "right" } },
      ],
      [
        {
          content: data.pf.period,
          colSpan: 3,
          styles: { fontStyle: "bold", halign: "left" },
        },
      ],
    ],
    columnStyles: {
      0: { cellWidth: half / 3 },
      1: { cellWidth: half / 3 },
      2: { cellWidth: half / 3 },
    },
  });
  const reimbBottom = Math.max(reimbEnd, pfEnd);
  outline(left, y, W, reimbBottom);
  y = reimbBottom + gap;

  // ---------- Income tax | Investment, HRA, Perq ----------
  const leftW = (W * 2) / 3;
  const rightW = W - leftW;
  const taxNumW = 20;
  const taxEnd = table(left, y, leftW, {
    head: [
      [
        {
          content: `Income Tax Calculation on the Financial Year ${data.incomeTax.financialYear}`,
          colSpan: 5,
          styles: { halign: "left" },
        },
      ],
      [
        "Particulars",
        { content: "Add Current", styles: { halign: "right" } },
        { content: "Add Cumulative", styles: { halign: "right" } },
        { content: "Add Projected", styles: { halign: "right" } },
        { content: "Annual", styles: { halign: "right" } },
      ],
    ],
    body: data.incomeTax.rows,
    columnStyles: {
      0: { cellWidth: leftW - taxNumW * 4 },
      1: { cellWidth: taxNumW, halign: "right" },
      2: { cellWidth: taxNumW, halign: "right" },
      3: { cellWidth: taxNumW, halign: "right" },
      4: { cellWidth: taxNumW, halign: "right" },
    },
  });

  const sideCols = {
    0: { cellWidth: rightW - 20 },
    1: { cellWidth: 20, halign: "right" },
  };
  const sideTable = (startY, title, rows) =>
    table(left + leftW, startY, rightW, {
      head: [[{ content: title, colSpan: 2, styles: { halign: "left" } }]],
      body: rows,
      columnStyles: sideCols,
    });

  let sideY = y;
  sideY = sideTable(sideY, "Investment Details", data.investmentRows) + gap * 0.6;
  sideY = sideTable(sideY, "HRA Details", data.hraRows) + gap * 0.6;
  sideY = sideTable(sideY, "Perq Details", data.perqRows);

  const taxBottom = Math.max(taxEnd, sideY);
  outline(left, y, W, taxBottom);
  y = taxBottom + gap;

  // ---------- Remarks ----------
  y = table(left, y, W, {
    head: [[{ content: "Remarks", styles: { halign: "center" } }]],
    body: [
      [
        {
          content: data.remarks.map((line, i) => `${i + 1}. ${line}`).join("\n"),
          styles: { fontSize: Math.max(fs - 1.2, 4.5), halign: "left" },
        },
      ],
    ],
    columnStyles: { 0: { cellWidth: W } },
  });

  return { doc, bottom: y };
};

/**
 * Builds the payslip and guarantees a single A4 page:
 * it starts at normal size and shrinks gradually until everything fits.
 */
export const buildPayslipPdf = (data) => {
  let result = null;
  for (let k = 1.15; k >= 0.5; k -= 0.03) {
    result = buildDoc(data, k);
    if (result.doc.getNumberOfPages() === 1) break;
  }
  return result.doc;
};

export const generatePayslipPdf = (data, fileName) => {
  const doc = buildPayslipPdf(data);
  doc.save(fileName);
};