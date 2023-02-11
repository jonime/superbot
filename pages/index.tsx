import useSWR from "swr";
import { useRouter } from "next/router";
import {
  FormEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { getStringValue } from "../src/utils";
import styles from "../styles/Home.module.css";
import { Message } from "../src/types";

export default function Home() {
  const scrollerRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const [value, setValue] = useState("");
  const thread = getStringValue(router.query.thread);
  const [sending, setSending] = useState(false);

  const { data, mutate } = useSWR<Message[]>(
    thread && `/api/message/${thread}`,
    { refreshInterval: 5000 }
  );

  const onKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      onSubmit(event);
    }
  };

  const onSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    if (!value) {
      return;
    }

    try {
      setSending(true);

      const response = await fetch(
        `/api/message${thread ? `/${thread}` : ""}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: value,
        }
      );

      if (response.status === 429) {
        return alert(await response.text());
      }

      const json = await response.json();

      if (thread) {
        mutate();
      } else {
        router.replace({ query: { thread: json.thread } });
      }
    } finally {
      setSending(false);
    }

    setValue("");
  };

  useEffect(() => {
    scrollerRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [data]);

  return (
    <form onSubmit={onSubmit}>
      <div className={styles.container}>
        <div className={styles.box}>
          <h1>Ask superdevs?</h1>

          <div className={styles.chat}>
            {data?.map((message, index) => (
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
              cols={1}
              rows={3}
            />

            <button className={styles.sendButton} disabled={sending}>
              Send
            </button>
          </div>
          {thread && (
            <button
              className={styles.newButton}
              type="button"
              onClick={() => router.replace({ query: {} })}
            >
              New question
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
