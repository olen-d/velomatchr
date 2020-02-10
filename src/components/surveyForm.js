import React, { useEffect, useState } from "react";

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

import { useAuth } from "../context/authContext";
// Important TODO: Check to make sure the user has match preferences and set them prior to running the survey! Maybe use a modal...
// Add the selectedVal attribute to the questions so we can keep track of which answer is selected in the state
questions.forEach(i => {
  i["selectedVal"] = null;
});

const SurveyForm = props => {
  const {
    colWidth,
    formTitle,
    formInstructions,
    submitBtnContent,
    submitRedirect,
    submitRedirectURL
  } = props;

  const [userId, setUserId] = useState(null);
  const [answers, SetAnswers] = useState(questions);

  const { authTokens, setDoRedirect, setRedirectURL } = useAuth();

  const userInfo = auth.getUserInfo(authTokens);

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
      // Hit the API route to calculate matches...
      fetch(`${process.env.REACT_APP_API_URL}/api/matches/calculate`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
      }).then(response => {
        return response.json();
      }).then(data => {
        if(data && submitRedirect) {
          setRedirectURL(submitRedirectURL);
          setDoRedirect(true);
        }
      }).catch(err => {
        console.log("AuthApp.js ~ 70 Error:\n", err);
        // Do something about the err
      });
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
        <Grid.Column width={colWidth}>
          <Header
            as="h2"
            color="orange"
          >
            {formTitle}
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={colWidth}>
          <p>
            {formInstructions}
          </p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={colWidth}>
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
              content={submitBtnContent}
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
