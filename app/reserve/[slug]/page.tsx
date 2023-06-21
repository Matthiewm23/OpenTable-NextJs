"use client";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Form from "./components/Form";
import Header from "./components/Header";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import { RestaurantCardType } from "../../page";

interface Props {
  restaurant: RestaurantCardType;
}

export default function Reserve({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { date: string; partySize: string };
}) {
  const [api, setApi] = useState(null);
  const [apiState, setApiState] = useState("CONNECTING");
  const [restaurant, setRestaurant] = useState<RestaurantCardType[]>([]);

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
    if (apiState === "READY") {
      const getInfo = async () => {
        const restaurantsOpt = await api.query.restaurant.allRestaurants();
        if (restaurantsOpt.isNone) {
          setRestaurant([]);
        } else {
          const restaurants = restaurantsOpt.unwrap();

          const allRestaurants = restaurants.map((restaurant: any) => {
            const decoder = new TextDecoder();
            return {
              id: restaurant.id.toNumber(),
              slug: decoder.decode(restaurant.slug),
              main_image: decoder.decode(restaurant.mainImage),
              name: decoder.decode(restaurant.name),
              cuisine_name: decoder.decode(restaurant.cuisineName),
              location_name: decoder.decode(restaurant.locationName),
            };
          });

          const selectedRestaurant = allRestaurants.find(
            (restaurant: RestaurantCardType) => restaurant.slug === params.slug
          );

          setRestaurant(selectedRestaurant || null);
        }
      };
      getInfo();
    }
  }, [apiState]);

  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header
          image={restaurant.main_image}
          name={restaurant.name}
          date={searchParams.date}
          partySize={searchParams.partySize}
        />
        <Form
          partySize={searchParams.partySize}
          slug={params.slug}
          date={searchParams.date}
        />
      </div>
    </div>
  );
}
