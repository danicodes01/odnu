import EventSource from "react-native-event-source";

const BASE_URL_AWS = process.env.EXPO_PUBLIC_EVENT_ROUTE_AWS; 

export interface RNEventSource {
  onerror?: ((this: EventSource, ev: { data: string | null }) => any) | null;
  onmessage?: ((this: EventSource, ev: { data: string | null }) => any) | null;
  onopen?: ((this: EventSource, ev: { data: string | null }) => any) | null;
  readyState?: number;
  close: () => void;
  addEventListener: (type: string, listener: (event: { data: string | null }) => void) => void;
}

export const getEventSource = (prompt: { prompt: string }, threadId: string): RNEventSource => {
  console.log("Creating EventSource connection...");
  return new EventSource(`${BASE_URL_AWS}/generate`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      question: prompt.prompt,
      thread_id: threadId,
    }),
  });
};

