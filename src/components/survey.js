import React from "react"

const Survey = () => {
    return(
        <div className="container">
            <div className="row">
               <div className="col s12">
                   <h4 className="header orange-text text-darken-2">Survey Questions</h4>
               </div>
            </div>
            <div className="row">
                <div className="col 12">
                    <h5 className="orange-text text-darken-2">
                        About Yourself
                    </h5>
               </div>
           </div>
           <form id="survey">
           <div className="row">
                <div className="input-field col s12 l6">
                    <input placeholder="Frederick" id="first_name" type="text" className="validate" required />
                    <label for="first_name">Your First Name (Required)</label>
                </div>
                <div className="input-field col s12 l6">
                    <input placeholder="Rosenstein" id="last_name" type="text" className="validate" required />
                    <label for="last_name">Your Last Name (Required)</label>
                </div>
           </div>
            <div className="row">
                <div className="input-field col s12 l6">
                    <input placeholder="someone@example.com" id="email" type="email" className="validate" required />
                    <label for="email">Your Email Address (Required)</label>
                </div>
                <div className="input-field col s12 l6">
                    <input placeholder="404.867.5309" id="phone" type="tel" />
                    <label for="phone">Your Phone Number (Optional)</label>
                </div>                       
            </div>
            <div className="row">
                <div className="input-field col s12 l6">
                    <input placeholder="http://www.example.com/selfie.jpg" id="your_photo" type="text" className="validate" required />
                    <label for="your_photo">Link to Your Photo (Required)</label>
                </div>   
                <div className="input-field col s8 m5 l4">
                    <select id="gender">
                        <option value="" disabled selected>Select Your Gender</option>
                        <option value="F">Female</option>
                        <option value="M">Male</option>
                        <option value="NB">Non-binary</option>
                        <option value="NS">Prefer not to say</option>
                    </select>
                    {/* <!-- <label>Materialize Select</label> --> */}
                </div>                                    
            </div>
            <div className="row">
                <div className="col s12">
                    <h5 className="orange-text text-darken-2">
                        Your Cycling Preferences
                    </h5>
                </div>
            </div>
            <div className="row">
                <div className="col s12 m6">
                    <p>
                        Rate the following statements on a scale of one to five, with one indicating you strongly disagree, three indicating neither agreement or disagreement, and five indicating strong agreement.
                    </p>
                </div>
            </div>
            <div className="row nbs">
                <div className="col s10">
                    <h6 className="header bold xtra">
                        Statement 1
                    </h6>
                    <p className="grey-text text-darken-2 xtra nbs">
                        Family does not come first, the bike does.
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s8 m5 l4">
                    <select id="sl1">
                        <option value="" disabled selected>Select an Option</option>
                        <option value="1">1 (Strongly Disagree)</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5 (Strongly Agree)</option>
                    </select>
                    {/* <!-- <label>Materialize Select</label> --> */}
                </div>                   
            </div>
            <div className="row nbs">
                <div className="col s10">
                    <h6 className="header bold xtra">
                        Statement 2
                    </h6>
                    <p className="grey-text text-darken-2 xtra nbs">
                        Shorts should be black.
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s8 m5 l4">
                    <select id="sl2">
                        <option value="" disabled selected>Select an Option</option>
                        <option value="1">1 (Strongly Disagree)</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5 (Strongly Agree)</option>
                    </select>
                    {/* <!-- <label>Materialize Select</label> --> */}
                </div>                   
            </div>
            <div className="row nbs">
                <div className="col s10">
                    <h6 className="header bold xtra">
                        Statement 3
                    </h6>
                    <p className="grey-text text-darken-2 xtra nbs">
                        Brakes are death.
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s8 m5 l4">
                    <select id="sl3">
                        <option value="" disabled selected>Select an Option</option>
                        <option value="1">1 (Strongly Disagree)</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5 (Strongly Agree)</option>
                    </select>
                    {/* <!-- <label>Materialize Select</label> --> */}
                </div>                   
            </div>
            <div className="row nbs">
                <div className="col s10">
                    <h6 className="header bold xtra">
                        Statement 4
                    </h6>
                    <p className="grey-text text-darken-2 xtra nbs">
                        Speeds and distances should always be referred to and measured in kilometers.
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s8 m5 l4">
                    <select id="sl4">
                        <option value="" disabled selected>Select an Option</option>
                        <option value="1">1 (Strongly Disagree)</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5 (Strongly Agree)</option>
                    </select>
                    {/* <!-- <label>Materialize Select</label> --> */}
                </div>                   
            </div>
            <div className="row nbs">
                <div className="col s10">
                    <h6 className="header bold xtra">
                        Statement 5
                    </h6>
                    <p className="grey-text text-darken-2 xtra nbs">
                        The bicycles on top of your car should be worth more than your car.
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s8 m5 l4">
                    <select id="sl5">
                        <option value="" disabled selected>Select an Option</option>
                        <option value="1">1 (Strongly Disagree)</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5 (Strongly Agree)</option>
                    </select>
                    {/* <!-- <label>Materialize Select</label> --> */}
                </div>                   
            </div>
            <div className="row nbs">
                <div className="col s10">
                    <h6 className="header bold xtra">
                        Statement 6
                    </h6>
                    <p className="grey-text text-darken-2 xtra nbs">
                        Socks can be any color you like.
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s8 m5 l4">
                    <select id="sl6">
                        <option value="" disabled selected>Select an Option</option>
                        <option value="1">1 (Strongly Disagree)</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5 (Strongly Agree)</option>
                    </select>
                    {/* <!-- <label>Materialize Select</label> --> */}
                </div>                   
            </div>
            <div className="row nbs">
                <div className="col s10">
                    <h6 className="header bold xtra">
                        Statement 7
                    </h6>
                    <p className="grey-text text-darken-2 xtra nbs">
                        Spare tubes, multi-tools and repair kits should be stored in jersey pockets only.
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s8 m5 l4">
                    <select id="sl7">
                        <option value="" disabled selected>Select an Option</option>
                        <option value="1">1 (Strongly Disagree)</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5 (Strongly Agree)</option>
                    </select>
                    {/* <!-- <label>Materialize Select</label> --> */}
                </div>                   
            </div>
            <div className="row nbs">
                <div className="col s10">
                    <h6 className="header bold xtra">
                        Statement 8
                    </h6>
                    <p className="grey-text text-darken-2 xtra nbs">
                        Tires are to be mounted with the label centered over the valve stem.
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s8 m5 l4">
                    <select id="sl8">
                        <option value="" disabled selected>Select an Option</option>
                        <option value="1">1 (Strongly Disagree)</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5 (Strongly Agree)</option>
                    </select>
                    {/* <!-- <label>Materialize Select</label> --> */}
                </div>                   
            </div>
            <div className="row nbs">
                <div className="col s10">
                    <h6 className="header bold xtra">
                        Statement 9
                    </h6>
                    <p className="grey-text text-darken-2 xtra nbs">
                        Saddles, bars, and tires shall be carefully matched.
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s8 m5 l4">
                    <select id="sl9"> 
                        <option value="" disabled selected>Select an Option</option>
                        <option value="1">1 (Strongly Disagree)</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5 (Strongly Agree)</option>
                    </select>
                    {/* <!-- <label>Materialize Select</label> --> */}
                </div>                   
            </div>
            <div className="row nbs">
                <div className="col s10">
                    <h6 className="header bold xtra">
                        Statement 10
                    </h6>
                    <p className="grey-text text-darken-2 xtra nbs">
                        Support your local bike shop.
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s8 m5 l4">
                    <select id="sl10">
                        <option value="" disabled selected>Select an Option</option>
                        <option value="1">1 (Strongly Disagree)</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5 (Strongly Agree)</option>
                    </select>
                    {/* <!-- <label>Materialize Select</label> --> */}
                </div>                   
            </div>
            <div className="row center">
                <button type="submit" 
                    value="submit" 
                    id="survey-btn" 
                    className="btn-large waves-effect waves-light red accent-4"
                    >   
                    <i className="fas fa-check-circle"></i> Find My Buddy
                </button>
            </div>
        </form>
            </div>

    );
}
    
export default Survey;