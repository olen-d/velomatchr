import React from "react"

const Footer = () => {
    return(
        <footer className="page-footer grey darken-4">
        <div className="container">
        <div className="row">
            <div className="col l6 s12">
            <h5 className="white-text">About</h5>
            <p className="grey-text text-lighten-4">When we aren't on our bicycles, we build web applications that make life easier for cyclists, so they can get out and ride more. </p>


            </div>
            <div className="col l3 s12">
            <h5 className="white-text">Made With</h5>
            <ul>
                <li><a className="white-text" href="http://www.fontawesome.com">Font Awesome</a></li>
                <li><a className="white-text" href="http://jquery.com">jQuery</a></li>
                <li><a className="white-text" href="http://materializecss.com">Materialize</a></li>
            </ul>
            </div>
            <div className="col l3 s12">
            <h5 className="white-text">Socialize</h5>
            <ul>
                <li><a className="white-text" href="#!"><i className="fab fa-facebook-f"></i> Facebook</a></li>
                <li><a className="white-text" href="https://github.com/olen-d/velomatchr"><i className="fab fa-github"></i> Github</a></li>
                <li><a className="white-text" href="#!"><i className="fab fa-instagram"></i> Instagram</a></li>
                <li><a className="white-text" href="#!"><i className="fab fa-twitter"></i> Twitter</a></li>
                <li><a className="white-text" href="#!"><i className="fab fa-youtube"></i> Youtube</a></li>
            </ul>
            </div>
        </div>
        </div>
        <div className="footer-copyright">
        <div className="container">
        Copyright &copy; 2019 <a className="orange-text text-lighten-3" href="http://www.olen.dev/">Olen Daelhousen</a>
        </div>
        </div>
        </footer>
    );
}

export default Footer