//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, Alert } from 'react-native';


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
// import messaging from '@react-native-firebase/messaging';
import ForgotPasswordModal from '../DashboardFlow/ForgotPasswordModal';


// create a component
const Login = (props) => {

	const [isLoading, setIsLoading] = useState(false)
	const [fcmToken, setFcmToken] = useState('')
	const [txtMobile, setTxtMobile] = useState('')
	const [txtPassword, setTxtPassword] = useState('')

	const [txtForgotMobile, setTxtForgotMobile] = useState('')
	const [isForgotOpen, setIsForgotOpen] = useState(false)

	useEffect(() => {

		// getFCMToken()
	},[])


	// const getFCMToken = async () => {
	// 	try {
	// 		const value = await AsyncStorage.getItem(ConstantKey.FCM_TOKEN)
	// 		if (value !== null) {
	// 			// value previously stored

	// 			setFcmToken(JSON.parse(value))
	// 		}
	// 		else {
	// 			generateFCMToken()
	// 		}
	// 	} catch (e) {
	// 		console.log("Error for FCM: " + e)
	// 	}
	// }


	// const generateFCMToken = async () => {
	// 	const fcmToken = await messaging().getToken();
	// 	if (fcmToken) {

	// 		storeToken(JSON.stringify(fcmToken))
	// 		console.log("Your Firebase Token is:", fcmToken);

	// 		//   Api_Send_Device_Token(fcmToken)

	// 	} else {
	// 		console.log("Failed", "No token received");
	// 	}
	// }

	//Helper Methods
	const storeToken = async (value) => {
		try {
			await AsyncStorage.setItem(ConstantKey.FCM_TOKEN, value)

		} catch (e) {
			// saving error
		}
	}


	const Api_Login = (isLoad, data) => {

		setIsLoading(isLoad)

		Webservice.post(APIURL.login, {

			username: data.mobile,
			password: data.password

		})
			.then(response => {

				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify(response));
				setIsLoading(false)

				if (response.data.Status == '1') {

					storeUserData(JSON.stringify(response.data.Data[0]))

				} else {
					Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}


	const Api_Reset_Password = (isLoad, data) => {

		setIsLoading(isLoad)

		Webservice.post(APIURL.resetPassword, {

			username: data.mobile,

		})
			.then(response => {

				if (response == null) {
					setIsLoading(false)
				}
				console.log("Api_Reset_Password response : "+JSON.stringify(response));
				setIsLoading(false)

				if (response.data.Status == '1') {

					Alert.alert("","Your temporary password is magnus, please try to login with this password. for better security please change your password from app.")

				} else {
					Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
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
			props.navigation.replace('Home')
		} catch (e) {
			// saving error
		}
	}


	// Action Methods
	const btnLoginTap = () => {
		requestAnimationFrame(() => {

			Keyboard.dismiss()

			if(txtMobile == ''){
				Toast.showWithGravity(i18n.t('enterMobileNumber'), Toast.LONG, Toast.BOTTOM);
			}
			else if(txtMobile.length < 10){
				Toast.showWithGravity(i18n.t('validMobile'), Toast.LONG, Toast.BOTTOM);
			}
			else if(txtPassword == ''){
				Toast.showWithGravity(i18n.t('enterPassword'), Toast.LONG, Toast.BOTTOM);
			}else{

				var dict = {}
				dict['mobile'] = txtMobile
				dict['password'] = txtPassword

				Api_Login(true, dict)
				// 
			}
			
		})
	}


	const btnCreateNewTap = () => {
		requestAnimationFrame(() => {

			props.navigation.replace('Register')

		})
	}


	const btnForgotPasswordTap = () => {
		requestAnimationFrame(() => {
			setIsForgotOpen(true)

		})
	}

	return (
			<View style={styles.container}>
				<View style={{ flex: 1, backgroundColor: Colors.white }}>

					<ImageBackground 
						style={{flex : 1, opacity : 0.4}} 
						source={Images.Background}/>

					<View style={{ width: '100%', height: '100%', justifyContent: 'center',position : 'absolute' }}>
						

						<Image style={{ width: '60%', height: 150, alignSelf: 'center', resizeMode : 'contain'}}
							source={Images.MagnusLogo} />


						<View style={styles.mobileView}>

							<Icon name={"mobile-alt"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }}/>

							<TextInput style={styles.textInputMobile}
								maxLength={10}
								value={txtMobile}
								placeholder={'Mobile number'}
								keyboardType={'number-pad'}
								returnKeyType={'next'}
								onChangeText={(txtMobile) => setTxtMobile(txtMobile.replace(/[^0-9]/g, ''))}
							/>

						</View>

						<View style={styles.mobileView}>

							<Icon name={"key"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }} />

							<TextInput style={styles.textInputMobile}
								value={txtPassword}
								placeholder={'Password'}
								secureTextEntry={true}
								returnKeyType={'done'}
								onChangeText={(txtPassword) => setTxtPassword(txtPassword)}
							/>


						</View>

						<TouchableOpacity style={{alignSelf : 'flex-end', paddingVertical : 5, marginHorizontal : 20}}
							onPress={() => btnForgotPasswordTap()}>
							<Text style={{fontFamily : ConstantKey.MONTS_SEMIBOLD, fontSize : FontSize.FS_16, color : Colors.black}}>
								Forgot Password?
							</Text>
						</TouchableOpacity>


						<TouchableOpacity style={styles.btnLogin}
							onPress={() => btnLoginTap()}>
							<Text style={styles.loginText}>
								Login
							</Text>
						</TouchableOpacity>

						<View style={{ marginTop: 20, marginLeft: 20, marginRight: 20,  }}>

							{isLoading == false ?
								<TouchableOpacity style={{alignSelf : 'center' }}>
									<Text style={{
										textAlign: 'center', fontSize: FontSize.FS_14, color: Colors.black,
										fontFamily: ConstantKey.MONTS_SEMIBOLD
									}}
										onPress={() => btnCreateNewTap()}>
										Don't Have an account? Create Account
									</Text>
								</TouchableOpacity>
							: null}

						</View>


						{/* </ScrollView> */}
					</View>

				</View>

				<ForgotPasswordModal 
					isOpen={isForgotOpen}
					onClose={() => setIsForgotOpen(false)}
					onSubmit={(data) => {
						console.log("submit daat : "+data)
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
		marginTop: 20, flexDirection: 'row', borderWidth: 1, borderColor: Colors.darkGrey, borderRadius: 10, backgroundColor: Colors.white,
		height: 50, marginLeft: 20, marginRight: 20, alignItems: 'center'
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
		marginLeft: 20, marginRight: 20, backgroundColor: Colors.primaryRed,
		marginTop: 20, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
		shadowColor: Colors.primaryRed,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
	},
	loginText: {
		fontSize: FontSize.FS_18, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default Login;
