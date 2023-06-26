"use client";

import Link from "next/link";
import AuthModal from "./AuthModal";
import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthContext";
import useAuth from "../../hooks/useAuth";

export default function NavBar() {
  const { data, loading } = useContext(AuthenticationContext);
  const { signout } = useAuth();
  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable{" "}
      </Link>
    </nav>
  );
}

// import Link from "next/link";
// import { useRouter } from "next/router";
// import AuthModal from "./AuthModal";
// import { useContext } from "react";
// import { AuthenticationContext } from "../context/AuthContext";
// import useAuth from "../../hooks/useAuth";

// export default function NavBar() {
//   const router = useRouter();
//   const { locale } = router;
//   const { data, loading } = useContext(AuthenticationContext);
//   const { signout } = useAuth();

//   return (
//     <nav className="bg-white p-2 flex justify-between">
//       <Link href="/" className="font-bold text-gray-700 text-2xl">
//         {locale === "fr" ? "Table Ouverte" : "OpenTable"}
//       </Link>
//     </nav>
//   );
// }
