/* eslint-disable @next/next/no-sync-scripts */
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import React from "react";
import "antd-button-color/dist/css/style.css";
import "../styles/antd.css";
import { Provider } from "react-redux";
import { store } from "../utils/redux/store";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <Head>
          <title>Wellness Events</title>
        </Head>
        <NextNProgress
          color="#3498db"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
          options={{
            easing: "ease",
            speed: 500,
          }}
        />
        {/* @ts-ignore */}
        <Component {...pageProps} />
      </SessionProvider>
    </Provider>
  );
}

export default MyApp;
