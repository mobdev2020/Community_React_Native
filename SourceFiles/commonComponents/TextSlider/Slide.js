import React from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { FontSize } from "../../Constants/FontSize";
import { Colors } from "../../Constants/Colors";
import { ConstantKey } from "../../Constants/ConstantKey";
import moment from "moment";

const { width, height } = Dimensions.get("window");

const TextSlide = ({ item }) => {
  return (
    <>
      <View style={styles.cardView2}>
        <View style={styles.textView}>
          <Text style={{
            fontSize: FontSize.FS_13,
            color: Colors.black,
            fontFamily: ConstantKey.MONTS_REGULAR,
            textAlign: "right",
            marginRight: 10
          }}>
            {moment(item.created_at).format('DD/MM/YYYY')}
          </Text>
          <Text style={{
            fontSize: FontSize.FS_18,
            color: Colors.black,
            fontFamily: ConstantKey.MONTS_SEMIBOLD,
            textAlign: "center"
          }}>
            {item?.title}
          </Text>
          <Text numberOfLines={4}
          style={{
            fontSize: FontSize.FS_14,
            color: Colors.black,
            fontFamily: ConstantKey.MONTS_MEDIUM,
            textAlign: "center",
            marginTop: 10
          }}>
            {item?.notice}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
 
  cardView2: {
    flex: 1,
    width: width - 70,
    height: height / 4.4,
    backgroundColor: Colors.lightGrey01,
    // justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    
  },

  textView: {
   marginHorizontal:8,
   marginVertical:10,
  },
  image: {
    width: width - 70,
    height: height / 3.5,
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

export default TextSlide;