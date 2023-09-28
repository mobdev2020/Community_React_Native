//import liraries
import React, {Component, useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  ImageBackground,
  ScrollView,
  Alert,
  Linking,
  FlatList,
  StatusBar,
} from 'react-native';

// Constants
import i18n from '../Localize/i18n';
import {ConstantKey} from '../Constants/ConstantKey';
import {Colors} from '../Constants/Colors';
import {Images} from '../Constants/Images';
import {FontSize} from '../Constants/FontSize';
import Webservice from '../Constants/API';
import LoadingView from '../Constants/LoadingView';
import {APIURL} from '../Constants/APIURL';
//Third Party
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import {navigate} from '../Constants/NavigationService';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
const MyAds = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [AdsCurrentPage, setAdsCurrentPage] = useState(1);
  const [AdsPaginationHide, setAdsPaginationHide] = useState(false);
  const [AdsData, setAdsData] = useState([]);
  const [Role, setRole] = useState('');

  useFocusEffect(
    useCallback(() => {
      console.log('call');
      Api_Get_Ads(true);
      Api_Get_Profile(true);
      return () => {
        console.log('1');
        setAdsCurrentPage(1);
        setAdsPaginationHide(false);
        setAdsData([]);
      };
    }, []),
  );

  // useEffect(() => {
  //   Api_Get_Ads(true)
  // }, [AdsCurrentPage])

  // const Api_Get_Ads = (isLoad) => {
  //   setIsLoading(isLoad)
  //   Webservice.get(APIURL.GetAds + "?page=" + AdsCurrentPage)
  //     .then(response => {
  //       setIsLoading(false)
  //       console.log(JSON.stringify("Api_Get_Ads Response  : " + JSON.stringify(response)));
  //       if (response.data.status == true) {

  //         if (response.data.data.next_page_url == null) {
  //           setAdsPaginationHide(true)
  //         }
  //         else{
  //           setAdsCurrentPage(AdsCurrentPage + 1)

  //         }

  //         var data = response.data.data?.data
  //         const unique = [...new Map(data.map(m => [m.id,m])).values()];
  //         console.log("unique :",unique)
  //         console.log("AdsData :",AdsData)
  //         setAdsData(unique,...AdsData)
  //       } else {
  //         // alert(response.data.message)
  //         setAdsPaginationHide(true)
  //       }
  //     })
  //     .catch((error) => {
  //       setIsLoading(false)
  //       console.log(error)
  //     })
  // }

  const Api_Get_Profile = isLoad => {
    setIsLoading(isLoad);
    Webservice.get(APIURL.GetProfile)
      .then(response => {
        setIsLoading(false);
        // console.log(JSON.stringify("Api_Get_Profile Response : " + JSON.stringify(response)));
        if (response.data.status == true) {
          var Role = response.data.data.role;
          setRole(Role);
        } else {
          alert(response.data.message);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };

  const Api_Get_Ads = async isLoad => {
    setIsLoading(isLoad);

    try {
      const response = await Webservice.get(
        APIURL.GetAds + '?page=' + AdsCurrentPage,
      );
      console.log(
        'Api_Get_Ads Response: ' + JSON.stringify(response.data.data),
      );

      if (response.data.status == true) {
        var data = response.data.data?.data;
        const unique = [...new Map(data.map(m => [m.id, m])).values()];
        const updatedAdsData = [...AdsData, ...unique];
        await setAdsData(updatedAdsData);
        setIsLoading(false);
        console.log(
          'response.data.data.next_page_url',
          response.data.data.next_page_url,
        );
        if (response.data.data.next_page_url == null) {
          setAdsPaginationHide(true);
        } else {
          console.log('else');
          setAdsPaginationHide(false);
          setAdsCurrentPage(AdsCurrentPage + 1);
        }
      } else {
        // alert(response.data.message)
        setIsLoading(false);
        setAdsPaginationHide(true);
      }
    } catch (error) {
      setIsLoading(false);
      setAdsPaginationHide(true);
      console.log(error);
    }
  };
  //   const Api_Delete_Ads =async (isLoad,items) => {
  //     setIsLoading(isLoad)

  //     let body = new FormData();
  //     body.append('advertise_id', items?.id)
  //     Webservice.post(APIURL.DeleteAds, body)
  //         .then(response => {
  //             setIsLoading(false)
  //             console.log(JSON.stringify("Api_Delete_Ads Response : " + JSON.stringify(response)));

  //             if (response.data.status == true) {
  //               var data = AdsData.filter((item)=> item.id !== items.id)
  //               setAdsData(data)
  //               setAdsCurrentPage(1)
  //               Api_Get_Ads(true)
  //                 Alert.alert("Sucess", "Advertises Deleted Sucessfully", [
  //                     {
  //                         text: 'Ok',
  //                         onPress: () => {
  //                         }
  //                     }
  //                 ], { cancelable: true })
  //             } else {
  //                 alert(response.data.Msg)
  //             }

  //         })
  //         .catch((error) => {

  //             setIsLoading(false)
  //             console.log(error)
  //         })
  // }

  const Api_Delete_Ads = async (isLoad, items) => {
    setIsLoading(isLoad);
    let body = new FormData();
    body.append('advertise_id', items?.id);
    Webservice.post(APIURL.DeleteAds, body)
      .then(response => {
        setIsLoading(false);
        // console.log("Api_Delete_Meeting Response : " + JSON.stringify(response?.data));
        if (response.data.status == true) {
          var data = AdsData.filter(item => item.id !== items.id);
          setAdsData(data);
          Alert.alert(
            'Success',
            'Advertise Deleted Successfully',
            [
              {
                text: 'Ok',
                onPress: () => {},
              },
            ],
            {cancelable: true},
          );
        } else {
          alert(response.data.Msg);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };

  const RenderStatus = val => {
    if (val == 0) {
      return 'In Review';
    } else if (val == 1) {
      return 'Live';
    } else {
      return 'Rejected';
    }
  };

  const RenderColor = val => {
    if (val == 0) {
      return '#fff3cd';
    } else if (val == 1) {
      return '#d4edda';
    } else {
      return '#f8d7da';
    }
  };

  const RenderTextColor = val => {
    if (val == 0) {
      return '#fa9f47';
    } else if (val == 1) {
      return '#34c240';
    } else {
      return '#d64242';
    }
  };

  const RenderIcon = val => {
    if (val == 0) {
      return 'alert';
    } else if (val == 1) {
      return 'check-circle';
    } else {
      return 'close-circle';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'}/>

      <View style={styles.container}>
        <View style={{flex: 1, backgroundColor: Colors.white}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 20,
              paddingVertical : 10
            }}>
            <Text
              style={{
                fontSize: FontSize.FS_18,
                color: Colors.black,
                fontFamily: ConstantKey.MONTS_SEMIBOLD,
              }}>
              {'My Advertising'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigate('AddAds', {isEdit: false});
              }}
              style={{
                alignSelf: 'flex-end',
                backgroundColor: '#ffffff',
                paddingHorizontal: 14,
                height: 34,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                borderWidth: 1,
                borderColor: Colors.primary,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: Colors.black,
                  alignSelf: 'center',
                  fontFamily : ConstantKey.MONTS_REGULAR,
                  fontSize : FontSize.FS_12
                }}>
                Add New Ads
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ marginHorizontal: 10}}>
            {console.log('AdsData Length', AdsData.length)}
            {console.log('AdsData Length', AdsPaginationHide)}
            {console.log(
              'AdsPaginationHide == false && !isLoading && AdsData.length <= 0 Length',
              AdsPaginationHide == false,
            )}
            {AdsData.length >= 0 && isLoading == false && (
              <FlatList
                data={AdsData}
                style={{marginVertical: 20}}
                keyExtractor={(item, index) => index}
                ListEmptyComponent={
                  !isLoading &&
                  AdsData.length >= 0 && (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,
                        alignSelf: 'center',
                        borderRadius: 6,
                        marginTop: 100,
                      }}>
                      <Text
                        style={{
                          fontSize: FontSize.FS_16,
                          color: Colors.black,
                          fontFamily: ConstantKey.MONTS_MEDIUM,
                        }}>
                        {'No Data Found'}
                      </Text>
                    </View>
                  )
                }
                ItemSeparatorComponent={<View style={{height:10,}}></View>}
                // ListHeaderComponent={<View style={{height:20,}}></View>}
                ListFooterComponent={
                  AdsPaginationHide == false ? (
                    <TouchableOpacity
                      onPress={() => {
                        Api_Get_Ads(true);
                      }}
                      style={{marginVertical: 25, alignSelf: 'center'}}>
                      <Text
                        style={{
                          fontSize: FontSize.FS_14,
                          color: Colors.primary,
                          fontFamily: ConstantKey.MONTS_MEDIUM,
                        }}>
                        {'See More'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{height: 20}}></View>
                  )
                }
                renderItem={({item, index}) => {
                  return (
                    <>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 5,
                          marginHorizontal: 10,
                          backgroundColor : Colors.white
                        }}>
                        <View
                          style={{
                            backgroundColor: RenderColor(item?.status),
                            paddingHorizontal: 8,
                            margin: 5,
                            borderRadius: 60,
                            alignSelf: 'flex-start',
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: FontSize.FS_12,
                              color: RenderTextColor(item?.status),
                              fontFamily: ConstantKey.MONTS_MEDIUM,
                              marginTop: 3,
                              marginLeft: 3,
                            }}>
                            {RenderStatus(item?.status)}{' '}
                          </Text>
                          <MaterialCommunityIcons
                            name={RenderIcon(item?.status)}
                            size={10}
                            color={RenderTextColor(item?.status)}
                          />
                        </View>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <TouchableOpacity
                            onPress={() => {
                              Alert.alert(
                                'Alert',
                                'Are you sure you want to delete advertise?',
                                [
                                  {
                                    text: 'No',
                                    onPress: () => {},
                                  },
                                  {
                                    text: 'Yes',
                                    onPress: () => {
                                      Api_Delete_Ads(true, item);
                                    },
                                  },
                                ],
                                {cancelable: true},
                              );
                            }}
                            style={{paddingHorizontal: 20}}>
                            <FastImage
                              style={{width: 20, height: 20}}
                              source={Images.ic_delete}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              navigate('AddAds', {isEdit: true, AdsData: item});
                            }}>
                            <FastImage
                              style={{width: 20, height: 20}}
                              source={Images.ic_edit}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          marginHorizontal: 10,
                          marginVertical: 5,
                          borderRadius : 10,
                          backgroundColor: Colors.white,
                          borderBottomLeftRadius: 8,
                          borderBottomRightRadius: 8,
                          shadowColor: "#000",
								shadowOffset: {
									width: 0,
									height: 2,
								},
								shadowOpacity: 0.20,
								shadowRadius: 4,
								elevation: 5,
                        }}>
                        <View
                          style={{
                            width: '100%',
                            height: ConstantKey.SCREEN_HEIGHT / 4.5,

                          }}>
                          <ImageBackground
                            style={{flex: 1, borderRadius: 10}}
                            source={{uri: item?.image_url}}
                            imageStyle={{}}
                            borderTopLeftRadius={10}
                            borderTopRightRadius={10}
                            resizeMode="cover"></ImageBackground>
                        </View>
                        <View
                          style={{
                            padding: 8,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            {item?.advertise_name && (
                              <Text
                                style={{
                                  fontSize: FontSize.FS_14,
                                  color: Colors.black,
                                  fontFamily: ConstantKey.MONTS_SEMIBOLD,
                                }}>
                                {item?.advertise_name}
                              </Text>
                            )}

                            <Text
                              style={{
                                fontSize: FontSize.FS_12,
                                color: Colors.black,
                                fontFamily: ConstantKey.MONTS_REGULAR,
                              }}>
                              {moment(item?.created_at).format('DD/MM/YY')}{' '}
                            </Text>
                          </View>
                          {item?.url && (
                            <Text
                              onPress={() => {
                                Linking.openURL(item?.url);
                              }}
                              numberOfLines={1}
                              style={{
                                fontSize: FontSize.FS_10,
                                color: Colors.endeavour,
                                fontFamily: ConstantKey.MONTS_REGULAR,
                                marginTop: 4,
                              }}>
                              {item?.url}
                            </Text>
                          )}
                          {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginVertical: 5 }}>
                        <TouchableOpacity onPress={() => {
                          Alert.alert("Alert", "Are you sure you want to delete advertise?", [
                            {
                              text: 'No',
                              onPress: () => {
                              }
                            },
                            {
                              text: 'Yes',
                              onPress: () => {
                                Api_Delete_Ads(true, item)
                              }
                            }
                          ], { cancelable: true })
                        }}
                          style={{ borderColor: Colors.grey01, borderRadius: 25, paddingVertical: 2, paddingHorizontal: 20, alignItems: "center", borderWidth: 1, marginRight: 12 }}>
                          <Text style={{ fontSize: FontSize.FS_13, color: Colors.grey01, fontFamily: ConstantKey.MONTS_REGULAR, }}>{"Delete"}</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigate("AddAds", { isEdit: true, AdsData: item }) }}
                          style={{ backgroundColor: Colors.primary, borderRadius: 25, paddingVertical: 2, paddingHorizontal: 26, alignItems: "center" }}>
                          <Text style={{ fontSize: FontSize.FS_13, color: Colors.white, fontFamily: ConstantKey.MONTS_REGULAR }}>{"Edit"}</Text>

                        </TouchableOpacity>
                      </View> */}
                        </View>
                      </View>
                    </>
                  );
                }}
              />
            )}
          </ScrollView>
        </View>

        {isLoading ? <LoadingView /> : null}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  calloutTitle: {
    fontSize: FontSize.FS_16,
    fontFamily: ConstantKey.MONTS_SEMIBOLD,
    color: Colors.primary,
  },
  calloutDescription: {
    marginTop: 5,
    fontSize: FontSize.FS_14,
    fontFamily: ConstantKey.MONTS_REGULAR,
    color: Colors.darkGrey,
  },
});
export default MyAds;
