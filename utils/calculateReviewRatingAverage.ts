import { Review } from "@prisma/client";
import { ReviewType } from "../app/page";


export const calculateReviewRatingAverage = (reviews: ReviewType[]) => {
  if (!reviews.length) return 0;

  return (
    reviews.reduce((sum, review) => {
      return sum + review.rating;
    }, 0) / reviews.length
  );
};
