// "use client";
// import { partySize as partySizes, times } from "../../../../data";
// import DatePicker from "react-datepicker";
// import { useState } from "react";
// import useAvailabilities from "../../../../hooks/useAvailabilities";
// import { CircularProgress } from "@mui/material";
// import Link from "next/link";
// import {
//   convertToDisplayTime,
//   Time,
// } from "../../../../utils/convertToDisplayTime";

// export default function ReservationCard({
//   openTime,
//   closeTime,
//   slug,
// }: {
//   openTime: string;
//   closeTime: string;
//   slug: string;
// }) {
//   const { data, loading, error, fetchAvailabilities, setData } =
//     useAvailabilities();

//   const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
//   const [time, setTime] = useState(openTime);
//   const [partySize, setPartySize] = useState("2");
//   const [day, setDay] = useState(new Date().toISOString().split("T")[0]);

//   const handleChangeDate = (date: Date | null) => {
//     if (date) {
//       setDay(date.toISOString().split("T")[0]);
//       return setSelectedDate(date);
//     }
//     return setSelectedDate(null);
//   };

//   const handleClick = () => {
//     fetchAvailabilities({
//       slug,
//       day,
//       time,
//       partySize,
//     });
//     // const dat = { time: "17:30:00.000Z", available: true };
//     // setData([dat]);
//   };

//   const filterTimeByRestaurantOpenWindow = () => {
//     const timesWithinWindow: typeof times = [];

//     let isWithinWindow = false;

//     times.forEach((time) => {
//       if (time.time === openTime) {
//         isWithinWindow = true;
//       }
//       if (isWithinWindow) {
//         timesWithinWindow.push(time);
//       }
//       if (time.time === closeTime) {
//         isWithinWindow = false;
//       }
//     });

//     return timesWithinWindow;
//   };
//   return (
//     <div className="fixed w-[15%] bg-white rounded p-3 shadow">
//       <div className="text-center border-b pb-2 font-bold">
//         <h4 className="mr-7 text-lg">Make a Reservation</h4>
//       </div>
//       <div className="my-3 flex flex-col">
//         <label htmlFor="">Party size</label>
//         <select
//           name=""
//           className="py-3 border-b font-light"
//           id=""
//           value={partySize}
//           onChange={(e) => setPartySize(e.target.value)}
//         >
//           {partySizes.map((size) => (
//             <option value={size.value}>{size.label}</option>
//           ))}
//         </select>
//       </div>
//       <div className="flex justify-between">
//         <div className="flex flex-col w-[48%]">
//           <label htmlFor="">Date</label>
//           <DatePicker
//             selected={selectedDate}
//             onChange={handleChangeDate}
//             className="py-3 borber-b font-light text-reg w-24"
//             dateFormat="MMMM d"
//             wrapperClassName="w-[48%]"
//           />
//         </div>
//         <div className="flex flex-col w-[48%]">
//           <label htmlFor="">Time</label>
//           <select
//             name=""
//             id=""
//             className="py-3 border-b font-light"
//             value={time}
//             onChange={(e) => setTime(e.target.value)}
//           >
//             {filterTimeByRestaurantOpenWindow().map((time) => (
//               <option value={time.time}>{time.displayTime}</option>
//             ))}
//           </select>
//         </div>
//       </div>
//       <div className="mt-5">
//         <button
//           className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
//           onClick={handleClick}
//           disabled={loading}
//         >
//           {loading ? <CircularProgress color="inherit" /> : "Find a Time"}
//         </button>
//       </div>
//       {data ? (
//         <div className="mt-4">
//           <p className="text-reg">Select a Time</p>
//           <div className="flex flex-wrap mt-2">
//             {data.map((time) => {
//               return time.available ? (
//                 <Link
//                   href={`/reserve/${slug}?date=${day}T${time.time}&partySize=${partySize}`}
//                   className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
//                 >
//                   <p className="text-sm font-bold">
//                     {convertToDisplayTime(time.time as Time)}
//                   </p>
//                 </Link>
//               ) : (
//                 <p className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3"></p>
//               );
//             })}
//           </div>
//         </div>
//       ) : (
//         <div> Hello </div>
//       )}
//     </div>
//   );
// }

"use client";
import { partySize as partySizes, times } from "../../../../data";
import DatePicker from "react-datepicker";
import useAvailabilities from "../../../../hooks/useAvailabilities";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import {
  convertToDisplayTime,
  Time,
} from "../../../../utils/convertToDisplayTime";

import { ApiPromise, WsProvider } from "@polkadot/api";
import { useState, useEffect } from "react";

export default function ReservationCard({
  openTime,
  closeTime,
  slug,
}: {
  openTime: string;
  closeTime: string;
  slug: string;
}) {
  // const { data, loading, error, fetchAvailabilities, setData } =
  //   useAvailabilities();

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState(openTime);
  const [partySize, setPartySize] = useState(2);
  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);

  const [button, setButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<{ time: string; available: boolean }[]>([]);

  const [api, setApi] = useState(null);
  const [apiState, setApiState] = useState("CONNECTING");

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split("T")[0]);
      return setSelectedDate(date);
    }
    return setSelectedDate(null);
  };

  const handleClick = () => {
    // fetchAvailabilities({
    //   slug,
    //   day,
    //   time,
    //   partySize,
    // });
    // const dat = { time: "17:30:00.000Z", available: true };
    // setData([dat]);
    setButton(true);
  };

  useEffect(() => {
    const connect = async () => {
      const wsProvider = new WsProvider("ws://localhost:9944");
      const api = await ApiPromise.create({ provider: wsProvider });
      setApi(api);
      setApiState("READY");
    };

    connect();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setButton(false);
    }, 500);
  }, [selectedDate, time, partySize]);

  // useEffect(() => {
  //   if (apiState === "READY") {
  //     const getdata = async () => {
  //       if (apiState === "READY") {
  //         setLoading(true);

  //         const availabilitiesOpt =
  //           await api.query.restaurant.allAvailability();

  //         if (!availabilitiesOpt.isNone) {
  //           const availabilities = availabilitiesOpt.unwrap();
  //           const decoder = new TextDecoder();
  //           const allAvailabilities = availabilities.map((availability) => ({
  //             time: decoder.decode(availability.time),
  //             available: decoder.decode(availability.available) === "true",
  //           }));

  //           // const filteredAvailabilities = allAvailabilities.filter(
  //           //   (availability) =>
  //           //     decoder.decode(availability.restaurantSlug) === slug &&
  //           //     availability.party_size.toNumber() === partySize &&
  //           //     decoder.decode(availability.day) === day &&
  //           //     decoder.decode(availability.time) === time
  //           // );

  //           setLoading(false);
  //           // setData(filteredAvailabilities);
  //           const dat = { time: "17:30:00.000Z", available: true };
  //           setData([dat]);
  //         }
  //       }

  //       getdata();
  //     };
  //   }
  // }, [api]);

  useEffect(() => {
    if (apiState === "READY") {
      const getData = async () => {
        setLoading(true);

        const availabilitiesOpt = await api.query.restaurant.allAvailability();

        if (!availabilitiesOpt.isNone) {
          const availabilities = availabilitiesOpt.unwrap();
          const decoder = new TextDecoder();
          const allAvailabilities = availabilities.map((availability) => ({
            time: decoder.decode(availability.time),
            available: availability.available,
            restaurantSlug: decoder.decode(availability.restaurantSlug),
            partySize: availability.partySize.toNumber(),
            day: decoder.decode(availability.day),
          }));

          const filteredAvailabilities = allAvailabilities.filter(
            (availability) =>
              availability.restaurantSlug === slug &&
              availability.partySize === partySize &&
              availability.day === day &&
              availability.time === time
          );

          const dat = filteredAvailabilities.map((availability) => ({
            time: availability.time,
            available: availability.available,
          }));

          setLoading(false);
          setData(dat);
          // const dat = { time: "17:30:00.000Z", available: true };
          // setData([dat]);
          // setData(allAvailabilities);
        }
      };
      getData();
    }
  }, [api, selectedDate, time, partySize]);

  const filterTimeByRestaurantOpenWindow = () => {
    const timesWithinWindow: typeof times = [];

    let isWithinWindow = false;

    times.forEach((time) => {
      if (time.time === openTime) {
        isWithinWindow = true;
      }
      if (isWithinWindow) {
        timesWithinWindow.push(time);
      }
      if (time.time === closeTime) {
        isWithinWindow = false;
      }
    });

    return timesWithinWindow;
  };
  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div></div>
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name=""
          className="py-3 border-b font-light"
          id=""
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
        >
          {partySizes.map((size) => (
            <option value={size.value}>{size.label}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleChangeDate}
            className="py-3 borber-b font-light text-reg w-24"
            dateFormat="MMMM d"
            wrapperClassName="w-[48%]"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            name=""
            id=""
            className="py-3 border-b font-light"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {filterTimeByRestaurantOpenWindow().map((time) => (
              <option value={time.time}>{time.displayTime}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? <CircularProgress color="inherit" /> : "Find a Time"}
        </button>
      </div>
      {button && data ? (
        <div className="mt-4">
          <p className="text-reg">Select an available time</p>
          <div className="flex flex-wrap mt-2">
            {data.map((time) => {
              return time.available ? (
                <Link
                  href={`/reserve/${slug}?date=${day}T${time.time}&partySize=${partySize}`}
                  className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
                >
                  <p className="text-sm font-bold">
                    {convertToDisplayTime(time.time as Time)}
                  </p>
                </Link>
              ) : (
                <p className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3"></p>
              );
            })}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
