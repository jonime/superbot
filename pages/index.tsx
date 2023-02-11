import { useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import { useChat } from "../src/useChat";
import { Button, Paper, TextField } from "@mui/material";

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
            <Paper variant="elevation" className={styles.chat}>
              {messages?.map((message, index) => (
                <div key={index}>
                  {message.from}: {message.text}
                </div>
              ))}
              <span ref={scrollerRef} />
            </Paper>

            <div className={styles.form}>
              <TextField
                label="Ask superdevs?"
                value={value}
                onKeyDown={onKeyDown}
                onChange={(event) => setValue(event.currentTarget.value)}
                className={styles.input}
                multiline
              />

              <Button disabled={sending} variant="contained" color="success">
                Send
              </Button>
            </div>
            <Button
              type="button"
              variant="contained"
              onClick={newQuestion}
              style={{ visibility: inThread ? "initial" : "hidden" }}
            >
              New question
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
