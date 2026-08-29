import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Mapping from "../components/Mapping";

const AssessmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setIsSidebarCollapsed } = useOutletContext();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);

  useEffect(() => {
    // Collapse sidebar when on this view
    if (setIsSidebarCollapsed) {
      setIsSidebarCollapsed(true);
    }
  }, [setIsSidebarCollapsed]);

  useEffect(() => {
    const fetchAssessmentDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("No active session");

        const res = await fetch(`/api/assessments/${id}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load assessment.");
        }

        const data = await res.json();
        setAssessmentData(data.assessment);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load assessment.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssessmentDetail();
    }
  }, [id]);

  const extractFileName = (path) => {
    if (!path) return "Unknown File";
    const parts = path.split('/');
    const name = parts[parts.length - 1];
    return name.replace(/^(question|answer)-\d+-/, '');
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <p className="text-xl font-medium">Loading Assessment...</p>
      </div>
    );
  }

  if (error || !assessmentData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <p className="text-red-500 text-xl font-medium mb-4">{error || "Assessment not found"}</p>
        <button 
          onClick={() => navigate("/upload")}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Back to Upload
        </button>
      </div>
    );
  }

  const questionPaperName = extractFileName(assessmentData.question_file_path);

  return (
    <div className="w-full h-full">
      <Mapping 
        answerSheetUrl={`/api/assessments/${id}/answer-sheet`} 
        questionPaperName={questionPaperName} 
        apiResult={assessmentData.result} 
      />
    </div>
  );
};

export default AssessmentDetail;
