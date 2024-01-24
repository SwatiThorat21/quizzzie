import styles from "./quizQuestionsPage.module.css";
import CreateQuestions from "../../components/createQuestions/CreateQuestions";

export default function QuizQuestionsPage({ quizdata, useId, setQuizId }) {
  return (
    <>
      <div className={styles.questions_page_Container}>
        <CreateQuestions quizdata={quizdata} useId={useId} setQuizId={setQuizId} />
      </div>
    </>
  );
}