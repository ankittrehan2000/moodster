import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ScaledSheet } from "react-native-size-matters";
import db from "../db";
import { imageObj } from "../functions/constants";

export default function EditScreen({ route, navigation }) {
  const { moodObj } = route.params;
  const [note, setNote] = useState(moodObj.noteToSelf);

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={[styles.infoContainer, bgColorer(moodObj.mood)]}>
        <View
          style={{
            height: "20%",
            width: "100%",
            justifyContent: "center",
            overflow: "hidden",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{ height: "150%", width: "150%" }}
            resizeMode="contain"
            source={imageObj(moodObj.mood)}
          ></Image>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.attribute}>Date</Text>
          <Text style={styles.value}>
            {new Date(moodObj.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            {new Date(moodObj.date).toLocaleTimeString()}
          </Text>
        </View>
        <View style={{ height: 2, width: '100%', alignSelf: 'center', backgroundColor: 'grey', marginVertical: 5 }}></View>
        {moodObj.sleep.length > 0 ? (
          <View>
          <View style={styles.rowContainer}>
            <Text style={styles.attribute}>Rest</Text>
            <Text style={styles.value}>
              {moodObj.sleep == "Rested" ? "Well rested" : "Not well rested"}
            </Text>
          </View>
          <View style={{ height: 2, width: '100%', alignSelf: 'center', backgroundColor: 'grey', marginVertical: 5 }}></View>
          </View>
        ) : null}
        {moodObj.activity.length > 0 ? (
          <View>
          <View style={styles.rowContainer}>
            <Text style={styles.attribute}>Activity</Text>
            <Text style={styles.value}>{moodObj.activity}</Text>
          </View>
          <View style={{ height: 2, width: '100%', alignSelf: 'center', backgroundColor: 'grey', marginVertical: 5 }}></View>
          </View>
        ) : null}
        {moodObj.social.length > 0 ? (
          <View>
          <View style={styles.rowContainer}>
            <Text style={styles.attribute}>Social Activity</Text>
            <Text style={styles.value}>{moodObj.social}</Text>
          </View>
          <View style={{ height: 2, width: '100%', alignSelf: 'center', backgroundColor: 'grey', marginVertical: 5 }}></View>
          </View>
        ) : null}
        {moodObj.social.length > 0 ? (
          <View>
          <View style={styles.rowContainer}>
            <Text style={styles.attribute}>Used Social Media?</Text>
            <Text style={styles.value}>{moodObj.socialMedia}</Text>
          </View>
                    <View style={{ height: 2, width: '100%', alignSelf: 'center', backgroundColor: 'grey', marginVertical: 5 }}></View>
                    </View>
        ) : null}
        {moodObj.weather.length > 0 ? (
          <View>
          <View style={styles.rowContainer}>
            <Text style={styles.attribute}>Weather</Text>
            <Text style={styles.value}>{moodObj.weather}</Text>
          </View>
          </View>
        ) : null}

        <TextInput
          value={note}
          style={styles.note}
          multiline={true}
          onChangeText={(text) => {
            setNote(text);
          }}
        />
      </View>
      <View style={styles.makeRow}>
        <TouchableOpacity
          onPress={() => {
            update(moodObj.id, note);
          }}
          style={[styles.btn, bgColorer(moodObj.mood)]}
        >
          <Text style={styles.btnText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "red" }]}
          onPress={() => {
            remove(moodObj.id);
            navigation.navigate("Advice");
          }}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <View style={{height: 200}}></View>
    </KeyboardAwareScrollView>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2ffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  btn: {
    width: "100@s",
    marginHorizontal: "5%",
    height: "20@vs",
    borderRadius: 20,
    height: "45@vs",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  btnText: {
    alignSelf: "center",
    fontSize: "15@s",
    fontFamily: "PatrickHand_400Regular",
  },
  infoContainer: {
    top: 0,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    paddingHorizontal: "5%",
    paddingBottom: "5%",
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: "2@vs",
  },
  attribute: {
    fontSize: "20@s",
    fontFamily: "PatrickHand_400Regular",
  },
  makeRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: "20@vs",
    justifyContent: "center"
  },
  value: {
    fontSize: "15@s",
    fontFamily: "PatrickHand_400Regular",
    alignSelf: "center",
  },
  note: {
    height: "200@vs",
    width: "95%",
    marginLeft: "2.5%",
    borderRadius: 20,
    backgroundColor: "white",
    marginVertical: "20@vs",
    fontFamily: "PatrickHand_400Regular",
    padding: "15@s",
    fontSize: "15@s",
  },
});

function bgColorer(mood) {
  switch (mood) {
    case "Happy":
      return { backgroundColor: "#b2f3b2" };
    case "Bored":
      return { backgroundColor: "#e5fbe5" };
    case "Annoyed":
      return { backgroundColor: "#ffffe0" };
    case "Angry":
      return { backgroundColor: "#fed8b1" };
    case "Nervous":
      return { backgroundColor: "#ebd8bd" };
    case "Sad":
      return { backgroundColor: "#ffcccb" };
  }
}

function update(id, note) {
  db.transaction((tx) => {
    tx.executeSql(
      "update moodster set noteToSelf = ? where id = ?",
      [note, id],
      (val) => {
        Alert.alert("Updated");
      },
      (err) => Alert.alert("Error Updating Value")
    );
  });
}

function remove(id) {
  db.transaction(async (tx) => {
    await tx.executeSql(
      "delete from moodster where id = ?",
      [id],
      (text) => {
        console.log("Deleted");
      },
      (err) => {
        console.log(err);
      }
    );
  });
}

//style this page
