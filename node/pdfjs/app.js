const PdfMerger = {};// require('pdf-merger-js');
const path = require('path');
const fs = require('fs');
const { Document, ExternalDocument } = require('pdfjs');

async function main1() {

  const merger = new PdfMerger();

  merger.add(path.resolve('report/alternativo-capa.pdf'));
  merger.add(path.resolve('report/alternativo-fluxo.pdf'));
  merger.add(path.resolve('report/capa.pdf'));
  merger.add(path.resolve('report/fluxo-01.pdf'));
  merger.add(path.resolve('report/fluxo-02.pdf'));
  merger.add(path.resolve('report/fluxo-03.pdf'));
  merger.add(path.resolve('report/fluxo-04.pdf'));
  merger.add(path.resolve('report/fluxo-05.pdf'));
  merger.add(path.resolve('report/fluxo-06.pdf'));
  merger.add(path.resolve('report/fluxo-07.pdf'));
  merger.add(path.resolve('report/fluxo-08.pdf'));

  console.log('just before save');
  await merger.save('result.pdf');

  console.log('finished');
}

async function main() {
  const doc = new Document();

  const add = (name) => {
    const buffer = fs.readFileSync(path.join(__dirname, name));
    const ed = new ExternalDocument(buffer);
    doc.addPagesOf(ed);
  };

  add('./report/alternativo-capa.pdf');
  add('./report/alternativo-fluxo.pdf');
  add('./report/capa.pdf');
  add('./report/fluxo-01.pdf');
  add('./report/fluxo-02.pdf');
  add('./report/fluxo-03.pdf');
  add('./report/fluxo-04.pdf');
  add('./report/fluxo-05.pdf');
  add('./report/fluxo-06.pdf');
  add('./report/fluxo-07.pdf');
  add('./report/fluxo-08.pdf');

  const outputStream = fs.createWriteStream(path.join(__dirname, './result.pdf'));

  doc.pipe(outputStream);
  await doc.end();

  console.log('finish');
}

main().catch(console.error);