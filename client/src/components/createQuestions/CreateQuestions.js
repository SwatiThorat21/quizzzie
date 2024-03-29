/* eslint-disable eqeqeq */
import styles from "./createQuestions.module.css";
import addIcon from "../../images/plus.png";
import { useState } from "react";
import closeIcon from "../../images/closeIcon.png";
import { useNavigate } from "react-router-dom";
import { CreateQuizFormData } from "../../apis/quiz";
import delete_icon from "../../images/delete_icon.png";
import { editFormData } from "../../apis/quiz";

export default function CreateQuestions({
  quizFormData,
  setShowQuizLinkShare,
  setQuizId,
  setQuizQuestionsData,
  quizQuestionsData,
  setShowCreateQuestions,
}) {
  const navigate = useNavigate();
  const [currentQuesIndex, setCurrentQuesIndex] = useState(0);
  const [timer, setTimer] = useState(undefined);

  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const userId = localStorage.getItem("userId");

  function addQuestions() {
    setQuizQuestionsData((prevData) => [
      ...prevData,
      {
        questionTitle: "",
        optionType: "Text",
        options: [
          {
            text: "",
            imageUrl: "",
          },
          {
            text: "",
            imageUrl: "",
          },
          {
            text: "",
            imageUrl: "",
          },
          {
            text: "",
            imageUrl: "",
          },
        ],
        correct_answer_index: -1,
      },
    ]);
    setCurrentQuesIndex((prevNum) => prevNum + 1);
  }

  function removeQuestions(indexToRemove) {
    setQuizQuestionsData((prevData) =>
      prevData.filter((_, index) => index !== indexToRemove)
    );
    setCurrentQuesIndex((prevIndex) => prevIndex - 1);
  }

  function handleShowQuestiondata(index) {
    setCurrentQuesIndex(index);
  }

  function handleChange(e, optionIndex) {
    const { name, value } = e.target;

    setQuizQuestionsData((prevData) => {
      const updatedQuestions = [...prevData];
      const updatedQuestion = { ...updatedQuestions[currentQuesIndex] };

      if (name === "text" || name === "imageUrl") {
        const updatedOptions = [...updatedQuestion.options];
        updatedOptions[optionIndex] = {
          ...updatedOptions[optionIndex],
          [name]: value,
        };
        updatedQuestion.options = updatedOptions;
      } else {
        updatedQuestion[name] = value;
      }
      if (quizFormData.quizType === "Q & A") {
        updatedQuestion.correct_answer_index = parseInt(value, 10);
      }

      updatedQuestions[currentQuesIndex] = updatedQuestion;
      return updatedQuestions;
    });
  }

  function handleTimerClick(value) {
    setTimer(value);
  }

  function cancelQuiz() {
    navigate("/dashboard");
    setShowCreateQuestions(false);
  }

  function validateInputs() {
    for (const questionData of quizQuestionsData) {
      if (!questionData.questionTitle) {
        alert("Please enter a question title");
        return false;
      }

      const nonEmptyOptionsCount = questionData.options.filter(
        (option) => option.text.trim() !== "" || option.imageUrl.trim() !== ""
      ).length;

      if (nonEmptyOptionsCount < 2) {
        alert("Each question must have at least 2 options");
        return false;
      }

      if (
        (quizFormData.quizType === "Q & A" &&
          questionData.correct_answer_index === "") ||
        questionData.correct_answer_index === undefined ||
        questionData.correct_answer_index === null
      ) {
        alert("Please select a correct answer");
        return false;
      }
    }

    return true;
  }

  function createAndEditQuiz(
    userId,
    quizTitle,
    quizType,
    timer_for_eachQuestion,
    createdAt_date,
    questions,
    quizFormId
  ) {
    if (!validateInputs()) {
      return;
    }
    if (!timer_for_eachQuestion && quizFormData.quizType === "Q & A") {
      alert("Please select a timer value");
      return;
    }

    if (quizFormId) {
      editFormData(quizFormId, questions)
        .then(() => {
          setQuizId(quizFormId);
          setShowQuizLinkShare(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      CreateQuizFormData(
        userId,
        quizTitle,
        quizType,
        timer_for_eachQuestion,
        createdAt_date,
        questions,
        setQuizId
      );

      setShowQuizLinkShare(true);
    }
  }

  function deleteOption(index) {
    setQuizQuestionsData((prevData) => {
      const updatedQuestions = [...prevData];
      const updatedQuestion = { ...updatedQuestions[currentQuesIndex] };

      updatedQuestion.options = updatedQuestion.options.filter(
        (_, optionIndex) => optionIndex !== index
      );

      updatedQuestions[currentQuesIndex] = updatedQuestion;
      return updatedQuestions;
    });
  }
  console.log(quizQuestionsData);
  return (
    <>
      <div className={styles.cancelCreate_btns_container}>
        <div className={styles.questions_page_subContainer}>
          <div className={styles.no_of_questions_wrapper}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div className={styles.question_numbers}>
                {quizQuestionsData.map((_, index) => (
                  <div
                    style={{ position: "relative", display: "flex" }}
                    key={index}
                  >
                    <div
                      className={`${styles.quesNumber} ${
                        currentQuesIndex === index && styles.activeQuesNumber
                      }`}
                      onClick={() => handleShowQuestiondata(index)}
                    >
                      {index + 1}
                    </div>
                    {index !== 0 && (
                      <img
                        src={closeIcon}
                        alt="closeIcon"
                        className={styles.closeNumIcon}
                        onClick={() => removeQuestions(index)}
                      ></img>
                    )}
                  </div>
                ))}
              </div>
              <img
                src={addIcon}
                alt="add icon"
                style={{ width: "15px", height: "15px", cursor: "pointer" }}
                onClick={addQuestions}
              ></img>
            </div>
            <p className={styles.maxQuestions}>Max 5 questions</p>
          </div>

          <div>
            <input
              type="text"
              name="questionTitle"
              placeholder="Q & A Question"
              value={quizQuestionsData[currentQuesIndex]?.questionTitle}
              onChange={handleChange}
              className={styles.questionTitleInput}
            ></input>
          </div>
          <div className={styles.option_type_wrapper}>
            <p style={{ marginRight: "1rem" }}>Option Type</p>
            <div className={styles.option_type_radioBtn_wrapper}>
              <input
                type="radio"
                value="Text"
                name="optionType"
                onChange={handleChange}
                checked={
                  quizQuestionsData[currentQuesIndex]?.optionType === "Text"
                }
              ></input>
              <label>Text</label>
            </div>
            <div className={styles.radioBtn_wrapper}>
              <input
                type="radio"
                value="Image URL"
                name="optionType"
                onChange={handleChange}
                checked={
                  quizQuestionsData[currentQuesIndex]?.optionType ===
                  "Image URL"
                }
              ></input>
              <label>Image URL</label>
            </div>
            <div className={styles.radioBtn_wrapper}>
              <input
                type="radio"
                value="Text & Image URL"
                name="optionType"
                onChange={handleChange}
                checked={
                  quizQuestionsData[currentQuesIndex]?.optionType ===
                  "Text & Image URL"
                }
              ></input>
              <label>Text & Image URL</label>
            </div>
          </div>
          <div style={{ marginTop: "0.5rem" }}>
            {quizQuestionsData.length > 0 &&
              quizQuestionsData[currentQuesIndex] && (
                <div className={styles.option_radioBtns_wrapper}>
                  {quizQuestionsData[currentQuesIndex].optionType ===
                    "Text" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      {quizQuestionsData[currentQuesIndex].options.map(
                        (option, index) => (
                          <div className={styles.option_wrapper} key={index}>
                            {quizFormData.quizType === "Q & A" && (
                              <input
                                type="radio"
                                value={index}
                                name="correct_answer_index"
                                onChange={(e) => handleChange(e, index)}
                                checked={
                                  // eslint-disable-next-line eqeqeq
                                  quizQuestionsData[currentQuesIndex]
                                    .correct_answer_index == index
                                }
                              ></input>
                            )}
                            <input
                              type="text"
                              placeholder="Text"
                              name="text"
                              value={option.text}
                              onChange={(e) => handleChange(e, index)}
                              className={`${styles.option_input} ${
                                // eslint-disable-next-line eqeqeq
                                quizQuestionsData[currentQuesIndex]
                                  .correct_answer_index == index &&
                                styles.optionSelected
                              }`}
                            ></input>
                            {index > 1 && (
                              <img
                                src={delete_icon}
                                alt="delete_icon"
                                style={{ width: "20px", cursor: "pointer" }}
                                onClick={() => deleteOption(index)}
                              ></img>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                  {quizQuestionsData[currentQuesIndex].optionType ===
                    "Image URL" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      {quizQuestionsData[currentQuesIndex].options.map(
                        (option, index) => (
                          <div className={styles.option_wrapper} key={index}>
                            {quizFormData.quizType === "Q & A" && (
                              <input
                                type="radio"
                                value={index}
                                name="correct_answer_index"
                                onChange={(e) => handleChange(e, index)}
                                checked={
                                  // eslint-disable-next-line eqeqeq
                                  quizQuestionsData[currentQuesIndex]
                                    .correct_answer_index == index
                                }
                              ></input>
                            )}
                            <input
                              type="text"
                              placeholder="Image URL"
                              name="imageUrl"
                              value={option.imageUrl}
                              onChange={(e) => handleChange(e, index)}
                              className={`${styles.option_input} ${
                                // eslint-disable-next-line eqeqeq
                                quizQuestionsData[currentQuesIndex]
                                  .correct_answer_index == index &&
                                styles.optionSelected
                              }`}
                            ></input>
                            {index > 1 && (
                              <img
                                src={delete_icon}
                                alt="delete_icon"
                                style={{ width: "20px", cursor: "pointer" }}
                                onClick={() => deleteOption(index)}
                              ></img>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                  {quizQuestionsData[currentQuesIndex].optionType ===
                    "Text & Image URL" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      {quizQuestionsData[currentQuesIndex].options.map(
                        (option, index) => (
                          <div className={styles.option_wrapper} key={index}>
                            {quizFormData.quizType === "Q & A" && (
                              <input
                                type="radio"
                                value={index}
                                name="correct_answer_index"
                                onChange={(e) => handleChange(e, index)}
                                checked={
                                  // eslint-disable-next-line eqeqeq
                                  quizQuestionsData[currentQuesIndex]
                                    .correct_answer_index == index
                                }
                              ></input>
                            )}
                            <input
                              type="text"
                              placeholder="Text"
                              name="text"
                              value={option.text}
                              onChange={(e) => handleChange(e, index)}
                              className={`${styles.option_input} ${
                                // eslint-disable-next-line eqeqeq
                                quizQuestionsData[currentQuesIndex]
                                  .correct_answer_index == index &&
                                styles.optionSelected
                              }`}
                            ></input>
                            <input
                              type="text"
                              placeholder="Image URL"
                              name="imageUrl"
                              value={option.imageUrl}
                              onChange={(e) => handleChange(e, index)}
                              className={`${styles.option_input} ${
                                // eslint-disable-next-line eqeqeq
                                quizQuestionsData[currentQuesIndex]
                                  .correct_answer_index == index &&
                                styles.optionSelected
                              }`}
                            ></input>
                            {index > 1 && (
                              <img
                                src={delete_icon}
                                alt="delete_icon"
                                style={{ width: "20px", cursor: "pointer" }}
                                onClick={() => deleteOption(index)}
                              ></img>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                  {quizFormData.quizType === "Q & A" && (
                    <div className={styles.timer_wrapper}>
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "#9F9F9F",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Timer
                      </p>
                      <div
                        className={`${styles.timerBtn} ${
                          timer === "OFF" && styles.selectedTimer
                        }`}
                        onClick={() => handleTimerClick("OFF")}
                      >
                        OFF
                      </div>
                      <div
                        className={`${styles.timerBtn} ${
                          timer === 5 && styles.selectedTimer
                        }`}
                        onClick={() => handleTimerClick(5)}
                      >
                        5 Sec
                      </div>
                      <div
                        className={`${styles.timerBtn} ${
                          timer === 10 && styles.selectedTimer
                        }`}
                        onClick={() => handleTimerClick(10)}
                      >
                        10 Sec
                      </div>
                    </div>
                  )}
                </div>
              )}
            <div className={styles.buttons_wrapper}>
              <button className={styles.cancelBtn} onClick={cancelQuiz}>
                Cancel
              </button>
              <button
                className={styles.createQuizBtn}
                onClick={() =>
                  createAndEditQuiz(
                    userId,
                    quizFormData.quizTitle,
                    quizFormData.quizType,
                    timer,
                    formattedDate,
                    quizQuestionsData,
                    quizFormData._id
                  )
                }
              >
                Create Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
