import Link from "next/link";

export default function ButtonReview() {
  return (
    <Link href="/review">
      <button
        className="fixed top-[850px] right-50 bg-red-600 rounded w-32 px-4 text-white font-bold h-16"
        onClick={() => {
          /* handle click event */
        }}
      >
        Add a Review
      </button>
    </Link>
  );
}
