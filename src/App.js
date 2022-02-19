import './App.css'
import { React, useEffect, useState} from 'react'

const axios = require('axios')
const Web3 = require('web3')
function App() {
  const web3 = new Web3(Web3.givenProvider)
  const [dataRes, setDataRes] = useState();
  const [balance, setBalance] = useState();
  // const [network, setNetWork] = useState();
  const getAccount = async() => {
    const account = await web3.eth.getAccounts()
    const balance = await web3.eth.getBalance(account[0])
    const balanceFix = web3.utils.fromWei(balance, 'ether');
    setBalance(balanceFix)
  }
  let getNetwork = "";

  const getDataChainid = async () => {
    const getChainId = await web3.eth.getChainId();
    await axios({
      method: 'get',
      url: 'http://localhost:3001/chainids',
      responseType: 'chainid'
    }).then(datas => {
      for(let i = 0; i<4; i++)
        if(getChainId == datas.data[i].chainId)
          getNetwork = datas.data[i].network
          setDataRes(getNetwork)
    })
  }
  useEffect(async() => {
    getDataChainid()
    getAccount()
    await window.ethereum.on('chainChanged', (chainId) => {
        setDataRes(chainId)
    })
  }, [dataRes]);


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
              <h1><a href={"#"}> Decentralized App</a></h1>
            </div>
            <div className="formbg-outer">
              <div className="formbg">
                <div className="formbg-inner padding-horizontal--48">
                  <span className="padding-bottom--15"></span>
                  {/* <form id="stripe-login"> */}
                  <div className="field">
                    <label>{dataRes}</label>
                    <input type='' id='amount' placeholder='Deposit Amount' />
                    <label style={{"padding": 10}}>Balance: {balance}</label>
                  </div>
                  <div className="field padding-bottom--24">
                    <select style={{"padding": 5}} placeholder={"Choose network to swap"}>
                      <option value={"Ethereum Mainet"}>Ethereum Mainet</option>
                      <option value={"Ethereum Mainet"}>Ethereum Mainet</option>
                      <option value={"Ethereum Mainet"}>Ethereum Mainet</option>
                      <option value={"Ethereum Mainet"}>Ethereum Mainet</option>
                      <option value={"Ethereum Mainet"}>Ethereum Mainet</option>
                    </select>
                    <input type='' id='amount' placeholder='Deposit Amount' />
                  </div>
                  <div className="field padding-bottom--24">
                    <input type="submit" name="submit" value={"SWAP"}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;
