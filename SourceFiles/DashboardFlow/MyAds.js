//import liraries
import React, { Component, useState, useEffect, useCallback } from 'react';
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
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
const MyAds = ({ navigation }) => {

  const [isLoading, setIsLoading] = useState(false)
  const [AdsCurrentPage, setAdsCurrentPage] = useState(1)
  const [AdsPaginationHide, setAdsPaginationHide] = useState(false)
  const [AdsData, setAdsData] = useState([])


  useFocusEffect(
    useCallback(() => {
      console.log("call")
      Api_Get_Ads(true)
      return () => {
        console.log("1")
        setAdsCurrentPage(1)
        setAdsPaginationHide(false)
      }
    }, [])
  );

  // useEffect(() => {
  //   Api_Get_Ads(true)
  // }, [AdsCurrentPage])



  const Api_Get_Ads = (isLoad) => {
    setIsLoading(isLoad)
    Webservice.get(APIURL.GetAds + "?page=" + AdsCurrentPage)
      .then(response => {
        setIsLoading(false)
        console.log(JSON.stringify("Api_Get_Ads Response  : " + JSON.stringify(response)));
        if (response.data.status == true) {

          if (response.data.data.next_page_url == null) {
            setAdsPaginationHide(true)
          }
          else{
            setAdsCurrentPage(AdsCurrentPage + 1)

          }

          var data = response.data.data?.data
          const unique = [...new Map(data.map(m => [m.id,m])).values()];
          console.log("unique :",unique)
          console.log("AdsData :",AdsData)
          setAdsData(unique,...AdsData)
        } else {
          // alert(response.data.message)
          setAdsPaginationHide(true)
        }
      })
      .catch((error) => {
        setIsLoading(false)
        console.log(error)
      })
  }
  const Api_Delete_Ads =async (isLoad,items) => {
    setIsLoading(isLoad)

    let body = new FormData();
    body.append('advertise_id', items?.id)
    Webservice.post(APIURL.DeleteAds, body)
        .then(response => {
            setIsLoading(false)
            console.log(JSON.stringify("Api_Delete_Ads Response : " + JSON.stringify(response)));

            if (response.data.status == true) {
              var data = AdsData.filter((item)=> item.id !== items.id)
              setAdsData(data)
              setAdsCurrentPage(1)
              Api_Get_Ads(true)
                Alert.alert("Sucess", "Advertises Deleted Sucessfully", [
                    {
                        text: 'Ok',
                        onPress: () => {
                        }
                    }
                ], { cancelable: true })
            } else {
                alert(response.data.Msg)
            }

        })
        .catch((error) => {

            setIsLoading(false)
            console.log(error)
        })
}




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
              <TouchableOpacity onPress={() => { navigate("AddAds", { isEdit: false }) }}
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
              data={AdsData}
              extraData={AdsData}
              style={{ marginVertical: 20 }}
              keyExtractor={(item, index) => index}
              ListEmptyComponent={
                !isLoading &&
                <View style={{ justifyContent: "center", alignItems: "center", padding: 10, alignSelf: "center", borderRadius: 10, marginTop: 100 }}>
                    <Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, }}>{"No Data Found"}</Text>

                </View>}
              // ListHeaderComponent={<View style={{height:20,}}></View>}
              ListFooterComponent=
              {

                AdsPaginationHide == false && !isLoading ?
                  <TouchableOpacity onPress={() => {
                    Api_Get_Ads(true)
                  }}
                    style={{ marginVertical: 25, alignSelf: "center" }}>
                    <Text style={{ fontSize: FontSize.FS_18, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM }}>{"See More"}</Text>

                  </TouchableOpacity> : <View style={{ height: 20 }}></View>

              }
              renderItem={({ item, index }) => {
                return (
                  <View style={{ marginHorizontal: 10, marginVertical: 5, backgroundColor: Colors.lightGrey01, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary }}>

                    <View style={{ width: "100%", height: ConstantKey.SCREEN_HEIGHT / 4.5 }}>

                      <ImageBackground style={{ flex: 1, borderRadius: 12, }}
                        source={{ uri: item?.image_url }}
                        imageStyle={{ borderRadius: 12, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, }}
                        resizeMode='cover'
                      >
                        {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <TouchableOpacity style={{
                            backgroundColor: Colors.primary, padding: 10, alignItems: "flex-end", alignSelf: "flex-end",
                            borderTopLeftRadius: 10, borderBottomRightRadius: 10,
                          }}
                            onPress={() => { }}>

                            <Icon name='trash' size={15} color={Colors.white} />
                          </TouchableOpacity>
                          <TouchableOpacity style={{
                            backgroundColor: Colors.primary, padding: 10, alignItems: "flex-start", alignSelf: "flex-start",
                            borderBottomLeftRadius: 10, borderTopRightRadius: 10,
                          }}
                            onPress={() => { }}>

                            <Icon name='edit' size={15} color={Colors.white} />
                          </TouchableOpacity>
                        </View> */}

                      </ImageBackground>
                    </View>
                    <View style={{
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                      padding: 8
                    }}>


                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM }}>{item?.advertise_name}</Text>
                        <Text style={{ fontSize: FontSize.FS_10, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR }}>{moment(item?.created_at).format("DD/MM/YY")} </Text>
                      </View>
                      <Text onPress={() => { Linking.openURL(item?.url) }} numberOfLines={1} style={{ fontSize: FontSize.FS_12, color: Colors.endeavour, fontFamily: ConstantKey.MONTS_REGULAR, marginTop: 4 }}>{item?.url}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginVertical: 5 }}>
                        <TouchableOpacity  onPress={() =>{
                            Alert.alert("Alert", "Are you sure wan't to delete advertises?", [
                              {
                                  text: 'No',
                                  onPress: () => {
                                  }
                              },
                              {
                                text: 'Yes',
                                onPress: () => {
                                  Api_Delete_Ads(true,item)
                                }
                            }
                          ], { cancelable: true })
                        }}
                        style={{ borderColor: Colors.grey01, borderRadius: 25, paddingVertical: 2, paddingHorizontal: 20, alignItems: "center", borderWidth: 1,marginRight:12 }}>
                          <Text style={{ fontSize: FontSize.FS_13, color: Colors.grey01, fontFamily: ConstantKey.MONTS_REGULAR, }}>{"Delete"}</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigate("AddAds", { isEdit: true, AdsData:item }) }}
                         style={{ backgroundColor: Colors.primary, borderRadius: 25,  paddingVertical: 2, paddingHorizontal: 26, alignItems: "center" }}>
                          <Text style={{ fontSize: FontSize.FS_13, color: Colors.white, fontFamily: ConstantKey.MONTS_REGULAR }}>{"Edit"}</Text>

                        </TouchableOpacity>
                      </View>

                    </View>
                  </View>
                )
              }}
            />
          </SafeAreaView>
        </ScrollView>
      </View>

      {isLoading ?
        <LoadingView />
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