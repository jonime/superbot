import { AppProps } from "next/app";
import { SWRConfig } from "swr";
import "../styles/global.css";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher }}>
      <Component {...pageProps} />
    </SWRConfig>
  );
}
