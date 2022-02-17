import './App.css'
import { React, useEffect, useState } from 'react'
import { FOXIE_ABI, FOXIE_ADDRESS } from './abi/foxieabi.js'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './abi/contractabi.js'

const axios = require('axios')
const Web3 = require('web3')

function App() {
  const web3 = new Web3(Web3.givenProvider)

  const foxieabi = new web3.eth.Contract(FOXIE_ABI, FOXIE_ADDRESS)
  const contractabi = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)
  const [account, setAccount] = useState([])

  const handleConnectMetamask = async() => {
    if(account.lenght === 0)
      await web3.eth.requestAccounts() && await web3.eth.getAccounts().then(account => {
        setAccount(account[0])
      })
  }
  const sendToContract = async () => {
    const amount = document.getElementById('amount').value;
    const address = document.getElementById('address').value;
    console.log('here', amount, address)

    console.log("Has Cliked")
    await foxieabi.methods.approve(address, web3.utils.toWei(amount, 'ether')).send({ from: account })
    await foxieabi.methods.transfer(address, web3.utils.toWei(amount, 'ether')).send({ from: account })
  }
  const withDraw = async () => {
    const balanceOf = await foxieabi.methods.balanceOf(CONTRACT_ADDRESS).call()
    await contractabi.methods.withDraw(balanceOf, FOXIE_ADDRESS).send({ from: account }).then(rep => console.log(rep));
  }
  const getData = async () => {
    axios.get('http://localhost:3000/users')
    .then(res => console.log("Axios Res", res.data))
    .catch(err => console.log("error:", err))
  }

  useEffect(async () => {
    handleConnectMetamask
  }, [account]);


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
                  <span className="padding-bottom--15">{"Account:" + account}</span>
                  {/* <form id="stripe-login"> */}
                  <div className="field padding-bottom--24">
                    <label>Token Foxie</label>
                    <input type='' id='amount' placeholder='Deposit Amount' />
                  </div>
                  <div className="field padding-bottom--24">
                    <div className="grid--50-50">
                      <label>Send Adress To</label>
                      <div className="reset-pass">
                        <a onClick={handleConnectMetamask} style={{"cursor":"pointer"}}>{"Connect Metamask"}</a>  
                      </div>
                    </div>
                    <input type="" id="address" placeholder='Address' />
                  </div>
                  <div className="field field-checkbox padding-bottom--24 flex-flex align-center">
                    <label>
                      <input type="checkbox" name="checkbox" /> Stay signed in for a week
                    </label>
                  </div>
                  <div className="field padding-bottom--24">
                    <input type="submit" name="submit" value={"Send"} onClick={sendToContract} />
                  </div>

                  {/* </form> */}
                  <div className="field padding-bottom--24">
                    <input type="submit" name="submit" value={"withDraw"} onClick={withDraw} />
                  </div>
                  <div className="field padding-bottom--24">
                    <input type="submit" name="submit" value={"getData"} onClick={getData} />
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
