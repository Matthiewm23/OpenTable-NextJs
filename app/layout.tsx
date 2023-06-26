import NavBar from "./components/NavBar";
import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";
import { appWithTranslation } from "next-i18next";

// import dynamic from "next/dynamic";

// interface Configurations {
//   wssBaseUrl: string;
// }

// export const configs: Configurations = {
//   wssBaseUrl: process.env.NEXT_PUBLIC_BASE_API_URL ?? "ws://127.0.0.1:9944",
// };

// const chainConfigs = {
//   providerSocket: configs.wssBaseUrl,
//   appName: "Unit Restaurant Network",
// };

// const SubstrateConnectionLayout = dynamic(
//   () =>
//     import("ts-substrate-lib").then((data) => data.SubstrateConnectionLayout),
//   {
//     ssr: false,
//     loading: () => <></>,
//   }
// );

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <SubstrateConnectionLayout configs={chainConfigs}>
    <html lang="en">
      <head />
      <body>
        <main className="bg-gray-100 min-h-screen w-screen">
          <main className="max-w-screen-2xl m-auto bg-white">
            <NavBar />
            {children}
          </main>
        </main>
      </body>
    </html>
    // </SubstrateConnectionLayout>
  );
}
