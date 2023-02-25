const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

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

async function createNewFile(pagesConfig) {
  const y = await PDFDocument.create();

  for (let i = 0; i < pagesConfig.length; i++) {
    const [copiedPage] = await y.copyPages(
      pdfCollection[pagesConfig[i][0]].pdfDoc,
      [pagesConfig[i][1] - 1]
    );
    y.addPage(copiedPage);
  }

  await fs
    .createWriteStream(
      path.join(__dirname, "..", "..", "createdFiles", "myFile.pdf")
    )
    .write(await y.save());
}

function getFile(fileName) {
  return pdfCollection[fileName];
}

module.exports = { pdfEngine: { openFile, getFile, createNewFile } };
