import './style/crosschaintoken.css'
import { React, useEffect, useState } from 'react'
// import ReactDOM from "react-dom";
import {
  Select, Box,
  MenuItem, InputLabel,
  FormControl, Avatar,
  Button, CircularProgress, TextField,
} from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useSnackbar } from 'notistack';
import Web3 from 'web3';
import axios from 'axios'
import {
  FOXIE_ABI, FOXIE_ROPSTEN,
  FOXIE_RINKEBY, RINKEBY_URL,
  ROPSTEN_URL, CONTRACT_ADDRESS_ROPSTEN,
  CONTRACT_ADDRESS_RINKEBY, CONTRACT_ABI,
} from '../abi/foxieabi'
import { createAlchemyWeb3 } from "@alch/alchemy-web3"
import { Grow, Slide, Zoom } from '@mui/material';



function Crosschaineth() {
  const [tokenAddress, setTokenAddress] = useState([]);
  const [arr, setArr] = useState([]);
  const [networkToken, setNetworkToken] = useState();
  const [networkSwapToken, setNetworkSwapToken] = useState();
  const [addressSwapToken, setAddressSwapToken] = useState();
  const [balanceTokenRopsten, setBalanceNetworkRopsten] = useState();
  const [balanceTokenRinkeby, setBalanceTokenRinkeby] = useState();
  const [amountUp, setAmountUp] = useState();
  const web3 = new Web3(Web3.givenProvider);
  const { enqueueSnackbar } = useSnackbar();
  const web3AlchemyRopsten = createAlchemyWeb3(ROPSTEN_URL)
  const web3AlchemyRinkeby = createAlchemyWeb3(RINKEBY_URL)

  const getBalanceRopsten = async () => {
    const CONTRACT_FOXIE_ROPSTEN = new web3AlchemyRopsten.eth.Contract(FOXIE_ABI, FOXIE_ROPSTEN)
    const account = await web3AlchemyRopsten.eth.getAccounts()
    const balance = await CONTRACT_FOXIE_ROPSTEN.methods.balanceOf(account[0]).call()
    setBalanceNetworkRopsten(web3AlchemyRopsten.utils.fromWei(balance, 'ether'))
  }
  const getBalanceRinkeby = async () => {
    const CONTRACT_FOXIE_RINKEBY = new web3AlchemyRinkeby.eth.Contract(FOXIE_ABI, FOXIE_RINKEBY)
    const account = await web3AlchemyRinkeby.eth.getAccounts()
    const balance = await CONTRACT_FOXIE_RINKEBY.methods.balanceOf(account[0]).call()
    setBalanceTokenRinkeby(web3AlchemyRinkeby.utils.fromWei(balance, 'ether'))
  }

  const handleChange = async (event) => {
    setTokenAddress(event.target.value);
    let addressToken = event.target.value;
    const result = await axios.get(`http://localhost:3001/tokens/params/${addressToken}`);
    setNetworkToken(result.data.network);
    (result.data.address === arr[0].address) ? setAddressSwapToken(arr[1].address) : setAddressSwapToken(arr[0].address);
    (result.data.network === arr[0].network) ? setNetworkSwapToken(arr[1].network) : setNetworkSwapToken(arr[0].network);
  };
  const handleAddress = async () => {
    const copyAddress = document.getElementById("address-btn1");
    await navigator.clipboard.writeText(copyAddress.value);
    enqueueSnackbar('Address has been copied success!!!', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      TransitionComponent: Slide,
      variant: 'success',
      sx: {
        "& .SnackbarContent-root": {
          bgcolor: '#0ed816',
          borderRadius: '4px',
          boxShadow: 'rgb(60 66 87 / 12%) 0px 7px 14px 0px, rgb(0 0 0 / 12%) 0px 3px 6px 0px',
          color: '#fff',
          fontSize: 18
        }
      }
    });
  }

  const getDataToken = async () => {
    const tokens = await axios({
      method: 'get',
      url: 'http://localhost:3001/tokens',
      responseType: 'token'
    })
    tokens.data.map(data => {
      setArr(datas => [...datas, data])
    })
  }
  const onchangeValue = (e) => {
    let amount = e.target.value
    setAmountUp(amount)
  }
  const depositToken = async () => {
    const CONTRACT_ROPSTEN = new web3AlchemyRopsten.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS_ROPSTEN)
    const CONTRACT_RINKEBY = new web3AlchemyRinkeby.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS_RINKEBY)
    const amountFix = web3.utils.toWei(amountUp, 'ether')
    console.log(amountFix)
    const account = await web3.eth.getAccounts()
    switch (networkToken) {
      case 'Ropsten Testnet Network':
        await CONTRACT_ROPSTEN.methods.deposit(amountFix, FOXIE_ROPSTEN).send({
          from: account[0]
        });
      // case 'Rinkeby Testnet Network':
      //   return (await CONTRACT_RINKEBY.methods.deposit(amountFix, FOXIE_RINKEBY).call());
      // default:
      //   return console.log(undefined);
    }
  }

  useEffect(async () => {
    getDataToken()
  }, [])

  useEffect(async () => {
    getBalanceRinkeby()
    getBalanceRopsten()
  }, [addressSwapToken])

  return (
    <div className="App">
      <div className="box-root flex-flex flex-direction--column" style={{ "minHeight": "100vh", "flexGrow": 1 }}>
        <div className="loginbackground box-background--white padding-top--64">
          <div className="loginbackground-gridContainer">
            <div className="box-root flex-flex" style={{ "gridArea": "top/start/bottom/end" }}>
              <div className="box-root" style={{ "backgroundImage": "linear-gradient(white 0%, rgb(247, 250, 252) 33%)", "flexGrow": 1 }}>
              </div>
            </div>
            <div className="box-root flex-flex" style={{ "gridArea": "4/2/auto/5" }}>
              <div className="box-root box-divider--light-all-2 animationLeftRight tans3s" style={{ "flexGrow": 1 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ "gridArea": "6/start/auto/2" }}>
              <div className="box-root box-background--blue800" style={{ "flexGrow": 1 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ "gridArea": "7/start/auto/4" }}>
              <div className="box-root box-background--blue animationLeftRight" style={{ "flexGrow": 1 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ "gridArea": "8 / 4 / auto / 6" }}>
              <div className="box-root box-background--gray100 animationLeftRight tans3s" style={{ "flexGrow": 1 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ "gridArea": "2/15/auto/end" }}>
              <div className="box-root box-background--cyan200 animationRightLeft tans4s" style={{ "flexGrow": 1 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ "gridArea": "3 / 14 / auto / end" }}>
              <div className="box-root box-background--blue animationRightLeft" style={{ "flexGrow": 1 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ "gridArea": "4 / 17 / auto / 20" }}>
              <div className="box-root box-background--gray100 animationRightLeft tans4s" style={{ "flexGrow": 1 }}></div>
            </div>
            <div className="box-root flex-flex" style={{ "gridArea": "5 / 14 / auto / 17" }}>
              <div className="box-root box-divider--light-all-2 animationRightLeft tans3s" style={{ "flexGrow": 1 }}></div>
            </div>
          </div>
        </div>
        <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ "flexGrow": 1, "zIndex": 9 }}>
          <div className="box-root padding-top--48 padding-bottom--24 flex-flex flex-justifyContent--center">
            <h1><a href={"#"}> Exchange Network To Swap Token</a></h1>
          </div>
          <div className="formbg-outer">
            <div className="formbg">
              <div className="formbg-inner padding-horizontal--48">
                <div className="field" style={{ "display": "flex", "flexDirection": "row" }}>
                  <Box sx={{ maxWidth: "50%" }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Token</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={tokenAddress ? tokenAddress : ""}
                        label="Token"
                        onChange={handleChange}>
                        {
                          arr.map((data, index) => {
                            return <MenuItem value={data.address} key={index}>{data.token}</MenuItem>
                          })
                        }
                      </Select>
                    </FormControl>
                  </Box>

                  {
                    (tokenAddress.length > 0) ? <Button variant="text" id="address-btn1" onClick={handleAddress} value={tokenAddress}>{"Address Token: " + tokenAddress}</Button> : ""
                  }
                </div>
                <span className="padding-bottom--15"></span>
                <Box sx={{ maxWidth: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <Button disabled sx={{ color: '#5469d4' }}>{tokenAddress.length > 0 ? "Network Token: " + networkToken : "Network Token: "}</Button>
                  <Button disabled>{tokenAddress.length > 0 ? "Balance:" + balanceTokenRopsten : ""}</Button>
                </Box>
                <span className="padding-bottom--15"></span>
                <Box sx={{ maxWidth: "100%" }}>
                  <TextField
                    id="outlined-number"
                    label="Amount"
                    type="number"
                    sx={{ width: '100%' }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onchangeValue} />
                </Box>
                <span className="padding-bottom--15"></span>
                <Box sx={{ maxWidth: "100%", display: 'flex', justifyContent: 'center' }}>
                  <SwapVertIcon
                    sx={{
                      fontSize: 40,
                      color: 'rgb(84, 105, 212)',
                      cursor: 'pointer',
                      transitions: "2s",
                      '&:hover': {
                        /////////
                      }
                    }}
                  />
                </Box>
                <span className="padding-bottom--15"></span>
                <div className="field" style={{ "display": "flex", "flexDirection": "row" }}>
                  <Box sx={{ maxWidth: "50%" }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Token</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={tokenAddress ? tokenAddress : ""}
                        label="Network"
                        onChange={handleChange}>
                        {
                          arr.map((data, index) => {
                            return <MenuItem value={data.address} key={index}>{data.token}</MenuItem>
                          })
                        }
                      </Select>
                    </FormControl>
                  </Box>
                  {
                    (tokenAddress.length > 0) ? <Button variant="text" id="address-btn2" value={addressSwapToken}>{"Address Token: " + addressSwapToken}</Button> : ""
                  }
                </div>
                <span className="padding-bottom--15"></span>
                <Box sx={{ maxWidth: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <Button disabled sx={{ color: '#5469d4' }}>{tokenAddress.length > 0 ? "Network Token: " + networkSwapToken : "Network Token: "}</Button>
                  <Button disabled>{tokenAddress.length > 0 ? "Balance:" + balanceTokenRinkeby : ""}</Button>
                </Box>
                <span className="padding-bottom--15"></span>
                <Box sx={{ maxWidth: "100%" }}>
                  <TextField
                    id="outlined-number"
                    label="Amount"
                    type="number"
                    sx={{ width: '100%' }}
                    InputLabelProps={{
                      shrink: true,
                    }} />
                </Box>
                <span className="padding-bottom--15"></span>
                <span className="padding-bottom--15"></span>
                <Box sx={{ maxWidth: "100%", display: 'flex', justifyContent: 'center' }}>
                  <Button variant="contained" disableElevation sx={{ background: '#5469d4', padding: 2 }} onClick={depositToken}>
                    CLICK HERE TO SWAP
                  </Button>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Crosschaineth;
