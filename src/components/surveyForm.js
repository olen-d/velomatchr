import React, { useContext, useEffect, useState } from "react";

import auth from "./auth";

import SurveyQuestion from "./surveyquestion";
import LikertItem from "./likertitem";

import questions from "../models/questions.json";
import likertItems from "../models/likertItems.json";

import {
  Button,
  Form,
  Grid,
  Header,
} from "semantic-ui-react"

import { AuthContext } from "../context/authContext";

// Add the selectedVal attribute to the questions so we can keep track of which answer is selected in the state
questions.forEach(i => {
  i["selectedVal"] = null;
});

const SurveyForm = props => {
  const [userId, setUserId] = useState(null);
  const [answers, SetAnswers] = useState(questions);

  const context = useContext(AuthContext);
  const token = context.authTokens;

  const userInfo = auth.getUserInfo(token);

  const setAnswerState = e => {
    const updatedAnswer = answers.map(answer => answer.id === parseInt(e.target.name) ? {...answer, ...{selectedVal: parseInt(e.target.value)}} : answer)
    SetAnswers(updatedAnswer);
  }

  const postSurveyAnswers = () => {

    const entries = answers;
    const formData = {userId: userId};

    entries.forEach(entry => {
      formData[entry.id] = entry.selectedVal;
    });

    fetch(`${process.env.REACT_APP_API_URL}/api/survey/submit`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      console.log("survyForm.js - 57 - DATA:\n", data);
      const { id, userId, answers } = data;
      // Get the other answers...
      fetch(`${process.env.REACT_APP_API_URL}/api/survey/except/${userId}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok. Unable to fetch. ");
        }
      })
      .then(json => {
        console.log("surveyForm.js - 69 - JSON:\n",json);
        // this.loading = false;
        // this.profile = json.profile;
      })
      .catch(err => {
        // [state].loading = false;
        // [state].error = err.toString();
      });
      // Run the matching algorithm...
      // Redirect to the matches page
    }).catch(error => {
      return ({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  }

  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user])

  return(
    <>
      <Grid.Row>
        <Grid.Column width={props.colWidth}>
          <Header
            as="h2"
            color="orange"
          >
            {props.formTitle}
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={props.colWidth}>
          <p>
            {props.formInstructions}
          </p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={props.colWidth}>
          <Form
            size="large"
          >
            {questions.map(question => (
              <SurveyQuestion
                key={question.id}
                id={question.id}
                number={question.number}
                text={question.text}
                onChange={setAnswerState.bind(this)}
              >
              {likertItems.map(likertItem => (
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
              className="fluid"
              type="button"
              color="red"
              size="large"
              icon="check circle"
              labelPosition="left"
              content={props.submitContent}
              onClick={postSurveyAnswers}
            >
            </Button>
          </Form>
        </Grid.Column>
      </Grid.Row>
    </>
  );
}

export default SurveyForm
