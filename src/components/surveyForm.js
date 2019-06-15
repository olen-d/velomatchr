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

class SurveyForm extends Component {
  state = {
    questions,
    likertItems
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
            >
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
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={this.props.colWidth}>
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
          </Grid.Column>
        </Grid.Row>
      </>
    );
  }
}

export default SurveyForm
