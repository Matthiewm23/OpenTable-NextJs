"use client";

import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import useReservation from "../../../../hooks/useReservation";
import { stringToU8a } from "@polkadot/util";
import { web3FromSource } from "@polkadot/extension-dapp";
import { waitReady } from "@polkadot/wasm-crypto";
import { useSubstrateConnection } from "ts-substrate-lib";
import { Keyring } from "@polkadot/keyring";

export default function Form({
  slug,
  date,
  partySize,
}: {
  slug: string;
  date: string;
  partySize: string;
}) {
  const [inputs, setInputs] = useState({
    bookerFirstName: "",
    bookerLastName: "",
    bookerPhone: "",
    bookerEmail: "",
    bookerOccasion: "",
    bookerRequest: "",
  });
  const [day, time] = date.split("T");
  const [disabled, setDisabled] = useState(true);
  const [didBook, setDidBook] = useState(false);
  const { error, loading, createReservation } = useReservation();
  const [api, setApi] = useState(null);
  const [account, setAccount] = useState(null);

  const [reservationMessage, setReservationMessage] = useState("");

  // const { substrateConnection } = useSubstrateConnection();

  // const { apiState, keyringState, api, currentAccount } = substrateConnection;

  useEffect(() => {
    if (
      inputs.bookerFirstName &&
      inputs.bookerLastName &&
      inputs.bookerEmail &&
      inputs.bookerPhone
    ) {
      return setDisabled(false);
    }
    return setDisabled(true);
  }, [inputs]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

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
    setReservationMessage("");

    // const injector = await web3FromSource(account.meta.source);
    const textEncoder = new TextEncoder();
    const helloBytes = textEncoder.encode("test".padEnd(35, "0"));

    const addreservation = api.tx.restaurant.addReservation(
      // textEncoder.encode(searchParams.slug),
      helloBytes,
      helloBytes,
      helloBytes,
      2
    );

    try {
      const hash = await addreservation.signAndSend(account, {
        signer: account.signer,
      });

      console.log("The hash : ", hash.toHex());
      setReservationMessage("Thanks for your reservation");
    } catch (error) {
      console.error("Error sending the transaction", error);
    }
  };

  return (
    <div className="mt-10 flex flex-wrap justify-between w-[660px]">
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
            value={inputs.bookerFirstName}
            name="bookerFirstName"
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            value={inputs.bookerLastName}
            placeholder="Last name"
            name="bookerLastName"
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            value={inputs.bookerPhone}
            placeholder="Phone number"
            name="bookerPhone"
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            value={inputs.bookerEmail}
            placeholder="Email"
            name="bookerEmail"
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Occasion (optional)"
            value={inputs.bookerOccasion}
            name="bookerOccasion"
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Requests (optional)"
            value={inputs.bookerRequest}
            name="bookerRequest"
            onChange={handleChangeInput}
          />
          <button
            disabled={disabled || loading}
            className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
            onClick={handleClick}
          >
            {loading ? (
              <CircularProgress color="inherit" />
            ) : (
              "Complete reservation"
            )}
          </button>
          {reservationMessage && (
            <div className="mt-4">
              <p className="text-reg">{reservationMessage}</p>
            </div>
          )}
          <p className="mt-4 text-sm">
            By clicking “Complete reservation” you agree to the OpenTable Terms
            of Use and Privacy Policy. Standard text message rates may apply.
            You may opt out of receiving text messages at any time.
          </p>
        </>
      )}
    </div>
  );
}
