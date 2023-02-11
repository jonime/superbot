import useSWR from "swr";
import { useRouter } from "next/router";
import {
  FormEventHandler,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";
import { getStringValue } from "./utils";
import { Message } from "./types";

export const useChat = () => {
  const router = useRouter();
  const thread = getStringValue(router.query.thread);

  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  const {
    data: messages,
    mutate,
    error,
  } = useSWR<Message[]>(thread && `/api/message/${thread}`, {
    refreshInterval: 5000,
  });

  useEffect(() => {
    if (error && thread) {
      router.replace({ query: {} });
    }
  }, [error, router, thread]);

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

  const newQuestion = () => {
    router.replace({ query: {} });
  };

  return {
    inThread: !!thread,
    messages,
    value,
    setValue,
    sending,
    onKeyDown,
    onSubmit,
    newQuestion,
  };
};
