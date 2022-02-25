import './style/crosschaineth.css'
import { React, useEffect, useState } from 'react'
// import ReactDOM from "react-dom";
import { RINKEBY_URL, ROPSTEN_URL, CROSSCHAIN_ABI, ADDRESSCONTRACT_RINKEBY, ADDRESSCONTRACT_ROPSTEN } from '../abi/crosschainabi'
import { createAlchemyWeb3 } from "@alch/alchemy-web3"
import { Grow, Slide, Zoom } from '@mui/material';
import { useSnackbar } from 'notistack';


function Crosschaineth() {
  const axios = require('axios')
  const Web3 = require('web3')
  const web3 = new Web3(Web3.givenProvider)
  const [dataRes, setDataRes] = useState();
  const [balance, setBalance] = useState();
  const [handleNetworks, setHandleNetwork] = useState();
  const [balanceNetwork, setBalanceNetwork] = useState(0);
  const { enqueueSnackbar } = useSnackbar();


  //masterial ui

  const contractRopsten = new web3.eth.Contract(
    CROSSCHAIN_ABI,
    ADDRESSCONTRACT_ROPSTEN
  );
  const contractRinkeby = new web3.eth.Contract(
    CROSSCHAIN_ABI,
    ADDRESSCONTRACT_RINKEBY
  );
  const web3AlchemyRinkeby = createAlchemyWeb3(RINKEBY_URL)
  const web3AlchemyRopsten = createAlchemyWeb3(ROPSTEN_URL)
  const amount = document.getElementById("amount");
  let getNetwork = "";

  const getAccount = async () => {
    const account = await web3.eth.getAccounts()
    const balance = await web3.eth.getBalance(account[0])
    const balanceFix = web3.utils.fromWei(balance, 'ether');
    setBalance(balanceFix)
  }

  const getDataChainid = async () => {
    const getChainId = await web3.eth.getChainId()
    await axios({
      method: 'get',
      url: 'http://localhost:3001/chainids',
      responseType: 'chainid'
    }).then(datas => {
      for (let i = 0; i < 7; i++)
        if (getChainId == datas.data[i].chainId)
          getNetwork = datas.data[i].network
      setDataRes(getNetwork)
    })
  }
  const handleExchangeclick = () => async () => {
    if (amount.value === '') {
      enqueueSnackbar('Please Adding To Swap Your Coin', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        TransitionComponent: Zoom,
        variant: 'warning',
        sx: {
          "& .SnackbarContent-root": {
            bgcolor: 'rgb(84, 105, 212)',
            borderRadius: '4px',
            color: '#fff',
            fontSize: 18
          }
        }
      });
    }
    else if (handleNetworks === undefined) {
      enqueueSnackbar('Please Choosing Your Network To Swap Your Coin', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        TransitionComponent: Zoom,
        variant: 'warning',
        sx: {
          "& .SnackbarContent-root": {
            bgcolor: 'rgb(84, 105, 212)',
            borderRadius: '4px',
            boxShadow: 'rgb(60 66 87 / 12%) 0px 7px 14px 0px, rgb(0 0 0 / 12%) 0px 3px 6px 0px',
            color: '#fff',
            fontSize: 18
          }
        }
      });
    } else {
      if (handleNetworks !== dataRes) {
        if (dataRes === "Ropsten Test Network") {
          console.log("Server Rinkeby responding....") 
          await deposit()
          enqueueSnackbar('Deposit Success!!!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center'
            },
            TransitionComponent: Slide,
            variant: 'success',
            sx: {
              "& .SnackbarContent-root": {
                // bgcolor: 'rgb(84, 105, 212)',
                borderRadius: '4px',
                // color: '#fff',
                fontSize: 18
              }
            }
          })
          const web3rkb = createAlchemyWeb3(RINKEBY_URL);

          const admin = await web3rkb.eth.accounts.wallet.add(
            "8c010bd222587fea251d21c1b2ed9f4fe08a94207a4e22e9aed8187d7890c64a"
            //privateKey wallet
          );
          console.log("address:", admin)

          const tx = await contractRinkeby.methods.withdraw(web3rkb.utils.toWei(amount.value, "ether"))
          //withdraw when get event
          const [gasPrice, gasCost] = await Promise.all([
            web3rkb.eth.getGasPrice(),
            tx.estimateGas({ from: admin.address }),
          ]);
          console.log("gasPrice", gasPrice, gasCost)
          const data = tx.encodeABI();
          const txData = {
            from: admin.address,
            to: ADDRESSCONTRACT_RINKEBY,
            data,
            gas: 100000,
            gasPrice,
          };
          const reponsive = await web3rkb.eth.sendTransaction(txData);
          //Alert when withdraw success
          enqueueSnackbar('Swap Success. Please check your balance wallet!!!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            TransitionComponent: Zoom,
            variant: 'success',
            sx: {
              "& .SnackbarContent-root": {
                borderRadius: '4px',
                fontSize: 18
              }
            }
          });
          //getBalance when withDraw
          const account = await web3rkb.eth.getAccounts()
          const balance = await web3rkb.eth.getBalance(account[0])
          setBalanceNetwork(web3.utils.fromWei(balance, 'ether'))
          console.log("reponsive", reponsive);
////////////////////////////////
        } else if (dataRes === "Rinkeby Test Network") {
          console.log("Server ropsten responding....") //rinkeby network
          await deposit()
          enqueueSnackbar('Deposit Success!!!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center'
            },
            TransitionComponent: Slide,
            variant: 'success',
            sx: {
              "& .SnackbarContent-root": {
                // bgcolor: 'rgb(84, 105, 212)',
                borderRadius: '4px',
                // color: '#fff',
                fontSize: 18
              }
            }
          })
          const web3ropsten = createAlchemyWeb3(ROPSTEN_URL);
          const admin = await web3ropsten.eth.accounts.wallet.add(
            "8c010bd222587fea251d21c1b2ed9f4fe08a94207a4e22e9aed8187d7890c64a"
            //privateKey wallet rinkeby
          );
          console.log("address:", admin)
          const tx = await contractRopsten.methods.withdraw(web3.utils.toWei(amount.value, "ether"))
          //withdraw when get event
          const [gasPrice, gasCost] = await Promise.all([
            web3ropsten.eth.getGasPrice(),
            tx.estimateGas({ from: admin.address }),
          ]);
          const data = tx.encodeABI();
          const txData = {
            from: admin.address,
            to: ADDRESSCONTRACT_ROPSTEN,
            data,
            gas: 100000,
            gasPrice,
          };
          //getBalance when withDraw
          const rep = await web3ropsten.eth.sendTransaction(txData);
          const account = await web3rkb.eth.getAccounts()
          const balance = await web3rkb.eth.getBalance(account[0])
          setBalanceNetwork(web3.utils.fromWei(balance, 'ether'))
          enqueueSnackbar('Swap Success. Please check your balance wallet!!!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            TransitionComponent: Zoom,
            variant: 'success',
            sx: {
              "& .SnackbarContent-root": {
                borderRadius: '4px',
                fontSize: 18
              }
            }
          })
          console.log('rep', rep);
        }
      } else {
        enqueueSnackbar('Please Changing Another Networks', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          TransitionComponent: Slide,
          variant: 'warning',
          sx: {
            "& .SnackbarContent-root": {
              bgcolor: 'rgb(84, 105, 212)',
              borderRadius: '4px',
              boxShadow: 'rgb(60 66 87 / 12%) 0px 7px 14px 0px, rgb(0 0 0 / 12%) 0px 3px 6px 0px',
              color: '#fff',
              fontSize: 18
            }
          }
        })
      }
    }


  }
  const handleNetwork = async (e) => {
    const account = await web3.eth.getAccounts()
    //ropsten network
    const balanceRopsten = await web3AlchemyRopsten.eth.getBalance(account[0])
    //rinkeby network
    const balanceRinkeby = await web3AlchemyRinkeby.eth.getBalance(account[0])
    const valueNetwork = e.target.value;
    setHandleNetwork(valueNetwork)
    switch (valueNetwork) {
      case 'Ropsten Test Network':
        return setBalanceNetwork(web3.utils.fromWei(balanceRopsten, 'ether'));
      case 'Rinkeby Test Network':
        return setBalanceNetwork(web3.utils.fromWei(balanceRinkeby, 'ether'));
      default:
        return 0
    }
  }
  const deposit = async () => {
    const account = await web3.eth.getAccounts();
    if (dataRes === "Ropsten Test Network") {
      await contractRopsten.methods.deposit().send({
        from: account[0],
        value: web3.utils.toWei(amount.value, "ether"),
      });
      const balance = await web3AlchemyRopsten.eth.getBalance(account[0])
      setBalance(web3.utils.fromWei(balance, 'ether'))
    }
    else if (dataRes === "Rinkeby Test Network")
      await contractRinkeby.methods.deposit().send({
        from: account[0],
        value: web3.utils.toWei(amount.value, "ether"),
      });
    const balance = await web3AlchemyRinkeby.eth.getBalance(account[0])
      setBalance(web3.utils.fromWei(balance, 'ether'))
  }

  const withdraw = async () => {
    const account = await web3.eth.getAccounts()
    if (dataRes === "Ropsten Test Network")
      await contractRopsten.methods.withdraw(web3.utils.toWei(amount.value, "ether")).send({
        from: account[0]
      })
    else if (dataRes === "Rinkeby Test Network")
      await contractRinkeby.methods.withdraw(web3.utils.toWei(amount.value, "ether")).send({
        from: account[0]
      })
  }

  useEffect(() => {
    (async () => {
      getDataChainid()
      await window.ethereum.on('chainChanged', async () => {
        const getChainId = await web3.eth.getChainId()
        setDataRes(getChainId)
      })
    })()
  }, [dataRes, handleNetworks]);

  useEffect(() => {
    getAccount()
  }, [balanceNetwork, balance])


  return (
    <div className="App">
      <div className="box-root flex-flex flex-direction--column" style={{ "minHeight": "100vh", "flexGrow": 1 }}>
        <div className="loginbackground box-background--white padding-top--64">
          <div className="loginbackground-gridContainer">
            <div className="box-root flex-flex" style={{ "gridArea": "top/start/8/end" }}>
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
            <h1><a href={"#"}> Exchange Network To Swap</a></h1>
          </div>
          <div className="formbg-outer">
            <div className="formbg">
              <div className="formbg-inner padding-horizontal--48">
                <span className="padding-bottom--15"></span>
                {/* <form id="stripe-login"> */}
                <div className="field">
                  <label>{dataRes}</label>
                  <input type='' id='amount' placeholder='Deposit Amount' />
                  <label style={{ "padding": 10 }}>Balance: {balance}</label>
                </div>
                <div className="field padding-bottom--24">
                  <select style={{ "padding": 7 }} onChange={handleNetwork}>
                    <option value={``} selected disabled>Choosing your network</option>
                    <option value={"Ethereum Mainet"} disabled>Ethereum Mainet</option>
                    <option value={"Ropsten Test Network"}>Ropsten Test Network</option>
                    <option value={"Rinkeby Test Network"}>Rinkeby Test Network</option>
                    <option value={"Goerli Test Network"} disabled>Goerli Test Network</option>
                    <option value={"Binance Smart Chain Testnet"} disabled>Binance Smart Chain Testnet</option>
                    <option value={"Ethereum Mainet"} disabled>Ethereum Mainet</option>
                    <option value={"Avalanche Fuji Testnet"} disabled>Avalanche Fuji Testnet</option>
                  </select>
                  <span className="padding-bottom--15"></span>
                  <input type='' id='amount' placeholder='Deposit Amount' disabled />
                  <label style={{ "padding": 10 }}>Balance: {balanceNetwork} </label>
                </div>
                <div className="field padding-bottom--24">
                  <input type="submit" name="swap" value={"SWAP"} onClick={handleExchangeclick('error')} />
                </div>
                {/* <div className="field padding-bottom--24">
                  <input type="submit" name="deposit" value={"DEPOSIT"} onClick={deposit} />
                </div> */}
                <div className="field padding-bottom--24">
                  <input type="submit" name="withdraw" value={"WITHDRAW"} onClick={withdraw} />
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
