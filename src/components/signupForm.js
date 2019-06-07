import React, { Component } from "react"

import { 
    Link 
} from "react-router-dom";

import GenderChoices from "./genderchoices"
import genderChoices from "../models/genderChoices"

import {
    Button,
    Form,
    Grid, 
    Header,
    Message,
    Segment
} from "semantic-ui-react"

class SignupForm extends Component {
    state = {
        genderChoices
    }

    render() {
        return(
            <Grid.Column width={this.props.colWidth}>
                <Header 
                    as="h2" 
                    textAlign="center"
                    color="grey"
                >
                    {this.props.formTitle}
                </Header>
                <Segment>
                    <Form size="large">
                        <Form.Input
                            fluid
                            icon="user"
                            iconPosition="left"
                            placeholder="First Name"
                        />
                        <Form.Input
                            fluid
                            icon="user"
                            iconPosition="left"
                            placeholder="Last Name"
                        />
                        <Form.Input
                            fluid
                            icon="envelope"
                            iconPosition="left"
                            placeholder="Email Address"
                            type="email"
                        />
                        <Form.Input
                            fluid
                            icon="phone"
                            iconPosition="left"
                            placeholder="Telephone Number"
                            type="tel"
                        />
                        <Form.Input
                            fluid
                            icon="image"
                            iconPosition="left"
                            placeholder="Profile Photograph"
                        />
                        <Form.Input
                            fluid
                            icon="lock"
                            iconPosition="left"
                            placeholder="Password"
                            type="password"
                        />
                        <Form.Input
                            fluid
                            control="select"
                            defaultValue="default"
                        >  
                            <option
                                key="-1"
                                value="default"
                                disabled
                            >
                                Select Your Gender
                            </option>
                            {this.state.genderChoices.map(genderChoice => (
                                <GenderChoices 
                                    key={genderChoice.id}
                                    value={genderChoice.value}
                                    text={genderChoice.text}
                                />
                            ))}
                        </Form.Input>
                        <Button 
                            color="red"
                            fluid
                            size="large"
                        >
                            Sign Up
                        </Button>
                    </Form>
                </Segment>
            </Grid.Column>
        );
    }
}

export default SignupForm;
