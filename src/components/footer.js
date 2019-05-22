import React from "react"

import {
    Container,
    Grid
} from "semantic-ui-react"

const Footer = () => {
    let dark = {
        "margin-top": "6rem",
        "padding-top": "4rem",
        "background-color": "#2c2c2c",
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
                            <ul>
                                <li><a className="white-text" href="http://www.fontawesome.com">Font Awesome</a></li>
                                <li><a className="white-text" href="http://jquery.com">jQuery</a></li>
                                <li><a className="white-text" href="http://materializecss.com">Materialize</a></li>
                            </ul>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <h3>
                                Socialize
                            </h3>
                            <ul>
                                <li><a className="white-text" href="#!"><i className="fab fa-facebook-f"></i> Facebook</a></li>
                                <li><a className="white-text" href="https://github.com/olen-d/velomatchr"><i className="fab fa-github"></i> Github</a></li>
                                <li><a className="white-text" href="#!"><i className="fab fa-instagram"></i> Instagram</a></li>
                                <li><a className="white-text" href="#!"><i className="fab fa-twitter"></i> Twitter</a></li>
                                <li><a className="white-text" href="#!"><i className="fab fa-youtube"></i> Youtube</a></li>
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
