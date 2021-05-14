import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { AppLoading } from "expo";
import {
  useFonts,
  PatrickHand_400Regular,
} from "@expo-google-fonts/patrick-hand";
import { ScaledSheet } from "react-native-size-matters";

export default function HomePage({ navigation }) {
  const [mood, setMood] = React.useState("");
  const display = mood == "" ? true : false;

  let [fontsLoaded] = useFonts({
    PatrickHand_400Regular,
  });

  React.useEffect(() => {}, [display]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Add a new entry",
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 20, alignSelf: "center" }}
          onPress={() => navigation.replace("Dashboard")}
        >
          <AntDesign
            size={Dimensions.get("screen").height * 0.03}
            name="arrowleft"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#f2ffff" }}>
        <Text style={styles.question}>
          How would you rate your mood this moment?
        </Text>
        <View style={styles.moodContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "90%",
              marginHorizontal: "5%",
              height: "40%",
              marginTop: "5%",
              marginBottom: "10%",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                setMood("Happy");
              }}
              style={[
                styles.moodSize,
                mood == "Happy" && { borderColor: "green" },
              ]}
            >
              <Image
                source={require("../assets/1.png")}
                style={{ height: "200%", width: "300%" }}
                resizeMode="contain"
              />
              <Text style={[styles.explainText, { color: "green" }]}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setMood("Bored");
              }}
              style={[
                styles.moodSize,
                mood == "Bored" && { borderColor: "#9dcd5a" },
              ]}
            >
              <Image
                source={require("../assets/4.png")}
                style={{ height: "300%", width: "300%" }}
                resizeMode="contain"
              />
              <Text style={[styles.explainText, { color: "#9dcd5a" }]}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setMood("Annoyed");
              }}
              style={[
                styles.moodSize,
                mood == "Annoyed" && { borderColor: "#ffde59" },
              ]}
            >
              <Image
                source={require("../assets/3.png")}
                style={{ height: "300%", width: "300%" }}
                resizeMode="contain"
              />
              <Text style={[styles.explainText, { color: "#ffde59" }]}>3</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "90%",
              marginHorizontal: "5%",
              height: "40%",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                setMood("Nervous");
              }}
              style={[
                styles.moodSize,
                mood == "Nervous" && { borderColor: "#4e1b04" },
              ]}
            >
              <Image
                source={require("../assets/2.png")}
                style={{ height: "300%", width: "300%" }}
                resizeMode="contain"
              />
              <Text style={[styles.explainText, { color: "#4e1b04" }]}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setMood("Angry");
              }}
              style={[
                styles.moodSize,
                mood == "Angry" && { borderColor: "#ffa500" },
              ]}
            >
              <Image
                source={require("../assets/5.png")}
                style={{ height: "300%", width: "300%" }}
                resizeMode="contain"
              />
              <Text style={[styles.explainText, { color: "#ffa500" }]}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setMood("Sad");
              }}
              style={[
                styles.moodSize,
                mood == "Sad" && { borderColor: "#ff0000" },
              ]}
            >
              <Image
                source={require("../assets/6.png")}
                style={{ height: "300%", width: "300%" }}
                resizeMode="contain"
              />
              <Text style={[styles.explainText, { color: "#ff0000" }]}>6</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.btn,
            display
              ? { backgroundColor: "#ececec" }
              : {
                  backgroundColor: "white",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.27,
                  shadowRadius: 4.65,

                  elevation: 6,
                },
          ]}
          disabled={display}
          onPress={async () => {
            await navigation.replace("Activity", { mood: mood });
            setMood("");
          }}
        >
          <Text style={styles.btnText}>Next Page</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = ScaledSheet.create({
  btnText: {
    alignSelf: "center",
    color: "black",
    fontFamily: "PatrickHand_400Regular",
    fontSize: "15@s",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    alignSelf: "center",
    marginLeft: 3,
  },
  moodSize: {
    height: "100%",
    width: "27%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    overflow: "hidden",
    alignContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  btn: {
    height: "10%",
    width: "30%",
    borderRadius: 25,
    alignSelf: "center",
    marginTop: "7%",
    justifyContent: "center",
    flexDirection: "row",
  },
  question: {
    fontSize: "30@vs",
    fontWeight: "bold",
    letterSpacing: 1.2,
    margin: 5,
    marginLeft: 10,
    marginTop: 20,
    fontFamily: "PatrickHand_400Regular",
    alignSelf: "center",
  },
  moodContainer: {
    height: 400,
    width: "90%",
    margin: "5%",
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 13,
  },
  explainText: {
    position: "absolute",
    bottom: "2%",
    fontSize: 20,
    fontFamily: "PatrickHand_400Regular",
  },
});

//in dashboard add a data processing to show what has been making the person sad/happy whatever - week
//remove data older than 365 days - add in description to see data a year old
