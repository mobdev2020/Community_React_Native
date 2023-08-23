//import liraries
import React, { Component, useLayoutEffect, useEffect, useState, useRef } from 'react';
import {
	View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, FlatList, Platform, Modal, TextInput,
	Linking, Alert, PermissionsAndroid, Image, Keyboard, Switch, Share, ScrollView, LogBox,
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
import ViewProfile from './ViewProfile';

//Third Party
import MapView, { Marker, PROVIDER_GOOGLE, Callout, Circle, } from 'react-native-maps';
import Toast from 'react-native-simple-toast';
// import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SliderBox } from "react-native-image-slider-box";
import RBSheet from "react-native-raw-bottom-sheet";
import { colors, SearchBar } from 'react-native-elements';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import { WebView } from 'react-native-webview';
import { Svg, Image as ImageSvg } from 'react-native-svg';
import { Dropdown } from 'react-native-material-dropdown-v2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import PolicyModal from './PolicyModal';
import EventDisplay from './EventDisplay';

import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { navigate } from '../Constants/NavigationService';
import { ExpandingDot } from 'react-native-animated-pagination-dots';
import Banner from '../commonComponents/BoxSlider/Banner';
import TextSlide from '../commonComponents/TextSlider/Slide';
import TextSlider from '../commonComponents/TextSlider/Banner';
// create a component
const Home = (props) => {

	const refRBUsers = useRef();
	const refRBProfile = useRef();
	const refMarker = useRef();
	const refMarkerPin = useRef([])


	const [isLoading, setIsLoading] = useState(false)
	const [ContactList, setContactList] = useState([])

	const [SelectedProfile, setSelectedProfile] = useState(null)
	const [CurrentLatitude, setCurrentLatitude] = useState(20.5937)
	const [CurrentLongitude, setCurrentLongitude] = useState(78.9629)

	const [FilterContactList, setFilterContactList] = useState([])
	const [SelectedUser, setSelectedUser] = useState(null)
	const [SelectedMember, setSelectedMember] = useState(null)
	const [FilteredName, setFilteredName] = useState('')
	const [modalVisible, setModalVisible] = useState(false);
	const [txtAddress, setTxtAddress] = useState('')

	const [FinalOTP, setFinalOTP] = useState('')
	const [txtOTP, setTxtOtp] = useState('')
	const [isOTPView, setIsOTPView] = useState(0)
	const [CategoryData, setCategoryData] = useState(null)
	const [locationSwitch, setLocationSwitch] = useState(true);

	const [openPolicy, setOpenPolicy] = useState(false);
	const [openLoginModal, setOpenLoginModal] = useState(false);
	const [UserData, setUserData] = useState(null);
	const [AdsData, setAdsData] = useState([]);
	const [NoticeData, setNoticeData] = useState([]);

	const [ArrEvents, setArrEvents] = useState([]);
	const [isDisplayEvent, setIsDisplayEvent] = useState(false)

	const HomeBanner = [
		{
			image: "https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg",
		},
		{
			image: "https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg",

		},
		{
			image: "https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg",

		},
	]
	const AddBanner = [
		{
			title: "Notice",
			desc: "Today- 01/08/2023 - Tuesday School is having holiday as declared by government due to very heavy rainfall."
		},
		{
			title: "Notice",
			desc: "Today- 01/08/2023 - Tuesday School is having holiday as declared by government due to very heavy rainfall."

		},
		{
			title: "Notice",
			desc: "Today- 01/08/2023 - Tuesday School is having holiday as declared by government due to very heavy rainfall."

		},
	]

	useEffect(() => {
		Api_Get_Profile(true)
		Api_Get_Ads(true)
		Api_Get_Banner(true)
		Api_Get_Category(true)
		// getUserData()
		return () => {

		}
	}, [])



	const btnReportTap = () => {
			props.navigation.navigate('Report', { userData: JSON.stringify(UserData) })
	}



	const getUserData = async (user_data) => {
		try {
			const value = await AsyncStorage.getItem(ConstantKey.USER_DATA)
			console.log("val :",value)
			if (value !== null) {
				// value previously stored

				
			}
			else {

			}
		} catch (e) {
			console.log("Error for FCM: " + e)
		}
	}
	const getFCMToken = async (user_data) => {
		try {
			const value = await AsyncStorage.getItem(ConstantKey.FCM_TOKEN)
			if (value !== null) {
				// value previously stored

				Api_UpdateDeviceId(false, user_data, JSON.parse(value))
			}
			else {

			}
		} catch (e) {
			console.log("Error for FCM: " + e)
		}
	}



	const Api_Get_Profile = (isLoad) => {
		setIsLoading(isLoad)
		Webservice.get(APIURL.GetProfile)
			.then(response => {
				setIsLoading(false)
				console.log(JSON.stringify("Api_Get_Profile Response : " + JSON.stringify(response)));
				if (response.data.status == true) {
					var data = response.data.data
					storeData(JSON.stringify(data))
					setUserData(response.data.data)
				} else {
					alert(response.data.message)
				}
			})
			.catch((error) => {
				setIsLoading(false)
				console.log(error)
			})
	}

	const Api_Get_Ads = (isLoad) => {
		setIsLoading(isLoad)
		Webservice.get(APIURL.GetAds + "?page=1")
			.then(response => {
				setIsLoading(false)
				console.log(JSON.stringify("Api_Get_Ads Response : " + JSON.stringify(response)));
				if (response.data.status == true) {
					var data = response.data.data.data
					var newArray = data.map(item =>{
						return{
							...item,
							image : item.image_url
						}
					})
					console.log("newArray",newArray)
					setAdsData(newArray)
				} else {
					alert(response.data.message)
				}
			})
			.catch((error) => {
				setIsLoading(false)
				console.log(error)
			})
	}
	const Api_Get_Banner = (isLoad) => {
		setIsLoading(isLoad)
		Webservice.get(APIURL.GetNotice + "?page=1")
			.then(response => {
				setIsLoading(false)
				// console.log(JSON.stringify("Api_Get_Banner Response : " + JSON.stringify(response)));
				if (response.data.status == true) {
					var data = response.data.data.data
					setNoticeData(data)
				} else {
					alert(response.data.message)
				}
			})
			.catch((error) => {
				setIsLoading(false)
				console.log(error)
			})
	}
	const Api_Get_Category = (isLoad) => {
		setIsLoading(isLoad)
		Webservice.get(APIURL.GetCategory, {
			mobile_number: 9016089923
		})
			.then(response => {
				console.log("Get Category Response : ", response.data)

				if (response.data.status == true) {
					setCategoryData(response.data.data)
					setIsLoading(false)
				} else {
					Toast.showWithGravity(response.data.message, Toast.LONG, Toast.BOTTOM);
					setIsLoading(false)
				}
			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}
	const storeData = async (value) => {
		try {
			await AsyncStorage.setItem(ConstantKey.USER_DATA, value)
		} catch (e) {
			console.log("Error :",e)
		}
	}


	const storeUserData = async (value) => {
		try {
			await AsyncStorage.setItem(ConstantKey.USER_DATA, value)

		} catch (e) {
			// saving error
		}
	}


	const Api_Logout = (isLoad) => {

		setIsLoading(isLoad)

		console.log("API_LOGOUT User na Data :" + JSON.stringify(UserData))

		Webservice.post(APIURL.logout, {
			member_id: UserData.id,
		})
			.then(response => {

				setIsLoading(false)
				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("API_LOGOUT Response : " + JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.Status == '1') {
					clearAll(props)
					setUserData(null)
				} else {
					alert(response.data.Msg)
				}

			})
			.catch((error) => {

				// setIsLoading(false)
				console.log(error)
			})
	}

	const Api_UpdateDeviceId = (isLoad, user_data, fcm_token) => {

		// setIsLoading(isLoad)

		console.log("Api_UpdateDeviceId User na Data :" + JSON.stringify(user_data))

		Webservice.post(APIURL.deviceIdUpdate, {
			member_id: user_data.id,
			// device_id : fcm_token,
			device_type: Platform.OS == 'android' ? 0 : 1
		})
			.then(response => {

				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("deviceIdUpdate Response : " + JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.Status == '1') {

				} else {

				}

			})
			.catch((error) => {

				// setIsLoading(false)
				console.log(error)
			})
	}


	const Api_GetContacts = (isLoad, user_data) => {

		setIsLoading(isLoad)

		console.log("Api_GetContacts User na Data :" + JSON.stringify(user_data))

		Webservice.post(APIURL.getContacts, {
			member_id: user_data.id
		})
			.then(response => {

				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify(response));
				setIsLoading(false)

				if (response.data.Status == '1') {

					var data = response.data.Data

					var filterActive = data.filter((item) => item.isVisible == "1")


					setContactList(filterActive)
					setFilterContactList(filterActive)

					// Check policy
					// getPolicyData()

					// setSelectedMember(response.data.Data[0])
					// setTxtAddress(response.data.Data[0].profile_address)
				} else {
					Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}

	const Api_VersionCheck = (isLoad) => {

		// setIsLoading(isLoad)

		Webservice.post(APIURL.versionCheck, {
			version: versionNo,
		})
			.then(response => {
				//   this.setState({spinner: false});
				if (response == null) {
					this.setState({ isloading: false, isRefresh: false });
					alert('error');
				}
				//   console.log(response);

				console.log('Get Version Check Response : ' + JSON.stringify(response))

				if (response.data.Status == '0') {

					Alert.alert(
						i18n.t('update'),
						i18n.t('updateAppDesc'),
						[
							{
								text: "OK", onPress: () => {

									if (Platform.OS == 'android') {

										Linking.openURL('market://details?id=com.webtual.magnusnetwork')
									} else {
										Linking.openURL('itms-apps://itunes.apple.com/us/app/1587460944?mt=8')
									}

								}
							},
						],
						{ cancelable: false }
					);

				} else {

					Api_GetEvents(true)
					//   this.showAlert(response.data.Msg)
				}
			})
			.catch((error) => {
				console.log(error.message)

			})
	}


	const Api_GetEvents = (isLoad) => {

		setIsLoading(isLoad)

		Webservice.get(APIURL.getEventList)
			.then(response => {
				//   this.setState({spinner: false});

				setIsLoading(false)

				if (response == null) {
					alert('error');
				}
				//   console.log(response);

				console.log('Get EventList Response : ' + JSON.stringify(response))

				if (response.data.Status == '1') {

					setArrEvents(response.data.Data)
					setIsDisplayEvent(true)
				} else {
					setIsDisplayEvent(false)

				}
			})
			.catch((error) => {
				setIsDisplayEvent(false)
				setIsLoading(false)
				console.log(error.message)

			})
	}



	const btnSubmitTap = (type) => {

			if (type == 1) {
				if (SelectedMember == null) {
					Toast.showWithGravity("Please select member", Toast.LONG, Toast.BOTTOM);
				}
				else if (txtAddress == '') {
					Toast.showWithGravity("Please enter address", Toast.LONG, Toast.BOTTOM);
				} else {
					Api_VerifyMember(true)
				}
			} else {

				if (txtOTP.length != 4) {
					Toast.showWithGravity("Please enter valid OTP", Toast.LONG, Toast.BOTTOM);
				} else if (txtOTP != FinalOTP) {
					Toast.showWithGravity("OTP is not match, Please try again", Toast.LONG, Toast.BOTTOM);
				}
				else {

					setModalVisible(false)

					Geocoder.init(ConstantKey.GOOGLE_KEY);
					// Search by geo-location (reverse geo-code)
					Geocoder.from(txtAddress)
						.then(json => {
							var location = json.results[0].geometry.location;
							console.log("location String : " + JSON.stringify(location));

							Api_UpdateAddress(true, location)

						})
						.catch(error => console.warn(error));

				}
			}

	}

	const clearAll = async (props) => {

		try {

			await AsyncStorage.clear()

			props.navigation.dispatch(
				StackActions.replace('Login')
			);
		} catch (e) {
			// clear error
		}
	}

	const btnProfileTap = () => {
			props.navigation.navigate('Profile', { userData: JSON.stringify(UserData) })
	}

	const btnShareTap = () => {
			Share.share(
				{
					message: 'Hello, Check this out\n\nHere im sharing an application link for Magnus Network, Please install it & find any magnus members just on single click.\n\nFor Android users : ' + ConstantKey.PLAY_STORE + "\n\nFor iPhone users : " + ConstantKey.APP_STORE,
				}
			).then(({ action, activityType }) => {
				if (action === Share.sharedAction)
					console.log('Share was successful');
				else
					console.log('Share was dismissed');
			});
	}

	const btnLogoutTap = () => {
			Alert.alert(
				i18n.t('appName'),
				i18n.t('logoutDesc'),
				[
					{ text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
					{
						text: 'Yes',
						onPress: () => {

							Api_Logout(true)
							// clearAll(props)
							// setUserData(null)

						}
					},
				],
				{ cancelable: true }
			);
	}

	const SwtichChange = (value) => {


		if (UserData == null) {

			Toast.showWithGravity(i18n.t("pleaseLogin"), Toast.LONG, Toast.BOTTOM)
		} else {

			Api_ToggleLocation(true, value == true ? 1 : 0)
			// Alert.alert(
			// 	'',
			// 	value ? i18n.t('turnOnLocation') : i18n.t('turnOffLocation'),
			// 	[
			// 		{ text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
			// 		{
			// 			text: 'Yes',
			// 			onPress: () => {

			// 				setLocationSwitch(value)

			// 			}
			// 		},
			// 	],
			// 	{ cancelable: true }
			// );
			console.log(value);

		}

	}

	const btnHelpTap = () => {
			props.navigation.navigate('Help')
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={{}}>
				<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 20, marginVertical: 12 }}>
					<View>
						<Text style={{
							fontSize: FontSize.FS_18,
							color: Colors.black,
							fontFamily: ConstantKey.MONTS_SEMIBOLD,
						}}>
							{"Webtual School"}
						</Text>
						<Text style={{
							fontSize: FontSize.FS_18,
							color: Colors.grey01,
							fontFamily: ConstantKey.MONTS_SEMIBOLD,
							lineHeight: 20
						}}>
							{"Hii, " +UserData?.user?.first_name+ "!" }
						</Text>
					</View>
					<TouchableOpacity onPress={() => { navigate("Profile") }}>
						<FastImage style={{ resizeMode: 'contain', width: 50, height: 50,borderRadius:50 }}
							source={{uri:UserData?.user?.avatar_url}}
						/>
					</TouchableOpacity>

				</View>
				<View style={{ flexDirection: "row", flex: 1, marginHorizontal: 20, alignItems: "center" }}>
					<TouchableOpacity onPress={() => {
						navigate("SearchScreen")
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
						<FastImage style={{ width: 24, height: 24, }}
							source={Images.Share}
							resizeMode='contain'
						/>
						<FastImage style={{ resizeMode: 'contain', width: 24, height: 24 }}
							source={Images.Suggestion}
						/>
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
								<TouchableOpacity style={{
									backgroundColor: Colors.lightGrey01,
									width: 62,
									height: 62,
									borderRadius: 50,
									padding: 15,
									alignItems: "center",
									justifyContent: "center"
								}}>

									<FastImage style={{ resizeMode: 'contain', width: 32, height: 32 }}
										source={{uri :item.image_url}}
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
	mapStyle: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	calloutTitle: {
		fontSize: FontSize.FS_15,
		fontFamily: ConstantKey.MONTS_SEMIBOLD,
		color: Colors.primaryRed
	},
	calloutbusinessname: {
		fontSize: FontSize.FS_14,
		fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black,
	},
	calloutDescription: {
		marginTop: 5,
		fontSize: FontSize.FS_14,
		fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.darkGrey,
		flex: 1
	},

	grediant: {
		margin: 20,
		// padding: 5,
		height: 44,
		// // flex:1,
		// width: 300,
		// justifyContent: 'center',
		alignSelf: 'center'
	},
	buttonContainer: {
		flex: 1.0,
		alignSelf: 'center',
		justifyContent: 'center',
		backgroundColor: '#ffffff',
		width: '99%',
		margin: 1,
		paddingHorizontal: 50
	},
	buttonText: {
		textAlign: 'center',
		color: '#4C64FF',
		alignSelf: 'center',
	},
	mobileView: {
		marginTop: 10, flexDirection: 'row', borderRadius: 10, backgroundColor: Colors.lightGrey01, borderWidth: 1, borderColor: Colors.primary,
		height: 44, alignItems: 'center', backgroundColor: Colors.lightGrey01,
	},

	textInputMobile: {
		marginLeft: 10, marginRight: 10, height: 50, flex: 1, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black,
	},
});
export default Home;
