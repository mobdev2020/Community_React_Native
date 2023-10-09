//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, ScrollView, Switch, Platform } from 'react-native';


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
import messaging from '@react-native-firebase/messaging';


//Third Party
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';


// create a component
const Register = (props) => {
	const [isLoading, setIsLoading] = useState(false)
	const [txtFirstName, setTxtFirstName] = useState(props?.route?.params?.data?.user?.first_name || '')
	const [txtLastName, setTxtLastName] = useState(props?.route?.params?.data?.user?.last_name || '')
	const [txtEmail, setTxtEmail] = useState(props?.route?.params?.data?.user?.email || '')
	const [description, setDescription] = useState(props?.route?.params?.data?.user?.kids_information || '')
	const [txtMobile, setTxtMobile] = useState(props?.route?.params?.data?.user?.phone || '')
	const [SchoolId, setSchoolId] = useState(props?.route?.params?.data?.user?.parent_id || '')
	const [isEnabled, setIsEnabled] = useState(false);
	const [FcmToken, setFcmToken] = useState("")

	const selectedSchoolData = useSelector(state => state.userRedux.school_data)


	useEffect(() => {
		console.log("UserData from login :", props?.route?.params?.data)
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

	const Api_Login_check = (isLoad) => {

		setIsLoading(isLoad)

		Webservice.post(APIURL.login, {

			mobile_number: txtMobile,
			device_type: Platform.OS == "android" ? 1 : 2,
			device_token: FcmToken

		})
			.then(response => {
				// console.log("Login response : ",JSON.stringify(response));
				setIsLoading(false)

				if (response.data.status == true) {

					Toast.showWithGravity("This mobile number has been registered. Please Login.", Toast.LONG, Toast.CENTER);
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
					dict.parent_id = props.route.params.school_id,
						// console.log("REGISTER FORM DATA :", dict)

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
			parent_id: SchoolId,
			kids_information : description,
			school_user_id : selectedSchoolData?.school_user_id
		})
			.then(response => {
				console.log("Register Response : ", response.data)
				if (response == null) {
					setIsLoading(false)
				}
				setIsLoading(false)

				if (response.data.status == true) {
					storeUserData(JSON.stringify(response.data.data))
				} else {
					Toast.showWithGravity(response.data.message, Toast.LONG, Toast.CENTER);
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}
	// Action Methods
	const btnRegisterTap = () => {
		// props.navigation.replace('Otp')
		// return
		requestAnimationFrame(() => {

			Keyboard.dismiss()
			let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
			if (txtFirstName == '') {
				Toast.showWithGravity(i18n.t('enterFName'), Toast.LONG, Toast.CENTER);
			}
			else if (txtLastName == '') {
				Toast.showWithGravity(i18n.t('enterLName'), Toast.LONG, Toast.CENTER);
			}
			else if (txtMobile == '') {
				Toast.showWithGravity(i18n.t('enterMobileNumber'), Toast.LONG, Toast.CENTER);
			}
			else if (txtMobile.length < 10) {
				Toast.showWithGravity(i18n.t('validMobile'), Toast.LONG, Toast.CENTER);
			}
			// else if (!validateEmail(txtEmail)) {
			// 	Toast.showWithGravity(i18n.t('validEmail'), Toast.LONG, Toast.CENTER);
			// }
			// else if (description == "") {
			// 	Toast.showWithGravity("Please enter your kids information", Toast.LONG, Toast.CENTER);
			// }

			else {

				if (isEnabled) {
					var dict = {};
					dict.first_name = txtFirstName
					dict.last_name = txtLastName
					dict.email_address = txtEmail
					dict.mobile_number = txtMobile
					dict.parent_id = SchoolId
					dict.kids_information = description
					props.navigation.navigate("BusinessProfile", { body: dict })
				}
				else {
					Api_Register(true)
				}
			}

		})
	}



	const btnLoginTap = () => {
		requestAnimationFrame(() => {

			props.navigation.replace('Login')

		})
	}


	return (
		<SafeAreaView style={styles.container}>
		<View style={styles.container}>
			<View style={{ flex: 1, backgroundColor: Colors.white }}>

			<View style={{ flexDirection: "row", alignItems: "center", }}>
							<TouchableOpacity onPress={() => { props.navigation.goBack() }}
								style={{ padding: 10 }}>
								<Icon name={"chevron-left"} size={20} color={Colors.black} />

							</TouchableOpacity>

							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_SEMIBOLD,
							}}>
								{"Basic Information"}
							</Text>

						</View>

				<ScrollView style={{}}>
					<View style={{ flex: 1, marginVertical: 10, marginHorizontal: 10 }}>
						
						<View style={{ marginHorizontal: 10 }}>
							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 30,
								lineHeight: FontSize.FS_20,
							}}>
								{i18n.t('firstName')}
							</Text>
							<View style={styles.mobileView}>
								<Icon name={"user"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />
								<TextInput style={styles.textInputMobile}
									value={txtFirstName}
									placeholder={i18n.t('enterFirstName')}
									returnKeyType={'done'}
									onChangeText={(txtname) => setTxtFirstName(txtname.replace(/[^A-Za-z\s]/ig, ''))}
								/>
							</View>
							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 20,
								lineHeight: FontSize.FS_20,
							}}>
								{i18n.t('lastName')}
							</Text>
							<View style={styles.mobileView}>
								<Icon name={"user"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />
								<TextInput style={styles.textInputMobile}
									value={txtLastName}
									placeholder={i18n.t('enterLastName')}
									returnKeyType={'done'}
									onChangeText={(txtname) => setTxtLastName(txtname.replace(/[^A-Za-z\s]/ig, ''))}
									keyboardType='default'
								/>
							</View>
							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 20,
								lineHeight: FontSize.FS_20,
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
							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 20,
								lineHeight: FontSize.FS_20,
							}}>
								{i18n.t('email')}
							</Text>
							<View style={styles.mobileView}>
								<Icon name={"at"} size={18} color={Colors.primary} style={{ marginLeft: 10 }} />
								<TextInput style={styles.textInputMobile}
									value={txtEmail}
									autoCapitalize={'none'}
									placeholder={i18n.t('enterEmailAddress')}
									returnKeyType={'next'}
									onChangeText={(txtEmail) => setTxtEmail(txtEmail)}
								/>
							</View>

							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 20,
								lineHeight: FontSize.FS_20,
							}}>
								Kids Information
							</Text>
							<View style={{
								marginTop: 10, backgroundColor: Colors.lightGrey01, borderRadius: 6,
								height: 120,
							}}>
								{/* <Icon name={"at"} size={18} color={Colors.primary} style={{ marginLeft: 10 }} /> */}
								<TextInput style={{
									marginLeft: 10, marginRight: 10, height: 120, flex: 1, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
									color: Colors.black, alignContent: "flex-start"
								}}
									multiline={true}
									value={description}
									autoCapitalize={'none'}
									placeholder={"Description of your kids"}
									returnKeyType={'done'}
									onChangeText={(dec) => setDescription(dec)}
								/>
							</View>
							<View style={{ marginTop: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
								<Text style={{
									fontSize: FontSize.FS_18,
									color: Colors.black,
									fontFamily: ConstantKey.MONTS_SEMIBOLD,
								}}>
									{"Do you want to Join Business Community?"}
								</Text>
								<Switch
									trackColor={{ false: Colors.grey, true: Colors.primary }}
									thumbColor={isEnabled ? Colors.white : '#f4f3f4'}
									ios_backgroundColor="#3e3e3e"
									onValueChange={(val) => {
										console.log("SWITCH :", val)
										setIsEnabled(val)
									}}
									value={isEnabled}
								/>
							</View>

							<TouchableOpacity style={styles.btnLogin}
								onPress={() => btnRegisterTap()}>
								<Text style={styles.loginText}>
									{"Next"}
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
										{i18n.t('alreadyAccount')}<Text style={{ color: Colors.primary, fontFamily: ConstantKey.MONTS_SEMIBOLD }}>{"Login Now"}</Text>
									</Text>
								</TouchableOpacity>
								: null}

						</View>



					</View>
					{/* </ScrollView> */}
				</ScrollView>
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
		marginTop: 10, flexDirection: 'row', backgroundColor: Colors.lightGrey01, borderRadius: 6,
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
		backgroundColor: Colors.black,
		marginTop: 48, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
	},
	loginText: {
		fontSize: FontSize.FS_16, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default Register;
