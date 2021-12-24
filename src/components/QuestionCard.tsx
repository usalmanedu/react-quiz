interface IQuestionCard {
  question: string;
  answers: string[];
  callback: any;
  userAnswer: boolean;
  questionNr: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<IQuestionCard> = ({
  question,
  answers,
  callback,
  userAnswer,
  questionNr,
  totalQuestions,
}) => (
  <>
    <p>
      Question: {questionNr} / {totalQuestions}
    </p>
    <p dangerouslySetInnerHTML={{ __html: question }} />
    <div>
      {answers.map((answer) => {
        <div>
          <button disabled={userAnswer} onClick={callback}>
            <span dangerouslySetInnerHTML={{ __html: answer }} />
          </button>
        </div>;
      })}
    </div>
  </>
);

export default QuestionCard;