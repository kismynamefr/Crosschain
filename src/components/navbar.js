import { React, useEffect, useState, useLayoutEffect } from 'react'
import axios from 'axios'
import './style/navbar.css'
import Web3 from 'web3'
const web3 = new Web3(Web3.givenProvider)
import {
    Select, Box,
    MenuItem, InputLabel,
    FormControl, Button,
    TextField, Grow,
    Slide, Zoom
} from '@mui/material';

function Navbar() {
    const [account, setAccount] = useState()
    const [networkWallet, setNetworkWallet] = useState()
    const [data, setData] = useState([])
    const [chainid, setChainid] = useState()
    const [decimals, setDecimals] = useState()

    const handleConnectMetamask = async () => {
        if (window.ethereum !== undefined)
            await web3.eth.requestAccounts().then(account => {
                const arr = account[0].split("");
                const splitAddress = (arr[0] + arr[1] + arr[2] + arr[3] + arr[4] + '...' + arr[38] + arr[39] + arr[40] + arr[41])
                setAccount(splitAddress)
            })
    }
    const accountChanged = async () => {
        await window.ethereum.on('accountsChanged', (account) => {
            const arr = account[0].split("");
            const splitAddress = (arr[0] + arr[1] + arr[2] + arr[3] + arr[4] + arr[5] + '...' + arr[38] + arr[39] + arr[40] + arr[41])
            setAccount(splitAddress);
        });
    }
    const getNetworkWallet = async () => {
        const decimals = await ethereum.request({ method: 'eth_chainId' });
        setDecimals(decimals)
        const chainids = await web3.eth.getChainId()
        setChainid(chainids)
        const result = await axios.get(`http://localhost:3001/chainids/params/chainid/${chainids}`)
        setNetworkWallet(result.data.network)
        await window.ethereum.on('chainChanged', async () => {
            const chainids = await web3.eth.getChainId()
            const result = await axios.get(`http://localhost:3001/chainids/params/chainid/${chainids}`)
            setNetworkWallet(result.data.network)
        })
    }
    const getArrNetwork = async () => {
        const result = await axios.get(`http://localhost:3001/chainids/`)
        setData(result.data);
    }

    const getNetwork = async (event) => {
        const value = event.target.value
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `${value}` }],
        })
    }

    useLayoutEffect(() => {
        getNetworkWallet()
        handleConnectMetamask()
        accountChanged()
    }, [account])

    useEffect(() => {
        getArrNetwork()
    }, [])

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
                                <TextField
                                    labelId=""
                                    id=""
                                    select
                                    label="Network"
                                    value={`${decimals}`}
                                    onChange={getNetwork} >
                                    {
                                        data.map((item, index) => (
                                            <MenuItem key={index} value={item.decimals}>{item.network}</MenuItem>
                                        ))
                                    }
                                </TextField>
                    </div>
                    <div className="nav navbar-nav">
                        <button type="button" className="btn btn-primary btn-lg" onClick={handleConnectMetamask}>{account ? account : 'undefined'}</button>
                    </div>
                </div>
            </div>
        </nav >
    )
}
export default Navbar;