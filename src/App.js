import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./styles/App.css";
import myEpicNft from './utils/MyEpicNFT.json';
import progresGif from "./assets/progress.gif";

// Constants
const TWITTER_HANDLE = "pkusma";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "https://testnets.opensea.io/assets/";
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0xEA17862D27b4C7EA695B190aB81Dccc4c462A378";

const App = () => {
  /*
  Just a state variable we use to store our user's public wallet. 
  Don't forget to import useState.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [isRightNetwork, setIsRightNetwork] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isWaitingConfiramtion, setIsWaitingConfiramtion] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [contractHash, setContractHash] = useState("");
  
  const checkIfWalletIsConnected = async () => {
    /*
     * First make sure we have access to window.ethereum
     */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    /*
     * Check if we're authorized to access the user's wallet
     */
    const accounts = await ethereum.request({ method: "eth_accounts" });

    /*
     * user can have multiple authorized accounts, we grab the first one if its there!
     */
    if (accounts.length > 0) {

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const goerliChainId = "0x5";
      if (chainId !== goerliChainId) {
        setIsRightNetwork(true);
        // alert("You are not connected to the Goerli Test Network!");
      } else {
        setIsRightNetwork(false);
        console.log("You are connected to goerli network!")
      }

      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("get metamask");
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener();

    } catch (error) {
      console.log(error);
    }
  };

   // Setup our listener.
   const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log("=== Minted finish: ", from, tokenId.toNumber())

          setTokenId(tokenId);

          // alert(`Hey there! We've minted your NFT and sent it to your wallet. 
          // It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the
          //  link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)

        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  )

  const renderMintGif = () => {
    return <img src = {progresGif} alt="minting animation"/>
  }

  const renderOpenSeaInfo = () =>{
    return <>
    { contractHash &&
      <div className="mintingInfo">
        <div className="trxInfo">Tx Hash: <a href={`https://goerli.etherscan.io/tx/${contractHash}`} target="_blank" rel="noreferrer">{contractHash}</a> </div>
        {tokenId && <div className="openSeaInfo">Opensea url: <a href={`${OPENSEA_LINK}/${CONTRACT_ADDRESS}/${tokenId}`} target="_blank" rel="noreferrer">{CONTRACT_ADDRESS}</a> </div>}
      </div>
  }
    </>
  }
  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        setIsWaitingConfiramtion(true);
   
        const provider = new ethers.providers.Web3Provider(ethereum);
        console.log(" 1 provider");
        
        const signer = provider.getSigner();
        console.log(" 2 signer");


        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();

        if (nftTxn){
          setContractHash(nftTxn.hash);
          setIsWaitingConfiramtion(false);
          setIsMinting(true);
        }

        console.log("Mining...please wait.");
        await nftTxn.wait();

        

        console.log(
          `Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
        );
        setIsMinting(false);
        setIsWaitingConfiramtion(false);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setIsMinting(false);
      setIsWaitingConfiramtion(false);
      console.log(error);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div className="container">
        
        <div className="header-container">
        <div className={isRightNetwork ? "alert-chain" : "hide-alert-chain"}>You are not connected to Goerli network, please switch it! </div>
          <p className="header gradient-text">Classic NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          
          {currentAccount === "" ? renderNotConnectedContainer() :  
          (isMinting ? renderMintGif() : renderMintUI())}
          {isWaitingConfiramtion && <div style={{color: 'white'}}><br/>Waiting confirmation! ...</div>}
        
        
        
        </div>

        {renderOpenSeaInfo()}

        <div className="footer-container">
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
