import { ethers } from 'ethers';
import DopeNft from "../utils/dopeNft.json";
import React, { useState, useEffect } from 'react';
import MineLoader from "./loading";
//Address of deployed contract
const CONTRACT_ADDRESS = "0x1238E2c79e1a138974cc9f620D845AC540c55C4b";
;

const MintComponent = ()=>{
  const [mining, setMining ] = useState(false);
  const [mintCount, setmintCount] = useState(0)
// Call to the contract to mint NFT 
 const triggerContractToMint = async () => {
   
    try {
        const { ethereum } = window;
        console.log('here', CONTRACT_ADDRESS);
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, DopeNft.abi, signer);
            let nftAmount = connectedContract.getTotalMints();
            // console.log(nftAmount);
            // console.log("Going to pop wallet now to pay gas...");
            let nftTranx = await connectedContract.constructDopeNft();
            setMining(true);
            // console.log("Mining...please wait.")
            await nftTranx.wait();
            setMining(false);
            console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTranx.hash}`);
    
          } else {
            console.log("Ethereum object doesn't exist!");
          }
            } catch (error) {
          console.log(error)
        }
    };

    const getNftCount = async () => {
      try {
        const { ethereum } = window;
        console.log('here', CONTRACT_ADDRESS);
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, DopeNft.abi, signer);
            let nftAmount = await connectedContract.getTotalMints();
            let amount = parseInt(nftAmount)
            setmintCount(amount);
        }
    } catch (error) {
      console.log(error);
    }
  }


useEffect(()=>{
    getNftCount()
}, [])

    if(mining) {
      return <MineLoader />;
    }


  return (
  <div>
    <button onClick={triggerContractToMint} className="cta-button mint-button">
      Mint My Alien NFT !
    </button>
  </div>
  )
};

export default MintComponent;