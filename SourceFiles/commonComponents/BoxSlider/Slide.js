import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, Linking } from "react-native";
import { FontSize } from "../../Constants/FontSize";
import { Colors } from "../../Constants/Colors";
import { ConstantKey } from "../../Constants/ConstantKey";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("window");

const Slide = ({ item }) => {
  return (
    <>
      {item?.image &&
        <TouchableOpacity onPress={() => {
          if(item?.url != null){
            Linking.openURL(item?.url)

          }
        }} style={styles.cardView}>

          <FastImage style={styles.image} source={{ uri: item.image_url }} />

        </TouchableOpacity>}
    </>
  );
};

const styles = StyleSheet.create({
  cardView: {
    width: width -20,
    height: height / 3.8,
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 6,
  },
  image: {
    width: width -20,
    height: height / 3.8,
  },
});

export default Slide;