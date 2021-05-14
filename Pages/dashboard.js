import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  StyleSheet,
  ImageBackground
} from "react-native";
import * as React from "react";
import db from "../db";
import { ContributionGraph } from "expo-chart-kit";
import compileData from "../functions/compileData";
import { LineChart, Grid, XAxis, BarChart } from "react-native-svg-charts";
import { AntDesign } from 'react-native-vector-icons';
import * as scale from "d3-scale";
import * as SVG from "react-native-svg";
import avgFinder from "./avgFinder";
import { List } from "react-native-paper";

const fontName = 'PatrickHand_400Regular'

export default function Dashboard({ navigation }) {
  const [moodsArray, setMoodsArray] = React.useState([]);
  const [tenEntries, setTenEntries] = React.useState([]);
  const [expanded, setExpanded] = React.useState(true);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{marginLeft: 20, alignSelf: 'center'}} onPress={() => navigation.replace("Home")}>
          <AntDesign size={Dimensions.get("screen").height * 0.03} name="pluscircleo" />
        </TouchableOpacity>
      )
    })
  }, [navigation]);

  const _weekActivities = (fn, textString) => {
    let moodsObjs = [...moodsArray];
    moodsObjs.reverse();
    let length = moodsObjs.length;
    let returnArray = [];
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        if (
          new Date(moodsObjs[i].date) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ) {
          returnArray.push(moodsObjs[i]);
        } else break;
      }
    }
    return fn(returnArray.reverse(), textString, true);
  };

  const _30daysActivities = (fn, text = '') => {
    let moodsObjs = [...moodsArray];
    moodsObjs.reverse();
    let length = moodsObjs.length;
    let returnArray = [];
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        if (
          new Date(moodsObjs[i].date) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ) {
          returnArray.push(moodsObjs[i]);
        } else break;
      }
    }
    if (returnArray.length == 0) return null
    return fn(returnArray.reverse(), text);
  };

  const extractData = async () => {
    await db.transaction(async (tx) => {
      await tx.executeSql(
        "select * from moodster;",
        [],
        async (text, { rows: _array }) => {
          await setMoodsArray(_array._array);
          await setTenEntries(
            _array._array.slice(Math.max(_array.length - 10, 0))
          );
        }
      );
    });
  };

  React.useEffect(() => {
    extractData();
  }, []);

  const _lineChart = (array, textString, isWeek) => {
    array = isWeek ? array.slice(-20) : array.slice(-40); //replace with other values
    let labels = [];
    let dataset = [];
    let value = array.length;
    let factor = value / 4;
    let counter = 0;
    for (let obj in array) {
      let date = new Date(array[obj].date).getDate();
      if (value <= 15)
      {
        labels.push(
        new Date(array[obj].date)
          .toLocaleDateString()
          .split("/")
          .slice(0, 2)
          .join("/")
      );}
      else if(obj == 0){
        date = 1
        counter = Math.round(counter + factor);
      } else if(obj == (array.length  - 1)) date = value
      else if (obj == counter) {
        date = counter
        counter = Math.round(counter + factor);
      }
      else date = ''
      dataset.push({
        value: switcheroo(array[obj].mood),
        label: date,
      });
    }
    //add date range
    //implement dates adder for this one too to be protective - to all charts

    const Decorator = ({ x, y, data }) => {
      return data.map((value, index) => (
        <SVG.Circle
          key={index}
          cx={x(index)}
          cy={y(value.value)}
          r={4}
          stroke={bgColorer(value)}
          fill={bgColorer(value)}
        />
      ));
    };

    const fontSize = array.length > 10 ? 10 : 12;
    const string = array.length > 15 ? (isWeek ? "*Limited to 20 entries" : "*Limited to 40 entries") : "";
    const axis = array.length > 15 ? "Entry Number" : "Date";

    if (dataset.length == 0){
      return unavailablechart("More data needed to show these charts")
    } else {
    return (
      <View style={styles.lineChartContainer}>
        {textString}
        <View style={{width: '100%'}}>
        <LabelReturner />
        <LineChart
          style={{ height: 200, left: "10%", width: "90%" }}
          data={dataset}
          svg={{ stroke: "purple" }}
          contentInset={{ top: 20, bottom: 20, left: 20, right: 20 }}
          animate={true}
          animationDuration={2000}
          yMin={0}
          yMax={5}
          numberOfTicks={5}
          yAccessor={({ item }) => item.value}
          xScale={scale.scaleLinear}
        >
          <Grid />
          <Decorator />
        </LineChart>
        </View>
        <XAxis
          data={dataset}
          contentInset={{ top: 20, bottom: 20, left: 20, right: 20 }}
          scale={scale.scaleLinear}
          formatLabel={(val, idx) => {
            return dataset[idx].label;
          }}
          svg={{ stroke: "rgb(0, 0, 0)", strokeWidth: 1, fontSize: fontSize }}
          style={{ width: "90%", left: "10%", height: "5%", paddingTop: 5 }}
        />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '10%' }}>
        <Text style={[styles.labelText, {fontSize: 14, alignSelf: 'flex-end'}]}>{string}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginRight: Dimensions.get('screen').width * 0, alignContent: 'center', alignItems: 'center' }}><Text style={[styles.labelText, {fontSize: 14, alignSelf: 'flex-end', marginRight: 5}]}>{axis}</Text><AntDesign name="arrowright" size={18}/></View>
        </View>
      </View>
    );}
  };

  const avgFinderChart = (array, textString) => {
    let plotArray = [0, 0, 0, 0, 0, 0];
    let colorArray = ["darkgreen", "green", "#9b870c", "brown", "orange", "red"];
    array.map((obj) => {
      let idx = switcheroo(obj.mood);
      plotArray[idx] += 1;
    });
    plotArray = plotArray.reverse()
    let data = [];
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
    if (array.length == 0) {
      return null
    } else {
    return (
      <View style={styles.barChartContainers}>
        <Text style={styles.labelText}>Barchart for mood entries in the past {textString}</Text>
        <BarChart
          style={{ height: 200, width: "90%", alignSelf: "center" }}
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
          data={data.length == 0 ? [1] : data}
          scale={scale.scaleLinear}
          formatLabel={(val, idx) => {
            return moods[idx];
          }}
          style={{ alignSelf: "center", width: "90%" }}
          svg={{}}
          contentInset={{ top: 20, bottom: 20, left: 25, right: 25 }}
        />
      </View>
    );}
  };

  const contribution = (array) => {
    let dates = [];
    let commitsData = [];
    let offset = new Date(new Date()).getTimezoneOffset() * 60 * 1000;
    array.map((obj) => {
      let dater = new Date(obj.date).getTime();
      dater = dater - offset;
      let date = new Date(dater).toISOString().split("T")[0];
      dates.push(date);
    });
    dates = [...new Set(dates)];
    dates.map((obj) => {
      commitsData.push({ date: obj, count: 4 });
    });
    const chartConfig = {
      backgroundGradientFrom: "#ffffff",
      backgroundGradientTo: "#ffffff",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(0, 0, 90, ${opacity})`,
      strokeWidth: 2,
      barPercentage: 0.5,
      useShadowColorFromDataset: false,
    };

    const today = new Date(new Date(Date.now()) - offset).toISOString().split("T")[0];
    let streak = 0;
    let yesterday = new Date(new Date(Date.now()).getTime() - offset);
    for (let value = commitsData.length - 1; value >= 0; value--) {
      if (commitsData[value].date == yesterday.toISOString().split("T")[0])
        streak += 1;
      else if (value == commitsData.length - 1) {
        yesterday.setDate(yesterday.getDate() - 1);
        if (commitsData[value].date == yesterday.toISOString().split("T")[0])
          streak += 1;
      } else break;
      yesterday.setDate(yesterday.getDate() - 1);
    }
    //add checks here if streak is 7, 15, 30 alert with confetti

    return (
      <View style={styles.contributionContainer}>
        <Text style={styles.labelText}>You have had a {streak} day long streak</Text>
        <ContributionGraph
          values={commitsData}
          endDate={today}
          numDays={75}
          width={Dimensions.get("screen").width * 0.8}
          height={220}
          chartConfig={chartConfig}
          accessor="count"
        />
      </View>
    );
  };

  const _moodsWithoutActivity = (array, text) => {
    //show that it is limited to 75
    //show the limits to the -15 also add functionality to choose to see stuff from before and customize lengths
    array = array.slice(-60);
    let withActivity = [];
    let withoutActivity = [];
    array.map((obj) => {
      if (obj.activity == "") withoutActivity.push(switcheroo(obj.mood));
      else withActivity.push(switcheroo(obj.mood));
    });
    withActivity = withActivity.slice(-20);
    withoutActivity = withoutActivity.slice(-20);
    let value = Math.max(withActivity.length, withoutActivity.length);
    let labels = [];
    if (value > 15) {
      labels.push(value);
      value = value / 6;
      labels.push(Math.round(1 + value + value + value + value));
      labels.push(Math.round(1 + value + value + value));
      labels.push(Math.round(1 + value + value));
      labels.push(Math.round(1 + value));
      labels.push(1); //test this once it
      labels.reverse();
    } else {
      labels = [...Array(value).keys()].map((i) => i + 1);
    }
    let data = [
      {
        data: withoutActivity,
        svg: { stroke: "purple", strokeWidth: 2 },
      },
      {
        data: withActivity,
        svg: { stroke: "#1b61ab", strokeWidth: 2 },
      },
    ];

    const Decorator = ({ x, y, data }) => {
      return data.map((obj) => {
        return obj.data.map((value, index) => (
          <SVG.Circle
            key={index}
            cx={x(index)}
            cy={y(value)}
            r={4}
            stroke={bgColorer({ "value": value })}
            fill={bgColorer({ "value": value })}
          />
        ));
      });
    };
    
    if (withoutActivity.length == 0 && withActivity.length == 0) return null
    else{
    return (
      <View style={styles.lineChartContainer}>
        {text}
        <View style={{width: '100%'}}>
        <LabelReturner />
        <LineChart
          style={{ height: 200, left: "10%", width: "90%" }}
          data={data}
          svg={{ stroke: "rgb(0, 0, 0)", strokeWidth: 1 }}
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
        <XAxis
          data={labels}
          contentInset={{ top: 20, bottom: 20, left: 20, right: 20 }}
          scale={scale.scaleLinear}
          formatLabel={(val, idx) => {
            return labels[idx];
          }}
          svg={{ stroke: "black", rotation: 0 }}
          style={{ width: "90%", left: "10%", height: "5%" }}
        />
        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginRight: 30, alignContent: 'center', alignItems: 'center' }}><Text style={[styles.labelText, {fontSize: 14, alignSelf: 'flex-end', marginRight: 5}]}>Entry Number</Text><AntDesign name="arrowright" size={18}/></View>
      </View>
    );}
  };

  const dayTimeChart = (array, textString) => {
    let string = array.length > 5 ? '*Limited to 5 entries' : ''
    array = array.slice(-5);
    let dataset = [];
    let labels = [];
    if (array.length > 0) {
      array.map((obj) => {
        let date = new Date(obj.date).getTime();
        if (
          date > new Date().setHours(0, 0, 0, 0) &&
          date < new Date().setHours(23, 59, 59, 999)
        ) {
          dataset.push(switcheroo(obj.mood));
          labels.push(
            new Date(obj.date)
              .toTimeString()
              .split(" ")[0]
              .split(":")
              .slice(0, 2)
              .join(":")
          );
        }
      });
    }

    const Decorator = ({ x, y, data }) => {
      return data.map((value, index) => (
        <SVG.Circle
          key={index}
          cx={x(index)}
          cy={y(value)}
          r={4}
          stroke={"rgb(255, 255, 255)"}
          fill={"black"}
        />
      ));
    };

    if (dataset.length == 0){
      return (
        unavailablechart("More data needed to show this chart")
      )
    } else {
    return (
      <View style={styles.lineChartContainer}>
        {textString}
        <View style={{width: '100%'}}>
        <LabelReturner />
        <LineChart
          style={{ height: 200, left: "10%", width: "90%" }}
          data={dataset}
          svg={{ stroke: "rgb(0, 0, 0)" }}
          contentInset={{ top: 20, bottom: 20, left: 30, right: 30 }}
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
        <XAxis
          data={labels}
          contentInset={{ top: 20, bottom: 20, left: 30, right: 30 }}
          scale={scale.scaleLinear}
          formatLabel={(val, idx) => {
            return labels[idx];
          }}
          svg={{ stroke: "rgb(0, 0, 0)", rotation: 0 }}
          style={{ width: "90%", left: "10%", height: "5%" }}
        />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '10%' }}>
        <Text style={[styles.labelText, {fontSize: 14, alignSelf: 'flex-end'}]}>{string}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginRight: Dimensions.get('screen').width * 0, alignContent: 'center', alignItems: 'center' }}><Text style={[styles.labelText, {fontSize: 14, alignSelf: 'flex-end', marginRight: 5}]}>Time</Text><AntDesign name="arrowright" size={18}/></View>
        </View>
      </View>
    );}
  };

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

  const allTimeAvg = avgFinder(moodsArray);
  const monthAvg = _30daysActivities(avgFinder);
  const weekAvg = _weekActivities(avgFinder);
  const monthString =
    monthAvg != allTimeAvg
      ? monthAvg > allTimeAvg
        ? "better than"
        : "worse than"
      : "same as";
  const weekString =
    weekAvg != allTimeAvg
      ? weekAvg > allTimeAvg
        ? "better than"
        : "worse than"
      : "same as";
  let weekStatement = Number.isNaN(weekAvg) ? 'No entries were found for this week' : `Your average mood for this week has been ${weekString} the average`;
  if(weekAvg == null){weekStatement = "No entries for this week"}
  let monthStatement = Number.isNaN(monthAvg) ? 'No entries were found for this month' : `Your average mood for this month has been ${monthString} the average`
  if(monthAvg == null){monthStatement = "No entries for this month"} 

return (
    <ScrollView
      style={{ backgroundColor: "#f2ffff" }}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.avgContainer} onPress={() => navigation.navigate('Advice')}>
      <View style={styles.textContainer}>
      <Text style={styles.avgTalker}>
        {weekStatement}
      </Text>
      </View>
      <View style={styles.textContainer}>
      <Text style={styles.avgTalker}>
        {monthStatement}
      </Text>
      </View>
      </TouchableOpacity>
      {tenEntries !== [] && contribution(moodsArray)}
      <TouchableOpacity
        onPress={() => {
          navigation.replace("ExtraInfo");
        }}
        style={[styles.moreInfoContainer, {marginBottom: 0}]}
      >
        <Text style={styles.avgTalker}>Factors affecting your mood</Text>
        <AntDesign name="arrowright" size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("WeatherInfo");
        }}
        style={styles.moreInfoContainer}
      >
        <Text style={styles.avgTalker}>Weather factors on mood</Text>
        <AntDesign name="arrowright" size={20} />
      </TouchableOpacity>
      {tenEntries !== [] && dayTimeChart(tenEntries, <Text style={styles.labelText}>Today's mood chart</Text>)}
      <List.Section>
        <List.Accordion title="Last 10 entries" expanded={expanded} onPress={() => setExpanded(!expanded)} titleStyle={[styles.avgTalker, { marginHorizontal: 5 }]} style={[styles.avgContainer, { paddingVertical: 0, marginTop: 5 }]}>
        {tenEntries !== [] && _lineChart(tenEntries, <Text style={styles.labelText}>Mood chart for previous 10 entries</Text>)}
        {tenEntries !== [] && avgFinderChart(tenEntries, '10 entries')}
        {tenEntries !== [] && compileData(tenEntries, '10 entries')}
        </List.Accordion>
        <List.Accordion title="Your last week" titleStyle={[styles.avgTalker, { marginHorizontal: 5 }]} style={[styles.avgContainer, { paddingVertical: 0 }]}>
          {tenEntries !== [] && _weekActivities(_lineChart, <Text style={styles.labelText}>Mood chart of the current week (add limitations)</Text>)}
          {tenEntries !== [] && _weekActivities(avgFinderChart, 'week')}
          {tenEntries !== [] && _weekActivities(_moodsWithoutActivity, <View style={styles.labelContainer}><Text style={[styles.label, {color: '#1b61ab'}]}>-</Text><Text style={styles.labelText}>Activity vs</Text><Text style={[styles.label, {color: 'purple'}]}>-</Text><Text style={styles.labelText}>No Activity (past week)</Text></View>)}
          {tenEntries !== [] && _weekActivities(compileData, 'week')}
        </List.Accordion>
        <List.Accordion title="Your last month" titleStyle={[styles.avgTalker, { marginHorizontal: 5 }]} style={[styles.avgContainer, { paddingVertical: 0 }]}>
          {tenEntries !== [] && _30daysActivities(_lineChart, <Text style={styles.labelText}>Mood Chart for past month</Text>)}
          {tenEntries !== [] && _30daysActivities(avgFinderChart, '30 days')}
          {tenEntries !== [] && _30daysActivities(_moodsWithoutActivity, <View style={styles.labelContainer}><Text style={[styles.label, {color: '#1b61ab'}]}>-</Text><Text style={styles.labelText}>Activity vs</Text><Text style={[styles.label, {color: 'purple'}]}>-</Text><Text style={styles.labelText}>No Activity (past 30 days)</Text></View>)}
          {tenEntries !== [] && _30daysActivities(compileData, '30 days', true)}
        </List.Accordion>
      </List.Section>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Advice");
        }}
        style={styles.moreInfoContainer}
      >
        <Text style={styles.avgTalker}>History of your mood entries</Text>
        <AntDesign name="arrowright" size={20} />
      </TouchableOpacity>
    </ScrollView>
  );
}

//update top labels and bottom ones too

const styles = StyleSheet.create({
  lineChartContainer: {
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
  textContainer: {
    borderRadius: 25
  },
  avgContainer: {
    width: '95%',
    left: '2.5%',
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 3,
},
shadowOpacity: 0.29,
shadowRadius: 4.65,

elevation: 7,
  },
  contributionContainer: {
    justifyContent: "center",
    left: "2.5%",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
    marginTop: 20,
    width: "95%",
    borderRadius: 25,
    height: 270,
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 2,
},
shadowOpacity: 0.25,
shadowRadius: 3.84,

elevation: 5,
  },
  barChartContainers: {
    height: 280,
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

elevation: 5,
  },
  labelText: {fontSize: 17, fontWeight: 'bold', marginVertical: 10, alignSelf: 'center', fontFamily: fontName,
  color: "#10365d"},
  label: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
    marginHorizontal: 5
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center'
  },
  avgTalker: {
    fontSize: 20,
    marginHorizontal: 20,
    fontWeight: "bold",
    marginVertical: 15,
    fontFamily: fontName
  },
  cardText: {
    fontSize: 14,
    marginVertical: 10
  },
  moreInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: '5%',
    backgroundColor: 'white',
    marginVertical: '3%',
    marginHorizontal: '2.5%',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,
  }
});

function LabelReturner() {
  return (
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
        position: 'absolute'
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
  );
}

function bgColorer(mood){
  switch(mood.value){
    case 5:
      return "darkgreen"
    case 4:
      return "green"
    case 3:
      return "#f5d730"
    case 2:
      return "brown"
    case 1:
      return "orange"
    case 0:
      return "red"
  }
}
function unavailablechart(textString){
  return(
    <View style={[styles.lineChartContainer, {overflow: 'hidden', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }]}>
        <ImageBackground source={require("../assets/wip.jpg")} style={{height: 250, width: 250, resizeMode: 'contain', justifyContent: 'center', opacity: 0.2 }}>
        </ImageBackground>
        <Text style={{ fontSize: Dimensions.get('window').width * 0.05, alignSelf: 'center', fontFamily: fontName, position: 'absolute' }}>{textString}</Text>
      </View>
  )
}

//<YAxis data={["0","1","2","3","4","5"]}
//scale={scale.scaleLinear} svg={{ stroke: "rgb(0,0,0)", fill: 'black', strokeWidth: 1}} numberOfTicks={5} contentInset={{ top: 20, bottom: 20, left: 20, right: 20 }} max={5} min={0} style={{left: 0, height: 200}}/>
//CHECK FOR NOT GOING OVER THE 15 for all charts especially the ones with dates_