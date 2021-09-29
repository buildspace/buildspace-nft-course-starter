import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";

import { triggerContractToMint } from "./eth/mintFunction";
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  // state management for storing a users address
  const [ currentAcct, setCurrentAcct ] = useState("");

  /*
  * checking for meta mask wallet
  */
  const detectWalletConnection = async () =>{
    const { ethereum } = window;
    // signals if ethereum (Metamask) is not detected in the console for now
    // update to make an alert 
    if(!ethereum) {
        console.log("Make sure you have metamask");
        return;
      } else {
    console.log("We have the ethereum object!", ethereum);
    }
  
/*
  * Check authorization on a users wallet.
  * 'ethereum.request' using the method 'eth_accounts' allows for a check for any accounts that have been authorized.
*/
  const accounts = await ethereum.request({ method: 'eth_accounts'});
    
  //As long as is not zero can grab the first eth account availible.
  if (accounts.length !== 0) {
      const acct = accounts[0];
      // setting the account found to state
      setCurrentAcct(acct);
    } else {
      console.log("No Authorized Account Found");
  }
}
  // establish wallted conntection
  const walletConnect = async () =>{
    try {
      const { ethereum} = window;
      if(!ethereum){
        alert("Need to get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts"});
      // set wallet address to state once connected established
      console.log("Connected", accounts[0]);
      setCurrentAcct(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={walletConnect} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  // Mint button that renders if a Metamask account is connected.
  const renderMintButton = () =>(
    <button onClick={triggerContractToMint} className="cta-button connect-wallet-button">
      Mint Alien NFT
    </button>
  );
  // runs function on page load if wallet is connected
  useEffect(()=>{
    detectWalletConnection();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Back to the Ether NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          { currentAcct === "" ? renderNotConnectedContainer() : renderMintButton()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
