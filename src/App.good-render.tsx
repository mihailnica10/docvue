import { useMemo, useState } from "react";
import { pdfjs } from "react-pdf";
import "./App.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import { Document, Page } from "react-pdf";

function App() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const RenderedPages = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <Page
          className={"pdf-page"}
          renderTextLayer={false}
          key={`page_${i}`}
          pageNumber={i}
        />,
      );
    }
    return pages;
  }, [numPages]);

  return (
    <div>
      <Document
        file="cornel.pdf"
        className={"pdf-document"}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <>
            yoo
          </>
        }
      >
        {RenderedPages}
      </Document>
    </div>
  );
}

export default App;
