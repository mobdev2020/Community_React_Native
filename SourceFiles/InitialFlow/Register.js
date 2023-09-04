//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, ScrollView } from 'react-native';


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
import PolicyModal from '../DashboardFlow/PolicyModal';
import messaging from '@react-native-firebase/messaging';


//Third Party
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';


// create a component
const Register = (props) => {
	const [isLoading, setIsLoading] = useState(false)
	const [txtFirstName, setTxtFirstName] = useState('')
	const [txtLastName, setTxtLastName] = useState('')
	const [txtEmail, setTxtEmail] = useState('')
	const [txtMobile, setTxtMobile] = useState(props?.route?.params?.data?.mobile_number ||'')
	const [SchoolId, setSchoolId] = useState(props?.route?.params?.school_id ||'')
	const [txtPassword, setTxtPassword] = useState('')
	const [acceptTerms, setAcceptTerms] = useState(true)
	const [openPrivacy, setOpenPrivacy] = useState(false)
	const [FcmToken, setFcmToken] = useState("")
	useEffect(() => {

		getFCMToken()
	}, [])


	const getFCMToken = async () => {
		try {
			const value = await AsyncStorage.getItem(ConstantKey.FCM_TOKEN)
			if (value !== null) {
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
	const Api_Register = (isLoad) => {
		setIsLoading(isLoad)
		Webservice.post(APIURL.register, {
			first_name: txtFirstName,
			last_name: txtLastName,
			email_address: txtEmail,
			mobile_number: txtMobile,
			is_register_business: 0,
			device_type: Platform.OS == "android" ? 1 : 2,
			device_token: FcmToken,
			parent_id: 5,
		})
			.then(response => {
				console.log("Register Response : ", response.data)
				if (response == null) {
					setIsLoading(false)
				}
				setIsLoading(false)

				if (response.data.status == true) {
					var dict = {};
					dict.first_name = txtFirstName
					dict.last_name = txtLastName
					dict.email_address = txtEmail
					dict.mobile_number = txtMobile
					dict.isFrom = "REGISTER"
					props.navigation.navigate("Otp", { data: dict })
					// storeUserData(response.data.data)
				} else {
					Toast.showWithGravity(response.data.message, Toast.LONG, Toast.BOTTOM);
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}
	const Api_Login_check = (isLoad) => {

		setIsLoading(isLoad)

		Webservice.post(APIURL.login, {

			mobile_number: txtMobile,
			device_type:Platform.OS == "android" ?1 :2,
			device_token: FcmToken

		})
			.then(response => {
				console.log("Login response : ",JSON.stringify(response));
				setIsLoading(false)

				if (response.data.status == true) {

					Toast.showWithGravity("This mobile number has been registered. Please Login.", Toast.LONG, Toast.BOTTOM);
					var dict = {};
					dict.mobile_number = txtMobile
					props.navigation.navigate("Login", { data: dict })

				} else {
					var dict = {};
					dict.first_name = txtFirstName
					dict.last_name = txtLastName
					dict.email_address = txtEmail
					dict.mobile_number = txtMobile
					dict.isFrom = "REGISTER"
					props.navigation.navigate("Otp", { data: dict })
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
	const validateEmail = (email) => {
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return (regex.test(email))
	}
	// Action Methods
	const btnRegisterTap = () => {
		// props.navigation.replace('Otp')
		// return
		requestAnimationFrame(() => {

			Keyboard.dismiss()
			let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
			if (txtFirstName == '') {
				Toast.showWithGravity(i18n.t('enterFName'), Toast.LONG, Toast.BOTTOM);
			}
			else if (txtLastName == '') {
				Toast.showWithGravity(i18n.t('enterLName'), Toast.LONG, Toast.BOTTOM);
			}
			else if (txtMobile == '') {
				Toast.showWithGravity(i18n.t('enterMobileNumber'), Toast.LONG, Toast.BOTTOM);
			}
			else if (txtMobile.length < 10) {
				Toast.showWithGravity(i18n.t('validMobile'), Toast.LONG, Toast.BOTTOM);
			}
			else if (!validateEmail(txtEmail)) {
				Toast.showWithGravity(i18n.t('validEmail'), Toast.LONG, Toast.BOTTOM);
			} else {
				var dict = {};
				dict.first_name = txtFirstName
				dict.last_name = txtLastName
				dict.email_address = txtEmail
				dict.mobile_number = txtMobile
				console.log("Register Dict : ", dict)
				// props.navigation.navigate("AskBusinessProfile",{body : dict})
				Api_Login_check(true)
			}

		})
	}

	const toggleTerms = (value) => {

		setAcceptTerms(!acceptTerms)
	}

	const btnLoginTap = () => {
		requestAnimationFrame(() => {

			props.navigation.replace('Login')

		})
	}


	return (
		// <SafeAreaView style={styles.container}>
		<View style={styles.container}>
			<View style={{ flex: 1, backgroundColor: Colors.white }}>


				<ScrollView style={{}}>
					<SafeAreaView style={{ flex: 1, marginVertical: 10, marginHorizontal: 10 }}>
						<View style={{ flexDirection: "row", alignItems: "center", }}>
							<TouchableOpacity onPress={() => { props.navigation.goBack() }}
								style={{ marginBottom: 5, padding: 10 }}>
								<Icon name={"chevron-left"} size={20} color={Colors.black} />

							</TouchableOpacity>

							<Text style={{
								fontSize: FontSize.FS_26,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_SEMIBOLD,
							}}>
								{i18n.t('Register')}
							</Text>

						</View>
						<View style={{ marginHorizontal: 10 }}>
							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 30,
								lineHeight: 20
							}}>
								{i18n.t('firstName')}
							</Text>
							<View style={styles.mobileView}>
								<Icon name={"user"} size={20} color={Colors.black} style={{ marginLeft: 10 }} />
								<TextInput style={styles.textInputMobile}
									value={txtFirstName}
									placeholder={i18n.t('enterFirstName')}
									returnKeyType={'done'}
									onChangeText={(txtname) => setTxtFirstName(txtname)}
								/>
							</View>
							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 20,
								lineHeight: 20
							}}>
								{i18n.t('lastName')}
							</Text>
							<View style={styles.mobileView}>
								<Icon name={"user"} size={20} color={Colors.black} style={{ marginLeft: 10 }} />
								<TextInput style={styles.textInputMobile}
									value={txtLastName}
									placeholder={i18n.t('enterLastName')}
									returnKeyType={'done'}
									onChangeText={(txtname) => setTxtLastName(txtname)}
								/>
							</View>
							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 20,
								lineHeight: 20
							}}>
								{i18n.t('phoneNumber')}
							</Text>
							<View style={styles.mobileView}>
								<Icon name={"mobile-alt"} size={20} color={Colors.black} style={{ marginLeft: 10 }} />
								<TextInput style={styles.textInputMobile}
									maxLength={10}
									value={txtMobile}
									placeholder={i18n.t('enterPhoneNumber')}
									keyboardType={'number-pad'}
									returnKeyType={'next'}
									onChangeText={(txtMobile) => setTxtMobile(txtMobile.replace(/[^0-9]/g, ''))}
								/>
							</View>
							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 20,
								lineHeight: 20
							}}>
								{i18n.t('email')}
							</Text>
							<View style={styles.mobileView}>
								<Icon name={"at"} size={18} color={Colors.black} style={{ marginLeft: 10 }} />
								<TextInput style={styles.textInputMobile}
									value={txtEmail}
									autoCapitalize={'none'}
									placeholder={i18n.t('enterEmailAddress')}
									returnKeyType={'done'}
									onChangeText={(txtEmail) => setTxtEmail(txtEmail)}
								/>
							</View>
							<TouchableOpacity style={styles.btnLogin}
								onPress={() => btnRegisterTap()}>
								<Text style={styles.loginText}>
									{i18n.t('Register')}
								</Text>
							</TouchableOpacity>
						</View>
						<View style={{ margin: 20 }}>
							{isLoading == false ?
								<TouchableOpacity style={{ alignSelf: 'center' }}>
									<Text style={{
										textAlign: 'center', fontSize: FontSize.FS_14, color: Colors.grey,
										fontFamily: ConstantKey.MONTS_REGULAR
									}}
										onPress={() => btnLoginTap()}>
										{i18n.t('alreadyAccount')}<Text style={{ color: Colors.purple, fontFamily: ConstantKey.MONTS_SEMIBOLD }}>{i18n.t('login')}</Text>
									</Text>
								</TouchableOpacity>
								: null}

						</View>

						<PolicyModal
							isOpen={openPrivacy}
							onClose={() => {
								setOpenPrivacy(false)
							}}
						/>

					</SafeAreaView>
					{/* </ScrollView> */}
				</ScrollView>
			</View>

			{isLoading ?
				<LoadingView text={"Please Wait..."} />
				: null}
		</View>
		// </SafeAreaView>
	);
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	mobileView: {
		marginTop: 10, flexDirection: 'row', backgroundColor: Colors.lightGrey01, borderRadius: 10,
		height: 50, alignItems: 'center'
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
	},
	loginText: {
		fontSize: FontSize.FS_18, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default Register;
