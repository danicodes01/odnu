import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';

interface VideoPlayerProps {
  videoUrl: string;
}

const { height } = Dimensions.get('window');

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  // Check if the video URL is a YouTube link
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  
  return isYouTube ? (
    <WebView
      source={{ uri: videoUrl.replace("watch?v=", "embed/") }} // Embedding YouTube URL
      style={styles.video}
      allowsFullscreenVideo
      javaScriptEnabled
      domStorageEnabled
      onError={(e) => console.error('YouTube WebView error:', e)}
    />
  ) : (
    <Video
      source={{ uri: videoUrl }} 
      style={styles.video2}
      useNativeControls
      resizeMode={ResizeMode.CONTAIN}
      shouldPlay
      onError={(e) => console.error('Video error:', e)}
    />
  );
};

const styles = StyleSheet.create({
  video: {
    height: height * 0.5,
    width: '100%',
  },
  video2: {
    height: height * 0.8,
    width: '100%',
    
  },
});

export default VideoPlayer;
