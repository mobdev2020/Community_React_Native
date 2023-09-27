import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import Slide from "./Slide";

const { width, heigth } = Dimensions.get("window");
let flatList;

function infiniteScroll(dataList) {
  const numberOfData = dataList.length;
  let scrollValue = 0,
    scrolled = -10;

  setInterval(function () {
    scrolled++;
    if (scrolled < numberOfData) scrollValue = scrollValue + width;
    else {
      scrollValue = 0;
      scrolled = 0;
    }

    this.flatList.scrollToOffset({ animated: true, offset: scrollValue });
  }, 2000);
}

const Banner = ({ data }) => {
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, width);
  const [dataList, setDataList] = useState(data);

  useEffect(() => {
    setDataList(data);
    // infiniteScroll(dataList);
  });

  if (data && data.length) {
    return (
      <View>
        <FlatList
          data={data}
          ref={(flatList) => {
            this.flatList = flatList;
          }}
          keyExtractor={(item, index) => "key" + index}
          horizontal
          pagingEnabled
          scrollEnabled
          snapToAlignment="center"
          // ItemSeparatorComponent={<View style={{width:10}}></View>}
        //   scrollEventThrottle={50}
        //   decelerationRate={1}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return <Slide item={item} />;
          }}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { x: scrollX } } },
            
          ],
          { useNativeDriver: false } 
          )}
        />

        <View style={styles.dotView}>
          {data.map((_, i) => {
            let opacity = position.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            return (
              <Animated.View 
                key={i}
                style={{
                  opacity,
                  height: 6,
                  width: 6,
                  backgroundColor: "#595959",
                  marginVertical: 8,
                  marginHorizontal: 3,
                  borderRadius: 5,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  dotView: { flexDirection: "row", justifyContent: "center" },
});

export default Banner;