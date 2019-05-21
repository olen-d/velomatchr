import React from "react"
import {
    Button,
    Form,
    Grid, 
    Header,
    Message,
    Segment
} from "semantic-ui-react"

export default () => (
    <Grid centered columns={1}>
        <Grid.Column>
            <Header 
                as="h2" 
                textAlign="center"
                color="grey"
            >
                Sign In
            </Header>
            <Segment>
                <Form size="large">
                    <Form.Input
                        fluid
                        icon="user"
                        iconPosition="left"
                        placeholder="Your Email Address"
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
                        Sign In
                    </Button>
                </Form>
            </Segment>
            <Message>
                <p>
                    Don't have an account yet?
                </p>
                <a href="survey">
                    <Button
                        color="red"
                        size="large"
                        content="Get Started"
                        icon="list alternate"
                        labelPosition="left"
                    >
                    </Button>
                </a>
            </Message>
        </Grid.Column>
    </Grid>
);
