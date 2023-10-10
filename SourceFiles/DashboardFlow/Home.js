//import liraries
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Platform,
  Linking,
  Alert,
  Share,
  ScrollView,
  BackHandler,
  LogBox,
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
import {version as versionNo} from '../../package.json';
import Toast from 'react-native-simple-toast';
// import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions, useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {navigate} from '../Constants/NavigationService';
import Banner from '../commonComponents/BoxSlider/Banner';
import CustomSlider from '../commonComponents/CustomSlider';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedSchool } from '../Redux/reducers/userReducer';
import { storeData } from '../commonComponents/AsyncManager';

// create a component
const Home = props => {

  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false);
  const [CategoryData, setCategoryData] = useState(null);
  const [UserData, setUserData] = useState(null);
  const [AdsData, setAdsData] = useState([]);
  const [NoticeData, setNoticeData] = useState([]);
  const [EventData, setEventData] = useState([]);
  const [BottomBannerData, setBottomBannerData] = useState([]);

  const [HomeData, setHomeData] = useState(null);

  const selectedSchoolData = useSelector(state => state.userRedux.school_data)

  const handleLoading = value => {
    setIsLoading(value);
  };

  useEffect(() => {
    const apiCalls = [
      Api_Get_Profile,
      // Api_Get_Ads,
      // Api_Get_Banner,
      // Api_Get_Category,
      Api_Get_Home_data,
    ];
    Promise.all(apiCalls.map(apiCall => apiCall(handleLoading)))
      .then(results => {
        const hasError = results.some(result => result === undefined);
        if (hasError) {
          console.log('One or more API calls failed');
        } else {
          // All API calls were successful
          // Process the data if needed
        }
      })
      .catch(error => {
        console.error('Error during Promise.all:', error);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      Api_Get_Profile(handleLoading);
      // Api_Get_Ads(handleLoading);
      // Api_Get_Banner(handleLoading);
      // Api_Get_Category(handleLoading);
      Api_Get_Home_data(handleLoading);
      const backAction = () => {
        Alert.alert(
          "",
          'Are you sure you want to exit?',
          [
            {
              text: 'No',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                BackHandler.exitApp();
              },
            },
          ],
          {cancelable: true},
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, []),
  );

  const Api_Get_Profile = handleLoading => {
    handleLoading(true); // Set loading to true when starting the API call
    console.log("selectedSchoolData : ",selectedSchoolData)
    Webservice.get(APIURL.GetProfile+"?school_user_id="+selectedSchoolData?.school_user_id)
      .then(response => {
        console.log("Api_Get_Profile Response : " + JSON.stringify(response))
        if (response.data.status == true) {
          var data = response.data.data;

          var selected_school = response?.data?.data?.user?.school_data

					storeData(ConstantKey.SELECTED_SCHOOL_DATA,selected_school ,() => {
						dispatch(setSelectedSchool(selected_school))
					})


          console.log("User Data : ",JSON.stringify(data))

          storeUserData(JSON.stringify(data));
          setUserData(response.data.data);
        } else {
          alert(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        handleLoading(false); // Set loading to false when the API call is completed (success or failure)
      });
  };

  const Api_Get_Home_data = handleLoading => {
    handleLoading(true); // Set loading to true when starting the API call
    console.log("selectedSchoolData :=> ",JSON.stringify(selectedSchoolData))
    Webservice.get(APIURL.getHomeData+"?school_user_id="+selectedSchoolData?.school_user_id)
      .then(response => {
        console.log('Api_Get_Home_data Response : ' + JSON.stringify(response));
        if (response.data.status == true) {
          var data = response.data.data;

          setHomeData(data);

          var newArray = data?.top_sliders?.map(item => {
            return {
              ...item,
              image: item.image_url,
            };
          });
          // console.log("newArray", newArray)
          newArray.length && setAdsData(newArray);

          data?.events.length && setEventData(data?.events);
          data?.categories.length && setCategoryData(data?.categories);
          data?.notice.length && setNoticeData(data?.notice);

          var bottomArray = data?.bottom_sliders?.map(item => {
            return {
              ...item,
              image: item.image_url,
            };
          });

          bottomArray.length && setBottomBannerData(bottomArray);
        } else {
          alert(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        handleLoading(false); // Set loading to false when the API call is completed (success or failure)
      });
  };

  const Api_Get_Ads = isLoad => {
    handleLoading(true); // Set loading to true when starting the API call
    Webservice.get(APIURL.GetAds + '?page=1&home_slider=1&school_user_id='+selectedSchoolData?.school_user_id)
      .then(response => {
        // console.log(JSON.stringify("Api_Get_Ads Response  : " + JSON.stringify(response)));
        if (response.data.status == true) {
          var data = response.data.data.data;
          var newArray = data.map(item => {
            return {
              ...item,
              image: item.image_url,
            };
          });
          // console.log("newArray", newArray)
          setAdsData(newArray);
        } else {
          // alert(response.data.message)
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        handleLoading(false); // Set loading to false when the API call is completed (success or failure)
      });
  };
  const Api_Get_Banner = isLoad => {
    handleLoading(true);
    Webservice.get(APIURL.GetNotice + '?page=1&school_user_id='+selectedSchoolData?.school_user_id)
      .then(response => {
        // console.log(JSON.stringify("Api_Get_Banner Response : " + JSON.stringify(response)));
        if (response.data.status == true) {
          var data = response.data.data.data;
          setNoticeData(data);
        } else {
          // alert(response.data.message)
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        handleLoading(false); // Set loading to false when the API call is completed (success or failure)
      });
  };
  const Api_Get_Category = isLoad => {
    handleLoading(true);
    Webservice.get(APIURL.GetCategory+"?school_user_id="+selectedSchoolData?.school_user_id, {
      mobile_number: 9016089923,
    })
      .then(response => {
        // console.log("Get Category Response : ", response.data)

        if (response.data.status == true) {
          setCategoryData(response.data.data);
        } else {
          Toast.showWithGravity(
            response.data.message,
            Toast.LONG,
            Toast.CENTER,
          );
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        handleLoading(false); // Set loading to false when the API call is completed (success or failure)
      });
  };
  const storeUserData = async value => {
    try {
      await AsyncStorage.setItem(ConstantKey.USER_DATA, value);
    } catch (e) {
      console.log('Error :', e);
    }
  };

  const btnShareTap = () => {
    Share.share({
      message:
        'Hello, Check this out\n\nHere im sharing an application link for School Community, Please install it .\n\nFor Android users : ' +
        ConstantKey.PLAY_STORE +
        '\n\nFor iPhone users : ' +
        ConstantKey.APP_STORE,
    }).then(({action, activityType}) => {
      if (action === Share.sharedAction) console.log('Share was successful ');
      else console.log('Share was dismissed');
    });
  };

  const btnSelectEventTap = item => {
    console.log(item);
    var dict = {
      ...item,
      description: item?.event_desc,
      end_date: item?.event_end_date,
      image: item?.event_image,
      image_url: item?.event_image_url,
      link: item?.event_link,
      name: item?.event_name,
      start_date: item?.event_start_date,
    };

    navigate('Details', {data: dict});
  };

  return (
    <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'}/>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 12,
        }}>
        <View style={{flex: 0.8, marginLeft: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FastImage
              style={{width: 24, height: 24}}
              source={selectedSchoolData?.logo_url ? {uri : selectedSchoolData?.logo_url} : Images.School_logo}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={{
                fontSize: FontSize.FS_14,
                color: Colors.black,
                fontFamily: ConstantKey.MONTS_SEMIBOLD,
                marginLeft: 5,
              }}>
              {selectedSchoolData?.title}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={{
              fontSize: FontSize.FS_12,
              color: Colors.grey01,
              fontFamily: ConstantKey.MONTS_REGULAR,
              lineHeight: FontSize.FS_26,
            }}>
            {UserData?.user?.first_name &&
              'Hey, ' + UserData?.user?.first_name + '!'}
          </Text>
        </View>
        <View style={{flex: 0.1}}></View>
        <TouchableOpacity
          style={{flex: 0.2, marginRight: 20, alignItems: 'center'}}
          onPress={() => {
            navigate('Profile');
          }}>
          <FastImage
            style={{
              resizeMode: 'contain',
              width: 44,
              height: 44,
              borderRadius: 44,
            }}
            source={{uri: UserData?.user?.avatar_url}}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={{}}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            marginHorizontal: 20,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigate('SearchScreen', {isSearch: true});
            }}
            style={[styles.mobileView, {flex: 0.75}]}>
            <Icon
              name={'magnify'}
              size={20}
              color={Colors.grey}
              style={{marginLeft: 10}}
            />

            <View>
              <Text
                style={{
                  fontSize: FontSize.FS_14,
                  color: Colors.grey,
                  fontFamily: ConstantKey.MONTS_REGULAR,
                  marginLeft: 5,
                }}>
                {i18n.t('searchHere')}
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 0.25,
              justifyContent: 'space-evenly',
              marginTop: 4,
            }}>
            <TouchableOpacity
              onPress={() => {
                btnShareTap();
              }}>
              <FastImage
                style={{width: 24, height: 24}}
                source={Images.Share}
                resizeMode="contain"
              />
            </TouchableOpacity>

              {UserData?.role == 'school' ? 
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Report');
              }}>
              <FastImage
                style={{resizeMode: 'contain', width: 24, height: 24}}
                source={Images.Suggestion}
              />
            </TouchableOpacity>
            : null}
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <Banner data={AdsData} />
        </View>

        <View
          style={{
            marginHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View>
            <Text
              style={{
                fontSize: FontSize.FS_18,
                color: Colors.black,
                fontFamily: ConstantKey.MONTS_SEMIBOLD,
              }}>
              {'Categories'}
            </Text>
            <View
              style={{
                height: 2.5,
                width: 100,
                backgroundColor: Colors.primary,
                marginLeft: 1,
              }}></View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigate('ViewAllCategories');
            }}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 50,
              backgroundColor: Colors.primaryLight,
            }}>
            <Text
              style={{
                fontSize: FontSize.FS_10,
                color: Colors.primary,
                fontFamily: ConstantKey.MONTS_MEDIUM,
              }}>
              {'View All'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginHorizontal: 20}}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 10}}
            data={CategoryData}
            ItemSeparatorComponent={<View style={{width: 20}}></View>}
            renderItem={({item, index}) => (
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    navigate('SearchScreen', {isSearch: false, category: item});
                  }}
                  style={{
                    backgroundColor: Colors.primaryLight,
                    width: 62,
                    height: 62,
                    borderRadius: 50,
                    padding: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FastImage
                    style={{resizeMode: 'contain', width: 32, height: 32}}
                    source={{uri: item.image_url}}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: FontSize.FS_14,
                    color: Colors.black,
                    fontFamily: ConstantKey.MONTS_MEDIUM,
                    marginTop: 10,
                  }}>
                  {item?.name} ({item?.business_count})
                </Text>
              </View>
            )}
          />
        </View>
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <View>
            <Text
              style={{
                fontSize: FontSize.FS_18,
                color: Colors.black,
                fontFamily: ConstantKey.MONTS_SEMIBOLD,
              }}>
              {'Events'}
            </Text>
            <View
              style={{
                height: 2.5,
                width: 50,
                backgroundColor: Colors.primary,
                marginLeft: 1,
              }}></View>
          </View>
          {EventData.length ? (
            <TouchableOpacity
              onPress={() => {
                navigate('Events');
              }}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 50,
                backgroundColor: Colors.primaryLight,
              }}>
              <Text
                style={{
                  fontSize: FontSize.FS_10,
                  color: Colors.primary,
                  fontFamily: ConstantKey.MONTS_MEDIUM,
                }}>
                {'View All'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={{}}>
          <View>
            <Text
              style={{
                fontSize: FontSize.FS_12,
                color: Colors.grey,
                fontFamily: ConstantKey.MONTS_REGULAR,
                marginHorizontal: 20,
                marginTop: 5,
              }}>
              Never miss out an event that matches your interest!
            </Text>
          </View>
          <FlatList
            horizontal
            contentContainerStyle={{paddingHorizontal: 20}}
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 10}}
            data={EventData}
            ItemSeparatorComponent={<View style={{width: 14}}></View>}
            renderItem={({item, index}) => (
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => btnSelectEventTap(item)}
                  style={{
                    backgroundColor: Colors.white,
                    width: 170,
                    // height: 170,
                    borderRadius: 10,
                    marginBottom: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 5,
                    // padding: 8,
                    // alignItems: "center",
                    // justifyContent: "center"
                  }}>
                  <FastImage
                    style={{
                      width: 170,
                      borderTopLeftRadius: 6,
                      borderTopRightRadius: 6,
                      height: 100,
                    }}
                    source={{
                      uri: item?.event_image_url,
                    }}
                  />
                  <View style={{paddingHorizontal: 10, marginVertical: 6}}>
                    <Text
                      style={{
                        fontSize: FontSize.FS_14,
                        color: Colors.black,
                        fontFamily: ConstantKey.MONTS_MEDIUM,
                      }}
                      numberOfLines={1}>
                      {item?.event_name}
                    </Text>
                    <Text
                      numberOfLines={3}
                      style={{
                        marginTop: 5,
                        fontSize: FontSize.FS_12,
                        color: Colors.dimGray,
                        fontFamily: ConstantKey.MONTS_REGULAR,
                      }}>
                      {item?.event_desc}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <View style={{marginHorizontal: 20, marginTop: 16, marginBottom: 0}}>
          <View>
            <Text
              style={{
                fontSize: FontSize.FS_18,
                color: Colors.black,
                fontFamily: ConstantKey.MONTS_SEMIBOLD,
              }}>
              {'School Board'}
            </Text>
            <View
              style={{
                height: 2.5,
                width: 70,
                backgroundColor: Colors.primary,
                marginLeft: 1,
                marginBottom: 10,
              }}></View>
          </View>
        </View>
        <CustomSlider data={NoticeData} />
        <View style={{marginTop: 20}}>
          <Banner data={BottomBannerData} />
        </View>
      </ScrollView>

      {isLoading ? <LoadingView /> : null}
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mobileView: {
    marginTop: 10,
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: Colors.lightGrey01,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    height: 44,
    alignItems: 'center',
    backgroundColor: Colors.lightGrey01,
  },
});
export default Home;
