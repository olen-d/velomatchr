import React from "react"

import {
  Container,
  Grid,
  Icon,
  List
} from "semantic-ui-react"

import "./footer.css"

const Footer = () => {
  let dark = {
    "marginTop": "6rem",
    "paddingTop": "4rem",
    "backgroundColor": "#2c2c2c",
    "color": "#fff"
  }

  return(
    <footer style={dark}>
      <Container>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={8}>
              <h3>
                About
              </h3>
              <p>
                When we aren't on our bicycles, we build web applications that make life easier for cyclists, so they can get out and ride more.
              </p>
            </Grid.Column>
            <Grid.Column width={4}>
              <h3>
                Made With
              </h3>
              <ul className="madeWithList">
                <li><a href="https://fontawesome.com/"><i className="fab fa-font-awesome-flag"></i> Font Awesome</a></li>
                <li><a href="https://react.semantic-ui.com/"><i class="fas fa-grip-horizontal"></i> Semantic UI React</a></li>
                <li><a href="https://reactjs.org/"><i class="fab fa-react"></i> React</a></li>
                <li><a href="https://nodejs.org/"><i class="fab fa-node-js"></i> Node</a></li>
                <li><a href="https://www.mysql.com/"><i class="fas fa-database"></i> MySql</a></li>
              </ul>
            </Grid.Column>
            <Grid.Column width={4}>
              <h3>
                Socialize
              </h3>
              <ul className="socializeList">
                <li><a href="#!"><i className="fab fa-facebook-f"></i> Facebook</a></li>
                <li><a href="https://github.com/olen-d/velomatchr"><i className="fab fa-github"></i> Github</a></li>
                <li><a href="#!"><i className="fab fa-instagram"></i> Instagram</a></li>
                <li><a href="#!"><i className="fab fa-twitter"></i> Twitter</a></li>
                <li><a href="#!"><i className="fab fa-youtube"></i> Youtube</a></li>
              </ul>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              Copyright &copy; 2019 <a className="orange-text text-lighten-3" href="http://www.olen.dev/">Olen Daelhousen</a>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </footer>
  );
}

export default Footer
