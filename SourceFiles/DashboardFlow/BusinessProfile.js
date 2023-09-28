//import liraries
import React, { Component, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, ScrollView, FlatList, StatusBar } from 'react-native';


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
import RBSheet from 'react-native-raw-bottom-sheet';
import FastImage from 'react-native-fast-image';
import { createNavigatorFactory } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';


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
	const [City, setCity] = useState("");
	const [Pincode, setPincode] = useState("");
	const [CoutryId, setCountryId] = useState("");
	const [Country, setCountry] = useState("");
	const [CountryData, setCountryData] = useState(null);
	const [StateId, setStateId] = useState("");
	const [State, setState] = useState("");
	const [StateData, setStateData] = useState(null);

	const [txtSearchCountry, setTxtSearchCountry] = useState('')
	const [filterCountry, setFilterCountry] = useState([])

	const [txtSearchState, setTxtSearchState] = useState('')
	const [filterState, setFilterState] = useState([])


	const refRBSheet = useRef();
	const CountrySheet = useRef();
	const StateSheet = useRef();

	useEffect(() => {
		getFCMToken()
		Api_Get_Category(true)
		Api_Get_Country(true)
		console.log("props?.route?.params", props?.route?.params?.body)
		if (props?.route?.params?.isFrom == "PROFILE") {
			Api_Get_Profile(true)
		}
	}, [])


	const Api_Get_Country = (isLoad, item) => {
		setIsLoading(isLoad)
		Webservice.get(APIURL.GetCountry)
			.then(response => {
				setIsLoading(false)
				// console.log(JSON.stringify("Api_Get_Country Response : " + JSON.stringify(response)));
				if (response.data.status == true) {
					var coutryData = response?.data?.data
					setCountryData(coutryData)
					setFilterCountry(coutryData)
				} else {
					alert(response.data.message)
				}
			})
			.catch((error) => {
				setIsLoading(false)
				console.log(error)
			})
	}
	const Api_Get_State = (isLoad, item) => {
		setIsLoading(isLoad)
		Webservice.get(APIURL.GetState + "?country_id=" + item.id)
			.then(response => {
				setIsLoading(false)
				console.log(JSON.stringify("Api_Get_State Response : " + JSON.stringify(response)));
				if (response.data.status == true) {
					var stateData = response?.data?.data
					setStateData(stateData)
					setFilterState(stateData)
				} else {
					alert(response.data.message)
				}
			})
			.catch((error) => {
				setIsLoading(false)
				console.log(error)
			})
	}
	const Api_Get_Profile = (isLoad) => {
		setIsLoading(isLoad)
		Webservice.get(APIURL.GetProfile)
			.then(response => {
				setIsLoading(false)
				console.log("Api_Get_Profile Response : " + JSON.stringify(response));
				if (response.data.status == true) {
					var business = response?.data?.data?.user?.business
					if (business != null) {
						setBusinessName(business?.business_name)
						setCategory(business?.category)
						setSubCategory(business?.subcategory_name)
						setBusinessPhone(business?.phone)
						setBusinessEmail(business?.email)
						setAddress(business?.address)
						setCity(business?.city)
						setPincode(business?.pincode)

						if(business?.country != null){
							setCountry(business?.country?.name)
							setCountryId(business?.country.id)
							var item = {id : business?.country.id, name : business?.country?.name}
							Api_Get_State(true, item)
						}
						

						setState(business?.state.name)
						setStateId(business?.state?.id)
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
		// body.append('business_address_line_one', Address)
		body.append('business_address', Address)
		body.append('business_city', City)
		body.append('business_country_id', CoutryId)
		body.append('business_pincode', Pincode)

		body.append('business_state_id', StateId)
		body.append('is_business_profile', 1)

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
					Toast.showWithGravity(response.data.message, Toast.LONG, Toast.CENTER);
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
		body.append('business_address', Address)
		body.append('business_city', City)
		body.append('business_country_id', CoutryId)
		body.append('business_pincode', Pincode)

		body.append('business_state_id', StateId)
		body.append('kids_information',props?.route?.params?.body?.kids_information )

		body.append('device_type', Platform.OS == "android" ? 1 : 2)
		body.append('device_token', FcmToken)
		body.append('parent_id', props?.route?.params?.body?.parent_id)
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
					Toast.showWithGravity(response.data.message, Toast.LONG, Toast.CENTER);
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
				Toast.showWithGravity("Please enter business name.", Toast.LONG, Toast.CENTER);
			}
			else if (Category == null) {
				Toast.showWithGravity("Please select category", Toast.LONG, Toast.CENTER);
			}
			// else if (SubCategory == '') {
			// 	Toast.showWithGravity("Please enter sub category", Toast.LONG, Toast.CENTER);
			// }
			else if (BusinessPhone.length < 10) {
				Toast.showWithGravity("Please enter valid phone number", Toast.LONG, Toast.CENTER);
			}
			else if (!validateEmail(BusinessEmail)) {
				Toast.showWithGravity(i18n.t('validEmail'), Toast.LONG, Toast.CENTER);
			} else if (Address == "") {
				Toast.showWithGravity("Please enter business address", Toast.LONG, Toast.CENTER);
			}
			else if (createNavigatorFactory == "") {
				Toast.showWithGravity("Please enter city", Toast.LONG, Toast.CENTER);
			} else if (Pincode == "") {
				Toast.showWithGravity("Please enter pincode", Toast.LONG, Toast.CENTER);
			} else if (Country == "") {
				Toast.showWithGravity("Please select country", Toast.LONG, Toast.CENTER);
			} else if (State == "") {
				Toast.showWithGravity("Please select state", Toast.LONG, Toast.CENTER);
			}
			else {
				console.log("route?.params?.isFrom ::", props?.route?.params?.isFrom)
				if (props?.route?.params?.isFrom == "PROFILE") {
					Api_Update_Business(true)

				}
				else {
					console.log("1")
					Api_Register(true)

				}
			}

		})
	}

	const onSearchCountry = (search) => {

		let text = search.toLowerCase()
		let ServiceData = CountryData

		let filteredName = ServiceData.filter((item) => {

			let name = item.name != null ? String(item.name).toLowerCase().match(text) : ''
			
			return name
		})

		console.log(filteredName.length)
		if (!text || text === '') {

			console.log("Text empty")
			setFilterCountry(CountryData)
		} 
		else if(filteredName.length == 0){
			setFilterCountry([])
		}
		else if (!Array.isArray(filteredName) && filteredName.length) {
			// set no data flag to true so as to render flatlist conditionally
			setFilterCountry([])

		} 
		else if (Array.isArray(filteredName)) {

			setFilterCountry(filteredName)
		}

		setTxtSearchCountry(search)
	}


	const onSearchState = (search) => {

		let text = search.toLowerCase()
		let ServiceData = StateData

		let filteredName = ServiceData.filter((item) => {

			let name = item.name != null ? String(item.name).toLowerCase().match(text) : ''
			
			return name
		})

		console.log(filteredName.length)
		if (!text || text === '') {

			console.log("Text empty")
			setFilterState(StateData)
		} 
		else if(filteredName.length == 0){
			setFilterState([])
		}
		else if (!Array.isArray(filteredName) && filteredName.length) {
			// set no data flag to true so as to render flatlist conditionally
			setFilterState([])

		} 
		else if (Array.isArray(filteredName)) {

			setFilterState(filteredName)
		}

		setTxtSearchState(search)
	}

	return (
		<SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'}/>

		<View style={styles.container}>
			<View style={{ flex: 1, backgroundColor: Colors.white }}>

			<View style={{ flexDirection: "row", alignItems: "center",marginHorizontal : 10 }}>
							<TouchableOpacity onPress={() => { props.navigation.goBack() }}
								style={{ marginRight: 10, padding: 10 }}>
								<Icon name={"chevron-left"} size={20} color={Colors.black} />

							</TouchableOpacity>

							<Text style={{
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_SEMIBOLD,
							}}>
								{i18n.t('BusinesProfile')}
							</Text>

						</View>
				<ScrollView style={{}}>
						
						<View style={{ marginHorizontal: 20 }}>
							<Text style={{
								fontSize: FontSize.FS_14,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 10,
								lineHeight: FontSize.FS_20,
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
								fontSize: FontSize.FS_14,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 10,
								lineHeight: FontSize.FS_20,
							}}>
								{i18n.t('Category')}
							</Text>

							<TouchableOpacity onPress={() => refRBSheet.current.open()}
								style={styles.mobileView}>
								<View style={[styles.textInputMobile, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}

								>
									<Text style={{
										fontSize: FontSize.FS_14,
										color: Category == "" ? Colors.lightGrey : Colors.dimGray,
										fontFamily: ConstantKey.MONTS_REGULAR,
										// marginTop:15
									}}>
										{Category?.name == null ? "Select Category" : Category?.name}
									</Text>
									<Icon name={"chevron-down"} size={14} color={Colors.lightGrey} />
								</View>
							</TouchableOpacity>
							<Text style={{
								fontSize: FontSize.FS_14,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 10,
								lineHeight: FontSize.FS_20,
							}}>
								{i18n.t('SubCategory')}
							</Text>
							<View style={styles.mobileView}>
								<TextInput style={styles.textInputMobile}
									value={SubCategory}
									placeholder={i18n.t('EnterCategory')}
									keyboardType={'default'}
									returnKeyType={'next'}
									onChangeText={(txt) => setSubCategory(txt.replace(/[^A-Za-z\s]/ig, ''))}
								/>
							</View>
							<Text style={{
								fontSize: FontSize.FS_14,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 10,
								lineHeight: FontSize.FS_20,
							}}>
								{i18n.t('BusinessPhone')}
							</Text>
							<View style={styles.mobileView}>
								<TextInput style={styles.textInputMobile}
									value={BusinessPhone}
									autoCapitalize={'none'}
									placeholder={i18n.t('EnterBusinessPhone')}
									returnKeyType={'done'}
									keyboardType='number-pad'
									onChangeText={(txt) => setBusinessPhone(txt)}
									maxLength={10}
								/>
							</View>
							<Text style={{
								fontSize: FontSize.FS_14,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 10,
								lineHeight: FontSize.FS_20,
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
								fontSize: FontSize.FS_18,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_SEMIBOLD,
								marginTop: 30,
							}}>
								{i18n.t('AddressInfo')}
							</Text>
							<Text style={{
								fontSize: FontSize.FS_14,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 30,
								lineHeight: FontSize.FS_20,
							}}>
								{i18n.t('Address')}
							</Text>
							{/* <View style={styles.mobileView}> */}
							<TextInput style={{
								height: 70, fontSize: FontSize.FS_14, fontFamily: ConstantKey.MONTS_REGULAR,
								color: Colors.dimGray, flex: 1, marginTop: 10, backgroundColor: Colors.lightGrey01, borderRadius: 6, paddingHorizontal: 10

							}}
								multiline={true}
								value={Address}
								autoCapitalize={'none'}
								placeholder={i18n.t('EnterAddress')}
								returnKeyType={'done'}
								onChangeText={(txt) => setAddress(txt)}
							/>
							{/* </View> */}
							<Text style={{
								fontSize: FontSize.FS_14,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 10,
								lineHeight: FontSize.FS_20,
							}}>
								{"City"}
							</Text>
							<View style={styles.mobileView}>
								<TextInput style={styles.textInputMobile}
									value={City}
									placeholder={"Enter City"}
									keyboardType={'default'}
									returnKeyType={'next'}
									onChangeText={(txt) => setCity(txt.replace(/[^A-Za-z\s]/ig, ''))}
								/>
							</View>
							<Text style={{
								fontSize: FontSize.FS_14,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 10,
								lineHeight: FontSize.FS_20,
							}}>
								{"Pincode"}
							</Text>
							<View style={styles.mobileView}>
								<TextInput style={styles.textInputMobile}
									value={Pincode}
									placeholder={"Enter Pincode"}
									keyboardType={'number-pad'}
									returnKeyType={'next'}
									onChangeText={(txt) => setPincode(txt)}
								/>
							</View>
							<Text style={{
								fontSize: FontSize.FS_14,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 10,
								lineHeight: FontSize.FS_20,
							}}>
								{"Select Country"}
							</Text>
							<TouchableOpacity onPress={() => CountrySheet.current.open()}
								style={styles.mobileView}>
								<View style={[styles.textInputMobile, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}

								>
									<Text style={{
										fontSize: FontSize.FS_14,
										color: Country == "" ? Colors.lightGrey : Colors.dimGray,
										fontFamily: ConstantKey.MONTS_REGULAR,
										// marginTop:15
									}}>
										{Country == "" ? "Select Country" : Country}
									</Text>
									<Icon name={"chevron-down"} size={14} color={Colors.lightGrey} />
								</View>
							</TouchableOpacity>
							<Text style={{
								fontSize: FontSize.FS_14,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 10,
								lineHeight: FontSize.FS_20,
							}}>
								{"Select State"}
							</Text>
							<TouchableOpacity onPress={() => {
								if (Country == "") {
									alert("Please select country")
								}
								else {
									StateSheet.current.open()
								}
							}
							}
								style={styles.mobileView}>
								<View style={[styles.textInputMobile, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}

								>
									<Text style={{
										fontSize: FontSize.FS_14,
										color: State == "" ? Colors.lightGrey : Colors.dimGray,
										fontFamily: ConstantKey.MONTS_REGULAR,
										// marginTop:15
									}}>
										{State == "" ? "Select State" : State}
									</Text>
									<Icon name={"chevron-down"} size={14} color={Colors.lightGrey} />
								</View>
							</TouchableOpacity>
							<TouchableOpacity style={styles.btnLogin}
								onPress={() => btnBusinessProfile()}>
								<Text style={styles.loginText}>
									{i18n.t('SaveProfile')}
								</Text>
							</TouchableOpacity>
						</View>
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
						)}
					/>
				</ScrollView>
			</RBSheet>
			<RBSheet height={ConstantKey.SCREEN_WIDTH * 1.3}
				ref={CountrySheet}
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
				<>
				<SearchBar
							lightTheme={true}
							showCancel
							// containerStyle={{
							// 	backgroundColor: Colors.white, marginHorizontal : 10,
							// 	borderRadius: 5, height: 50, marginTop: 20,
							// }}
							inputContainerStyle={{ backgroundColor: Colors.white,  padding: 0,}}
							onClear={() => {

								setFilterCountry(CountryData)
							}}
							value={txtSearchCountry}
							inputStyle={{ 
								fontFamily: ConstantKey.MONTS_REGULAR, fontSize: FontSize.FS_14, color: Colors.black, height: 50 }}
							placeholder={'Search here...'}
							onChangeText={onSearchCountry}
						/>
				
				<ScrollView>
					<FlatList
						showsHorizontalScrollIndicator={false}
						style={{ marginTop: 10 }}
						data={filterCountry}
						ItemSeparatorComponent={<View style={{ width: 20, }}></View>}
						renderItem={({ item, index }) => (
							<TouchableOpacity onPress={() => {
								CountrySheet.current.close()
								setCountry(item?.name)
								setCountryId(item.id)

								setStateId('')
								setState('')
								Api_Get_State(true, item)
							}}
								style={{
									padding: 15,
									alignItems: "center",
									flexDirection: "row"
								}}>

								{/* <FastImage style={{ resizeMode: 'contain', width: 24, height: 24 }}
									source={{ uri: item.image_url }}
								/> */}
								<Text style={{
									fontSize: FontSize.FS_14,
									color: Colors.black,
									fontFamily: ConstantKey.MONTS_MEDIUM,
									marginLeft: 10
								}}>
									{item.name}
								</Text>
							</TouchableOpacity>
						)}
					/>
				</ScrollView>
				</>
			</RBSheet>
			<RBSheet 
			height={ConstantKey.SCREEN_WIDTH * 1.3}
				ref={StateSheet}
				closeOnDragDown={true}
				closeOnPressMask={true}
				customStyles={{
					wrapper: {
						backgroundColor: Colors.black03
					},
					draggableIcon: {
						backgroundColor: Colors.primary
					},
				}}
			>
				<>
				
				<SearchBar
							lightTheme={true}
							showCancel
							// containerStyle={{
							// 	backgroundColor: Colors.white, marginHorizontal : 10,
							// 	borderRadius: 5, height: 50, marginTop: 20,
							// }}
							inputContainerStyle={{ backgroundColor: Colors.white,  padding: 0,}}
							onClear={() => {

								setFilterState(StateData)
							}}
							value={txtSearchState}
							inputStyle={{ 
								fontFamily: ConstantKey.MONTS_REGULAR, fontSize: FontSize.FS_14, color: Colors.black, height: 50 }}
							placeholder={'Search here...'}
							onChangeText={onSearchState}
						/>
				
				<ScrollView>
					<FlatList
						showsHorizontalScrollIndicator={false}
						style={{ marginTop: 10 }}
						data={filterState}
						ItemSeparatorComponent={<View style={{ width: 20, }}></View>}
						renderItem={({ item, index }) => (
							<TouchableOpacity onPress={() => {
								StateSheet.current.close()
								setState(item?.name)
								setStateId(item?.id)
							}}
								style={{
									padding: 15,
									alignItems: "center",
									flexDirection: "row"
								}}>

								<Text style={{
									fontSize: FontSize.FS_14,
									color: Colors.black,
									fontFamily: ConstantKey.MONTS_MEDIUM,
									marginLeft: 10
								}}>
									{item.name}
								</Text>
							</TouchableOpacity>
						)}
					/>
				</ScrollView>
				</>
			</RBSheet>
		</View>
		</SafeAreaView>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	mobileView: {
		marginTop: 10, flexDirection: 'row', backgroundColor: Colors.lightGrey01, borderRadius: 6,
		height: 44, alignItems: 'center', 
	},
	textInputMobile: {
		marginLeft: 10, marginRight: 10, height: 50, flex: 1, fontSize: FontSize.FS_14, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.dimGray
	},
	btnLogin: {
		backgroundColor: Colors.black,
		marginVertical: 48, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
	},
	loginText: {
		fontSize: FontSize.FS_16, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});
export default BusinessProfile