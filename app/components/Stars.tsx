import React from "react";
import fullStar from "../../public/icons/full-star.png";
import halfStar from "../../public/icons/half-star.png";
import emptyStar from "../../public/icons/empty-star.png";
import Image from "next/image";
import { Review } from "@prisma/client";
import { calculateReviewRatingAverage } from "../../utils/calculateReviewRatingAverage";
import { ReviewType } from "../../app/page";

export default function Stars({
  reviews,
  rating,
}: {
  reviews: ReviewType[];
  rating?: number;
}) {
  const reviewRating = rating || calculateReviewRatingAverage(reviews);

  const renderStars = () => {
    const stars = [];
    const roundedRating = Math.ceil(reviewRating);

    for (let i = 0; i < 5; i++) {
      if (i < roundedRating) {
        stars.push(fullStar);
      } else {
        stars.push(emptyStar);
      }
    }

    return stars.map((star, index) => {
      return (
        <div>
          <Image key={index} src={star} alt="" className="w-4 h-4 mr-1" />
        </div>
      );
    });
  };

  return <div className="flex items-center">{renderStars()}</div>;
}
