//import liraries
import React, { Component, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, ScrollView, FlatList } from 'react-native';


// Constants
import i18n from '../Localize/i18n'
import { ConstantKey } from '../Constants/ConstantKey'
import { Colors } from '../Constants/Colors';
import { Images } from '../Constants/Images';
import { FontSize } from '../Constants/FontSize';
import Webservice from '../Constants/API'
import LoadingView from '../Constants/LoadingView'
import { APIURL } from '../Constants/APIURL';
//Third Party
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-material-dropdown-v2';
import RBSheet from 'react-native-raw-bottom-sheet';
import FastImage from 'react-native-fast-image';

const BusinessProfile = (props) => {

	const [isLoading, setIsLoading] = useState(false)
	const [RegsterData, setRegisterData] = useState(props?.route?.params?.body || "")
	const [CategoryData, setCategoryData] = useState(null)
	const [BusinessName, setBusinessName] = useState('')
	const [Category, setCategory] = useState(null)
	const [SubCategory, setSubCategory] = useState('')
	const [BusinessPhone, setBusinessPhone] = useState('')
	const [BusinessEmail, setBusinessEmail] = useState('')
	const [Address, setAddress] = useState('')
	const [FcmToken, setFcmToken] = useState("")
	const [UserData, setUserData] = useState(null);

	const refRBSheet = useRef();

	useEffect(() => {
		getFCMToken()
		Api_Get_Category(true)
		console.log("props?.route?.params", props?.route?.params)
		if (props?.route?.params?.isFrom == "PROFILE") {
			Api_Get_Profile(true)
		}
	}, [])



	const Api_Get_Profile = (isLoad) => {
		setIsLoading(isLoad)
		Webservice.get(APIURL.GetProfile)
			.then(response => {
				setIsLoading(false)
				console.log(JSON.stringify("Api_Get_Profile Response : " + JSON.stringify(response)));
				if (response.data.status == true) {
					var business = response?.data?.data?.user?.business
					if (business != null) {
						setBusinessName(business?.business_name)
						setCategory(business?.category)
						setSubCategory(business?.subcategory_name)
						setBusinessPhone(business?.phone)
						setBusinessEmail(business?.email)
						setAddress(business?.address_line_one)
					}

				} else {
					alert(response.data.message)
				}
			})
			.catch((error) => {
				setIsLoading(false)
				console.log(error)
			})
	}

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

		} else {
			console.log("Failed", "No token received");
		}

	}

	const storeUserData = async (value) => {
		try {
			await AsyncStorage.setItem(ConstantKey.USER_DATA, value)
			props.navigation.replace('Home')
		} catch (e) {
			console.log("Error :", e)
		}
	}
	const Api_Update_Business = (isLoad) => {
		setIsLoading(isLoad)
		let body = new FormData();
		body.append('business_name', BusinessName)
		body.append('category', Category?.id)
		body.append('subcategory', SubCategory)
		body.append('business_mobile_number', BusinessPhone)
		body.append('business_email_address', BusinessEmail)
		body.append('business_address_line_one', Address)

		Webservice.post(APIURL.UpdateBusiness, body)
			.then(response => {
				setIsLoading(false)
				console.log(JSON.stringify("Api_Update_Business Response : " + JSON.stringify(response)));
				if (response.data.status == true) {
					Toast.showWithGravity(response.data.message, Toast.SHORT, Toast.CENTER);
					props.navigation.goBack()
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

	const Api_Register = (isLoad) => {
		setIsLoading(isLoad)
		let body = new FormData();
		body.append('first_name', props?.route?.params?.body?.first_name)
		body.append('last_name', props?.route?.params?.body?.last_name)
		body.append('email_address', props?.route?.params?.body?.email_address)
		body.append('mobile_number', props?.route?.params?.body?.mobile_number)
		body.append('is_register_business', 1)
		body.append('business_name', BusinessName)
		body.append('category', Category?.id)
		body.append('subcategory', SubCategory)
		body.append('business_mobile_number', BusinessPhone)
		body.append('business_email_address', BusinessEmail)
		body.append('business_address_line_one', Address)
		body.append('device_type', Platform.OS == "android" ? 1 : 2)
		body.append('device_token', FcmToken)
		body.append('parent_id', 5)
		Webservice.post(APIURL.register, body)
			.then(response => {
				console.log("Register Response : ", response.data)
				if (response == null) {
					setIsLoading(false)
				}
				setIsLoading(false)

				if (response.data.status == true) {
					storeUserData(JSON.stringify(response.data.data))
				} else {
					Toast.showWithGravity(response.data.message, Toast.LONG, Toast.BOTTOM);
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}

	const btnBusinessProfile = (params) => {
		btnCreateProfileTap()
	}
	const validateEmail = (email) => {
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return (regex.test(email))
	}


	const btnCreateProfileTap = () => {
		requestAnimationFrame(() => {
			console.log(validateEmail(BusinessEmail))
			Keyboard.dismiss()
			if (BusinessName == '') {
				Toast.showWithGravity("Please enter business name.", Toast.LONG, Toast.BOTTOM);
			}
			else if (Category == null) {
				Toast.showWithGravity("Please select category", Toast.LONG, Toast.BOTTOM);
			}
			else if (SubCategory == '') {
				Toast.showWithGravity("Please enter sub category", Toast.LONG, Toast.BOTTOM);
			}
			else if (BusinessPhone.length < 10) {
				Toast.showWithGravity("Please enter valid phone number", Toast.LONG, Toast.BOTTOM);
			}
			else if (!validateEmail(BusinessEmail)) {
				Toast.showWithGravity(i18n.t('validEmail'), Toast.LONG, Toast.BOTTOM);
			} else if (Address == "") {
				Toast.showWithGravity("Please enter business address", Toast.LONG, Toast.BOTTOM);
			}
			else {
				console.log("route?.params?.isFrom ::", props?.route?.params?.isFrom)
				if (props?.route?.params?.isFrom == "REGISTER") {
					Api_Register(true)
				}
				else {
					Api_Update_Business(true)

				}
			}

		})
	}

	return (
		<View style={styles.container}>
			<View style={{ flex: 1, backgroundColor: Colors.white }}>


				<ScrollView style={{}}>
					<SafeAreaView style={{ flex: 1, marginVertical: 10, marginHorizontal: 10 }}>
						<View style={{ flexDirection: "row", alignItems: "center", }}>
							<TouchableOpacity onPress={() => { props.navigation.goBack() }}
								style={{ marginRight: 10, marginBottom: 5, padding: 10 }}>
								<Icon name={"chevron-left"} size={20} color={Colors.black} />

							</TouchableOpacity>

							<Text style={{
								fontSize: FontSize.FS_26,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_SEMIBOLD,
							}}>
								{i18n.t('BusinesProfile')}
							</Text>

						</View>
						<View style={{ marginHorizontal: 10 }}>
							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 10,
								lineHeight: 20
							}}>
								{i18n.t('BusinessName')}
							</Text>
							<View style={styles.mobileView}>
								<TextInput style={styles.textInputMobile}
									value={BusinessName}
									placeholder={i18n.t('EnterBusineeName')}
									returnKeyType={'done'}
									onChangeText={(txtname) => setBusinessName(txtname)}
								/>

							</View>
							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 20,
								lineHeight: 20
							}}>
								{i18n.t('Category')}
							</Text>

							<TouchableOpacity onPress={() => refRBSheet.current.open()}
								style={styles.mobileView}>
								<View style={[styles.textInputMobile, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}

								>
									<Text style={{
										fontSize: FontSize.FS_15,
										color: Colors.lightGrey,
										fontFamily: ConstantKey.MONTS_REGULAR,
										// marginTop:15
									}}>
										{Category?.name == null ? "Select Category" : Category?.name}
									</Text>
									<Icon name={"chevron-down"} size={14} color={Colors.lightGrey} />
								</View>
							</TouchableOpacity>
							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 20,
								lineHeight: 20
							}}>
								{i18n.t('SubCategory')}
							</Text>
							<View style={styles.mobileView}>
								<TextInput style={styles.textInputMobile}
									value={SubCategory}
									placeholder={i18n.t('EnterCategory')}
									keyboardType={'default'}
									returnKeyType={'next'}
									onChangeText={(txt) => setSubCategory(txt)}
								/>
							</View>
							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 20,
								lineHeight: 20
							}}>
								{i18n.t('BusinessPhone')}
							</Text>
							<View style={styles.mobileView}>
								<TextInput style={styles.textInputMobile}
									value={BusinessPhone}
									autoCapitalize={'none'}
									placeholder={i18n.t('EnterBusinessPhone')}
									returnKeyType={'done'}
									onChangeText={(txt) => setBusinessPhone(txt)}
									maxLength={10}
								/>
							</View>
							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 20,
								lineHeight: 20
							}}>
								{i18n.t('BusinessEmail')}
							</Text>
							<View style={styles.mobileView}>
								<TextInput style={styles.textInputMobile}
									value={BusinessEmail}
									autoCapitalize={'none'}
									placeholder={i18n.t('EnterBusinessEmail')}
									returnKeyType={'done'}
									onChangeText={(txt) => setBusinessEmail(txt)}
								/>
							</View>
							<Text style={{
								fontSize: FontSize.FS_26,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_SEMIBOLD,
								marginTop: 20,
							}}>
								{i18n.t('AddressInfo')}
							</Text>
							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 20,
								lineHeight: 20
							}}>
								{i18n.t('Address')}
							</Text>
							{/* <View style={styles.mobileView}> */}
							<TextInput style={{
								height: 100, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
								color: Colors.black, flex: 1, marginTop: 10, backgroundColor: Colors.lightGrey01, borderRadius: 10, paddingHorizontal: 10

							}}
								multiline={true}
								value={Address}
								autoCapitalize={'none'}
								placeholder={i18n.t('EnterAddress')}
								returnKeyType={'done'}
								onChangeText={(txt) => setAddress(txt)}
							/>
							{/* </View> */}
							<TouchableOpacity style={styles.btnLogin}
								onPress={() => btnBusinessProfile()}>
								<Text style={styles.loginText}>
									{i18n.t('CreateBusinesProfile')}
								</Text>
							</TouchableOpacity>
						</View>
					</SafeAreaView>
				</ScrollView>
			</View>

			{isLoading ?
				<LoadingView />
				: null}

			<RBSheet
				ref={refRBSheet}
				closeOnDragDown={true}
				closeOnPressMask={true}
				customStyles={{
					wrapper: {
						backgroundColor: Colors.black03
					},
					draggableIcon: {
						backgroundColor: Colors.primary
					}
				}}
			>
				<ScrollView>
					<FlatList
						showsHorizontalScrollIndicator={false}
						style={{ marginTop: 10 }}
						data={CategoryData}
						ItemSeparatorComponent={<View style={{ width: 20, }}></View>}
						renderItem={({ item, index }) => (
							// <View style={{ alignItems: "center" }}>
							<TouchableOpacity onPress={() => {
								refRBSheet.current.close()
								setCategory(item)
							}}
								style={{
									padding: 15,
									alignItems: "center",
									flexDirection: "row"
								}}>

								<FastImage style={{ resizeMode: 'contain', width: 24, height: 24 }}
									source={{ uri: item.image_url }}
								/>
								<Text style={{
									fontSize: FontSize.FS_14,
									color: Colors.black,
									fontFamily: ConstantKey.MONTS_MEDIUM,
									marginLeft: 10
								}}>
									{item.name}
								</Text>
							</TouchableOpacity>

							// </View>

						)}
					/>
				</ScrollView>
			</RBSheet>
		</View>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	mobileView: {
		marginTop: 10, flexDirection: 'row', backgroundColor: Colors.lightGrey01, borderRadius: 10,
		height: 50, alignItems: 'center'
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
export default BusinessProfile