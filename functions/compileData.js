import * as React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { PieChart } from "react-native-chart-kit";
export default function compileData(array, textString) {
  let length = array.length;
  let happy = 0,
    sad = 0,
    angry = 0,
    nervous = 0,
    bored = 0,
    annoyed = 0;
  for (let i = 0; i < length; i++) {
    switch (array[i].mood) {
      case "Happy":
        happy += 1;
        break;
      case "Sad":
        sad += 1;
        break;
      case "Angry":
        angry += 1;
        break;
      case "Nervous":
        nervous += 1;
        break;
      case "Bored":
        bored += 1;
        break;
      case "Annoyed":
        annoyed += 1;
    }
  }
  const data = [
    {
      name: "1",
      numEntries: happy,
      color: "darkgreen",
      legendFontColor: "darkgreen",
      legendFontSize: 15,
    },
    {
      name: "2",
      numEntries: bored,
      color: "green",
      legendFontColor: "green",
      legendFontSize: 15,
    },
    {
      name: "3",
      numEntries: annoyed,
      color: "yellow",
      legendFontColor: "yellow",
      legendFontSize: 15,
    },
    {
      name: "4",
      numEntries: nervous,
      color: "brown",
      legendFontColor: "brown",
      legendFontSize: 15,
    },
    {
      name: "5",
      numEntries: angry,
      color: "orange",
      legendFontColor: "orange",
      legendFontSize: 15,
    },
    {
      name: "6",
      numEntries: sad,
      color: "red",
      legendFontColor: "red",
      legendFontSize: 15,
    },
  ];
  const chartConfig = {
    backgroundColor: "blue",
    backgroundGradientFrom: "red",
    backgroundGradientTo: "blue",
    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  if(length == 0) return null
  return (
    <View
      style={[
        styles.chartContainer,
        {
          backgroundColor: "white",
          marginVertical: 20,
          borderRadius: 25,
          width: "95%",
          marginLeft: "2.5%",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Text style={styles.labelText}>
        PieChart of mood entries for the past {textString}
      </Text>
      <PieChart
        data={data}
        width={Dimensions.get("screen").width * 0.75}
        height={Dimensions.get("screen").height * 0.2}
        chartConfig={chartConfig}
        accessor="numEntries"
        style={{ marginLeft: "0%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  legendText: {
    fontSize: Dimensions.get("screen").height * 0.015,
    marginVertical: "1%",
    fontWeight: "bold",
  },
  chartContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  labelText: {
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 10,
    alignSelf: "center",
    fontFamily: "PatrickHand_400Regular",
    color: "#10365d",
  },
});

//make it resemble the first page colors
