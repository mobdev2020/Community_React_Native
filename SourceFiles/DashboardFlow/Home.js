//import liraries
import React, { Component, useLayoutEffect, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, FlatList, Platform, Modal, TextInput, 
		Linking, Alert, PermissionsAndroid, Image, Keyboard, Switch, Share } from 'react-native';

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
import MapView, { Marker, PROVIDER_GOOGLE, Callout,Circle } from 'react-native-maps';
import Toast from 'react-native-simple-toast';
// import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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


// create a component
const Home = (props) => {

	const refRBUsers = useRef();
	const refRBProfile = useRef();
	const refMarker = useRef();
	const refMarkerPin = useRef([])


	const [isLoading, setIsLoading] = useState(true)
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

	const [locationSwitch, setLocationSwitch] = useState(true);

	const [openPolicy, setOpenPolicy] = useState(false);
	const [openLoginModal, setOpenLoginModal] = useState(false);
	const [UserData, setUserData] = useState(null);

	const [ArrEvents, setArrEvents] = useState([]);
	const [isDisplayEvent , setIsDisplayEvent] = useState(false)


	// Set Navigation Bar
	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerTitle: i18n.t('appName'),
			headerTitleStyle: {
				fontFamily: ConstantKey.MONTS_SEMIBOLD,
				fontSize : FontSize.FS_18
			},
			headerStyle: {
				backgroundColor: Colors.white,
			},
			headerLeft: () => (
				
					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity style={{
							height: 30, width: 30, marginRight: 10, marginLeft: 10,
							borderColor: Colors.primaryRed, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center'
						}}
							onPress={() => btnShareTap()}>
							<Icon name="share-variant" size={15} color={Colors.primaryRed} />
						</TouchableOpacity>
						<TouchableOpacity style={{
							height: 30, width: 30, marginRight: 10, 
							borderColor: Colors.primaryRed, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center'
						}}
							onPress={() => btnReportTap()}>
							<Icon name="lightbulb" size={15} color={Colors.primaryRed} solid/>
						</TouchableOpacity>
					</View>
			),
			headerRight: () => (
				ContactList.length != 0 ?
					<View style={{flexDirection : 'row'}}>
						{/* <TouchableOpacity style={{marginRight : 10}} onPress={() => setModalVisible(true)}>
						<Icon name="plus" size={20} color={Colors.primaryRed} />
					</TouchableOpacity> */}

						<TouchableOpacity style={{
							height: 30, width: 30, marginRight: 10,
							borderColor: Colors.primaryRed, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center'
						}}
							onPress={() => refRBUsers.current.open()}>
							<Icon name="magnify" size={15} color={Colors.primaryRed} />
						</TouchableOpacity>

						<TouchableOpacity style={{
							height: 30, width: 30, marginRight : 10,
							borderColor: Colors.primaryRed, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center'
						}}
							onPress={() => {

								if (UserData != null) {
									btnProfileTap()
									
									// props.navigation.navigate('MembersProfile',{member_data :  String(69)})
								}
							}}>  

							{UserData != null ?
								<Icon name="account" size={15} color={Colors.primaryRed} />
								: null}
						</TouchableOpacity>
					</View>
					: <></>
			),
			// headerLeftContainerStyle: { marginLeft: 10, },
			headerTintColor: Colors.primaryRed,
			headerBackTitleVisible: false,
		});
	}, [props, ContactList, locationSwitch, UserData]);


	useEffect(() => {

		getPolicyData()
		setIsLoading(true)
		// requestLocationPermission()
		// Api_VersionCheck()
		Api_GetEvents(true)
		return () => {

		}
	}, [])


	const requestLocationPermission = async (user_data) => {
		if (Platform.OS === 'ios') {

			getOneTimeLocation(user_data);

		} else {
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
					{
						title: 'Location Access Required',
						message: 'This App needs to Access your location',
					},
				);
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {

					//To Check, If Permission is granted
					getOneTimeLocation(user_data);

				} else {

					console.log("User Na Data : "+JSON.stringify(UserData))

					Api_GetContacts(true, user_data)
					console.log('====================================');
					console.log('Permission Denied');
					console.log('====================================');
				}
			} catch (err) {

				Api_GetContacts(true)
				console.warn(err);
			}
		}
	};

	const btnReportTap = () => {
		requestAnimationFrame(() => {
			props.navigation.navigate('Report', { userData : JSON.stringify(UserData)})
			
		})
	}

	const getOneTimeLocation = (user_data) => {
		console.log('====================================');
		console.log('Getting Location ...');
		console.log('====================================');
		// Geolocation.requestAuthorization();
		Geolocation.getCurrentPosition(
			//Will give you the current location
			(position) => {

				console.log('====================================');
				console.log("Current Location is : " + JSON.stringify(position));
				console.log('====================================');

				console.log('getOneTimeLocation User na Data : '+JSON.stringify(user_data));

				setCurrentLatitude(position.coords.latitude)
				setCurrentLongitude(position.coords.longitude)

				Api_GetContacts(true, user_data)

			},
			(error) => {

				console.log('getOneTimeLocation User na Data : '+JSON.stringify(UserData));
				Api_GetContacts(true, user_data) 
				console.log('====================================');
				console.log(error.message);
				console.log('====================================');
			},
			{
				enableHighAccuracy: false,
				timeout: 200000,
				maximumAge: 5000
			},
		);
	};


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

	const getPolicyData = async () => {


		try {
			const value = await AsyncStorage.getItem(ConstantKey.USER_DATA)
			if (value !== null) {
				// value previously stored

				var data = JSON.parse(value)
				console.log("User Data: " + value)


				Api_Get_Profile(true, data.id)


				setUserData(data)
				setLocationSwitch(data.isVisible == '1' ? true : false)

				requestLocationPermission(data)

				// getFCMToken(data)
			}
			else {

			}
		} catch (e) {
			console.log("Error : " + e)
		}
	}


	const Api_Get_Profile = (isLoad, id) => {

		setIsLoading(isLoad)


		Webservice.post(APIURL.getProfile,{
			member_id : id,
		})
			.then(response => {

				setIsLoading(false)
				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("Api_Get_Profile Response : "+JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.Status == '1') {
					
					var data = response.data.Data

					storeData(JSON.stringify(data))
					setUserData(response.data.Data)

					if(data.birthdate == null){
					
						Alert.alert("","We didn't find your date of birth, Please add your birth date",[
							{
								text : 'Update',
								onPress : () => {
									props.navigation.navigate('UpdateProfile',{userData : JSON.stringify(data)})
								}
							}
	
						],{ cancelable : false })
	
	
					}

				} else {
					alert(response.data.Msg)
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
			// saving error
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

		console.log("API_LOGOUT User na Data :"+JSON.stringify(UserData))

		Webservice.post(APIURL.logout,{
			member_id : UserData.id,
		})
			.then(response => {

				setIsLoading(false)
				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("API_LOGOUT Response : "+JSON.stringify(response)));
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

		console.log("Api_UpdateDeviceId User na Data :"+JSON.stringify(user_data))

		Webservice.post(APIURL.deviceIdUpdate,{
			member_id : user_data.id,
			// device_id : fcm_token,
			device_type : Platform.OS == 'android' ? 0 : 1
		})
			.then(response => {

				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("deviceIdUpdate Response : "+JSON.stringify(response)));
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

		console.log("Api_GetContacts User na Data :"+JSON.stringify(user_data))

		Webservice.post(APIURL.getContacts,{
			member_id : user_data.id
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

	const Api_VerifyMember = (isLoad, location) => {

		setIsLoading(isLoad)

		Webservice.post(APIURL.verifycontact, {

			id: SelectedMember.id,
		})
			.then(response => {

				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify(response));
				setIsLoading(false)

				if (response.data.Status == '1') {

					setFinalOTP(response.data.Data)
					setIsOTPView(1)

				} else {
					Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}


	const Api_UpdateAddress = (isLoad, location) => {

		setIsLoading(isLoad)

		Webservice.post(APIURL.updateaddress, {

			id: SelectedMember.id,
			profile_address: txtAddress,
			latitude: location.lat,
			longitude: location.lng

		})
			.then(response => {

				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify(response));
				setIsLoading(false)

				if (response.data.Status == '1') {

					setTxtAddress('')
					setModalVisible(false)

					setIsOTPView(0)
					setSelectedMember(null)
					setTxtAddress('')
					setTxtOtp('')

					Toast.showWithGravity("Address Updated Sucessfully", Toast.LONG, Toast.BOTTOM);

					Api_GetContacts(true, UserData)

				} else {
					Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}


	const Api_ToggleLocation = (isLoad, status) => {

		setIsLoading(isLoad)

		Webservice.post(APIURL.updateVisiblity, {

			id: UserData.id,
			status: status

		})
			.then(response => {

				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify(response));
				setIsLoading(false)

				if (response.data.Status == '1') {

					setLocationSwitch(status == 1 ? true : false)


					Toast.showWithGravity(status == 1 ? "Location Enable Sucessfully" : "Location Disable Sucessfully", Toast.LONG, Toast.BOTTOM);

					Api_GetContacts(true, UserData)
					
				} else {
					Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}


	// Action Methods
	const SelectUserTap = (item) => {
		requestAnimationFrame(() => {

			const index2 = ContactList.map(item => item.id).indexOf(item.id);
			console.log('Index: ', index2); // Found the object index

			setSelectedUser(item)

			if (refMarker) {

				refMarker.current.animateToRegion(
					{
						latitude: Number(item.latitude),
						longitude: Number(item.longitude),
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					},
					500
				);

				refMarkerPin.current[index2].showCallout()

				refRBUsers.current.close()

			}

		})
	}


	const btnSubmitTap = (type) => {
		requestAnimationFrame(() => {

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

		})
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
		requestAnimationFrame(() => {

			props.navigation.navigate('Profile', { userData : JSON.stringify(UserData)})
		})
	}

	const btnShareTap = () => {
		requestAnimationFrame(() => {
			Share.share(
				{
					message: 'Hello, Check this out\n\nHere im sharing an application link for Magnus Network, Please install it & find any magnus members just on single click.\n\nFor Android users : '+ConstantKey.PLAY_STORE+"\n\nFor iPhone users : "+ConstantKey.APP_STORE,
				}
				).then(({action, activityType}) => {
				if(action === Share.sharedAction)
				  	console.log('Share was successful');
				else
				  	console.log('Share was dismissed');
				});
		})
	}
	
	const btnLogoutTap = () => {
		requestAnimationFrame(() => {

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
		})
	}

	const SwtichChange = (value) => {


		if(UserData == null){

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

	const openGps = (item) => {

		setSelectedProfile(item)
		refRBProfile.current.OpenPopUp()
		return

		var scheme = Platform.OS === 'ios' ? 'http://maps.apple.com/?daddr=' : 'http://maps.google.com/maps?daddr='
		var url = scheme + Number(item.latitude) + ',' + Number(item.longitude) +
			console.log("URl : " + url)
		openExternalApp(url)
	}


	const openExternalApp = (url) => {
		Linking.canOpenURL(url).then(supported => {
			if (supported) {
				Linking.openURL(url);
			} else {
				Alert.alert(
					'ERROR',
					'Unable to open: ' + url,
					[
						{ text: 'OK' },
					]
				);
			}
		});
	}


	const GoToCurrentLocation = () => {

		if (refMarker) {
			refMarker.current.animateToRegion(
				{
					latitude: Number(CurrentLatitude),
					longitude: Number(CurrentLongitude),
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				},
				500
			);
		}

	}

	const btnHelpTap = () => {
		requestAnimationFrame(() => {
			props.navigation.navigate('Help')
		})
	}


	// Search City Name
	const updateSearch = (search) => {
		let text = search.toLowerCase()
		let Contacts = ContactList


		let filteredName = Contacts.filter((item) => {

			let name = item.name != null ? item.name.toLowerCase().match(text) : ''
			let business_profile = item.business_profile != null ? item.business_profile.toLowerCase().match(text) : ''
			let business_tag = item.business_tag != null ? item.business_tag.toLowerCase().match(text) : ''

			return name || business_profile || business_tag
		})
		if (!text || text === '') {

			setFilterContactList(ContactList)

		} else if (!Array.isArray(filteredName) && !filteredName.length) {
			// set no data flag to true so as to render flatlist conditionally

			setFilterContactList([])

		} else if (Array.isArray(filteredName)) {

			setFilterContactList(filteredName)
		}

		setFilteredName(search)

	};


	const btnEventsTap = () => {
		requestAnimationFrame(() => {

			props.navigation.navigate('EventsList', { userData : JSON.stringify(UserData)})
		})
	}


	const btnViewGainSheet = (URL) => {
		requestAnimationFrame(() => {

			Linking.openURL(URL)
			// props.navigation.navigate('ViewGainSheet',{url : URL})
		})
	}


	// Render Sprator
	const Saprator = () => {
		return (
			<View style={{ height: 10, }}></View>
		)
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>


			</View>


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
	}
});
export default Home;
