//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, Alert, Platform, PermissionsAndroid, StatusBar } from 'react-native';


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


//Third Party
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';


// create a component
const Login = (props) => {

	const [isLoading, setIsLoading] = useState(false)
	const [fcmToken, setFcmToken] = useState('')
	const [txtMobile, setTxtMobile] = useState(props?.route?.params?.data?.mobile_number || '')
	const [txtPassword, setTxtPassword] = useState('')

	const [txtForgotMobile, setTxtForgotMobile] = useState('')
	const [isForgotOpen, setIsForgotOpen] = useState(false)

	useEffect(() => {
		getFCMToken()
		requestCameraPermission()
	}, [])
	const requestCameraPermission = async () => {
		try {
		  const granted = await PermissionsAndroid.requestMultiple([
			PermissionsAndroid.PERMISSIONS.CAMERA,
			PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
		  ]);
	  
		  console.log('CAMERA permission result:', granted['android.permission.CAMERA']);
		  console.log('READ_EXTERNAL_STORAGE permission result:', granted['android.permission.READ_MEDIA_IMAGES']);
	  
		  // Rest of your code...
		} catch (err) {
		  console.warn(err);
		}
	  };
	
	const getFCMToken = async () => {
		try {
			const value = await AsyncStorage.getItem(ConstantKey.FCM_TOKEN)
			console.log("FCM GET", value)
			if (value !== null) {
				// value previously stored

				setFcmToken(JSON.parse(value))
			}
			else {
				console.log("else call")
				generateFCMToken()
			}
		} catch (e) {
			console.log("Error for FCM: " + e)
		}
	}


	const generateFCMToken = async () => {
		const fcmToken = await messaging().getToken();
		setFcmToken(fcmToken)
		if (fcmToken) {

			storeToken(JSON.stringify(fcmToken))
			console.log("Your Firebase Token is:", fcmToken);

			//   Api_Send_Device_Token(fcmToken)

		} else {
			console.log("Failed", "No token received");
		}
	}

	//Helper Methods
	const storeToken = async (value) => {
		console.log("Your Firebase Token is 11:", fcmToken);

		try {
			await AsyncStorage.setItem(ConstantKey.FCM_TOKEN, value)

		} catch (e) {
			console.log("ASYNC ERROR1", e)
		}
	}



	const Api_Login = (isLoad) => {

		setIsLoading(isLoad)

		Webservice.post(APIURL.login, {

			mobile_number: txtMobile,
			device_type: Platform.OS == "android" ? 1 : 2,
			device_token: fcmToken

		})
			.then(response => {
				// console.log("Login response : ", JSON.stringify(response));
				setIsLoading(false)

				if (response.data.status == true) {

					if (response.data.data.is_register == true && response.data.data.is_active == 1) {
						var dict = {};
						dict.mobile_number = txtMobile
						dict.isFrom = "LOGIN"
						props.navigation.navigate("Otp", { data: dict })
					}
					// storeUserData(JSON.stringify(response.data.Data[0]))

				} else {
					var dict = {};
					dict.mobile_number = txtMobile
					dict.isFrom = "LOGIN"
					props.navigation.navigate("WelcomeScreen", { data: dict })
					// Toast.showWithGravity(response.data.message, Toast.LONG, Toast.CENTER);
					// var dict = {};
					// dict.mobile_number = txtMobile
					// props.navigation.navigate("Register",{data : dict})
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}


	const storeUserData = async (value) => {
		try {
			await AsyncStorage.setItem(ConstantKey.USER_DATA, value)
			// props.navigation.replace('Home')
			props.navigation.replace('Otp')
		} catch (e) {
			// saving error
		}
	}


	// Action Methods
	const btnLoginTap = () => {

		requestAnimationFrame(() => {
			Keyboard.dismiss()
			if (txtMobile == '') {
				Toast.showWithGravity(i18n.t('enterMobileNumber'), Toast.LONG, Toast.CENTER);
			}
			else if (txtMobile.length < 10) {
				Toast.showWithGravity(i18n.t('validMobile'), Toast.LONG, Toast.CENTER);
			}
			else {
				var dict = {};
						dict.mobile_number = txtMobile
						// dict.isFrom = "LOGIN"
						props.navigation.navigate("Otp", { data: dict })
				// Api_Login(true)
			}
		})
	}

	// const btnCreateNewTap = () => {
	// 	requestAnimationFrame(() => {
	// 		// props.navigation.navigate('Register')
	// 		props.navigation.navigate('QrCode')

	// 	})
	// }

	return (
		<SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'}/>

		<View style={styles.container}>
			<View style={{ flex: 1, backgroundColor: Colors.white }}>
				<View style={{ justifyContent: 'center', marginHorizontal: 25, marginVertical: 40 }}>
					<Text style={{
						fontSize: FontSize.FS_26,
						color: Colors.black,
						fontFamily: ConstantKey.MONTS_SEMIBOLD,
						marginTop : 20
					}}>
						{i18n.t('login')}
					</Text>

					<Text style={{
						fontSize: FontSize.FS_18,
						color: Colors.black,
						fontFamily: ConstantKey.MONTS_MEDIUM,
						marginTop: 40,
						lineHeight: FontSize.FS_20
					}}>
						{i18n.t('phoneNumber')}
					</Text>

					<View style={styles.mobileView}>
						<Icon name={"mobile-alt"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />
						<TextInput style={styles.textInputMobile}
							maxLength={10}
							value={txtMobile}
							placeholder={i18n.t('enterPhoneNumber')}
							keyboardType={'number-pad'}
							returnKeyType={'next'}
							onChangeText={(txtMobile) => setTxtMobile(txtMobile.replace(/[^0-9]/g, ''))}
						/>

					</View>
					<TouchableOpacity style={styles.btnLogin}
						onPress={() => btnLoginTap()}>
						{/* <Text style={styles.loginText}>
							{i18n.t('login')}
						</Text> */}
							<Icon name={"chevron-right"} size={20} color={Colors.white}  />
					</TouchableOpacity>

					{/* <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20, }}>

						{isLoading == false ?
							<TouchableOpacity style={{ alignSelf: 'center' }}>
							
								<Text style={{
									textAlign: 'center', fontSize: FontSize.FS_14, color: Colors.grey,
									fontFamily: ConstantKey.MONTS_REGULAR
								}}
									onPress={() => btnCreateNewTap()}>
									{i18n.t('dontHaveAccount')}<Text style={{ color: Colors.purple, fontFamily: ConstantKey.MONTS_SEMIBOLD }}>{i18n.t('register')}</Text>
								</Text>
							</TouchableOpacity>
							: null}

					</View> */}
				</View>
			</View>


			{isLoading ?
				<LoadingView />
				: null}
		</View>
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
		marginTop: 10, flexDirection: 'row', borderRadius: 6, backgroundColor: Colors.white,
		height: 50, alignItems: 'center', backgroundColor: Colors.lightGrey01
	},
	countryCodeText: {
		marginLeft: 10, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black
	},
	textInputMobile: {
		marginLeft: 10, marginRight: 10, height: 50, flex: 1, fontSize: FontSize.FS_14, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black,
	},
	btnLogin: {
		backgroundColor: Colors.black,
		marginTop: 48, height: 50,width:50, borderRadius: 60, alignItems: 'center', justifyContent: 'center',alignSelf:"center"
		// shadowColor: Colors.primaryRed,
		// shadowOffset: { width: 0, height: 2 },
		// shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
	},
	loginText: {
		fontSize: FontSize.FS_16, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default Login;
