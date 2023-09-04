//import liraries
import React, {  useEffect, useState, useRef, useCallback } from 'react';
import {
	View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Platform,
	Linking, Alert, Share, ScrollView,
} from 'react-native';
// Constants
import i18n from '../Localize/i18n'
import { ConstantKey } from '../Constants/ConstantKey'
import { Colors } from '../Constants/Colors';
import { Images } from '../Constants/Images';
import { FontSize } from '../Constants/FontSize';
import Webservice from '../Constants/API'
import LoadingView from '../Constants/LoadingView'
import { APIURL } from '../Constants/APIURL';
import { version as versionNo } from '../../package.json'
import Toast from 'react-native-simple-toast';
// import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geocoder from 'react-native-geocoding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { navigate } from '../Constants/NavigationService';
import Banner from '../commonComponents/BoxSlider/Banner';
import TextSlider from '../commonComponents/TextSlider/Banner';


// create a component
const Home = (props) => {

	const [isLoading,  setIsLoading] = useState(false)
	const [CategoryData, setCategoryData] = useState(null)
	const [UserData, setUserData] = useState(null);
	const [AdsData, setAdsData] = useState([]);
	const [NoticeData, setNoticeData] = useState([]);

	const handleLoading = (value) => {
		setIsLoading(value);
	  };

	  useEffect(() => {
		const apiCalls = [Api_Get_Profile, Api_Get_Ads, Api_Get_Banner, Api_Get_Category];
		Promise.all(apiCalls.map((apiCall) => apiCall(handleLoading)))
		  .then((results) => {
			const hasError = results.some((result) => result === undefined);
			if (hasError) {
			  console.error('One or more API calls failed');
			} else {
			  // All API calls were successful
			  // Process the data if needed
			}
		  })
		  .catch((error) => {
			console.error('Error during Promise.all:', error);
		  });
	  }, []);
	
	  useFocusEffect(
		useCallback(() => {
		  Api_Get_Profile(handleLoading);
		  Api_Get_Ads(handleLoading);
		  Api_Get_Banner(handleLoading);
		  Api_Get_Category(handleLoading);
	  
		  return () => {
			// Cleanup function if needed
		  };
		}, [])
	  );


	const getUserData = async (user_data) => {
		try {
			const value = await AsyncStorage.getItem(ConstantKey.USER_DATA)
			console.log("val :", value)
			if (value !== null) {
				// value previously stored


			}
			else {

			}
		} catch (e) {
			console.log("Error for FCM: " + e)
		}
	}

	const Api_Get_Profile = (handleLoading) => {
		handleLoading(true); // Set loading to true when starting the API call
		Webservice.get(APIURL.GetProfile)
		  .then((response) => {
			console.log(JSON.stringify("Api_Get_Profile Response : " + JSON.stringify(response)));
			if (response.data.status == true) {
			  var data = response.data.data;
			  storeData(JSON.stringify(data));
			  setUserData(response.data.data);
			} else {
			  alert(response.data.message);
			}
		  })
		  .catch((error) => {
			console.log(error);
		  })
		  .finally(() => {
			handleLoading(false); // Set loading to false when the API call is completed (success or failure)
		  });
	  }

	const Api_Get_Ads = (isLoad) => {
		handleLoading(true); // Set loading to true when starting the API call
		Webservice.get(APIURL.GetAds + "?page=1&home_slider=1")
			.then(response => {
				console.log(JSON.stringify("Api_Get_Ads Response  : " + JSON.stringify(response)));
				if (response.data.status == true) {
					var data = response.data.data.data
					var newArray = data.map(item => {
						return {
							...item,
							image: item.image_url
						}
					})
					console.log("newArray", newArray)
					setAdsData(newArray)
				} else {
					alert(response.data.message)
				}
			})
			.catch((error) => {
				console.log(error)
			})
			.finally(() => {
				handleLoading(false); // Set loading to false when the API call is completed (success or failure)
			  });
	}
	const Api_Get_Banner = (isLoad) => {
		handleLoading(true)
		Webservice.get(APIURL.GetNotice + "?page=1")
			.then(response => {
				// console.log(JSON.stringify("Api_Get_Banner Response : " + JSON.stringify(response)));
				if (response.data.status == true) {
					var data = response.data.data.data
					setNoticeData(data)
				} else {
					alert(response.data.message)
				}
			})
			.catch((error) => {
				console.log(error)
			})
			.finally(() => {
				handleLoading(false); // Set loading to false when the API call is completed (success or failure)
			  });
	}
	const Api_Get_Category = (isLoad) => {
		handleLoading(true)
		Webservice.get(APIURL.GetCategory, {
			mobile_number: 9016089923
		})
			.then(response => {
				console.log("Get Category Response : ", response.data)

				if (response.data.status == true) {
					setCategoryData(response.data.data)
				} else {
					Toast.showWithGravity(response.data.message, Toast.LONG, Toast.BOTTOM);
				}
			})
			.catch((error) => {
				console.log(error)
			})
			.finally(() => {
				handleLoading(false); // Set loading to false when the API call is completed (success or failure)
			  });
	}
	const storeData = async (value) => {
		try {
			await AsyncStorage.setItem(ConstantKey.USER_DATA, value)
		} catch (e) {
			console.log("Error :", e)
		}
	}

	const btnShareTap = () => {
		Share.share(
			{
				message: 'Hello, Check this out\n\nHere im sharing an application link for School Community, Please install it .\n\nFor Android users : ' + ConstantKey.PLAY_STORE + "\n\nFor iPhone users : " + ConstantKey.APP_STORE,
			}
		).then(({ action, activityType }) => {
			if (action === Share.sharedAction)
				console.log('Share was successful');
			else
				console.log('Share was dismissed');
		});
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={{}}>
				<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 20, marginVertical: 12 }}>
					<View>
						<Text style={{
							fontSize: FontSize.FS_17,
							color: Colors.black,
							fontFamily: ConstantKey.MONTS_SEMIBOLD,
						}}>
							{UserData?.user?.school_title}
						</Text>
						<Text style={{
							fontSize: FontSize.FS_16,
							color: Colors.grey01,
							fontFamily: ConstantKey.MONTS_MEDIUM,
							lineHeight: 20
						}}>
							{UserData?.user?.first_name && "Hii, " + UserData?.user?.first_name + "!"}
						</Text>
					</View>
					<TouchableOpacity onPress={() => { navigate("Profile") }}>
						<FastImage style={{ resizeMode: 'contain', width: 50, height: 50, borderRadius: 50 }}
							source={{ uri: UserData?.user?.avatar_url }}
						/>
					</TouchableOpacity>

				</View>
				<View style={{ flexDirection: "row", flex: 1, marginHorizontal: 20, alignItems: "center" }}>
					<TouchableOpacity onPress={() => {
						navigate("SearchScreen", { isSearch: true })
					}}
						style={[styles.mobileView, { flex: 0.75 }]}>
						<Icon name={"magnify"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />

						<View>
							<Text style={{
								fontSize: FontSize.FS_14,
								color: Colors.grey,
								fontFamily: ConstantKey.MONTS_REGULAR,
								marginLeft: 5
							}}>{i18n.t('searchHere')}</Text>
						</View>
					</TouchableOpacity>
					<View style={{ flexDirection: "row", alignItems: "center", flex: 0.25, justifyContent: "space-evenly", marginTop: 4 }}>

						<TouchableOpacity onPress={() => {
							btnShareTap()
						}}>
							<FastImage style={{ width: 24, height: 24, }}
								source={Images.Share}
								resizeMode='contain'
							/>
						</TouchableOpacity>

						<TouchableOpacity onPress={() => {
							props.navigation.navigate("Report")
						}}>
							<FastImage style={{ resizeMode: 'contain', width: 24, height: 24 }}
								source={Images.Suggestion}
							/>
						</TouchableOpacity>

					</View>

				</View>
				<View style={{ marginTop: 20, }}>
					<Banner data={AdsData} />
				</View>
				<View style={{ marginHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
					<Text style={{
						fontSize: FontSize.FS_18,
						color: Colors.black,
						fontFamily: ConstantKey.MONTS_SEMIBOLD,
					}}>
						{"Categories"}
					</Text>
					<TouchableOpacity onPress={() => {
						navigate("ViewAllCategories")
					}}
						style={{ borderWidth: 0.5, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 50 }}>
						<Text style={{
							fontSize: FontSize.FS_10,
							color: Colors.black,
							fontFamily: ConstantKey.MONTS_SEMIBOLD,
						}}>
							{"View All"}
						</Text>
					</TouchableOpacity>
				</View>
				<View style={{ marginHorizontal: 20, }}>
					<FlatList
						horizontal
						showsHorizontalScrollIndicator={false}
						style={{ marginTop: 10 }}
						data={CategoryData}
						ItemSeparatorComponent={<View style={{ width: 20, }}></View>}
						renderItem={({ item, index }) => (
							<View style={{ alignItems: "center" }}>
								<TouchableOpacity onPress={() => { navigate("SearchScreen", { isSearch: false, category: item }) }}
									style={{
										backgroundColor: Colors.lightGrey01,
										width: 62,
										height: 62,
										borderRadius: 50,
										padding: 15,
										alignItems: "center",
										justifyContent: "center"
									}}>

									<FastImage style={{ resizeMode: 'contain', width: 32, height: 32 }}
										source={{ uri: item.image_url }}
									/>

								</TouchableOpacity>
								<Text style={{
									fontSize: FontSize.FS_14,
									color: Colors.black,
									fontFamily: ConstantKey.MONTS_MEDIUM,
								}}>
									{item?.name}
								</Text>
							</View>

						)}
					/>
				</View>
				<View style={{ paddingHorizontal: 20, marginVertical: 16 }}>
					<Text style={{
						fontSize: FontSize.FS_18,
						color: Colors.black,
						fontFamily: ConstantKey.MONTS_SEMIBOLD,
					}}>
						{"School Board"}
					</Text>
					<TextSlider data={NoticeData} />
				</View>
			</ScrollView>
			{isLoading ? <LoadingView /> : null}
		</SafeAreaView >
	);
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	mobileView: {
		marginTop: 10, flexDirection: 'row', borderRadius: 10, backgroundColor: Colors.lightGrey01, borderWidth: 1, borderColor: Colors.primary,
		height: 44, alignItems: 'center', backgroundColor: Colors.lightGrey01,
	},
});
export default Home;
