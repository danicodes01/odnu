import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import VideoPlayer from "@/components/ui/VideoPlayer";

interface Feed {
    id: string;
    title: string;
    date: string;
    description: string;
    mediaType: string;
    media: string;
    url: string;
  }

export default function NasaUpdate() {
    const [feed, setFeed] = useState<Feed[]>([]);

    const getFeed = useCallback(async () => {
      const apiKey = process.env.EXPO_PUBLIC_REACT_APP_NASA_API_KEY;
      const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
    
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("data: ", data);
    
        let mediaUrl = data.url;
        const twitterLink = data.explanation.match(/(https?:\/\/)?(pic\.twitter\.com\/\S+)/i);
        console.log("twitterLink: ", twitterLink);
        if (twitterLink && twitterLink[0]) {
          // Construct the full URL if needed
          mediaUrl = twitterLink[0].startsWith('http') ? twitterLink[0] : `https://${twitterLink[0]}`;
        }

        console.log("mediaUrlHereere!!!: ", mediaUrl);
    
        const refactorData: Feed[] = [
          {
            id: data.title,
            title: data.title,
            date: data.date,
            description: data.explanation,
            media: data.media,
            mediaType: data.media_type,
            url: mediaUrl,
          },
        ];
    
        setFeed(refactorData);
      } catch (error) {
        console.log(error);
      }
    }, []);    
  
    useEffect(() => {
      getFeed();
    }, [getFeed]);
  
    if (feed.length === 0) {
      return <ThemedText>No data available</ThemedText>;
    }
  
    const planet = feed[0]; // Since you're only using one planet in the data
  
    const isVideo = planet.media === "video" || planet.mediaType === "other"; // Check if it's a video or an image
    const headerContent = isVideo ? (
      console.log("planet.url", planet.url),
      <VideoPlayer videoUrl={planet.url} /> // Use the new VideoPlayer component for videos
    ) : (
      <Image
        source={{ uri: planet.url }}
        style={styles.media}
        resizeMode='cover'
      />
    );
  
    return (
      <ParallaxScrollView
        headerImage={headerContent} // Pass the image here as the headerImage prop
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      >
        <ThemedView style={styles.planetContainer}>
          <ThemedText style={styles.title}>{planet.title}</ThemedText>
          <ThemedText style={styles.date}>{planet.date}</ThemedText>
          <ThemedText style={styles.description}>{planet.description}</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    );
  };
  
  const { height } = Dimensions.get("window"); // Get the device height for dynamic layout
  
  const styles = StyleSheet.create({
    mediaContainer: {
      height: height * 0.5, // Media takes up 50% of the screen height
      width: "100%",
    },
    media: {
      height: "100%",
      width: "100%",
    },
    planetContainer: {
      padding: 15,
      borderRadius: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    date: {
      fontSize: 14,
      color: "#666",
      marginVertical: 10,
    },
    description: {
      fontSize: 16,
    },
  });
  
  
