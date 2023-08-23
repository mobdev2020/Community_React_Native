//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, ScrollView, Alert, Linking, FlatList } from 'react-native';


// Constants
import i18n from '../Localize/i18n'
import { ConstantKey } from '../Constants/ConstantKey'
import { Colors } from '../Constants/Colors';
import { Images } from '../Constants/Images';
import { FontSize } from '../Constants/FontSize';
import Webservice from '../Constants/API'
import LoadingView from '../Constants/LoadingView'
import { APIURL } from '../Constants/APIURL';
//Third Party
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { navigate } from '../Constants/NavigationService';
const MyAds = ({ navigation }) => {

  const [isLoading, setIsLoading] = useState(false)







  return (
    <View style={styles.container}>
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <ScrollView style={{}}>
          <SafeAreaView style={{ flex: 1, marginVertical: 15, marginHorizontal: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 10 }}>
              <Text style={{
                fontSize: FontSize.FS_22,
                color: Colors.black,
                fontFamily: ConstantKey.MONTS_SEMIBOLD,
              }}>
                {"My Advertising"}
              </Text>
              <TouchableOpacity onPress={() => { navigate("AddAds") }}
                style={{
                  alignSelf: 'flex-end',
                  backgroundColor: '#ffffff',
                  paddingHorizontal: 14,
                  height: 34,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: Colors.primary
                }}>
                <Text style={{
                  textAlign: 'center',
                  color: Colors.black,
                  alignSelf: 'center',
                }}>
                  Add New Ads
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
				data={[0, 1, 2, 3, 4,]}
        style={{marginVertical:20}}
				keyExtractor={(item, index) => index}
				// ListHeaderComponent={<View style={{height:20,}}></View>}
				ListFooterComponent={<View style={{ height: 20, }}></View>}
				renderItem={({ item, index }) => {
					return (
						<View style={{ marginHorizontal: 10, marginVertical: 5, backgroundColor: Colors.lightGrey01, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary }}>
							<View style={{width:"100%",height:ConstantKey.SCREEN_HEIGHT/4.5}}>
							<FastImage style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, flex: 1, borderRadius: 12 }}
								source={Images.Poster}
								resizeMode='cover'
							/>
							</View>
							<View style={{
								borderBottomLeftRadius: 12,
								borderBottomRightRadius: 12,
								padding: 8
							}}>


								<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
									<Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM }}>Conference</Text>
									<Text style={{ fontSize: FontSize.FS_10, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR }}>01/08/2023</Text>
								</View>
								<Text onPress={() => {Linking.openURL("https://wemanage.webtual.com/")}} numberOfLines={1} style={{ fontSize: FontSize.FS_12, color: Colors.endeavour, fontFamily: ConstantKey.MONTS_REGULAR ,marginTop:4}}>https://wemanage.webtual.com/</Text>


							</View>
						</View>
					)
				}}
			/>
          </SafeAreaView>
        </ScrollView>
      </View>

      {isLoading ?
        <LoadingView text={"Please Wait..."} />
        : null}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  calloutTitle: {
    fontSize: FontSize.FS_16,
    fontFamily: ConstantKey.MONTS_SEMIBOLD,
    color: Colors.primary
  },
  calloutDescription: {
    marginTop: 5,
    fontSize: FontSize.FS_14,
    fontFamily: ConstantKey.MONTS_REGULAR,
    color: Colors.darkGrey,

  },
});
export default MyAds