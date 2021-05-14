import React, { useState } from 'react';
import { ScaledSheet } from 'react-native-size-matters';
import { View, Text } from 'react-native';

export default function Settings({ navigation }){


  return(
    <View>
      <View>Notifications settings</View>
      <View>Clear data</View>
      <View>Attributions to the github things being used</View>
      <View>Privacy Policy --</View>
      <View>Terms of Use --</View>
    </View>
  )
}

const styles = ScaledSheet.create({

})
