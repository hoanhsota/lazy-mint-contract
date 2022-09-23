import React, { useEffect } from "react";
import { ethers } from "ethers";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import PaymentContractInterface from "./contracts/Payment.json";
import { toast } from "react-toastify";

const SUPPORTED_CHAIN = Number(process.env.REACT_APP_CHAIN_ID);
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;

export default function NFT({ nft }) {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  const payment = [nft.orderID, nft.token, nft.amount];
  const { data, write, isError, error } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: PaymentContractInterface.abi,
    functionName: "purchase",
  });

  useEffect(() => {
    if (isError) {
      toast.error(error.reason);
    }
  }, [isError]);

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (d) => {
      console.log(d);
      toast("Successfully purchased payment!");
    },
    onError: (e) => {
      console.log(e);
      toast.error("Something went wrong");
    },
  });

  const mintHandler = async () => {
    if (!isConnected) return;
    write({
      recklesslySetUnpreparedArgs: payment,
    });
  };

  return (
    <>
      <div className="p-5 rounded-3xl shadow-md bg-white">
        <article key={nft.tokenID} className="rounded-3xl">
          <img
            src={nft.meta.image}
            alt={"Ghost IMG"}
            className="h-52 object-fit object-cover w-full lg:h-80 rounded-3xl"
          />

          <div className="p-5 pb-0 flex flex-col md:flex-row items-start md:items-center justify-between">
            <article className="flex items-center justify-start">
              <ul>
                <li className="text-slate-800 font-bold">
                  Order ID: #{nft.orderID}
                </li>
                <li className="text-slate-800 font-bold">{nft.meta.name}</li>
                <li className="text-sm text-slate-800 opacity-75 font-bold">
                  Giá: {ethers.utils.formatEther(nft.amount)} Token
                </li>
              </ul>
            </article>

            {isConnected && chain.id === SUPPORTED_CHAIN && (
              <>
                <article className="mt-5 md:mt-0">
                  <>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded"
                      onClick={mintHandler}
                      disabled={isLoading}
                    >
                      {isLoading ? "Purchasing..." : "Purchase now"}
                    </button>
                  </>
                </article>
              </>
            )}
          </div>
        </article>
      </div>
    </>
  );
}
