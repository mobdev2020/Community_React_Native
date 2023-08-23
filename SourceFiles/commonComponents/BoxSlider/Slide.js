import React from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { FontSize } from "../../Constants/FontSize";
import { Colors } from "../../Constants/Colors";
import { ConstantKey } from "../../Constants/ConstantKey";

const { width, height } = Dimensions.get("window");

const Slide = ({ item }) => {
  return (
    <>
      {item?.image &&
        <View style={styles.cardView}>

          <Image style={styles.image} source={{ uri: item.image }} />

        </View>}
        {item?.title &&
      <View style={styles.cardView2}>
        <View style={styles.textView}>
          <Text style={{
            fontSize: FontSize.FS_13,
            color: Colors.black,
            fontFamily: ConstantKey.MONTS_REGULAR,
            textAlign: "right",
            marginRight: 10
          }}>
            {"24/10/2023"}
          </Text>
          <Text style={{
            fontSize: FontSize.FS_18,
            color: Colors.black,
            fontFamily: ConstantKey.MONTS_SEMIBOLD,
            textAlign: "center"
          }}>
            {item?.title}
          </Text>
          <Text style={{
            fontSize: FontSize.FS_14,
            color: Colors.black,
            fontFamily: ConstantKey.MONTS_MEDIUM,
            textAlign: "center",
            marginTop: 10
          }}>
            {item?.desc}
          </Text>
        </View>
      </View>
      }
    </>
  );
};

const styles = StyleSheet.create({
  cardView: {
    flex: 1,
    width: width - 20,
    height: height / 3.5,
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 10,
  },
  cardView2: {
    flex: 1,
    width: width - 50,
    height: height / 4.4,
    backgroundColor: Colors.lightGrey01,
    justifyContent: "center",
    // marginHorizontal: 10,
    // marginTop:10,
    // marginBottom:5,
    borderRadius: 10,
    borderWidth: 1,
    
  },

  textView: {
    flex:1
    // width: width - 40,
    // height: height / 4.4,
    // position: "absolute",
    // bottom: 10,
    // margin: 10,
    // left: 5,
  },
  image: {
    width: width - 20,
    height: height / 3.5,
    // borderRadius: 2,
  },
  itemTitle: {
    color: "white",
    fontSize: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0.8, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 3,
    marginBottom: 5,
    fontWeight: "bold",
    elevation: 5,
  },
  itemDescription: {
    color: "white",
    fontSize: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0.8, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default Slide;