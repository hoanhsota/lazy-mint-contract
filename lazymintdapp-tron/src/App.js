import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import NFT from "./NFT";
import NFTVouchers from "./NFTVouchers.json";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

const waitTron = () => {
  return new Promise((resolve, reject) => {
    let attempts = 0,
      maxAttempts = 100;

    const checkTron = () => {
      if (window.tronWeb) {
        resolve(true);
      }
      attempts++;
      if (attempts >= maxAttempts) {
        reject(false);
      }
      setTimeout(checkTron, 100);
    };

    checkTron();
  });
};

function App() {
  const [nfts, setNfts] = useState([]);
  const [address, setAddress] = useState([]);
  const [contract, setContract] = useState([]);
  const [isConnected, setIsConnected] = useState([]);

  const connectToWallet = useCallback(async (): Promise<boolean> => {
    if (window.tronLink) {
      await window.tronLink.request({ method: "tron_requestAccounts" });
    }

    if (!window.tronWeb) return false;

    const { name, base58 } = window.tronWeb.defaultAddress;

    if (base58) {
      setAddress(base58);
      setIsConnected(true);
      let tronweb = window.tronWeb;
      const trxAmount = await tronweb.trx.getBalance(base58);
      console.log(tronweb.defaultAddress.base58);
      console.log({ tronWeb: window.tronWeb.trx });
      console.log({ balance: trxAmount });
      console.log({ CONTRACT_ADDRESS });

      console.log(await tronweb.contract());
      try {
        const contract = await tronweb.contract().at(CONTRACT_ADDRESS);
        console.log({ contract });

        tronLinkEventListener();
        setContract(contract);
        return true;
      } catch (e) {
        console.log({ e });
      }
    }

    setIsConnected(false);
    return false;
  }, []);

  const cleanData = useCallback(() => {
    setIsConnected(false);
    setAddress("");
  }, []);

  const tronLinkEventListener = useCallback(() => {
    window.addEventListener("load", connectToWallet);

    window.addEventListener("message", async (msg) => {
      const { message } = msg.data;

      if (!message) return;

      if (
        message.action === "setAccount" ||
        message.action === "setNode" ||
        message.action === "tabReply" ||
        message.action === "accountsChanged"
      ) {
        if (message.data.address) {
          await connectToWallet();
        }

        if (message.action !== "tabReply" && !message.data.address) {
          cleanData();
        }
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      await connectToWallet();
      if (!nfts.length) {
        console.log({ NFTVouchers });
        const promises = NFTVouchers.map(async (n, idx) => {
          let ownerAddress = null;
          try {
            ownerAddress = await contract.ownerOf(n.tokenID);
          } catch (error) {}
          NFTVouchers[idx].owner = ownerAddress;
        });
        await Promise.all(promises);
        setNfts(NFTVouchers);
      }
    })();
  }, []);

  return (
    <>
      <div className="container mx-auto px-5 2xl:px-0">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-start-1 col-end-3">
            <h6 className="text-slate-800 font-bold text-3xl md:text-2xl lg:text-5xl my-10 lg:mt-20 lg:mb-14">
              Lazy NFTs
            </h6>
          </div>
          <div className="col-end-7 col-span-2">
            <div className="my-10 lg:mt-20 lg:mb-14">
              <div>
                {isConnected && address ? (
                  <button className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded">
                    {`${address.slice(0, 4)}...${address.slice(38)}`}
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>

        {!nfts.length ? (
          <>
            <div
              className="flex items-center justify-center"
              style={{
                height: "40vh",
              }}
            >
              <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
              <p>Loading...</p>
            </div>
          </>
        ) : (
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 pb-20 lg:container">
            {nfts.map((nft, idx) => (
              <NFT key={idx} nft={nft} />
            ))}
          </section>
        )}
      </div>
    </>
  );
}

export default App;
