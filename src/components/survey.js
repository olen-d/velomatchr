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

class Survey extends Component {
    state = {
        questions,
        likertItems
    }


    render () {
        return(
            <Container>
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Header 
                                as="h1"
                                color="orange"
                            >
                                Survey Questions
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Header 
                                as="h2"
                                color="orange"
                            >
                                About Yourself
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Form>

                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>


            <form id="survey">
            <div className="row">
                    <div className="input-field col s12 l6">
                        <input placeholder="Frederick" id="first_name" type="text" className="validate" required />
                        <label htmlFor="first_name">Your First Name (Required)</label>
                    </div>
                    <div className="input-field col s12 l6">
                        <input placeholder="Rosenstein" id="last_name" type="text" className="validate" required />
                        <label htmlFor="last_name">Your Last Name (Required)</label>
                    </div>
            </div>
                <div className="row">
                    <div className="input-field col s12 l6">
                        <input placeholder="someone@example.com" id="email" type="email" className="validate" required />
                        <label htmlFor="email">Your Email Address (Required)</label>
                    </div>
                    <div className="input-field col s12 l6">
                        <input placeholder="404.867.5309" id="phone" type="tel" />
                        <label htmlFor="phone">Your Phone Number (Optional)</label>
                    </div>                       
                </div>
                <div className="row">
                    <div className="input-field col s12 l6">
                        <input placeholder="http://www.example.com/selfie.jpg" id="your_photo" type="text" className="validate" required />
                        <label htmlFor="your_photo">Link to Your Photo (Required)</label>
                    </div>   
                    <div className="input-field col s8 m5 l4">
                        <select id="gender" defaultValue={"default"}>
                            <option value="default" disabled>Select Your Gender</option>
                            <option value="F">Female</option>
                            <option value="M">Male</option>
                            <option value="NB">Non-binary</option>
                            <option value="NS">Prefer not to say</option>
                        </select>
                    </div>                                    
                </div>
                <div className="row">
                    <div className="col s12">
                        <h5 className="orange-text text-darken-2">
                            Your Cycling Preferences
                        </h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m6">
                        <p>
                            Rate the following statements on a scale of one to five, with one indicating you strongly disagree, three indicating neither agreement or disagreement, and five indicating strong agreement.
                        </p>
                    </div>
                </div>
                <div className="row">
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
                <div className="row center">
                    <button type="submit" 
                        value="submit" 
                        id="survey-btn" 
                        className="btn-large waves-effect waves-light red accent-4"
                        >   
                        <i className="fas fa-check-circle"></i> Find My Buddy
                    </button>
                </div>
            </form>
            </Container>
        );
    }
}
    
export default Survey;
