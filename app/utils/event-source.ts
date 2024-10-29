
import EventSource from 'react-native-event-source';

export const getEventSource = (prompt: { prompt: string }) => {
  const eventRouteProd = process.env.EXPO_PUBLIC_EVENT_ROUTE_PROD;
  const eventRouteDev = process.env.EXPO_PUBLIC_EVENT_ROUTE_DEV;
  return new EventSource(`http://localhost:8888/chat`, {
  // return new EventSource(`http://${eventRouteProd}/chatHandler`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(prompt),
  });
};


// import EventSource from 'react-native-event-source';

// export const getEventSource = (prompt: { prompt: string }) => {
//   const eventRouteProd = process.env.EXPO_PUBLIC_EVENT_ROUTE_PROD;
//   const eventRouteDev = process.env.EXPO_PUBLIC_EVENT_ROUTE_DEV;

//   const requestBody = {
//     chat_history: [],
//     text: prompt.prompt,
//   };
  
//   return new EventSource('http://localhost:8001/space-bot/stream', {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     method: "POST",
//     body: JSON.stringify(requestBody),
//   });
// };




 
