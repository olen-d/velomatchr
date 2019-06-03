import React, { Component } from "react"

import { 
    Link 
  } from "react-router-dom";

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
                            placeholder="Your First Name"
                        />
                        <Form.Input
                            fluid
                            icon="user"
                            iconPosition="left"
                            placeholder="Your Last Name"
                        />
                        <Form.Input
                            fluid
                            icon="envelope"
                            iconPosition="left"
                            placeholder="Your Email Address"
                            type="email"
                        />
                        <Form.Input
                            fluid
                            icon="phone"
                            iconPosition="left"
                            placeholder="Your Telephone Number"
                            type="tel"
                        />
                        <Form.Input
                            fluid
                            icon="image"
                            iconPosition="left"
                            placeholder="Your Photograph"
                        />
                        <Form.Input
                            fluid
                            icon="lock"
                            iconPosition="left"
                            placeholder="Your Password"
                            type="password"
                        />
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

/*
<div className="input-field col s8 m5 l4">
    <select id="gender" defaultValue={"default"}>
        <option value="default" disabled>Select Your Gender</option>
        <option value="F">Female</option>
        <option value="M">Male</option>
        <option value="NB">Non-binary</option>
        <option value="NS">Prefer not to say</option>
    </select>
</div>                                    
*/
