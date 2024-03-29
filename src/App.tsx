import { useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { fetchQuizQuestions, QuestionState } from "./API";
import QuizForm from "./components/QuizForm";

interface IAnswerObject {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<IAnswerObject[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(true);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);

  const startTrivia = async (
    e: React.FormEvent<HTMLFormElement>,
    amount: number,
    difficulty: "easy" | "medium" | "hard"
  ): Promise<void> => {
    e.preventDefault();
    setTotalQuestions(amount);
    setLoading(true);
    setGameOver(false);
    const newQuestions: QuestionState[] = await fetchQuizQuestions(
      amount,
      difficulty
    );
    console.log(newQuestions);

    setQuestions(newQuestions);
    setLoading(false);
    setUserAnswers([]);
    setScore(0);
    setNumber(0);
  };

  const checkAnswer = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    const answer: string = e.currentTarget.value;
    const isAnswerCorrect: boolean =
      answer === questions[number].correct_answer;
    if (isAnswerCorrect) {
      e.currentTarget.style.backgroundColor = "green";
      setScore((prev) => prev + 1);
    } else {
      e.currentTarget.style.backgroundColor = "red";
      console.log(e.currentTarget);
    }
    const answerObject: IAnswerObject = {
      question: questions[number].question,
      answer,
      correct: isAnswerCorrect,
      correctAnswer: questions[number].correct_answer,
    };
    setUserAnswers((prev) => [...prev, answerObject]);
  };

  const nextQuestion = () => {
    const nextQuestionNumber: number = number + 1;
    if (nextQuestionNumber === totalQuestions) {
      setGameOver(true);
    } else {
      setNumber(nextQuestionNumber);
    }
  };

  return (
    <div className="App">
      <h1>React Quiz</h1>
      {gameOver || userAnswers.length === totalQuestions ? (
        <QuizForm startTrivia={startTrivia} />
      ) : null}
      {userAnswers.length === totalQuestions && totalQuestions !== 0 ? (
        <p>Score: {score}</p>
      ) : null}
      {loading && <p>Loading Questions...</p>}

      {!gameOver && !loading ? (
        <div>
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={totalQuestions}
            question={questions[number].question}
            answers={questions[number].answer}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
          {!gameOver &&
          !loading &&
          userAnswers.length === number + 1 &&
          number !== totalQuestions - 1 ? (
            <button onClick={nextQuestion}>Next Question</button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default App;
