import React, { Component } from "react"

import SurveyQuestion from "./surveyquestion"
import LikertItem from "./likertitem"

import questions from "../models/questions.json"
import likertItems from "../models/likertItems.json"

import {
  Container,
  Form,
  Grid,
  Header,
  Icon
} from "semantic-ui-react"

class SurveyForm extends Component {
  state = {
    questions,
    likertItems
  }

  render() {
    return(
        <div className="surveyForm">
            {this.state.questions.map(question => (
                <SurveyQuestion
                    key={question.id}
                    id={question.id}
                    number={question.number}
                    text={question.text}
                >
                    {this.state.likertItems.map(likertItem => (
                        <LikertItem 
                            key={likertItem.id}
                            id={likertItem.id}
                            number={likertItem.number}
                            text={likertItem.text}
                        />
                    ))}  
                </SurveyQuestion>
            ))}
        </div>
    );
  }
}

export default SurveyForm
