"use client";
import { useEffect, useState } from "react";

import { stringToU8a } from "@polkadot/util";
import { web3FromSource } from "@polkadot/extension-dapp";
import { waitReady } from "@polkadot/wasm-crypto";
import { useSubstrateConnection } from "ts-substrate-lib";
import { Keyring } from "@polkadot/keyring";

import { ApiPromise, WsProvider } from "@polkadot/api";

export enum PriceType {
  REGULAR = "REGULAR",
  CHEAP = "CHEAP",
  EXPENSIVE = "EXPENSIVE",
}

export default function Form({
  searchParams,
}: {
  searchParams: { slug: string; id: number };
}) {
  const [api, setApi] = useState(null);
  const [account, setAccount] = useState(null);

  const [inputs, setInputs] = useState({
    FirstName: "",
    LastName: "",
    description: "",
    rating: null,
  });
  const [disabled, setDisabled] = useState(false);
  const [didBook, setDidBook] = useState(false);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.name === "rating" ? Number(e.target.value) : e.target.value;
    setInputs({
      ...inputs,
      [e.target.name]: value,
    });
  };

  // useEffect(() => {
  //   async function init() {
  //     const { web3Enable, web3Accounts } = await import(
  //       "@polkadot/extension-dapp"
  //     );
  //     const { ApiPromise, WsProvider } = await import("@polkadot/api");

  //     const provider = new WsProvider("ws://localhost:9944");
  //     const api = await ApiPromise.create({ provider });

  //     const allInjected = await web3Enable("My dapp");
  //     if (allInjected.length === 0) {
  //       console.error("No Account found");
  //       return;
  //     }

  //     const allAccounts = await web3Accounts();
  //     if (allAccounts.length === 0) {
  //       console.error("No Account found");
  //       return;
  //     }

  //     const account = allAccounts[0];

  //     setApi(api);
  //     setAccount(account);
  //   }

  //   init();
  // }, []);

  useEffect(() => {
    async function init() {
      const { ApiPromise, WsProvider } = await import("@polkadot/api");

      const provider = new WsProvider("ws://localhost:9944");
      const api = await ApiPromise.create({ provider });

      // Crée un compte Alice.
      const keyring = new Keyring({ type: "sr25519" });
      const account = keyring.addFromUri("//Alice");

      setApi(api);
      setAccount(account);
    }

    init();
  }, []);

  const handleClick = async () => {
    if (!api || !account) {
      console.error("API not initilized");
      return;
    }

    // const injector = await web3FromSource(account.meta.source);
    const textEncoder = new TextEncoder();
    // const helloBytes = textEncoder.encode(
    //   "test worktest worktest worktest worktest worktest worktest work"
    // );
    const helloBytes = textEncoder.encode("test".padEnd(50, "0"));

    console.log(inputs.FirstName.padEnd(50, "0"));

    const addreview = api.tx.restaurant.addReview(
      // textEncoder.encode(searchParams.slug.padEnd(35, "0")),
      helloBytes,
      helloBytes,
      helloBytes,
      helloBytes,

      // textEncoder.encode(inputs.FirstName.padEnd(20, "0")),
      // textEncoder.encode(inputs.LastName.padEnd(35, "0")),
      // textEncoder.encode(inputs.description.padEnd(35, "0")),
      inputs.rating,
      // searchParams.id,
      1,
      1
    );

    // try {
    //   const hash = await addreview.signAndSend(account.address, {
    //     signer: injector.signer,
    //   });

    try {
      const hash = await addreview.signAndSend(account, {
        signer: account.signer,
      });

      console.log("The hash : ", hash.toHex());
    } catch (error) {
      console.error("Error sending the transaction", error);
    }
  };

  return (
    <div className="mt-10 flex flex-wrap justify-between w-[660px] bg-white p-8">
      {didBook ? (
        <div>
          <h1>You are all booked up</h1>
          <p>Enjoy your reservation</p>
        </div>
      ) : (
        <>
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="First name"
            value={inputs.FirstName}
            name="FirstName"
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            value={inputs.LastName}
            placeholder="Last name"
            name="LastName"
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            value={inputs.description}
            placeholder="Description"
            name="description"
            onChange={handleChangeInput}
          />
          <input
            type="number"
            className="border rounded p-3 w-80 mb-4"
            value={inputs.rating}
            placeholder="Rating (1-5)"
            name="rating"
            min="1"
            max="5"
            onChange={handleChangeInput}
          />
          <button
            // disabled={disabled || loading}
            disabled={disabled}
            className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
            onClick={handleClick}
          >
            {/* {loading ? <CircularProgress color="inherit" /> : "Review"} */}
            Send your review
          </button>
          <p className="mt-4 text-sm">
            By clicking “Adding Review” you agree to the OpenTable Terms of Use
            and Privacy Policy. Standard text message rates may apply. You may
            opt out of receiving text messages at any time.
          </p>
        </>
      )}
    </div>
  );
}
