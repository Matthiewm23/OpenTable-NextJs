"use client";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import Description from "./components/Description";
import Images from "./components/Images";
import RestaurantNavBar from "./components/RestaurantNavBar";
import Title from "./components/Title";
import ReservationCard from "./components/ReservationCard";
import { TextDecoder } from "text-encoding";
import { RestaurantCardType } from "../page";
import ButtonReview from "./components/ButtonReview";

interface Props {
  restaurant: RestaurantCardType;
}

export default function RestaurantDetails({
  params,
}: {
  params: { slug: string };
}) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [api, setApi] = useState<ApiPromise | null>(null);
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

  useEffect(() => {
    if (apiState === "READY") {
      const getRestaurantData = async () => {
        const restaurantsOpt = await api.query.restaurant.allRestaurants();
        const reviewsOpt = await api.query.restaurant.allReviews();

        if (!restaurantsOpt.isNone) {
          const restaurants = restaurantsOpt.unwrap();
          const reviews = reviewsOpt.unwrap();

          const allRestaurants = restaurants.map((rawRestaurant: any) => {
            const decoder = new TextDecoder();

            return {
              id: rawRestaurant.id.toNumber(),
              name: decoder.decode(rawRestaurant.name),
              main_image: decoder.decode(rawRestaurant.mainImage),
              description: decoder.decode(rawRestaurant.description),
              open_time: decoder.decode(rawRestaurant.openTime),
              close_time: decoder.decode(rawRestaurant.closeTime),
              slug: decoder.decode(rawRestaurant.slug),
              images: rawRestaurant.images.map((image) =>
                decoder.decode(image)
              ),
              reviews: reviews
                .filter(
                  (review) =>
                    review.id.toNumber() === rawRestaurant.id.toNumber()
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

          const selectedRestaurant = allRestaurants.find(
            (restaurant: RestaurantCardType) => restaurant.slug === params.slug
          );

          setRestaurant(selectedRestaurant || null);
        }
      };

      getRestaurantData();
    }
  }, [api, params.slug]);

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <Title name={restaurant.name} />
        <Description description={restaurant.description} />
        <Images images={restaurant.images} />
        <h1 className="font-bold text-3xl mt-10 mb-7 border-b pb-5">
          What {restaurant.reviews.length} people
          {restaurant.reviews.length > 1 ? "s" : ""} are saying{" "}
        </h1>
        {restaurant.reviews?.map((review, index) => (
          <p key={index}>
            {review.firstname} {review.lastname} {" -"}
            {review.text}
            <br />
            <br />
          </p>
        ))}
      </div>
      <div className="w-[27%] relative text-reg">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <ReservationCard
            openTime={restaurant.open_time}
            closeTime={restaurant.close_time}
            slug={restaurant.slug}
          />
          <ButtonReview></ButtonReview>
        </div>
      </div>
    </>
  );
}
