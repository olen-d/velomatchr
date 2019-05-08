import React from "react"

const Home = () => {
    return(
        <>
            <div class="container">
                <br />
                <br />
                <h1 class="header center orange-text text-darken-2">
                    VeloMatchr
                </h1>
                <div class="row center">
                    <h5 class="header col s12 light">
                        Find the riding buddy of your dreams.
                    </h5>
                </div>
                <div class="row">
                    <div class="col s12 m6 center">
                        <a href="survey" id="survey-button" class="btn-large waves-effect waves-light red accent-4"><i class="fas fa-list-alt"></i> Get Started</a>
                    </div>
                    <div class="col s12 m6">
                        <form id="login">
                        <div class="input-field col s12 m10 l8">
                            <input id="your_email" type="text" class="validate" required />
                            <label for="your_email">Your Email Address (Required)</label>
                        </div>
                        <div class="input-field col s12 m10 l8">
                            <input id="your_password" type="password" class="validate" required />
                            <label for="your_password">Your Password (Required)</label>
                        </div>
                        </form>
                    </div>
                </div>      
            </div>
            <div class="container">
                <div class="section">
                    <div class="row">
                        <div class="col s12 m4">
                            <div class="icon-block">
                                <h2 class="center red-text text-darken-3">
                                    <i class="material-icons">flash_on</i>
                                </h2>
                                <h5 class="center">
                                    Find a riding buddy fast
                                </h5>
                                <p class="light">
                                    Our ten question survey is designed to be filled out in five minutes or less, so you can quickly find a buddy and ride. We refined our survey through rigourous testing to identify questions with the highest information density to save you time while providing the highest quality matches.
                                </p>
                            </div>
                        </div>
                        <div class="col s12 m4">
                            <div class="icon-block">
                                <h2 class="center red-text text-darken-3">
                                    <i class="material-icons">group</i>
                                </h2>
                                <h5 class="center">
                                    Compatibility focused
                                </h5>
                                <p class="light">
                                    No one wants to ride with the person who is always surging when it's their turn at the front of the paceline. Or that person who natters on incessantly about the latest gear. Our proprietary algorithm uses a unique framework to provide you with the most compatible riding buddy.
                                </p>
                            </div>
                        </div>
                        <div class="col s12 m4">
                            <div class="icon-block">
                                <h2 class="center red-text text-darken-3">
                                    <i class="material-icons">settings</i>
                                </h2>
                                <h5 class="center">
                                    Easy to use
                                </h5>
                                <p class="light">
                                    We kept VeloMatchr simple and intuitive so that you can focus on what's important - riding with a buddy. Just click the "Get Started" button, fill out the survey, and get a riding buddy.
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
