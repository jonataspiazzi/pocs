const PdfMerger = require('pdf-merger-js');
const path = require('path');

(async () => {
  const merger = new PdfMerger();

  merger.add(path.resolve('report/page-01.pdf'));
  merger.add(path.resolve('report/page-02.pdf'));
  merger.add(path.resolve('report/page-03.pdf'));
  merger.add(path.resolve('report/page-04.pdf'));

  console.log('just before save');
  await merger.save('result.pdf');

  console.log('finished');
})();