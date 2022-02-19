import { React, useEffect, useState } from 'react'
import './style/navbar.css';
import Web3 from 'web3'
const web3 = new Web3(Web3.givenProvider)

function Navbar() {
    const [account, setAccount] = useState()
    const handleConnectMetamask = async () => {
        let account = await web3.eth.getAccounts()
        if (account === undefined) account = await web3.eth.requestAccounts()
        setAccount(account[0])
    }
    const accountChanged = async() => {
        await window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts);
        });
    }
    useEffect(async() => {
        handleConnectMetamask
        accountChanged()
    }, [account])

    return (
        <nav className="navbar navbar-default navbar-fixed-top">
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse"
                        data-target="#myNavbar">
                        <span className="glyphicon glyphicon-menu-hamburger"></span>
                    </button>
                    <div className="navbar-left logo">
                    </div>
                    <h1 className="brand brand-name navbar-left">Kredswap</h1>
                </div>
                <div className="navbar-right" id="myNavbar">
                    <div className="nav navbar-nav">
                        <button type="button" className="btn btn-primary btn-lg" >{account ? account : "Login"}</button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;