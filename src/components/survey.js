import React, { Component } from "react"

import SurveyQuestion from "./surveyquestion"
import LikertItem from "./likertitem"

import questions from "../models/questions.json"
import likertItems from "../models/likertItems.json"

import {
    Container,
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
            <div className="row">
               <div className="col s12">
                   <h4 className="header orange-text text-darken-2">Survey Questions</h4>
               </div>
            </div>
            <div className="row">
                <div className="col 12">
                    <h5 className="orange-text text-darken-2">
                        About Yourself
                    </h5>
               </div>
           </div>
           <form id="survey">
           <div className="row">
                <div className="input-field col s12 l6">
                    <input placeholder="Frederick" id="first_name" type="text" className="validate" required />
                    <label for="first_name">Your First Name (Required)</label>
                </div>
                <div className="input-field col s12 l6">
                    <input placeholder="Rosenstein" id="last_name" type="text" className="validate" required />
                    <label for="last_name">Your Last Name (Required)</label>
                </div>
           </div>
            <div className="row">
                <div className="input-field col s12 l6">
                    <input placeholder="someone@example.com" id="email" type="email" className="validate" required />
                    <label for="email">Your Email Address (Required)</label>
                </div>
                <div className="input-field col s12 l6">
                    <input placeholder="404.867.5309" id="phone" type="tel" />
                    <label for="phone">Your Phone Number (Optional)</label>
                </div>                       
            </div>
            <div className="row">
                <div className="input-field col s12 l6">
                    <input placeholder="http://www.example.com/selfie.jpg" id="your_photo" type="text" className="validate" required />
                    <label for="your_photo">Link to Your Photo (Required)</label>
                </div>   
                <div className="input-field col s8 m5 l4">
                    <select id="gender">
                        <option value="" disabled selected>Select Your Gender</option>
                        <option value="F">Female</option>
                        <option value="M">Male</option>
                        <option value="NB">Non-binary</option>
                        <option value="NS">Prefer not to say</option>
                    </select>
                    {/* <!-- <label>Materialize Select</label> --> */}
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
                        id={question.id}
                        number={question.number}
                        text={question.text}
                    >
                        {this.state.likertItems.map(likertItem => (
                            <LikertItem 
                                id={likertItem.id}
                                number={likertItem.number}
                                text={likertItem.text}
                            />
                        ))}  
                    </SurveyQuestion>
                ))}
            </div>

            <div className="row">
                <div className="input-field col s8 m5 l4">
                    <select id="sl10">
                        <option value="" disabled selected>Select an Option</option>
                        <option value="1">1 (Strongly Disagree)</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5 (Strongly Agree)</option>
                    </select>
                </div>                   
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
