import React from "react";
import { useTronlink } from "use-tronlink";

const SUPPORTED_CHAIN = Number(process.env.REACT_APP_CHAIN_ID);
const ConnectButton = () => {
  const {
    address, // The connected wallet address
    walletName, // The wallet name
    trxBalance, // The wallet TRX balance
    isConnected, // A boolean checking it is connected or not
  } = useTronlink();

  if (isConnected) {
    return (
      <div>
        <button className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded">
          {`${address.slice(0, 4)}...${address.slice(38)}`}
        </button>
      </div>
    );
  }
};

export default ConnectButton;
