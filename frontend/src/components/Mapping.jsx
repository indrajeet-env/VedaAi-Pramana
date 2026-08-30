import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { ChevronDown, ChevronUp, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Expand, Shrink, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Mapping = ({ answerSheetUrl, questionPaperName, apiResult }) => {
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [expandedQs, setExpandedQs] = useState({});
  
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [fileProp, setFileProp] = useState(null);
  const [selectedQuestionNumber, setSelectedQuestionNumber] = useState(null);

  useEffect(() => {
    const prepareFile = async () => {
      if (!answerSheetUrl) {
        setFileProp(null);
        return;
      }
      if (answerSheetUrl.startsWith('blob:')) {
        setFileProp(answerSheetUrl);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        setFileProp({
          url: answerSheetUrl,
          httpHeaders: {
            Authorization: `Bearer ${session?.access_token}`
          }
        });
      }
    };
    prepareFile();
  }, [answerSheetUrl]);

  const questions = apiResult?.questions || [];

  const toggleAll = () => {
    const newState = !isAllExpanded;
    setIsAllExpanded(newState);
    const newExpandedQs = {};
    questions.forEach(q => {
      newExpandedQs[q.questionNumber] = newState;
    });
    setExpandedQs(newExpandedQs);
  };

  const toggleQ = (id) => {
    setExpandedQs(prev => {
      const isCurrentlyExpanded = prev[id];
      if (!isCurrentlyExpanded) {
        setSelectedQuestionNumber(id);
      } else if (selectedQuestionNumber === id) {
        setSelectedQuestionNumber(null);
      }
      return { ...prev, [id]: !isCurrentlyExpanded };
    });
  };

  useEffect(() => {
    if (selectedQuestionNumber) {
      const q = questions.find(q => q.questionNumber === selectedQuestionNumber);
      if (q && q.answerLocations && q.answerLocations.length > 0) {
        setPageNumber(q.answerLocations[0].page);
      }
    }
  }, [selectedQuestionNumber, questions]);

  const getStatus = (score, maxMarks) => {
    if (score === maxMarks) return 'correct';
    if (score === 0) return 'incorrect';
    return 'partial';
  };

  const getBadgeColor = (score, maxMarks) => {
    const status = getStatus(score, maxMarks);
    switch(status) {
      case 'correct': return 'bg-green-100 text-green-700';
      case 'partial': return 'bg-orange-100 text-orange-700';
      case 'incorrect': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const zoomIn = () => setScale(s => Math.min(s + 0.1, 2.0));
  const zoomOut = () => setScale(s => Math.max(s - 0.1, 0.5));
  const prevPage = () => setPageNumber(p => Math.max(p - 1, 1));
  const nextPage = () => setPageNumber(p => Math.min(p + 1, numPages || 1));

  return (
    <div className="w-full h-full flex gap-6 bg-transparent">
      {/* LEFT PANEL: Questions */}
      <div className="w-1/3 bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div>
            <h3 className="font-bold text-gray-900 bricolage text-lg">Extracted Questions</h3>
            <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">From: {questionPaperName || "Question Paper"}</p>
          </div>
          <button 
            onClick={toggleAll}
            className="text-xs font-medium text-orange-500 hover:text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
          >
            {isAllExpanded ? <Shrink size={14} /> : <Expand size={14} />}
            {isAllExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
          {questions.map((q) => (
            <div key={q.questionNumber} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all hover:border-orange-200">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleQ(q.questionNumber)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                    Q{q.questionNumber}
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${getBadgeColor(q.score, q.maxMarks)}`}>
                    {q.score}/{q.maxMarks}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  {expandedQs[q.questionNumber] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
              
              {expandedQs[q.questionNumber] && (
                <div className="px-4 pb-4 pt-1 text-sm text-gray-600 border-t border-gray-50 bg-gray-50/50 space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Question:</p>
                    <p className="text-gray-700">{q.question}</p>
                  </div>
                  
                  {q.feedback && (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                      <p className="font-semibold text-blue-800 mb-1 flex items-center gap-1">
                        <Lightbulb size={14} /> Feedback
                      </p>
                      <p className="text-blue-700/80">{q.feedback}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {q.strengths?.length > 0 && (
                      <div className="bg-green-50/50 border border-green-100 rounded-lg p-3">
                        <p className="font-semibold text-green-800 mb-1 flex items-center gap-1">
                          <CheckCircle size={14} /> Strengths
                        </p>
                        <ul className="list-disc list-inside text-green-700/80 space-y-1">
                          {q.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    
                    {q.weaknesses?.length > 0 && (
                      <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-3">
                        <p className="font-semibold text-orange-800 mb-1 flex items-center gap-1">
                          <AlertTriangle size={14} /> Weaknesses
                        </p>
                        <ul className="list-disc list-inside text-orange-700/80 space-y-1">
                          {q.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {q.unclearParts?.length > 0 && (
                    <div className="bg-red-50/50 border border-red-100 rounded-lg p-3">
                      <p className="font-semibold text-red-800 mb-1">Unclear Parts</p>
                      <ul className="list-disc list-inside text-red-700/80 space-y-1">
                        {q.unclearParts.map((u, i) => <li key={i}>{u}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL: Answer Sheet PDF Viewer */}
      <div className="w-2/3 bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white shadow-md border border-gray-200 rounded-full px-4 py-2 flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
            <button onClick={zoomOut} disabled={scale <= 0.5} className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors disabled:opacity-50"><ZoomOut size={18} /></button>
            <span className="text-xs font-semibold text-gray-700 w-12 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={zoomIn} disabled={scale >= 2.0} className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors disabled:opacity-50"><ZoomIn size={18} /></button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevPage} disabled={pageNumber <= 1} className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors disabled:opacity-50"><ChevronLeft size={18} /></button>
            <span className="text-xs font-semibold text-gray-700 min-w-[70px] text-center">Page {pageNumber} of {numPages || '-'}</span>
            <button onClick={nextPage} disabled={!numPages || pageNumber >= numPages} className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors disabled:opacity-50"><ChevronRight size={18} /></button>
          </div>
        </div>

        <div className="flex-1 bg-[#525659] relative overflow-auto flex justify-center py-20">
          {fileProp ? (
             <Document
               key={answerSheetUrl}
               file={fileProp}
               onLoadSuccess={onDocumentLoadSuccess}
               onLoadError={(error) => console.error("PDF Load Error Details:", error)}
               className="flex flex-col items-center shadow-lg"
               loading={
                 <div className="text-white bg-black/50 px-4 py-2 rounded-lg">
                   Loading PDF...
                 </div>
               }
             >
               <Page 
                 pageNumber={pageNumber} 
                 scale={scale} 
                 renderAnnotationLayer={false}
                 renderTextLayer={false}
                 className="relative"
               >
                 {selectedQuestionNumber && (() => {
                   const q = questions.find(q => q.questionNumber === selectedQuestionNumber);
                   if (!q || !q.answerLocations) return null;
                   return q.answerLocations
                     .filter(loc => loc.page === pageNumber)
                     .map((loc, idx) => (
                       <div 
                         key={idx}
                         className="absolute bg-green-400/40 border-2 border-green-500 rounded pointer-events-none transition-all duration-300 z-50"
                         style={{
                           left: `${loc.left * scale}px`,
                           top: `${loc.top * scale}px`,
                           width: `${loc.width * scale}px`,
                           height: `${loc.height * scale}px`
                         }}
                       />
                     ));
                 })()}
               </Page>
             </Document>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100 absolute inset-0">
              No PDF Loaded
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mapping;
