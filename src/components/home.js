import React from "react"
import {
    Grid,
    Header,
    Icon
 } from "semantic-ui-react"

import LoginForm from "./loginForm";

const Headers = () => (
    <>
        <Header as="h1"></Header>
        <Header as="h2"></Header>
        <Header as="h3"></Header>
    </>
)

export {
    Headers
};

const Home = () => {
    let ctrTxt = {"text-align": "center"}

    return(
        <div>
            <div className="ui grid">
                <div className="sixteen wide center aligned column">
                    <h1 className="ui header orange">
                        VeloMatchr
                    </h1>
                    <h2 className="ui header grey">
                        Find the riding buddy of your dreams.
                    </h2>
                </div>
            </div>
            <div className="ui two column stackable grid container">
                <div className="column">
                    &nbsp;
                </div>
                <LoginForm />
            </div>          
            <div className="ui three column stackable grid container">
                <div className="column">
                    <h1 className="ui header red" style={ctrTxt}>
                        <i className="bolt icon"></i>
                    </h1>
                    <h3 className="ui header grey" style={ctrTxt}>
                        Find a riding buddy fast
                    </h3>
                    <p className="light">
                        Our ten question survey is designed to be filled out in five minutes or less, so you can quickly find a buddy and ride. We refined our survey through rigourous testing to identify questions with the highest information density to save you time while providing the highest quality matches.
                    </p>
                </div>
                <div className="column">
                    <h1 className="ui header red" style={ctrTxt}>
                        <i className="users icon"></i>
                    </h1>
                    <h3 className="ui header grey" style={ctrTxt}>
                        Compatibility focused
                    </h3>
                    <p className="light">
                        No one wants to ride with the person who is always surging when it's their turn at the front of the paceline. Or that person who natters on incessantly about the latest gear. Our proprietary algorithm uses a unique framework to provide you with the most compatible riding buddy.
                    </p>
                </div>
                <div className="column">
                    <h1 className="ui header red" style={ctrTxt}>
                        <i className="setting icon"></i>
                    </h1>
                    <h3 className="ui header grey" style={ctrTxt}>
                        Easy to use
                    </h3>
                    <p className="light">
                        We kept VeloMatchr simple and intuitive so that you can focus on what's important - riding with a buddy. Just click the "Get Started" button, fill out the survey, and get matched with a riding buddy.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;
