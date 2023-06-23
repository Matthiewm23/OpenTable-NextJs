This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Launch the node

You can cargo build --release this repository : https://github.com/Matthiewm23/UnitChainRestaurant.

Then launch the node with ./target/release/node-unitchain --dev.

# Run your front end

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

# The logic

With the genesis config file of the chain, 5 restaurants, few reviews and menu have been initialize. They will be display in the application.
You can use polkadotjs app to add through extrinsics reviews, restaurant. Easely changes could make possible to add menu.

At the moment, there is a little hack to allow someone to book through the website, this will be corrected : we just need to change the availability through a new extrinsic in the chain (currently, you could book several times the same thing).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
