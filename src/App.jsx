import React from "react";
import Quiz from "./Quiz";
import { nanoid } from "nanoid";
import { decode } from "html-entities";

let checkQuizCompleted = false

export default function App() {

    const [startQuiz, setStartQuiz] = React.useState(false)
    const [formData, setFormData] = React.useState({
        category: 9,
        difficulty: "easy",
        numOfQuestions: 10,
        type: ""
    })
    const [quizArray, setQuizArray] = React.useState([])
    const [selectedAnswerArray, setSelectedAnswerArray] = React.useState([])
    const [totalScore, setTotalScore] = React.useState({ isScoreChecked: false, totalScore: 0 })
    console.log(formData)
    console.log(quizArray)
    React.useEffect(() => {
        if (startQuiz) {
            const { category, difficulty, numOfQuestions,type} = formData
            fetch(`https://opentdb.com/api.php?amount=${numOfQuestions}&category=${category}&difficulty=${difficulty}&type=${type}`)
                .then(res => res.json())
                .then(data => {
                    const quizData = data.results.map(item => {
                        const answersArray = [...item.incorrect_answers, item.correct_answer]
                        return {
                            question: decode(item.question),
                            incorrect_answers: item.incorrect_answers,
                            correct_answer: decode(item.correct_answer),
                            selectedAnswerArray: suffleArray(answersArray)
                        }
                    })

                    setQuizArray(quizData)

                    setSelectedAnswerArray(Array(numOfQuestions).fill(0).map(item => {
                        return {
                            id: nanoid(),
                            answer: ""
                        }
                    }))

                })
        }
    }, [startQuiz])

    // Checks if all answers are selected or Not
    checkQuizCompleted = selectedAnswerArray.every(item => item.answer)

    function handleChange(e) {
        const { name, value } = e.target
        if (name === "numOfQuestions") {
            setFormData(prevItem => ({ ...prevItem, [name]: parseInt(value) }))
        } else {
            setFormData(prevItem => ({ ...prevItem, [name]: value }))
        }
    }

    function suffleArray(arr) {
        for (let i = 0; i < arr.length; i++) {
            let j = Math.floor(Math.random() * arr.length)
            let temp = decode(arr[i])
            arr[i] = decode(arr[j])
            arr[j] = temp
        }
        return arr
    }

    function selectOption(e, id) {
        console.log(checkQuizCompleted)
        if (!totalScore.isScoreChecked) {
            const selectedAnswer = e.target.dataset.answers
            if (selectedAnswer) {
                setSelectedAnswerArray(prevItem => prevItem.map(item => (
                    item.id === id ? { ...item, answer: selectedAnswer } : item
                )))
            }
        }
    }
    function checkAnswer(selectedAnswerArray, quizArray) {
        if (!totalScore.isScoreChecked) {
            let total = 0
            for (let i = 0; i < selectedAnswerArray.length; i++) {
                if (selectedAnswerArray[i].answer === quizArray[i].correct_answer) {
                    total++
                }
            }
            setTotalScore(item => ({ ...item, isScoreChecked: true, totalScore: total }))
        }
        else {
            setStartQuiz(false)
            setFormData({
                category: 9,
                difficulty: "easy"
            })
            setQuizArray([])
            setSelectedAnswerArray([])
            setTotalScore({ isScoreChecked: false, totalScore: 0 })
        }
    }
    const quizEelements = quizArray.map((item, index) => {
        const { id, answer } = selectedAnswerArray[index]
        return <Quiz
            correct_answer={totalScore.isScoreChecked ? quizArray[index].correct_answer : ""}
            isAnswerChecked={totalScore.isScoreChecked}
            key={id}
            id={id}
            isAnswerd={answer}
            selectOption={(e) => selectOption(e, id)}
            {...item}
        />
    })

    return (
        <main className="container">
            {
                !startQuiz ?
                    <>
                        <h1> Quzzical</h1>
                        <p>Test your knowledge with our fun quiz!</p>
                        <form>
                            <label htmlFor="category">Select Category</label>
                            <select
                                name="category"
                                id="category"
                                className="form-control"
                                onChange={handleChange}
                                value={formData.category}>
                                <option value="9">General Knowledge</option>
                                <option value="10">Entertainment: Books</option>
                                <option value="11">Entertainment: Film</option>
                                <option value="12">Entertainment: Music</option>
                                <option value="13">Entertainment: Musicals & Theatres</option>
                                <option value="14">Entertainment: Television</option>
                                <option value="15">Entertainment: Video Games</option>
                                <option value="16">Entertainment: Board Games</option>
                                <option value="17">Science & Nature</option>
                                <option value="18">Science: Computers</option>
                                <option value="19">Science: Mathematics</option>
                                <option value="20">Mythology</option>
                                <option value="21">Sports</option>
                                <option value="22">Geography</option>
                                <option value="23">History</option>
                                <option value="24">Politics</option>
                                <option value="25">Art</option>
                                <option value="26">Celebrities</option>
                                <option value="27">Animals</option>
                                <option value="28">Vehicles</option>
                                <option value="29">Entertainment: Comics</option>
                                <option value="30">Science: Gadgets</option>
                                <option value="31">Entertainment: Japanese Anime & Manga</option>
                                <option value="32">Entertainment: Cartoon & Animations</option>
                            </select>

                            <label htmlFor="difficulty">Select Difficulty</label>
                            <select
                                name="difficulty"
                                class="form-control"
                                value={formData.difficulty}
                                onChange={handleChange}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>

                            <label htmlFor="numOfQuestions">Questions</label>
                            <select
                                name="numOfQuestions"
                                class="form-control"
                                value={formData.numOfQuestions}
                                onChange={handleChange}>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="25">25</option>
                            </select>

                            <label htmlFor="questions">Type of Questions</label>
                            <div className="questions--type--container">

                                <label
                                    htmlFor="any"
                                    className={`questions--type ${formData.type === "" ? "right-answer" : ""}`}>
                                    Any Type
                                </label>
                                <input type="radio"
                                    name="type"
                                    id="any"
                                    value=""
                                    className="hidden--radio--qestionsType"
                                    onChange={handleChange}
                                    checked={formData.type === ""}
                                />

                                <label
                                    htmlFor="boolean"
                                    className={`questions--type ${formData.type === "boolean" ? "right-answer" : ""}`}>
                                    True / False
                                </label>
                                <input type="radio"
                                    name="type"
                                    id="boolean"
                                    value="boolean"
                                    className="hidden--radio--qestionsType"
                                    onChange={handleChange}
                                    checked={formData.type === "boolean"}
                                />

                                <label
                                    htmlFor="multiple"
                                    className={`questions--type ${formData.type === "multiple" ? "right-answer" : ""}`}>
                                    Multiple
                                </label>
                                <input type="radio"
                                    name="type"
                                    id="multiple"
                                    className="hidden--radio--qestionsType"
                                    value="multiple"
                                    onChange={handleChange}
                                    checked={formData.type === "multiple"}
                                />
                            </div>
                        </form>
                        <button
                            type="button"
                            className="btn-start-quiz"
                            onClick={() => setStartQuiz(true)}
                        >
                            Take Quiz
                        </button>
                    </>
                    :
                    <div className="quiz-container">
                        {quizEelements}
                        <div className="score-container">
                            {totalScore.isScoreChecked && <span className="answer-text">{`You Scored ${totalScore.totalScore}/${formData.numOfQuestions} Correct Answer`}</span>}
                            <button
                                type="button"
                                className="btn-check-answer"
                                disabled={!checkQuizCompleted}
                                style={{ backgroundColor: (checkQuizCompleted) ? "#4D5B9E" : "#a8b6ff" }}
                                onClick={() => checkAnswer(selectedAnswerArray, quizArray)}
                            >{!totalScore.isScoreChecked ? "Check Score" : "Restart Quiz"}</button>
                        </div>
                    </div>
            }
        </main>
    )
}