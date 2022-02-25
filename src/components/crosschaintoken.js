import './style/crosschaintoken.css'
import { React, useEffect, useState } from 'react'
// import ReactDOM from "react-dom";
import {
  Select,
  Box,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
  Button,
  CircularProgress,
  TextField
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Web3 from 'web3';
import axios from 'axios'
import { FOXIE_ABI, FOXIE_ROPSTEN, FOXIE_RINKEBY } from '../abi/foxieabi'


function Crosschaineth() {
  const [tokenAddress, setTokenAddress] = useState([]);
  const [arr, setArr] = useState([]);
  const [networkToken, setNetworkToken] = useState();
  const [balanceTokenRopsten, setBalanceNetworkRopsten] = useState();
  const web3 = new Web3(Web3.givenProvider);

  const getBalance = async () => {
    const CONTRACT_FOXIE_ROPSTEN = new web3.eth.Contract(FOXIE_ABI, FOXIE_ROPSTEN)
    const account = await web3.eth.getAccounts()
    const balance = await CONTRACT_FOXIE_ROPSTEN.methods.balanceOf(account[0]).call()
    setBalanceNetworkRopsten(web3.utils.fromWei(balance, 'ether'))
  }

  const handleChange = async (event) => {
    setTokenAddress(event.target.value);
    let addressToken = event.target.value;
    await axios.get(`http://localhost:3001/tokens/params/${addressToken}`).then(data => setNetworkToken(data.data.network))
  };

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

  useEffect(async () => {
    getDataToken()
    getBalance()
  }, [])

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
                        label="Age"
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
                    (tokenAddress.length > 0) ? <Button variant="text">{"Address Token: " + tokenAddress}</Button> : ""
                  }
                </div>
                <Box sx={{ maxWidth: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <Button disabled>{tokenAddress.length > 0? "Network Token: " + networkToken: "Network Token: "}</Button>
                  <Button disabled>{tokenAddress.length > 0? "Balance:" + balanceTokenRopsten: ""}</Button>
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
