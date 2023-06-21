"use client";
import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import { PrismaClient, Cuisine, Location, PRICE, Review } from "@prisma/client";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";

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
  id: number;
  user_id: number;
}

export interface RestaurantCardType {
  id: number;
  name: string;
  main_image: string;
  cuisine: string;
  location: string;
  price: PRICE;
  slug: string;
  reviews: ReviewType[];
  description: string;
  images: string[];
}

const Home = () => {
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
          console.log("Hello");

          console.log(reviews);
          const allRestaurants = restaurants.map((restaurant) => {
            const decoder = new TextDecoder();
            return {
              id: restaurant.id.toNumber(),
              slug: decoder.decode(restaurant.slug),
              main_image: decoder.decode(restaurant.mainImage),
              name: decoder.decode(restaurant.name),
              cuisine_name: decoder.decode(restaurant.cuisineName),
              location_name: decoder.decode(restaurant.locationName),
              price: PriceType[restaurant.price],
              reviews: reviews
                .filter(
                  (review) => review.id.toNumber() === restaurant.id.toNumber()
                )
                .map((review) => ({
                  firstname: decoder.decode(review.firstname),
                  lastname: decoder.decode(review.lastname),
                  text: decoder.decode(review.text),
                  rating: review.rating.toNumber(),
                  id: review.id.toNumber(),
                  user_id: review.userId.toNumber(),
                })),
            };
          });

          setRestaurants(allRestaurants);
        }
      };
      getInfo();
    }
  }, [apiState]);

  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {restaurants.map((restaurant) => (
          <>
            <>
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            </>
          </>
        ))}
      </div>
    </main>
  );
};

export default Home;
