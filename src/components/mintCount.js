import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DopeNft from "../utils/dopeNft.json";
const CONTRACT_ADDRESS = "0x1238E2c79e1a138974cc9f620D845AC540c55C4b";
const TOTAL_MINT_COUNT = 50;


const MintCount = () =>{
    const [mintCount, setmintCount] = useState(0);

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
  }, []);


  return(
    <div>
        <p className="header-small gradient-text-count"> Minted:&nbsp;{mintCount} / {TOTAL_MINT_COUNT}</p>
    </div>
  )};

  export default MintCount;