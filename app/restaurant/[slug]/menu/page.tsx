"use client";

import Menu from "../components/Menu";
import RestaurantNavBar from "../components/RestaurantNavBar";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";

export default function RestaurantMenu({
  params,
}: {
  params: { slug: string };
}) {
  const [menu, setMenu] = useState<Menu | null>(null);
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
      const getMenuData = async () => {
        const menuOpt = await api.query.restaurant.allMenu();

        if (!menuOpt.isNone) {
          const menue = menuOpt.unwrap();
          const menus = menue.map((rawMenu: any) => {
            const decoder = new TextDecoder();

            return {
              id: rawMenu.id.toNumber(),
              name: decoder.decode(rawMenu.name),
              price: decoder.decode(rawMenu.price),
              description: decoder.decode(rawMenu.description),
              restaurant_id: rawMenu.restaurantId.toNumber(),
              created_at: decoder.decode(rawMenu.createdAt),
              updated_at: decoder.decode(rawMenu.updatedAt),
            };
          });

          setMenu(menus || null);
        }
      };

      getMenuData();
    }
  }, [api, params.slug]);

  return (
    <>
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <RestaurantNavBar slug={params.slug} />
        <Menu menu={menu} />
      </div>
    </>
  );
}
