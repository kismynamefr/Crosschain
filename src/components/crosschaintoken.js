import './style/crosschaintoken.css'
import { React, useEffect, useState, useLayoutEffect, Fragment } from 'react'
import useProvider from './provider/provider'
// import ReactDOM from "react-dom";
import {
  Select, Box,
  MenuItem, InputLabel,
  FormControl, Button,
  TextField, Grow,
  Slide, Zoom
} from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useSnackbar } from 'notistack';
import Web3 from 'web3';
import axios from 'axios'
import { IERC20_ABI, ERC20_ABI } from '../abi/IERC20abi'
import { CONTRACT_ABI } from '../abi/foxieabi'



function Crosschaineth() {
  const [tokenAddress, setTokenAddress] = useState([])
  const [arrToken, setArrToken] = useState([])
  const [arrPair, setArrPair] = useState([])
  const [networkToken, setNetworkToken] = useState()
  const [networkSwapToken, setNetworkSwapToken] = useState()
  const [addressSwapToken, setAddressSwapToken] = useState()
  const [amountUp, setAmountUp] = useState()
  const [amountReceive, setAmountReceive] = useState()
  const [networkWallet, setNetworkWallet] = useState()
  const [balanceToken, setBalanceToken] = useState()
  const [balanceTokenSwap, setBalanceTokenSwap] = useState()
  const web3 = new Web3(Web3.givenProvider)
  const { enqueueSnackbar } = useSnackbar()
  const { getProvider } = useProvider()

  const getNetworkWallet = async () => {
    const chainids = await web3.eth.getChainId()
    const result = await axios.get(`http://localhost:3001/chainids/params/chainid/${chainids}`)
    setNetworkWallet(result.data.network)
    await window.ethereum.on('chainChanged', async () => {
      const chainids = await web3.eth.getChainId()
      const result = await axios.get(`http://localhost:3001/chainids/params/chainid/${chainids}`)
      setNetworkWallet(result.data.network)
      window.location.reload()
    })
  }
  const getArrToken = async () => {
    const chainids = await web3.eth.getChainId()
    const result = await axios.get(`http://localhost:3001/tokens/paramss/${chainids}`)
    setArrToken(result.data)
    //When chainid was changing...
    await window.ethereum.on('chainChanged', async () => {
      const result = await axios.get(`http://localhost:3001/tokens/paramss/${chainids}`)
      setArrToken(result.data)
      window.location.reload()
    })
  }

  const handleChangeNetwork = async (e) => {
    const addressSwapToken = e.target.value
    const account = await web3.eth.getAccounts()
    setAddressSwapToken(e.target.value)
    const result = await axios.get(`http://localhost:3001/tokens/params/${addressSwapToken}`)
    setNetworkSwapToken(result.data.network)
    console.log(result.data.chainid)
    await getProvider(result.data.chainid).then(async (web3) => {
      console.log(web3)
      const contract = new web3.eth.Contract(IERC20_ABI, addressSwapToken)
      const balance = await contract.methods.balanceOf(account[0]).call()
      const balanceFix = await web3.utils.fromWei(balance, 'ether')
      setBalanceTokenSwap(balanceFix)
    })
  }

  const handleChange = async (event) => {
    const addressToken = event.target.value
    const account = await web3.eth.getAccounts()
    setTokenAddress(addressToken)
    const result = await axios.get(`http://localhost:3001/tokens/params/${addressToken}`)
    setNetworkToken(result.data.network)
    //getPairToken
    const pair = await axios.get(`http://localhost:3001/pairs/params/${addressToken}`)
    setArrPair(pair.data)
    //getBalanceToken
    const methodGetBalance = new web3.eth.Contract(IERC20_ABI, addressToken)
    const balanceOf = await methodGetBalance.methods.balanceOf(account[0]).call()
    const balanceFix = await web3.utils.fromWei(balanceOf, 'ether')
    setBalanceToken(balanceFix)
  }

  const handleAddressUp = async () => {
    const copyAddress = document.getElementById("address-btn1")
    await navigator.clipboard.writeText(copyAddress.value)
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
    })
  }
  const handleAddressDown = async () => {
    const copyAddress = document.getElementById("address-btn2")
    await navigator.clipboard.writeText(copyAddress.value)
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
    })
  }

  const onchangeValue = (e) => {
    let amount = e.target.value
    setAmountUp(amount)
    const fees = amount * 99.95 / 100
    setAmountReceive(fees)
  }

  const deposit = async () => {
    const chainid = await web3.eth.getChainId()
    const account = await web3.eth.getAccounts()
    const getAddressContract = await axios.get(`http://localhost:3001/contracts/params/${chainid}`)
    const contract_address = getAddressContract.data[0].address
    const contractApprove = new web3.eth.Contract(IERC20_ABI, tokenAddress)
    const contractDeposit = new web3.eth.Contract(CONTRACT_ABI, contract_address)
    const amountDepo = await web3.utils.toWei(amountUp, 'ether')
    console.log(contract_address)
    //approve token
    await contractApprove.methods.approve(contract_address, amountDepo).send({
      from: account[0],
    }).then(data => console.log(data.transactionHash))
    //depo token
    const tx = await contractDeposit.methods.deposit(amountDepo, tokenAddress).encodeABI()
    const txdata = {
      from: account[0],
      to: contract_address,
      data: tx,
    }
    await web3.eth.sendTransaction(txdata).then(async (data) => {
      const action = key => (
        <Fragment>
          <Button sx={{
            bgcolor: '#fff',
            boxShadow: 'rgb(60 66 87 / 12%) 0px 7px 14px 0px, rgb(0 0 0 / 12%) 0px 3px 6px 0px',
            color: '#5469d4'
          }} onClick={() => {
            navigator.clipboard.writeText(`${data.transactionHash}`)
          }}>
            Transaction Hash
          </Button>
        </Fragment>
      )
      enqueueSnackbar('Deposit Has Been Success!!!!!', {
        autoHideDuration: 3000,
        TransitionComponent: Slide,
        action,
        variant: 'success',
        sx: {
          "& .SnackbarContent-root": {
            bgcolor: '#5469d4',
            borderRadius: '4px',
            boxShadow: 'rgb(60 66 87 / 12%) 0px 7px 14px 0px, rgb(0 0 0 / 12%) 0px 3px 6px 0px',
            color: '#fff',
            fontSize: 18
          }
        }
      })
      //set balance when deposit done!!!
      const balance = await contractApprove.methods.balanceOf(account[0]).call()
      const balanceFix = await web3.utils.fromWei(balance, 'ether')
      setBalanceToken(balanceFix)
    })
  }

  const mint = async () => {
    const result = await axios.get(`http://localhost:3001/tokens/params/${addressSwapToken}`)
    const chainid = result.data.chainid
    const getAddressContract = await axios.get(`http://localhost:3001/contracts/params/${chainid}`)
    const contract_address = getAddressContract.data[0].address
    console.log('contract address: ', contract_address)
    await getProvider(chainid).then(async (web3) => {
      const admin = await web3.eth.accounts.wallet.add(
        "8c010bd222587fea251d21c1b2ed9f4fe08a94207a4e22e9aed8187d7890c64a"
        //privateKey wallet
      )
      const amountFix = await web3.utils.toWei(`${amountReceive}`, 'ether')
      const contractMint = new web3.eth.Contract(ERC20_ABI, addressSwapToken)
      const tx = contractMint.methods.mint(admin.address, amountFix).encodeABI()
      const txdata = {
        from: admin.address,
        to: addressSwapToken,
        data: tx,
        gas: 1000000
      }
      await web3.eth.sendTransaction(txdata).then(async (data) => {
        const action = key => (
          <Fragment>
            <Button sx={{
              bgcolor: '#fff',
              boxShadow: 'rgb(60 66 87 / 12%) 0px 7px 14px 0px, rgb(0 0 0 / 12%) 0px 3px 6px 0px',
              color: '#5469d4'
            }} onClick={() => {
              navigator.clipboard.writeText(`${data.transactionHash}`)
            }}>
              Transaction Hash
            </Button>
          </Fragment>
        )
        enqueueSnackbar('Swap Token Has Been Success with 0.05% fees!!!!!', {
          autoHideDuration: 10000,
          TransitionComponent: Slide,
          action,
          variant: 'success',
          sx: {
            "& .SnackbarContent-root": {
              bgcolor: '#5469d4',
              borderRadius: '4px',
              boxShadow: 'rgb(60 66 87 / 12%) 0px 7px 14px 0px, rgb(0 0 0 / 12%) 0px 3px 6px 0px',
              color: '#fff',
              fontSize: 18
            }
          }
        })
        const balance = await contractMint.methods.balanceOf(admin.address).call()
        const balanceFix = await web3.utils.fromWei(balance, 'ether')
        setBalanceTokenSwap(balanceFix)
        const isReverse = await axios.get(`http://localhost:3001/pairs/reverse/${tokenAddress}/${addressSwapToken}`)
        const resultReverse = isReverse.data[0].isReverse
        console.log(resultReverse)
        if(resultReverse === 'true'){
          console.log("Proceed burn because isReverse === true")
          const burn = await contractMint.methods.burn(addressSwapToken, amountFix).encodeABI()
          const txdataBurn = {
            from: admin.address,
            to: addressSwapToken,
            data: burn,
            gas: 1000000
          }
          await web3.eth.sendTransaction(txdataBurn).then(data => console.log(data))
        }
      })
      
    })
  }

  const handleExchange = async () => {
    await deposit()
    await mint()
  }

  useLayoutEffect(() => {
    getArrToken()

    return (async () => {
      await window.ethereum.removeListener('chainChanged', getArrToken)
    })
  }, [])

  useEffect(() => {

  }, [arrPair])

  useEffect(async () => {
    getNetworkWallet()
  }, [])

  useEffect(() => {

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
                <span className="padding-bottom--15"></span>
                <div className="field" style={{ "display": "flex", "flexDirection": "row" }}>
                  <Box sx={{ maxWidth: "50%" }}>
                    <FormControl fullWidth sx={{ width: "100%" }} >
                      <InputLabel id="demo-simple-select-label">Token</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={`${tokenAddress}`}
                        label="Token"
                        onChange={handleChange}>
                        {
                          arrToken.map((data, index) => {
                            return <MenuItem value={`${data.address}`} key={index}>{data.token}</MenuItem>
                          })
                        }
                      </Select>
                    </FormControl>
                  </Box>
                  {
                    (tokenAddress.length > 0) ? <Button variant="text" id="address-btn1" onClick={handleAddressUp} value={tokenAddress}>{"Address Token: " + tokenAddress}</Button> : ""
                  }
                </div>
                <span className="padding-bottom--15"></span>
                <Box sx={{ maxWidth: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <Button disabled sx={{ color: '#5469d4' }}>{tokenAddress.length > 0 ? "Network Token: " + networkToken : "Network Token: "}</Button>
                  <Button disabled>{tokenAddress.length > 0 ? "Balance: " + balanceToken : ""}
                  </Button>
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
                <div className="field">
                  <Box
                    sx={{ maxWidth: "100%" }}>
                    <div style={{ "display": "flex", "flexDirection": "row" }}>
                      <TextField
                        id="outlined-select-currency"
                        select
                        label="Network"
                        sx={{ width: "22%" }}
                        onChange={handleChangeNetwork}
                        value={arrPair.length > 0 ? `${addressSwapToken}` : ''} >
                        {
                          arrPair.map((data, index) => {
                            return (
                              <MenuItem key={`${index}`} value={`${data.token2}`}>
                                {`${data.network2}`}
                              </MenuItem>
                            )
                          })
                        }
                      </TextField>
                      {
                        (arrPair.length > 0) ? <Button variant="text" id="address-btn2" onClick={handleAddressDown} value={addressSwapToken}>{"Address Token: " + addressSwapToken}</Button> : ""
                      }
                    </div>
                  </Box>
                  <span className="padding-bottom--15"></span>
                  <Box sx={{ maxWidth: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Button disabled sx={{ color: '#5469d4' }}>{arrPair.length > 0 ? "Network Token: " + networkSwapToken : "Network Token: "}</Button>
                    <Button disabled>{(
                      arrPair.length > 0 ? "Balance: " + balanceTokenSwap : ""
                    )}</Button>
                  </Box>
                  {/* <Box sx={{ maxWidth: "100%" }}>
                    <TextField
                      id="outlined-number"
                      label="Amount"
                      type="number"
                      sx={{ width: "100%" }}
                      InputLabelProps={{
                        shrink: true,
                      }} />
                  </Box> */}
                  <span className="padding-bottom--15"></span>
                  <Button sx={{ color: '#5469d4' }}>{"Crosschain fee: 0.05%"}</Button>
                  <span className="padding-bottom--15"></span>
                  <Button sx={{ color: '#5469d4' }}>{"Total token receive : " + amountReceive}</Button>
                  <span className="padding-bottom--15"></span>
                  <Box sx={{ maxWidth: "100%", display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" disableElevation sx={{ background: '#5469d4', padding: 2 }} onClick={handleExchange}>
                      CLICK HERE TO SWAP
                    </Button>
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Crosschaineth;
