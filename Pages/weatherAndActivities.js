import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import db from "../db";
import { LineChart, Grid, XAxis, BarChart } from "react-native-svg-charts";
import * as scale from "d3-scale";
import * as SVG from "react-native-svg";
import { ScrollView } from "react-native-gesture-handler";
import avgFinder from "./avgFinder";
import DropDownPicker from "react-native-dropdown-picker";
import { AntDesign } from "@expo/vector-icons";

const fontName = "PatrickHand_400Regular";

export default function WeatherExtraInfo({ navigation }) {
  const [sunnyArray, setSunnyArray] = useState([]);
  const [Rain, setRainArray] = useState([]);
  const [Cloudy, setCloudyArray] = useState([]);
  const [Stormy, setStormyArray] = useState([]);
  const [Snowing, setSnowingArray] = useState([]);
  const [allArray, setAllArray] = useState([]);
  const [pastArray, setPastArray] = useState([]);
  const [constraint, setConstraint] = useState('');

  useEffect(() => {
    extractDataForAll();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{marginLeft: 20, alignSelf: 'center'}} onPress={() => navigation.replace("Dashboard")}>
          <AntDesign size={Dimensions.get("screen").height * 0.03} name="arrowleft" />
        </TouchableOpacity>
      )
    })
  }, [navigation])

  const extractDataForAll = async () => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        "select * from moodster where weather=?",
        ["Sunny"],
        async (text, { rows: _array }) => {
          await setSunnyArray(_array._array);
        }
      );
      await tx.executeSql(
        "select * from moodster where weather=?",
        ["Rain"],
        async (text, { rows: _array }) => {
          await setRainArray(_array._array);
        }
      );
      await tx.executeSql(
        "select * from moodster where weather=?",
        ["Cloudy"],
        async (text, { rows: _array }) => {
          await setCloudyArray(_array._array);
        }
      );
      await tx.executeSql(
        "select * from moodster where weather=?",
        ["Stormy"],
        async (text, { rows: _array }) => {
          await setStormyArray(_array._array);
        }
      );
      await tx.executeSql(
        "select * from moodster where weather=?",
        ["Snowing"],
        async (text, { rows: _array }) => {
          await setSnowingArray(_array._array);
        }
      );
      await tx.executeSql(
        "select * from moodster",
        ["None"],
        async (text, { rows: _array }) => {
          await setAllArray(_array._array);
        }
      );
    });
  };

  const returnChartVal = (array1, array2, array3, textString) => {
    const string = (array1.length > 10 || array2.length > 10 || array3.length > 10) ? '*Limited to 10 entries for factor' : ''
    array1 = moodReturner(array1.slice(-10));
    array2 = moodReturner(array2.slice(-10));
    array3 = moodReturner(array3.slice(-10));
    let data = [
      {
        data: array1,
        svg: { stroke: "purple", strokeWidth: 2 },
      },
      {
        data: array2,
        svg: { stroke: "#1b61ab", strokeWidth: 2 },
      },
      {
        data: array3,
        svg: { stroke: "red", strokeWidth: 2 },
      },
    ];
    let maxVal = Math.max(array1.length, array2.length, array3.length);
    let labels = [...Array(maxVal).keys()].map((i) => i + 1);

    const Decorator = ({ x, y, data }) => {
      return data.map((obj) => {
        return obj.data.map((value, index) => (
          <SVG.Circle
            key={index}
            cx={x(index)}
            cy={y(value)}
            r={4}
            stroke={'white'}
            fill={bgColorer(value)}
          />
        ));
      });
    };

    return (
      <View style={styles.lineCharContainer}>
        {textString}
        <View style={{ width: "100%" }}>
          <View
            style={{
              flexDirection: "column",
              display: "flex",
              left: 0,
              width: "10%",
              height: 200,
              justifyContent: "space-evenly",
              paddingBottom: 5,
              paddingTop: 5,
              position: "absolute",
            }}
          >
            <View
              style={{
                height: "16.66%",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Image
                source={require("../assets/1.png")}
                style={{ height: "200%", width: "200%" }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                height: "16.66%",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Image
                source={require("../assets/4.png")}
                style={{ height: "200%", width: "200%" }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                height: "16.66%",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Image
                source={require("../assets/3.png")}
                style={{ height: "200%", width: "200%" }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                height: "16.66%",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Image
                source={require("../assets/2.png")}
                style={{ height: "200%", width: "200%" }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                height: "16.66%",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Image
                source={require("../assets/5.png")}
                style={{ height: "200%", width: "200%" }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                height: "16.66%",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Image
                source={require("../assets/6.png")}
                style={{ height: "200%", width: "200%" }}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={{ height: 200 }}>
            <LineChart
              style={{
                position: "absolute",
                height: 200,
                left: "10%",
                width: "90%",
              }}
              data={data}
              svg={{ stroke: "rgb(0, 0, 0)", strokeWidth: 1.5 }}
              contentInset={{ top: 20, bottom: 20, left: 20, right: 20 }}
              animate={true}
              animationDuration={10000}
              yMin={0}
              yMax={5}
              numberOfTicks={5}
              xScale={scale.scaleLinear}
            >
              <Grid />
              <Decorator />
            </LineChart>
          </View>
        </View>
        <XAxis
          data={labels}
          contentInset={{ top: 20, bottom: 20, left: 20, right: 20 }}
          scale={scale.scaleLinear}
          formatLabel={(val, idx) => {
            return labels[idx];
          }}
          svg={{ stroke: "rgb(0, 0, 0)", rotation: 0 }}
          style={{ width: "90%", left: "10%", height: "5%" }}
        />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '7%' }}>
        <Text style={[styles.labelText, {fontSize: 14, alignSelf: 'flex-end'}]}>{string}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginRight: Dimensions.get('screen').width * 0, alignContent: 'center', alignItems: 'center' }}><Text style={[styles.labelText, {fontSize: 14, alignSelf: 'flex-end', marginRight: 2}]}>Entry Number</Text><AntDesign name="arrowright" size={18}/></View>
        </View>
      </View>
    );
  };


  const returnBarChartVal = (array, textString) => {
    let plotArray = [0, 0, 0, 0, 0, 0];
    let colorArray = ["darkgreen", "green", "#9b870c", "brown", "orange", "red"];
    array.map((obj) => {
      let idx = switcheroo(obj.mood);
      plotArray[idx] += 1;
    });
    let data = [];
    plotArray = plotArray.reverse()
    plotArray.map((val, index) =>
      data.push({
        value: val,
        svg: {
          fill: colorArray[index],
        },
      })
    );
    let moods = ["1", "2", "3", "4", "5", "6"];

    const Labels = ({ x, y, bandwidth, data }) =>
      data.map((value, index) => {
        return (
          <SVG.Text
            key={index}
            x={x(index) + bandwidth / 2}
            y={y(value.value) + 15}
            fontSize={15}
            fill={"white"}
            alignmentBaseline={"middle"}
            textAnchor={"middle"}
          >
            {value.value}
          </SVG.Text>
        );
      });
    //fix this chart
    return (
      <View style={styles.barChartContainers}>
        {textString}
        <BarChart
          style={{ height: 250, width: "90%", alignSelf: "center" }}
          data={data}
          gridMin={0}
          numberOfTicks={0}
          svg={{ fill: "rgba(134, 65, 244, 0.8)" }}
          yAccessor={({ item }) => item.value}
          contentInset={{ top: 20, bottom: 20 }}
          xScale={scale.scaleLinear}
        >
          <Grid />
          <Labels />
        </BarChart>
        <XAxis
          data={data}
          scale={scale.scaleLinear}
          formatLabel={(val, idx) => {
            return moods[idx];
          }}
          style={{ alignSelf: "center", width: "90%" }}
          svg={{}}
          contentInset={{ top: 20, bottom: 20, left: 25, right: 25 }}
        />
      </View>
    );
  };

  const moodReturner = (array) => {
    let returnArr = [];
    array.map((obj) => {
      returnArr.push(switcheroo(obj.mood));
    });
    return returnArr;
  };

  const dataRetriever = (column, val) => {
    db.transaction(async (tx) => {
      await tx.executeSql(
        `select mood from moodster where ${column} = ?`,
        [val],
        (text, { rows: _array }) => {
          setPastArray(_array._array);
        }
      );
    });
  };

  const activityImpacter = () => {
    //add weather to this
    let allTime = avgFinder(allArray); //pass from dashboard
    //have multiple betters and lowers and undefined on values check
    let strings = [
      "sunny",
      "rainy",
      "cloudy",
      "stormy",
      "snowy",
    ];
    let values = [
      sunnyArray,
      Rain,
      Cloudy,
      Stormy,
      Snowing,
    ]
    .filter((elem, i)=> {
      if(elem.length === 0) strings.splice(i, 1)
      return elem.length > 0
    })
    .map((arr) => {
      return parseFloat(avgFinder(arr));
    });
    let worst = Math.min(...values);
    let best = Math.max(...values);
    let displayString = "";
    if (worst < allTime)
      displayString += `Based on your inputs ${
        strings[values.findIndex((elem) => elem == worst)]
			} weather is causing your mood to be on lower on average`;
    if (best > allTime)
      displayString += `\n\nBased on your inputs ${
        strings[values.findIndex((elem) => elem == best)]
      } weather is causing your mood to be on higher on average`;
    return(<View style={styles.avgContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.avgTalker}>{displayString}</Text>
        </View>
      </View>);
	};
	//add strings like these to show what is returned on weather fluctuating mood

  const switcheroo = (mood) => {
    switch (mood) {
      case "Happy":
        return 5;
      case "Sad":
        return 0;
      case "Angry":
        return 1;
      case "Nervous":
        return 2;
      case "Bored":
        return 4;
      case "Annoyed":
        return 3;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {allArray != [] && activityImpacter()}
      <Text style={[styles.labelText, {alignSelf: 'flex-start', fontSize: 25, marginLeft: 15, marginTop: 20}]}>View mood chart for</Text> 
      <DropDownPicker
        items={[
          { label: "None", value: "none" },
					{ label: "Sunny", value: "weather Sunny" },
					{ label: "Raining", value: "weather Rain"},
					{ label: "Cloudy", value: "weather Cloudy"},
          { label: "Stormy", value: "weather Stormy"},
          { label: "Snowing", value: "weather Snowing"},
        ]}
        defaultValue={"none"}
        containerStyle={{ height: 40, marginBottom: 20 }}
        style={styles.dropDown}
        itemStyle={{
          justifyContent: "flex-start"
        }}
        labelStyle={{
          fontSize: 18,
          fontFamily: fontName
        }}
        dropDownStyle={styles.dropDown}
        onChangeItem={(item) => {
					if(item.value == 'none') setPastArray([])
          const value = item.value.split(" ");
          setConstraint(item.label);
          dataRetriever(value[0], value[1]);
        }}
      />
      {pastArray.length > 0 && returnChartVal(pastArray, [], [], <View style={styles.labelContainer}><Text style={styles.labelText}>Line Chart of {constraint} weather</Text></View>)}
      {pastArray.length > 0 && returnBarChartVal(pastArray, <View style={styles.labelContainer}><Text style={styles.labelText}>Number of entries with {constraint} weather</Text></View>)}
			<View style={{height: 20}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#f2ffff'
  },
  lineCharContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    justifyContent: "center",
    height: 310,
    marginVertical: 15,
    left: "2.5%",
    width: "95%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  emojisContainerChart: {
    height: "16.66%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
	},
	
  barChartContainers: {
    height: 320,
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    left: "2.5%",
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 25,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },

  dropDown: {
    backgroundColor: "#ffffff",
    marginHorizontal: '2.5%',
    width: '95%',
    borderRadius: 10
  },
  avgContainer: {
    width: "95%",
    left: "2.5%",
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    marginBottom: 15,
    elevation: 7,
  },
  labelText: {
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 10,
    alignSelf: "center",
    fontFamily: fontName,
    color: "#10365d",
  },

  label: {
    fontSize: 40,
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
    marginHorizontal: 5,
  },
  labelContainer: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
  },
  textContainer: {
    borderRadius: 25,
  },
  avgTalker: {
    fontSize: 20,
    marginHorizontal: 20,
    fontWeight: "bold",
    marginVertical: 15,
    fontFamily: fontName,
  },
});


function bgColorer(mood) {
  switch (mood) {
    case 5:
      return "darkgreen";
    case 4:
      return "green";
    case 3:
      return "#f5d730";
    case 2:
      return "brown";
    case 1:
      return "orange";
    case 0:
      return "red";
  }
}
