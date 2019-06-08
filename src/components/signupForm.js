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
    constructor(props) {
        super(props);
        this.state = {
            genderChoices,
            firstName: "",
            lastName: "",
            emailAddress: "",
            telephoneNumber: "",
            password: "",
            gender: "default"
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name] : e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault();

        const {
            firstName,
            lastName,
            emailAddress,
            telephoneNumber,
            password,
            gender
        } = this.state;

        fetch("http://localhost:5000/api/signup", {
            method: "post",
            body: JSON.stringify({firstName, lastName, emailAddress, telephoneNumber, password, gender}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log("Ninjas", data);
        });
    }

    render() {
        const {
            firstName,
            lastName,
            emailAddress,
            telephoneNumber,
            password,
            gender
        } = this.state;

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
                    <Form 
                        size="large"
                        onSubmit={this.onSubmit}
                    >
                        <Form.Input
                            fluid
                            icon="user"
                            iconPosition="left"
                            name="firstName"
                            value={firstName}
                            placeholder="First Name"
                            onChange={this.onChange}
                        />
                        <Form.Input
                            fluid
                            icon="user"
                            iconPosition="left"
                            name="lastName"
                            value={lastName}
                            placeholder="Last Name"
                            onChange={this.onChange}
                        />
                        <Form.Input
                            fluid
                            icon="envelope"
                            iconPosition="left"
                            name="emailAddress"
                            value={emailAddress}
                            placeholder="Email Address"
                            type="email"
                            onChange={this.onChange}
                        />
                        <Form.Input
                            fluid
                            icon="phone"
                            iconPosition="left"
                            name="telephoneNumber"
                            value={telephoneNumber}
                            placeholder="Telephone Number"
                            type="tel"
                            onChange={this.onChange}
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
                            name="password"
                            value={password}
                            placeholder="Password"
                            type="password"
                            onChange={this.onChange}
                        />
                        <Form.Input
                            fluid
                            control="select"
                            name="gender"
                            value={gender}
                            onChange={this.onChange}
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
                            type="submit"
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
