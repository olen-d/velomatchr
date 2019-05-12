import React from "react"

const Home = () => {
    return(
        <>
            <div className="container">
                <br />
                <br />
                <h1 className="header center orange-text text-darken-2">
                    VeloMatchr
                </h1>
                <div className="row center">
                    <h5 className="header col s12 light">
                        Find the riding buddy of your dreams.
                    </h5>
                </div>
                <div className="row">
                    <div className="col s12 m6 center">
                        <a href="survey" id="survey-button" className="btn-large waves-effect waves-light red accent-4"><i className="fas fa-list-alt"></i> Get Started</a>
                    </div>
                    <div className="col s12 m6">
                        <form id="login">
                        <div className="input-field col s12 m10 l8">
                            <input id="your_email" type="text" className="validate" required />
                            <label for="your_email">Your Email Address (Required)</label>
                        </div>
                        <div className="input-field col s12 m10 l8">
                            <input id="your_password" type="password" className="validate" required />
                            <label for="your_password">Your Password (Required)</label>
                        </div>
                        </form>
                    </div>
                </div>      
            </div>
            <div className="container">
                <div className="section">
                    <div className="row">
                        <div className="col s12 m4">
                            <div className="icon-block">
                                <h2 className="center red-text text-darken-3">
                                    <i className="material-icons">flash_on</i>
                                </h2>
                                <h5 className="center">
                                    Find a riding buddy fast
                                </h5>
                                <p className="light">
                                    Our ten question survey is designed to be filled out in five minutes or less, so you can quickly find a buddy and ride. We refined our survey through rigourous testing to identify questions with the highest information density to save you time while providing the highest quality matches.
                                </p>
                            </div>
                        </div>
                        <div className="col s12 m4">
                            <div className="icon-block">
                                <h2 className="center red-text text-darken-3">
                                    <i className="material-icons">group</i>
                                </h2>
                                <h5 className="center">
                                    Compatibility focused
                                </h5>
                                <p className="light">
                                    No one wants to ride with the person who is always surging when it's their turn at the front of the paceline. Or that person who natters on incessantly about the latest gear. Our proprietary algorithm uses a unique framework to provide you with the most compatible riding buddy.
                                </p>
                            </div>
                        </div>
                        <div className="col s12 m4">
                            <div className="icon-block">
                                <h2 className="center red-text text-darken-3">
                                    <i className="material-icons">settings</i>
                                </h2>
                                <h5 className="center">
                                    Easy to use
                                </h5>
                                <p className="light">
                                    We kept VeloMatchr simple and intuitive so that you can focus on what's important - riding with a buddy. Just click the "Get Started" button, fill out the survey, and get matched with a riding buddy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <br />
            </div>
        </>
    );
}

export default Home;
