import { ethers } from 'ethers';
import DopeNft from "../utils/dopeNft.json";

//Address of deployed contract
const CONTRACT_ADDRESS = "0x1238E2c79e1a138974cc9f620D845AC540c55C4b";
// Event listener to the capture event function from contract.   
export const mintEventListener = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          DopeNft.abi,
          signer
        );
  
        // Create connection to contract and emits (throws) it when from address and tokenId is passed in.
        connectedContract.on("newAlienNFT", (from, tokenId) => {
          //safe check we have the right data
          console.log(from, tokenId.toNumber());
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Click 'Ok' and we will take you to your new NFT!`
          );
          window.open(`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });
      } else {
        alert(`Oops something went wrong`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  