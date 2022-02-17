import React from 'react';
import './style/navbar.css';

function Navbar() {
    return (
        <div className="container-fluid px-0">
            <nav className="navbar navbar-expand-md navbar-light bg-white p-0"> <a className="navbar-brand mr-4" href="#"><strong>BBBootstrap</strong></a> <button className="navbar-toggler mr-3" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"> <span className="navbar-toggler-icon"></span> </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                </div>
            </nav>
        </div>
    )
}
export default Navbar;