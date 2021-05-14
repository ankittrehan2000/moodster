import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import db from "../db";
import { imageObj, EmojiContainer } from "../functions/constants";
import { useIsFocused } from '@react-navigation/native';

export default function Advice({ navigation }) {
  const [moodsArray, setMoodsArray] = React.useState([]);
  const isFocused = useIsFocused();

  const extractData = async () => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        "select * from moodster;",
        [],
        async (text, { rows: _array }) => {
          const array = await _array._array.reverse()
          if(array.length == 0){
            await setMoodsArray(null);
          }
          else {
            await setMoodsArray(array);
          }
        }
      );
    });
  };

  React.useEffect(() => {
    extractData();
  }, [isFocused]);

  //show image time date activities... and then onclick have an ability to delete or update note
  //update card colors
  if (moodsArray == null){
    return(
      <View style={{ flex:1 ,backgroundColor: '#f2ffff', alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
        <Text style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center'}}>No mood history found</Text>
      </View>
    )
  }
  else if (moodsArray.length == 0){
    return(
      <View style={{ flex:1 ,backgroundColor: '#f2ffff', alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
        <Text style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center'}}>Getting your mood history...</Text>
      </View>
    )
  }
  else{
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f2ffff" }}
      showsVerticalScrollIndicator={false}
    >
      {moodsArray.map((moodsObj, idx) => {
        return (
          <TouchableOpacity
            style={[styles.cardContainer, {paddingRight: 50}, bgColorer(moodsObj.mood)]}
            key={idx}
            onPress={() => navigation.navigate("Edit", { moodObj: moodsObj })}
          >
            <View
              style={{
                width: "50%",
                height: "80%",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <Image
                style={{ height: "150%", width: "150%", top: "30%" }}
                resizeMode="contain"
                source={imageObj(moodsObj.mood)}
              ></Image>
              <View style={styles.date}>
                <Text
                  style={[
                    styles.cardText,
                    {
                      fontSize: 23,
                      fontWeight: "bold",
                      marginBottom: 0,
                      alignSelf: "center",
                    },
                  ]}
                >
                  {new Date(moodsObj.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <View
                  style={{
                    height: 3,
                    backgroundColor: "black",
                    width: "55%",
                    alignSelf: "center",
                  }}
                ></View>
                <Text
                  style={[
                    styles.cardText,
                    {
                      fontSize: 18,
                      fontWeight: "bold",
                      marginTop: 0,
                      alignSelf: "center",
                    },
                  ]}
                >
                  {new Date(
                    moodsObj.date
                  ).toLocaleTimeString(navigator.language, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>
            <View
              style={{ marginTop: 20, overflow: "hidden", marginBottom: 20 }}
            >
              <View style={{ height: 25, overflow: 'hidden', display: 'flex',  flexDirection: 'row', width: '100%'}}>
              {EmojiContainer(moodsObj.activity)}
              {EmojiContainer(moodsObj.sleep)}
              {EmojiContainer(moodsObj.social)}
              {EmojiContainer(moodsObj.socialMedia)}
              {EmojiContainer(moodsObj.weather)}
              </View>
              <View style={{ width: "100%", marginTop: 10 }}>
                <Text
                  numberOfLines={3}
                  style={
                    (styles.cardText,
                    {
                      width: Dimensions.get("screen").width * 0.4,
                      marginTop: 11,
                      fontSize: 16,
                      fontFamily: 'PatrickHand_400Regular'
                    })
                  }
                >
                  {moodsObj.noteToSelf == null ? "No note entered" : moodsObj.noteToSelf}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );}
}

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

const styles = StyleSheet.create({
  cardContainer: {
    height: 180,
    paddingRight: 20,
    marginVertical: 25,
    display: "flex",
    flexDirection: "row",
    width: "95%",
    marginLeft: "2.5%",
    backgroundColor: "#f2ffff",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  date: {
    position: "absolute",
    top: 10,
    width: "100%",
  },
  cardText: {
    fontSize: 14,
    marginVertical: 10,
  },
});
// add view more button at the end which shows all entries
