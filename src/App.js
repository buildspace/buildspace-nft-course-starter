import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import MintComponent from "./components/mintComponent";
import Header from "./components/header";
import NftCard from "./components/nftCard";
import MintCount from "./components/mintCount";
import { mintEventListener } from "./eth/helperFunc";
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_HANDLE_ME = 'NickGonzalez__'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/back-to-the-ether-1"';


const App = () => {
  // state management for storing a users address
  const [ currentAcct, setCurrentAcct ] = useState("");

  // Checking for meta mask wallet.
  const detectWalletConnection = async () =>{
   
      const { ethereum } = window;
      if(ethereum.networkVersion != "4"){
      alert("Need to be on the Rinkeby Test net!");
      return;
      }
    // signals if ethereum (Metamask) is not detected in the console for now
    if (!ethereum) {
      console.log("Make sure you have metamask");
      return;
    } else {
      console.log("We have the ethereum object!", ethereum);
    }
    console.log(window.ethereum.networkVersion, 'window.ethereum.networkVersion');
    
    //Check authorization on a users wallet.'ethereum.request' using the method 'eth_accounts' allows for a check for any accounts that have been authorized.
    const accounts = await ethereum.request({ method: "eth_accounts" });
    //As long as it is not zero, it can grab the first eth account availible.
    if (accounts.length !== 0) {
      const acct = accounts[0];
      // setting the account found to state
      setCurrentAcct(acct);
      mintEventListener();
    } else {
      console.log("No Authorized Account Found");
    }
  }
  // Establish wallet conntection
 const walletConnect = async () => {
    try {
      const { ethereum } = window;
      if(ethereum.networkVersion != "4"){
        alert("Need to be on the Rinkeby Test net!");
        return;
      }
      if (!ethereum) {
        alert("Need to get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      // set wallet address to state once connected established
      console.log("Connected", accounts[0]);
      setCurrentAcct(accounts[0]);
      mintEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <div>
      <button onClick={walletConnect} className="cta-button connect-wallet-button">
        Connect to Wallet
      </button>
    </div>
  );

  const connectedWallet = () => (
    <div className="connected-wallet-status">
      <p className="sub-text"><span className="connection-status"></span>Walleted Connected</p>
      <MintComponent />
      <iframe src="https://giphy.com/embed/NDJWGU4n74di0" width="280" height="280" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
    </div>
  );


  // runs function on page load if wallet is connected
  useEffect(()=>{
    detectWalletConnection();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <Header />
        <div className="header-container">
          <p className="header gradient-text">Back to the Ether 🖖 NFT Collection </p>
          {/* <p className="header-small gradient-text">NFT Collection</p> */}
          <p className="sub-text">Each uniquely named.&nbsp; Each NOT of this 🌎.&nbsp; Discover your 👽 today.</p>
        {currentAcct === "" ? (
            renderNotConnectedContainer()
          ) : (
            connectedWallet()
          )}

          <NftCard opensea={OPENSEA_LINK}/>
          </div>
          <div className="body-container">
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <p className="footer-text">built by&nbsp;</p>
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE_ME}`}</a>
          <p>&nbsp;&nbsp;❌ &nbsp;&nbsp;</p>
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
          <div className="open-sea">
          <a className="opensea-img" href={OPENSEA_LINK} title="Buy on OpenSea" target="_blank"><img height="40px" width="120px" border-radius="5px" box-shadow="0px 1px 6px rgba(0, 0, 0, 0.25)" src="https://storage.googleapis.com/opensea-static/Logomark/Badge%20-%20Available%20On%20-%20Light.png" alt="Available on OpenSea" /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
