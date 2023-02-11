import { AppProps } from "next/app";
import { SWRConfig } from "swr";
import "../styles/global.css";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (r.status >= 400) {
      return Promise.reject(new Error(r.statusText));
    }

    return r.json();
  });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher }}>
      <Component {...pageProps} />
    </SWRConfig>
  );
}
