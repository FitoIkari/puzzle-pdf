const { PDFDocument } = require("pdf-lib");
const fs = require("fs");

const pdfCollection = {};

async function openFile(filePath) {
  const title = filePath.split("\\").slice(-1)[0].replace(".pdf", "");
  let pdfBytes = fs.readFileSync(filePath);

  addFile(title, await PDFDocument.load(pdfBytes));
  return title;
}

function addFile(title, pdfDoc) {
  pdfCollection[title] = {
    title,
    pdfDoc,
  };
}

async function createNewFile(pagesConfig, filePath) {
  const y = await PDFDocument.create();

  if (filePath.slice(-4) !== ".pdf") filePath += ".pdf";

  for (let i = 0; i < pagesConfig.length; i++) {
    const [copiedPage] = await y.copyPages(
      pdfCollection[pagesConfig[i][0]].pdfDoc,
      [pagesConfig[i][1] - 1]
    );
    y.addPage(copiedPage);
  }

  await fs.createWriteStream(filePath).write(await y.save());
}

function getFile(fileName) {
  return pdfCollection[fileName];
}

module.exports = { pdfEngine: { openFile, getFile, createNewFile } };
