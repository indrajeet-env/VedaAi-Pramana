import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { UploadCloud, File as FileIcon, X, ArrowRight, Sparkles } from "lucide-react";
import Frame01 from "../assets/Frame01.png";

import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const Upload = () => {
  const { setIsSidebarCollapsed } = useOutletContext();
  const [questionPaper, setQuestionPaper] = useState(null);
  const [answerSheet, setAnswerSheet] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const qpInputRef = useRef(null);
  const asInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getPdfPageCount = async (file) => {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    return pdf.numPages;
  };

  const handleFileChange = async (e, setFile) => {
    const file = e.target.files[0];

    if (!file) return;

    let pages = 1;

    if (file.type === "application/pdf") {
      pages = await getPdfPageCount(file);
    }

    setFile({
      name: file.name,
      size: formatFileSize(file.size),
      pages,
    });
  };

  const removeFile = (e, setFile) => {
    e.stopPropagation();
    e.preventDefault();
    setFile(null);
  };

  const UploadCard = ({ title, file, setFile, inputRef }) => {
    return (
      <div 
        className={`relative w-72 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${
          file 
            ? "border-orange-300 bg-orange-50/30" 
            : "border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400"
        }`}
        onClick={() => !file && inputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          onChange={(e) => handleFileChange(e, setFile)}
          accept=".pdf"
        />

        {file ? (
          <div className="flex flex-col items-center p-4 w-full h-full relative">
            <button 
              onClick={(e) => removeFile(e, setFile)}
              className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm border border-gray-100 hover:text-gray-600 transition-colors"
            >
              <X size={14} />
            </button>
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-red-500 mb-3">
              <FileIcon size={24} />
            </div>
            <p className="font-semibold text-sm text-gray-800 text-center truncate w-full px-4">
              {file.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {file.size} • {file.pages} pages
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-3">
              <UploadCloud size={24} />
            </div>
            <p className="font-medium text-gray-700">{title}</p>
            <p className="text-xs text-gray-400 mt-1">Click to browse or drag & drop</p>
          </div>
        )}
      </div>
    );
  };

  if (isExtracting) {
    return (
      <div className="w-full h-full bg-white rounded-[32px] shadow-sm flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
            <Sparkles size={56} className="text-orange-500 animate-pulse" strokeWidth={1.5} />
          </div>
          <div className="bricolage">
            <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Extracting...</h2>
          </div>
          <p className="text-gray-500 text-xl font-medium">This may take a while</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto py-10">
      
      <div className="bricolage text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight items-center">
          <span>Upload</span>
          <span className="text-orange-500 bg-orange-50 px-4 py-1.5 rounded-md">
            Question Paper & Answer Sheets
          </span>
        </h2>
        <p className="text-gray-500 mt-4 text-lg">
          Upload both files to get started
        </p>
      </div>

      <div className="mb-10 relative">
        <img src={Frame01} alt="#"/>
      </div>

      <div className="flex gap-6 mb-10">
        <UploadCard 
          title="Upload Question Paper" 
          file={questionPaper} 
          setFile={setQuestionPaper} 
          inputRef={qpInputRef} 
        />
        <UploadCard 
          title="Upload Answer Sheet" 
          file={answerSheet} 
          setFile={setAnswerSheet} 
          inputRef={asInputRef} 
        />
      </div>

      <div className="flex flex-col items-center">
        <button 
          disabled={!questionPaper || !answerSheet}
          onClick={() => {
            setIsExtracting(true);
            if (setIsSidebarCollapsed) setIsSidebarCollapsed(true);
          }}
          className={`flex items-center gap-2 px-10 py-4 rounded-full font-medium text-lg transition-all ${
            questionPaper && answerSheet 
              ? "bg-[#1e1e1e] text-white hover:bg-[#2a2a2a] shadow-md shadow-gray-200" 
              : "bg-stone-400 text-gray-300 cursor-not-allowed"
          }`}
        >
          <p className="text-sm ">Start Mapping</p>
          <ArrowRight size={20} />
        </button>
        <div className="text-xs text-gray-400 mt-4 flex flex-col gap-1 items-center">
          <p>Once both files are uploaded, you’ll able to map answers with questions</p>
          <p>Mapping takes about 2-3 minutes depending on the file size.</p>
        </div>
      </div>
    </div>
  );
};

export default Upload;
