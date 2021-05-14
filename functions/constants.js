import React from "react";
import { Image, StyleSheet } from "react-native";
export const imageObj = (val) => {
  switch (val) {
    case "Happy":
      return require("../assets/1.png");
    case "Bored":
      return require("../assets/4.png");
    case "Annoyed":
      return require("../assets/3.png");
    case "Nervous":
      return require("../assets/2.png");
    case "Angry":
      return require("../assets/5.png");
    case "Sad":
      return require("../assets/6.png");
  }
};

export const EmojiContainer = (val) => {
  switch (val) {
    case "Exercising":
      return (
        <Image
          source={require("../assets/exercise.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Eating":
      return (
        <Image
          source={require("../assets/food.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Working":
      return (
        <Image
          source={require("../assets/work.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Playing":
      return (
        <Image
          source={require("../assets/playing.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Studying":
      return (
        <Image
          source={require("../assets/studying.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Running Chores":
      return (
        <Image
          source={require("../assets/chores.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "TV":
      return (
        <Image
          source={require("../assets/tv.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Meditation":
      return (
        <Image
          source={require("../assets/meditation.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Rested":
      return (
        <Image
          source={require("../assets/well-rested.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Tired":
      return (
        <Image
          source={require("../assets/sleepy.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Sunny":
      return (
        <Image
          source={require("../assets/sunny.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Rain":
      return (
        <Image
          source={require("../assets/rain.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Cloudy":
      return (
        <Image
          source={require("../assets/cloudy.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Stormy":
      return (
        <Image
          source={require("../assets/stormy.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Snowing":
      return (
        <Image
          source={require("../assets/snowing.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Yes":
      return (
        <Image
          source={require("../assets/social-media.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "No":
      return (
        <Image
          source={require("../assets/nosocialmedia.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Family":
      return (
        <Image
          source={require("../assets/family.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "Friends":
      return (
        <Image
          source={require("../assets/friends.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
    case "None":
      return (
        <Image
          source={require("../assets/alonetime.png")}
          style={styles.moodImage}
          resizeMode="contain"
        />
      );
  }
};

const styles = StyleSheet.create({
  moodImage: { height: "100%", alignSelf: "flex-start", width: "13%" },
});
