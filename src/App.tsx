import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./App.css";
pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function App() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pdfUrl = params.get("pdf");
    setPdfFile(pdfUrl);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  // Handle missing PDF: ask for URL
  if (!pdfFile) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-100 to-indigo-200">
        <div className="bg-white/80 rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-8 backdrop-blur-md">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
            DocVue
          </h1>
          <p className="text-lg text-gray-700 text-center mb-4">
            Welcome to DocVue.<br />
            Paste a public PDF URL below to get started!
          </p>
          <input
            type="url"
            className="border border-indigo-300 rounded-lg px-5 py-3 w-80 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg"
            placeholder="Paste PDF URL here..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            autoFocus
          />
          <button
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-bold text-lg"
            disabled={!inputUrl.trim()}
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.set("pdf", inputUrl.trim());
              window.location.search = params.toString();
            }}
          >
            View PDF
          </button>
          <div className="text-sm text-gray-400 mt-2 text-center">
            Your PDF must be publicly accessible.<br />
            Example:{" "}
            <span className="font-mono">https://example.com/sample.pdf</span>
          </div>
        </div>
      </div>
    );
  }

  // Only render the document, no extra UI
  return (
    <div className="pdf-document">
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        className="pdf-document"
        loading={
          <div className="flex flex-col items-center justify-center h-screen w-screen">
            <svg
              className="animate-spin h-12 w-12 text-indigo-500 mb-6"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="text-indigo-700 font-bold text-xl">
              {/* Loading... */}
            </span>
          </div>
        }
        error={
          <div className="flex flex-col items-center justify-center h-full w-full">
            <svg
              className="h-12 w-12 text-red-500 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
              />
            </svg>
            <span className="text-red-600 font-bold text-xl mb-2">
              Failed to load PDF.
            </span>
            <span className="text-gray-500 text-center mb-4">
              Please check the URL and ensure the PDF is publicly accessible.
            </span>
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
              onClick={() => {
                window.location.search = "";
              }}
            >
              Try another PDF
            </button>
          </div>
        }
      >
        {/* Render all pages, no extra UI */}
        {Array.from({ length: numPages }, (_, i) => (
          <Page
            loading={<></>}
            key={`page_${i + 1}`}
            pageNumber={i + 1}
            className="pdf-page"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={window.innerWidth}
          />
        ))}
      </Document>
    </div>
  );
}

export default App;
