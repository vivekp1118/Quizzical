import React from "react";

export default function Quiz(props) {
    const options = props.selectedAnswerArray.map(item => (
        <span
            className={props.isAnswerChecked && props.correct_answer == item ? "right-answer" :
                       props.isAnswerChecked && props.isAnswerd == item ? "wrong-answer" : 
                       props.isAnswerd == item ? "active" : "inactive"}
            data-answers={item}
        >
            {item}
        </span>
    ))
    return (
        <>
            <div className="quiz-question-answer">
                <p className="questions">{props.question}</p>
                <p className="options" id={props.id} onClick={props.selectOption}>
                    {options}
                    {props.isAnswerChecked && props.correct_answer === props.isAnswerd && <p className="logo right"><i class="fa-solid fa-circle-check"></i></p>}
                    {props.isAnswerChecked && props.correct_answer !== props.isAnswerd && <p className="logo wrong"><i class="fa-solid fa-circle-xmark"></i></p>}
                </p>
            </div>
        </>
    )
}