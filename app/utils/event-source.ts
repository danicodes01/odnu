import EventSource from 'react-native-event-source';

export const getEventSource = (prompt: { prompt: string }) => {
  const eventRouteProd = process.env.EXPO_PUBLIC_EVENT_ROUTE_PROD;
  const eventRouteDev = process.env.EXPO_PUBLIC_EVENT_ROUTE_DEV;
  return new EventSource(`http://${eventRouteDev}/chat`, {
  // return new EventSource(`http://${eventRouteProd}/chatHandler`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(prompt),
  });
};
