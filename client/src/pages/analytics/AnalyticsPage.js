import Analytics from "../../components/analytics/Analytics";
import Sidebar from "../../components/sidebar/Sidebar";
import { useState, useEffect } from "react";
import ShowQuestionAnalysis from "../../components/ShowQuestionAnalysis/ShowQuestionAnalysis";
import { useNavigate } from "react-router-dom";

export default function AnalyticsPage({ quizData, setQuizData, setIsLoggedIn, setShowCreateQuestions }) {
  const [selectedQuestionId, setSelectedQuestionId] = useState(undefined);

  const navigate = useNavigate();
  useEffect(() => {
    const jwToken = localStorage.getItem("jwToken");
    if (!jwToken) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar setIsLoggedIn={setIsLoggedIn}/>
        {!selectedQuestionId && (
          <Analytics
            quizData={quizData}
            setQuizData={setQuizData}
            setSelectedQuestionId={setSelectedQuestionId}
            setShowCreateQuestions={setShowCreateQuestions}
          />
        )}
        {selectedQuestionId && (
          <ShowQuestionAnalysis
            quizData={quizData}
            selectedQuestionId={selectedQuestionId}
          />
        )}
      </div>
    </>
  );
}
