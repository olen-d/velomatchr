import React from "react"

import {
  Container,
  Grid,
  Header
 } from "semantic-ui-react"

import SignupRequiredForm from "../components/signupRequiredForm";

const Home = () => {
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
          {/* <p>Status: {this.state.data}</p> */}
        </Grid.Column>
      </Grid>
      <Grid stackable>
        <SignupRequiredForm
          colWidth="6"
          formTitle="Sign Up Today"
        />
      </Grid>          
      <Grid stackable columns="equal">
        <Grid.Column>
          <Header
            as="h1" 
            textAlign="center"
            color="red"
          >
            <i className="bolt icon"></i>
          </Header>
          <Header
            as="h3"
            textAlign="center"
            color="grey" className="ui header grey"
          >
            Find a riding buddy fast
          </Header>
          <p className="light">
            Our ten question survey is designed to be filled out in five minutes or less, so you can quickly find a buddy and ride. We refined our survey through rigourous testing to identify questions with the highest information density to save you time while providing the highest quality matches.
          </p>
        </Grid.Column>
        <Grid.Column>
          <Header
            as="h1" 
            textAlign="center"
            color="red"
          >
            <i className="users icon"></i>
          </Header>
          <Header
            as="h3"
            textAlign="center"
            color="grey" className="ui header grey"
          >
            Compatibility focused
          </Header>
          <p className="light">
            No one wants to ride with the person who is always surging when it's their turn at the front of the paceline. Or that person who natters on incessantly about the latest gear. Our proprietary algorithm uses a unique framework to provide you with the most compatible riding buddy.
          </p>
        </Grid.Column>
        <Grid.Column>
          <Header
            as="h1" 
            textAlign="center"
            color="red"
          >
            <i className="setting icon"></i>
          </Header>
          <Header
            as="h3"
            textAlign="center"
            color="grey" className="ui header grey"
          >
            Easy to use
          </Header>
          <p className="light">
            We kept VeloMatchr simple and intuitive so that you can focus on what's important - riding with a buddy. Just click the "Get Started" button, fill out the survey, and get matched with a riding buddy.
          </p>
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default Home;
