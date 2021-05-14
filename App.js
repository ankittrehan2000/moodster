import HomePage from "./Pages/home";
import Activity from "./Pages/activity";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import EditScreen from "./Pages/edit";
import ExtraInfo from "./Pages/extraInfo";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import { Image, TouchableOpacity } from "react-native";
import WeatherExtraInfo from "./Pages/weatherAndActivities";
import Dashboard from "./Pages/dashboard";
import Advice from "./Pages/advice";
import { Dimensions, Text } from "react-native";
import { AntDesign } from 'react-native-vector-icons';
import {
  useFonts,
  PatrickHand_400Regular,
} from "@expo-google-fonts/patrick-hand";

const Stack = createStackNavigator();

async function _loadAssetsAsync() {
  const imageAssets = cacheImages([
    require("./assets/1.png"),
    require("./assets/2.png"),
    require("./assets/3.png"),
    require("./assets/4.png"),
    require("./assets/5.png"),
    require("./assets/6.png"),
    require("./assets/exercise.png"),
    require("./assets/food.png"),
    require("./assets/meditation.png"),
    require("./assets/alonetime.png"),
    require("./assets/chores.png"),
    require("./assets/cloudy.png"),
    require("./assets/music.png"),
    require("./assets/family.png"),
    require("./assets/nosocialmedia.png"),
    require("./assets/playing.png"),
    require("./assets/rain.png"),
    require("./assets/sleepy.png"),
    require("./assets/snowing.png"),
    require("./assets/social-media.png"),
    require("./assets/stormy.png"),
    require("./assets/studying.png"),
    require("./assets/sunny.png"),
    require("./assets/tv.png"),
    require("./assets/well-rested.png"),
    require("./assets/work.png"),
    require("./assets/friends.png"),
    require("./assets/wip.jpg"),
  ]);

  await Promise.all([...imageAssets]);
}

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
//rememeber to add splash in order to avoid errors

export default function App({navigation}) {
  const [loadApp, setLoadApp] = React.useState(false);
  let [fontsLoaded] = useFonts({
    PatrickHand_400Regular,
  });

  React.useEffect(() => {}, []);

  if (!loadApp) {
    return (
      <AppLoading
        startAsync={_loadAssetsAsync}
        onFinish={() => setLoadApp(true)}
        onError={console.warn}
      />
    );
  } else if(!fontsLoaded){
    return (
      <AppLoading />
    )
  }
   else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleStyle: {
              fontFamily: "PatrickHand_400Regular",
              fontSize: Dimensions.get("screen").height * 0.03,
            },
            headerStyle: {
              backgroundColor: "#f2ffff",
              borderBottomWidth: 0,
              elevation: 0,
              shadowColor: "transparent",
            },
          }}
        >
          <Stack.Screen name="Dashboard" component={Dashboard} options={{
            headerTitle: "Home"
          }} />
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Activity" component={Activity} />
          <Stack.Screen name="Edit" component={EditScreen} />
          <Stack.Screen name="ExtraInfo" component={ExtraInfo} />
          <Stack.Screen name="WeatherInfo" component={WeatherExtraInfo} />
          <Stack.Screen name="Advice" component={Advice} options={{
            headerTitle: "History"
          }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

//style graphs and show most recent entry shortcut
//add settings screen for notifs
//add info screen for every input
