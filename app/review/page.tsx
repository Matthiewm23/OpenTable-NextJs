"use client";

import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { stringToU8a } from "@polkadot/util";
import { web3FromSource } from "@polkadot/extension-dapp";
import { waitReady } from "@polkadot/wasm-crypto";
import { useSubstrateConnection } from "ts-substrate-lib";

export default function Form() {
  const [inputs, setInputs] = useState({
    FirstName: "",
    LastName: "",
    description: "",
  });
  const [disabled, setDisabled] = useState(false);
  const [didBook, setDidBook] = useState(false);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
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
          <button
            // disabled={disabled || loading}
            disabled={disabled}
            className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
            // onClick={handleClick}
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
