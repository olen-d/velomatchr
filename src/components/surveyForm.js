import React, { Component } from "react"

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
  // this.onSubmit = this.onSubmit.bind(this);
  state = {
    questions,
    likertItems,
  }

  setAnswerState = e => {
    const questions = this.state.questions.map(question => question.id === parseInt(e.target.name) ? {...question, ...{selectedVal: parseInt(e.target.value)}} : question)
    this.setState({questions : questions});
  }

  onSubmit = e => {
    e.preventDefault();
      console.log("xyzzy");
    const entries = this.state.questions;
    const formData = new FormData();

    entries.forEach(entry => {
      console.log(entry.id,entry.selectedVal);
      formData.append(entry.id, entry.selectedVal);
    });
    for (const key of formData.entries()) {
      console.log(key[0] + " " + key[1])
    }
    

    // fetch("http://localhost:5000/api/signup", {
    //   method: "post",
    //   body: formData
    // }).then(response => {
    //   return response.json();
    // }).then(data => {
    //   console.log("Ninjas", data);
    // });
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
