// import {useState} from "react"
// import axios from "axios"

// export default function useAvailabilities(){
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState(null)
//     const [data, setData] = useState<{time: string; available: boolean}[] | null>(null)


//     const fetchAvailabilities = async ({slug, partySize, day, time}: {slug: string; partySize: string; day: string; time: string}) => {
//         setLoading(true)

//         try {
//             const response = await axios.get(`http://localhost:3000/api/restaurant/${slug}/availability`, {
//                 params: {
//                     day,
//                     time,
//                     partySize
//                 }
//             });
//             console.log(response)
//             setLoading(false)
//             setData(response.data)
//         } catch (error: any) {
//             setLoading(false)
//             setError(error.response.data.errorMessage)
//         }

//     }

//     return {loading, data, error, fetchAvailabilities}

// }

'use client'
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useState, useEffect } from "react";


export default function useAvailabilities() {




  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<{ time: string; available: boolean }[]>([]);

  const [api, setApi] = useState(null);
  const [apiState, setApiState] = useState("CONNECTING");




  useEffect(() => {
    const connect = async () => {
      const wsProvider = new WsProvider("ws://localhost:9944");
      const api = await ApiPromise.create({ provider: wsProvider });
      setApi(api);
      setApiState("READY");
    };

    connect();
  }, []);

  const fetchAvailabilities = async ({ slug, partySize, day, time }) => {
    if (apiState === "READY") {
      setLoading(true);

      try {
        const availabilitiesOpt = await api.query.restaurant.allAvailability();

        if (!availabilitiesOpt.isNone) {
          const availabilities = availabilitiesOpt.unwrap();
          const decoder = new TextDecoder();
          const allAvailabilities = availabilities.map((availability) => ({
            time: decoder.decode(availability.time),
            available: decoder.decode(availability.available) === 'true',
          }));

          const filteredAvailabilities = allAvailabilities.filter(
            (availability) =>
              decoder.decode(availability.restaurant_slug) === slug &&
              availability.party_size.toString() === partySize &&
              decoder.decode(availability.day) === day &&
              decoder.decode(availability.time) === time
          );

          setLoading(false);
          setData(filteredAvailabilities);

      

    }



      } catch (error) {
        setLoading(false);
      }
    }
  };

  return { loading, data, error, fetchAvailabilities, setData };
}
