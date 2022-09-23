import { useEffect, useState } from "react";
import "./App.css";
import NFT from "./NFT";
import ConnectButton from "./ConnectButton";
import PaymentOrders from "./paymentOrder.json";
import PaymentContractInterface from "./contracts/Payment.json";
import { useContract, useProvider } from "wagmi";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [payments, setPayments] = useState([]);
  const provider = useProvider();
  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: PaymentContractInterface.abi,
    signerOrProvider: provider,
  });

  useEffect(() => {
    (async () => {
      console.log(contract);
      if (contract && !payments.length) {
        setPayments(PaymentOrders);
      }
    })();
  }, []);

  return (
    <>
      <div className="container mx-auto px-5 2xl:px-0">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-start-1 col-end-3">
            <h6 className="text-slate-800 font-bold text-3xl md:text-2xl lg:text-5xl my-10 lg:mt-20 lg:mb-14">
              Kiki Payment Demo
            </h6>
          </div>
          <div className="col-end-7 col-span-2">
            <div className="my-10 lg:mt-20 lg:mb-14">
              <ConnectButton />
            </div>
          </div>
        </div>

        {!payments.length ? (
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
            {payments.map((nft, idx) => (
              <NFT key={idx} nft={nft} />
            ))}
          </section>
        )}
      </div>
    </>
  );
}

export default App;
