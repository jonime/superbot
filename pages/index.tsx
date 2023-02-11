import { useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import { useChat } from "../src/useChat";

export default function Home() {
  const {
    messages,
    inThread,
    onKeyDown,
    onSubmit,
    sending,
    value,
    setValue,
    newQuestion,
  } = useChat();

  const scrollerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <>
      <Head>
        <title>Ask superdevs?</title>
      </Head>
      <form onSubmit={onSubmit}>
        <div className={styles.container}>
          <div className={styles.box}>
            <div className={styles.chat}>
              {messages?.map((message, index) => (
                <div key={index}>
                  {message.from}: {message.text}
                </div>
              ))}
              <span ref={scrollerRef} />
            </div>

            <div className={styles.form}>
              <textarea
                value={value}
                onKeyDown={onKeyDown}
                onChange={(event) => setValue(event.currentTarget.value)}
                className={styles.input}
                rows={3}
              />

              <button disabled={sending}>Send</button>
            </div>
            <button
              type="button"
              onClick={newQuestion}
              style={{ visibility: inThread ? "initial" : "hidden" }}
            >
              New question
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
