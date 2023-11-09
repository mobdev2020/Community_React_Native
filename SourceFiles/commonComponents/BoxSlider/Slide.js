import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, Linking } from "react-native";
import { FontSize } from "../../Constants/FontSize";
import { Colors } from "../../Constants/Colors";
import { ConstantKey } from "../../Constants/ConstantKey";
import FastImage from "react-native-fast-image";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { navigate } from "../../Constants/NavigationService";

const { width, height } = Dimensions.get("window");

const Slide = ({ item },props) => {

  console.log("Slider Data : ",item)

  return (
    <>
      {item?.image &&
        <TouchableOpacity onPress={() => {
          if(item?.video_url != null){
            // props.navigation.navigate("VideoPlay")
            navigate("VideoPlay",{url :item?.video_url })
          }
          else if(item?.url != null){
            Linking.openURL(item?.url)

          }
        }} style={styles.cardView}>

          {item?.video ? 
            <View>
                <FastImage style={[styles.image]} source={{ uri: item.image_url }} />

                <View style={{position : 'absolute', top : 0, bottom : 0, right : 0, left : 0, backgroundColor : Colors.black03,
                alignItems : 'center', justifyContent : 'center'}}>
                    <Icon name="play-circle" size={50} color={Colors.white}/>
                </View>
            </View>
          :
          <FastImage style={styles.image} source={{ uri: item.image_url }} />

          }

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