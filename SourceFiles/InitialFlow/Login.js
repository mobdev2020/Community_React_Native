//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, Alert, Platform } from 'react-native';


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
import ForgotPasswordModal from '../DashboardFlow/ForgotPasswordModal';


// create a component
const Login = (props) => {

	const [isLoading, setIsLoading] = useState(false)
	const [fcmToken, setFcmToken] = useState('')
	const [txtMobile, setTxtMobile] = useState(props?.route?.params?.data?.mobile_number ||'')
	const [txtPassword, setTxtPassword] = useState('')

	const [txtForgotMobile, setTxtForgotMobile] = useState('')
	const [isForgotOpen, setIsForgotOpen] = useState(false)

	useEffect(() => {

		getFCMToken()
	}, [])


	const getFCMToken = async () => {
		try {
			const value = await AsyncStorage.getItem(ConstantKey.FCM_TOKEN)
			if (value !== null) {
				// value previously stored

				setFcmToken(JSON.parse(value))
			}
			else {
				generateFCMToken()
			}
		} catch (e) {
			console.log("Error for FCM: " + e)
		}
	}


	const generateFCMToken = async () => {
		const fcmToken = await messaging().getToken();
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
		try {
			await AsyncStorage.setItem(ConstantKey.FCM_TOKEN, value)

		} catch (e) {
			// saving error
		}
	}


	const Api_Login = (isLoad) => {

		setIsLoading(isLoad)

		Webservice.post(APIURL.login, {

			mobile_number: txtMobile,
			device_type:Platform.OS == "android" ?1 :2,
			device_token: fcmToken

		})
			.then(response => {
				console.log("Login response : ",JSON.stringify(response));
				setIsLoading(false)

				if (response.data.status == true) {

					if(response.data.data.is_register == true && response.data.data.is_active == 1 ) {
						var dict = {};
						dict.mobile_number = txtMobile
						dict.isFrom = "LOGIN"
						props.navigation.navigate("Otp",{data : dict})
					}
					// storeUserData(JSON.stringify(response.data.Data[0]))

				} else {
					Toast.showWithGravity(response.data.message, Toast.LONG, Toast.BOTTOM);
					var dict = {};
					dict.mobile_number = txtMobile
					props.navigation.navigate("Register",{data : dict})
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
				Toast.showWithGravity(i18n.t('enterMobileNumber'), Toast.LONG, Toast.BOTTOM);
			}
			else if (txtMobile.length < 10) {
				Toast.showWithGravity(i18n.t('validMobile'), Toast.LONG, Toast.BOTTOM);
			}
			 else {
				Api_Login(true)
			}
		})
	}

	const btnCreateNewTap = () => {
		requestAnimationFrame(() => {
			props.navigation.navigate('Register')

		})
	}

	return (
		<View style={styles.container}>
			<View style={{ flex: 1, backgroundColor: Colors.white }}>
				<View style={{ justifyContent: 'center',marginHorizontal:20,marginVertical:40 }}>
					<Text style={{
						fontSize: FontSize.FS_26,
						color: Colors.black,
						fontFamily: ConstantKey.MONTS_SEMIBOLD
					}}>
						{i18n.t('login')}
					</Text>

					<Text style={{
						fontSize: FontSize.FS_18,
						color: Colors.black,
						fontFamily: ConstantKey.MONTS_MEDIUM,
						marginTop:40,
						lineHeight:20
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
						<Text style={styles.loginText}>
						{i18n.t('login')}
						</Text>
					</TouchableOpacity>

					<View style={{ marginTop: 20, marginLeft: 20, marginRight: 20, }}>

						{isLoading == false ?
							<TouchableOpacity style={{ alignSelf: 'center' }}>
								<Text style={{
									textAlign: 'center', fontSize: FontSize.FS_14, color: Colors.grey,
									fontFamily: ConstantKey.MONTS_REGULAR
								}}
									onPress={() => btnCreateNewTap()}>
									{i18n.t('dontHaveAccount')}<Text style={{ color: Colors.purple,fontFamily: ConstantKey.MONTS_SEMIBOLD }}>{i18n.t('register')}</Text>
								</Text>
							</TouchableOpacity>
							: null}

					</View>
				</View>
			</View>

			<ForgotPasswordModal
				isOpen={isForgotOpen}
				onClose={() => setIsForgotOpen(false)}
				onSubmit={(data) => {
					console.log("submit daat : " + data)
					setIsForgotOpen(false)
					Api_Reset_Password(true, data)
				}}
			/>

			{isLoading ?
				<LoadingView />
				: null}
		</View>
	);
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	mobileView: {
		marginTop: 10, flexDirection: 'row', borderRadius: 10, backgroundColor: Colors.white,
		height: 50,  alignItems: 'center',backgroundColor:Colors.lightGrey01
	},
	countryCodeText: {
		marginLeft: 10, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black
	},
	textInputMobile: {
		marginLeft: 10, marginRight: 10, height: 50, flex: 1, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black,
	},
	btnLogin: {
		 backgroundColor: Colors.primary,
		marginTop: 48, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
		// shadowColor: Colors.primaryRed,
		// shadowOffset: { width: 0, height: 2 },
		// shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
	},
	loginText: {
		fontSize: FontSize.FS_18, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default Login;
