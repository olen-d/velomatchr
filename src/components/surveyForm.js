import React, { Component } from "react"

import auth from "./auth";

import SurveyQuestion from "./surveyquestion"
import LikertItem from "./likertitem"

import questions from "../models/questions.json"
import likertItems from "../models/likertItems.json"

import {
  Button,
  Form,
  Grid,
  Header,
} from "semantic-ui-react"

// Add the selectedVal attribute to the questions so we can keep track of which answer is selected in the state
questions.forEach(i => {
  i["selectedVal"] = null;
});

class SurveyForm extends Component {
  state = {
    questions,
    likertItems,
    userId: ""
  }

  componentDidMount() {
    const token = auth.getToken();
    const userInfo = auth.getUserInfo(token);
    if (userInfo) {
      this.setState({userId: userInfo.userId}); 
    }   
  }

  setAnswerState = e => {
    const questions = this.state.questions.map(question => question.id === parseInt(e.target.name) ? {...question, ...{selectedVal: parseInt(e.target.value)}} : question)
    this.setState({questions : questions});
  }

  onSubmit = e => {
    e.preventDefault();

    const entries = this.state.questions;
    const formData = {userId: this.state.userId};

    entries.forEach(entry => {
      formData[entry.id] = entry.selectedVal;
    });

    fetch("http://localhost:5000/api/survey/submit", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      console.log("Doritos\n", data);
    }).catch(error => {
      return ({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  }

  render() {
    return(
      <>
        <Grid.Row>
          <Grid.Column width={this.props.colWidth}>
            <Header
              as="h2"
              color="orange"
            >
              {this.props.formTitle}
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={this.props.colWidth}>
            <p>
              {this.props.formInstructions}
            </p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={this.props.colWidth}>
            <Form
              size="large"
              onSubmit={this.onSubmit}
            >
              {this.state.questions.map(question => (
                <SurveyQuestion
                  key={question.id}
                  id={question.id}
                  number={question.number}
                  text={question.text}
                  onChange={this.setAnswerState.bind(this)}
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
              <Button
                fluid
                type="submit"
                color="red"
                size="large"
                icon="check circle"
                labelPosition="left"
                content={this.props.submitContent}
              >
              </Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </>
    );
  }
}

export default SurveyForm
