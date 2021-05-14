import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import db from "../db";
import { List } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign } from "react-native-vector-icons";

db.transaction(async (tx) => {
  await tx.executeSql(
    "create table if not exists moodster(id integer primary key, mood text, date date, activity text, noteToSelf text, sleep text, weather text, social text, socialMedia text);",
    [],
    (test) => console.log("created"),
    (a, err) => console.log(err)
  );
});

export default function Activity({ route, navigation }) {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "More Info",
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 20, alignSelf: "center" }}
          onPress={() => navigation.replace("Home")}
        >
          <AntDesign size={welpSize} name="arrowleft" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [activity, setActivity] = React.useState("");
  const [note, setNote] = React.useState(null);
  const { mood } = route.params;
  const [sleep, setSleep] = React.useState("");
  const [weather, setWeather] = React.useState("");
  const [social, setSocial] = React.useState("");
  const [socialMedia, setSocialMedia] = React.useState("");

  const moodInput = () => {
    db.transaction(async (tx) => {
      await tx.executeSql(
        "insert into moodster (mood, date, activity, noteToSelf, sleep, weather, social, socialMedia) values (?, ?, ?, ?, ?, ?, ?, ?);",
        [
          mood,
          new Date().toISOString(),
          activity,
          note,
          sleep,
          weather,
          social,
          socialMedia,
        ],
        (a, val) => console.log(val),
        (a, err) => console.log(err)
      );
    });
  };

  const welpSize = Dimensions.get("window").height * 0.03;

  return (
    <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: "#f2ffff" }}>
      <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          await moodInput();
          navigation.replace("Dashboard");
        }}
      >
        <Text style={styles.btnText}>Save</Text>
        <AntDesign size={welpSize} name="save" style={styles.submitBtn} />
      </TouchableOpacity>
      <Text style={styles.topText}>What were you doing?</Text>
      <List.Section>
        <List.Accordion title="Activity" titleStyle={styles.listTitle}>
          <View
            style={[styles.activityCard, { paddingVertical: 10, height: 420 }]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "90%",
                marginHorizontal: "5%",
                height: "33%",
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  setActivity("Exercising");
                }}
                style={[
                  styles.moodSize,
                  activity == "Exercising" && { borderColor: "gold" },
                ]}
              >
                <Image
                  source={require("../assets/exercise.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Exercise</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setActivity("Eating");
                }}
                style={[
                  styles.moodSize,
                  activity == "Eating" && { borderColor: "purple" },
                ]}
              >
                <Image
                  source={require("../assets/food.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Eating</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setActivity("Working");
                }}
                style={[
                  styles.moodSize,
                  activity == "Working" && { borderColor: "green" },
                ]}
              >
                <Image
                  source={require("../assets/work.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Work</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "90%",
                marginHorizontal: "5%",
                height: "33%",
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  setActivity("Playing");
                }}
                style={[
                  styles.moodSize,
                  activity == "Playing" && { borderColor: "darkred" },
                ]}
              >
                <Image
                  source={require("../assets/playing.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Playing</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setActivity("Studying");
                }}
                style={[
                  styles.moodSize,
                  activity == "Studying" && { borderColor: "darkblue" },
                ]}
              >
                <Image
                  source={require("../assets/studying.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Study</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setActivity("Running Chores");
                }}
                style={[
                  styles.moodSize,
                  activity == "Running Chores" && { borderColor: "pink" },
                ]}
              >
                <Image
                  source={require("../assets/chores.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Running Chores</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "90%",
                marginHorizontal: "5%",
                height: "33%",
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  setActivity("Music");
                }}
                style={[
                  styles.moodSize,
                  activity == "Music" && { borderColor: "darkred" },
                ]}
              >
                <Image
                  source={require("../assets/music.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Music</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setActivity("TV");
                }}
                style={[
                  styles.moodSize,
                  activity == "TV" && { borderColor: "black" },
                ]}
              >
                <Image
                  source={require("../assets/tv.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>TV</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setActivity("Meditation");
                }}
                style={[
                  styles.moodSize,
                  activity == "Meditation" && { borderColor: "silver" },
                ]}
              >
                <Image
                  source={require("../assets/meditation.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Meditation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </List.Accordion>
        <List.Accordion title="Sleep" titleStyle={styles.listTitle}>
          <View style={[styles.activityCard, { height: 200 }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "90%",
                marginHorizontal: "5%",
                height: "65%",
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  setSleep("Rested");
                }}
                style={[
                  styles.moodSize,
                  sleep == "Rested" && { borderColor: "green" },
                ]}
              >
                <Image
                  source={require("../assets/well-rested.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Well Rested</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setSleep("Tired");
                }}
                style={[
                  styles.moodSize,
                  sleep == "Tired" && { borderColor: "blue" },
                ]}
              >
                <Image
                  source={require("../assets/sleepy.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Tired/Not Rested</Text>
              </TouchableOpacity>
            </View>
          </View>
        </List.Accordion>
        <List.Accordion title="Weather" titleStyle={styles.listTitle}>
          <View style={styles.activityCard}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "90%",
                marginHorizontal: "5%",
                height: "33%",
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  setWeather("Sunny");
                }}
                style={[
                  styles.moodSize,
                  weather == "Sunny" && { borderColor: "gold" },
                ]}
              >
                <Image
                  source={require("../assets/sunny.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Sunny</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setWeather("Rain");
                }}
                style={[
                  styles.moodSize,
                  weather == "Rain" && { borderColor: "purple" },
                ]}
              >
                <Image
                  source={require("../assets/rain.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Rain</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setWeather("Cloudy");
                }}
                style={[
                  styles.moodSize,
                  weather == "Cloudy" && { borderColor: "green" },
                ]}
              >
                <Image
                  source={require("../assets/cloudy.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Cloudy</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "90%",
                marginHorizontal: "5%",
                height: "33%",
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  setWeather("Stormy");
                }}
                style={[
                  styles.moodSize,
                  weather == "Stormy" && { borderColor: "darkred" },
                ]}
              >
                <Image
                  source={require("../assets/stormy.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Stormy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setWeather("Snowing");
                }}
                style={[
                  styles.moodSize,
                  weather == "Snowing" && { borderColor: "darkblue" },
                ]}
              >
                <Image
                  source={require("../assets/snowing.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Snow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </List.Accordion>
        <List.Accordion
          title="Have you used Social Media recently?"
          titleStyle={styles.listTitle}
        >
          <View style={[styles.activityCard, { height: 200 }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "90%",
                marginHorizontal: "5%",
                height: "65%",
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  setSocialMedia("Yes");
                }}
                style={[
                  styles.moodSize,
                  socialMedia == "Yes" && { borderColor: "green" },
                ]}
              >
                <Image
                  source={require("../assets/social-media.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setSocialMedia("No");
                }}
                style={[
                  styles.moodSize,
                  socialMedia == "No" && { borderColor: "yellow" },
                ]}
              >
                <Image
                  source={require("../assets/nosocialmedia.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </List.Accordion>
        <List.Accordion title="Social Activities" titleStyle={styles.listTitle}>
          <View style={[styles.activityCard, { height: 200 }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "90%",
                marginHorizontal: "5%",
                height: "65%",
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  setSocial("Family");
                }}
                style={[
                  styles.moodSize,
                  social == "Family" && { borderColor: "orange" },
                ]}
              >
                <Image
                  source={require("../assets/family.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Family</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setSocial("Friends");
                }}
                style={[
                  styles.moodSize,
                  social == "Friends" && { borderColor: "red" },
                ]}
              >
                <Image
                  source={require("../assets/friends.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Friends</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setSocial("None");
                }}
                style={[
                  styles.moodSize,
                  social == "None" && { borderColor: "green" },
                ]}
              >
                <Image
                  source={require("../assets/alonetime.png")}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.explainText}>Alone Time</Text>
              </TouchableOpacity>
            </View>
          </View>
        </List.Accordion>
      </List.Section>
      <TextInput
        multiline={true}
        placeholder="Dear Moodster, I feel great today...."
        style={styles.textInp}
        value={note}
        onChangeText={(text) => setNote(text)}
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  topText: {
    fontSize: Dimensions.get('window').width * 0.09,
    fontWeight: "bold",
    fontFamily: "PatrickHand_400Regular",
    marginTop: 20,
    marginLeft: 20
  },
  moodImage: { height: "50%", width: "50%" },
  activityCard: {
    width: "90%",
    marginLeft: "5%",
    height: 400,
    borderRadius: 25,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 13,
  },
  opener: {
    height: 20,
    backgroundColor: "white",
    borderRadius: 20,
    left: "42%",
    width: "16%",
    top: "5%",
  },
  moodSize: {
    height: "100%",
    width: "27%",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  textInp: {
    height: 350,
    width: "90%",
    backgroundColor: "white",
    marginTop: 30,
    left: "5%",
    borderRadius: 50,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    fontFamily: "PatrickHand_400Regular",
    fontSize: 20,
    elevation: 13,
  },
  accordianTile: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  btnText: {
    alignSelf: "center",
    color: "black",
    fontFamily: "PatrickHand_400Regular",
    fontSize: Dimensions.get("window").width * 0.05,
  },
  logo: {
    fontSize: 50,
  },
  explainText: {
    fontFamily: "PatrickHand_400Regular",
    fontSize: 15,
  },
  listTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    fontFamily: "PatrickHand_400Regular",
  },
  btn: {
    height: Dimensions.get('window').height * 0.07,
    width: Dimensions.get('window').width * 0.3,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: "7%",
    justifyContent: "center",
    flexDirection: "row",
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
  submitBtn: {
    marginLeft: 5,
    alignSelf: 'center'
  },
});

//add who were you with section
