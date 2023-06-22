import React from "react";
import { PriceType } from "../page";

export default function Price({ price }: { price: PriceType }) {
  const renderPrice = () => {
    if (price === PriceType.CHEAP) {
      return (
        <>
          <span>$$</span> <span className="text-gray-400">$$</span>
        </>
      );
    } else if (price === PriceType.REGULAR) {
      return (
        <>
          <span>$$$</span> <span className="text-gray-400">$</span>
        </>
      );
    } else {
      return (
        <>
          <span>$$$$</span>
        </>
      );
    }
  };

  return <p className="flex mr-3">{renderPrice()}</p>;
}
