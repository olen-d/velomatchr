import React, { Component } from "react"

import {
    Container,
    Grid,
    Header,
    Icon
 } from "semantic-ui-react"

import SignupForm from "../components/signupForm";

class Home extends Component {
    state = {
        data: null
    };

    componentDidMount() {
        // Call our fetch function below once the component mounts
      this.callBackendAPI()
        .then(res => this.setState({ data: res.express }))
        .catch(err => console.log(err));
    }
      // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
    callBackendAPI = async () => {
      const response = await fetch('http://localhost:5000/api/express_backend');
      const body = await response.json();
  
      if (response.status !== 200) {
        throw Error(body.message) 
      }
      return body;
    };

    render() {
        let ctrTxt = {"textAlign": "center"};   // TODO: Fix this to use Header as... syntax
        return(
            <Container>
                <Grid>
                    <Grid.Column width={16} >
                        <Header
                            as="h1" 
                            textAlign="center"
                            color="orange"
                        >
                            VeloMatchr
                        </Header>
                        <Header
                            as="h2"
                            textAlign="center" 
                            color="grey"
                        >
                            Find the riding buddy of your dreams.
                        </Header>
                        <p>Status: {this.state.data}</p>
                    </Grid.Column>
                </Grid>
                <Grid stackable>
                    <SignupForm
                        colWidth="6"
                        formTitle="Sign Up Today"
                    />
                </Grid>          
                <Grid stackable columns="equal">
                    <Grid.Column>
                        <h1 className="ui header red" style={ctrTxt}>
                            <i className="bolt icon"></i>
                        </h1>
                        <h3 className="ui header grey" style={ctrTxt}>
                            Find a riding buddy fast
                        </h3>
                        <p className="light">
                            Our ten question survey is designed to be filled out in five minutes or less, so you can quickly find a buddy and ride. We refined our survey through rigourous testing to identify questions with the highest information density to save you time while providing the highest quality matches.
                        </p>
                    </Grid.Column>
                    <Grid.Column>
                        <h1 className="ui header red" style={ctrTxt}>
                            <i className="users icon"></i>
                        </h1>
                        <h3 className="ui header grey" style={ctrTxt}>
                            Compatibility focused
                        </h3>
                        <p className="light">
                            No one wants to ride with the person who is always surging when it's their turn at the front of the paceline. Or that person who natters on incessantly about the latest gear. Our proprietary algorithm uses a unique framework to provide you with the most compatible riding buddy.
                        </p>
                    </Grid.Column>
                    <Grid.Column>
                        <h1 className="ui header red" style={ctrTxt}>
                            <i className="setting icon"></i>
                        </h1>
                        <h3 className="ui header grey" style={ctrTxt}>
                            Easy to use
                        </h3>
                        <p className="light">
                            We kept VeloMatchr simple and intuitive so that you can focus on what's important - riding with a buddy. Just click the "Get Started" button, fill out the survey, and get matched with a riding buddy.
                        </p>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
    
}

export default Home;
