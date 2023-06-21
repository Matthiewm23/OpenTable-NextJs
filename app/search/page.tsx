"use client";
import { PRICE, PrismaClient } from "@prisma/client";
import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import SearchSideBar from "./components/SearchSideBar";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";

// const prisma = new PrismaClient();

interface SearchParams {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

export enum PriceType {
  REGULAR = "REGULAR",
  CHEAP = "CHEAP",
  EXPENSIVE = "EXPENSIVE",
}

export interface ReviewType {
  firstname: string;
  lastname: string;
  text: string;
  rating: number;
  restaurant_id: number;
  user_id: number;
}

export interface RestaurantCardType {
  // id: number;
  name: string;
  main_image: string;
  cuisine: string;
  location: string;
  price: PRICE;
  slug: string;
  reviews: ReviewType[];
}

export default function Search({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [api, setApi] = useState(null);
  const [apiState, setApiState] = useState("CONNECTING");
  const [restaurants, setRestaurants] = useState<RestaurantCardType[]>([]);

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
        const reviewsOpt = await api.query.restaurant.allReviews();

        if (restaurantsOpt.isNone) {
          setRestaurants([]);
        } else {
          const restaurants = restaurantsOpt.unwrap();
          const reviews = reviewsOpt.unwrap();
          const allRestaurants = restaurants.map((restaurant) => {
            const decoder = new TextDecoder();
            return {
              slug: decoder.decode(restaurant.slug),
              main_image: decoder.decode(restaurant.mainImage),
              name: decoder.decode(restaurant.name),
              cuisine: decoder.decode(restaurant.cuisineName),
              location: decoder.decode(restaurant.locationName),
              price: PriceType[restaurant.price],
              reviews: reviews.filter(
                (review) => review.restaurant_id === restaurant.id
              ),
            };
          });

          if (searchParams.city) {
            const filteredRestaurants = allRestaurants.filter(
              (restaurant) =>
                restaurant.location.toLowerCase() ===
                searchParams.city.toLowerCase()
            );
            setRestaurants(filteredRestaurants);
          } else {
            setRestaurants(allRestaurants);
          }
        }
      };
      getInfo();
    }
  }, [apiState, searchParams.city]);

  // const restaurants = await fetchRestaurantsByCity(searchParams);
  // const location = await fetchLocations();
  // const cuisine = await fetchCuisines();
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          // locations={location}
          // cuisines={cuisine}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length ? (
            <>
              {restaurants.map((restaurant) => (
                <RestaurantCard restaurant={restaurant} key={restaurant.id} />
              ))}
            </>
          ) : (
            <p>Sorry, we found no restaurants in this area</p>
          )}
        </div>
      </div>
    </>
  );
}
