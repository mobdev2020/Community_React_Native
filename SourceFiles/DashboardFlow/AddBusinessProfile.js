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
import { useDispatch, useSelector } from 'react-redux';
import { storeData } from '../commonComponents/AsyncManager';
import { setSelectedSchool } from '../Redux/reducers/userReducer';


const AddBusinessProfile = (props) => {

    const [isLoading, setIsLoading] = useState(false)
	const [BusinessData, setBusinessData] = useState(props?.route?.params?.business_data || null)
	const [CategoryData, setCategoryData] = useState(null)
	const [BusinessName, setBusinessName] = useState('')
	const [Category, setCategory] = useState(null)
	const [SubCategory, setSubCategory] = useState('')
	const [BusinessPhone, setBusinessPhone] = useState('')
	const [BusinessEmail, setBusinessEmail] = useState('')
	const [Address, setAddress] = useState('')
	const [FcmToken, setFcmToken] = useState("")
	const [UserData, setUserData] = useState(null);

	const [txtSearchCategory, setTxtSearchCategory] = useState('')
	const [filterCategory, setFilterCategory] = useState([])

	const [txtSearchCity, setTxtSearchCity] = useState('')
	const [CityId, setCityId] = useState("");
	const [CityData, setCityData] = useState([])
	const [City, setCity] = useState("");
	const [filterCity, setFilterCity] = useState([])

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

	const selectedSchoolData = useSelector(state => state.userRedux.school_data)

	const[for_business_page, setForBusinessPage] = useState(0)

	const dispatch = useDispatch()

	const refRBSheet = useRef();
	const CountrySheet = useRef();
	const StateSheet = useRef();
	const CitySheet = useRef();


    useEffect(() => {
        Api_Get_Country(true)
        Api_Get_Category(true)
        if(BusinessData != null){

            var business = JSON.parse(BusinessData)
            console.log("business data : ",BusinessData)

            setBusinessName(business?.business_name)
            setCategory(business?.category)
            setSubCategory(business?.subcategory_name)
            setBusinessPhone(business?.phone)
            setBusinessEmail(business?.email)
            setAddress(business?.address)
            setCity(business?.city ? business?.city : '')
            setPincode(business?.pincode)

            if(business?.country != null){
                setCountry(business?.country?.name)
                setCountryId(business?.country.id)
                var item = {id : business?.country.id, name : business?.country?.name}
                Api_Get_State(true, item)
            }


            if(business?.state != null){
                setState(business?.state.name)
                setStateId(business?.state?.id)
                var item = {id : business?.state.id, name : business?.state?.name}
                Api_Get_City(true, item)
            }
            
        }
    
      return () => {
        
      }
    }, [])
    

    const Api_Get_Category = (isLoad) => {
		setIsLoading(isLoad)
		// var businessPage =  props?.route?.params?.isFrom == "PROFILE" ? "1" : "1"
		Webservice.get(APIURL.GetCategory+"?school_user_id="+selectedSchoolData?.school_user_id+"&for_business_page=1", {
			mobile_number: 9016089923,
		})
			.then(response => {
				console.log("Get Category Response : ", response)

				if (response.data.status == true) {
					setCategoryData(response.data.data)
					setFilterCategory(response.data.data)
					setTxtSearchCategory('')
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


	const Api_Get_City = (isLoad, item) => {
		setIsLoading(isLoad)
		Webservice.get(APIURL.GetCity + "?state_id=" + item.id)
			.then(response => {
				setIsLoading(false)
				console.log(JSON.stringify("Api_Get_City Response : " + JSON.stringify(response)));
				if (response.data.status == true) {
					var cityData = response?.data?.data
					setCityData(cityData)
					setFilterCity(cityData)
				} else {
					alert(response.data.message)
				}
			})
			.catch((error) => {
				setIsLoading(false)
				console.log(error)
			})
	}


    const Api_Add_BusinessProfile = (isLoad) => {
        setIsLoading(isLoad)
        Webservice.post(APIURL.addBusinessProfile,{
            business_name: BusinessName,
            category: Category?.id,
            subcategory: SubCategory,
            business_mobile_number: BusinessPhone,
            business_email_address: BusinessEmail,
            business_address: Address,
            business_country_id: CoutryId,
            business_state_id: StateId,
            business_city: City,
            business_pincode: Pincode
            
        })
            .then(response => {
                console.log("Api_Add_BusinessProfile",JSON.stringify(response));
                setIsLoading(false)
                if (response.data.status == true) {
                    Toast.showWithGravity("Profile added successfully", Toast.LONG, Toast.CENTER);
                    props.navigation.goBack()
                } else {
                    Toast.showWithGravity(response.data.message, Toast.LONG, Toast.CENTER);
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.log(error)
            })
    }

    const Api_Update_BusinessProfile = (isLoad) => {
        setIsLoading(isLoad)

        let body = new FormData();
        let buzData = JSON.parse(BusinessData)
        body.append('business_id', buzData?.id)
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

        Webservice.post(APIURL.UpdateBusiness,body)
            .then(response => {
                console.log("Api_Update_BusinessProfile :=> ",JSON.stringify(response));
                setIsLoading(false)
                if (response.data.status == true) {
                    Toast.showWithGravity("Profile updated successfully", Toast.LONG, Toast.CENTER);
                    props.navigation.goBack()
                } else {
                    Toast.showWithGravity(response.data.message, Toast.LONG, Toast.CENTER);
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.log(error)
            })
    }

    const validateEmail = (email) => {
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return (regex.test(email))
	}


    const onSearchCategory = (search) => {

		let text = search.toLowerCase()
		let ServiceData = CategoryData

		let filteredName = ServiceData.filter((item) => {

			let name = item.name != null ? String(item.name).toLowerCase().match(text) : ''
			
			return name
		})

		console.log(filteredName.length)
		if (!text || text === '') {

			console.log("Text empty")
			setFilterCategory(CategoryData)
		} 
		else if(filteredName.length == 0){
			setFilterCategory([])
		}
		else if (!Array.isArray(filteredName) && filteredName.length) {
			// set no data flag to true so as to render flatlist conditionally
			setFilterCategory([])

		} 
		else if (Array.isArray(filteredName)) {

			setFilterCategory(filteredName)
		}

		setTxtSearchCategory(search)
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


    const onSearchCity = (search) => {

		let text = search.toLowerCase()
		let ServiceData = CityData

		let filteredName = ServiceData.filter((item) => {

			let name = item.name != null ? String(item.name).toLowerCase().match(text) : ''
			
			return name
		})

		console.log(filteredName.length)
		if (!text || text === '') {

			console.log("Text empty")
			setFilterCity(StateData)
		} 
		else if(filteredName.length == 0){
			setFilterCity([])
		}
		else if (!Array.isArray(filteredName) && filteredName.length) {
			// set no data flag to true so as to render flatlist conditionally
			setFilterCity([])

		} 
		else if (Array.isArray(filteredName)) {

			setFilterCity(filteredName)
		}

		setTxtSearchCity(search)
	}


    const btnCreateBusinessProfileTap = () => {
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
				if (BusinessData != null) {
					Api_Update_BusinessProfile(true)
				}
				else {
					Api_Add_BusinessProfile(true)

				}
			}

		})
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
								{ BusinessData != null ?  i18n.t('UpdateBusinesProfile')  : i18n.t('BusinesProfile')}
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
								{ i18n.t('BusinessName')}
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
							
							{/* </View> */}
							{/* <Text style={{
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
							</View> */}
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

							<Text style={{
								fontSize: FontSize.FS_14,
								color: Colors.black,
								fontFamily: ConstantKey.MONTS_MEDIUM,
								marginTop: 10,
								lineHeight: FontSize.FS_20,
							}}>
								{"Select City"}
							</Text>
							<TouchableOpacity onPress={() => {
								if (StateId == "") {
									alert("Please select State")
								}
								else {
									CitySheet.current.open()
								}
							}
							}
								style={styles.mobileView}>
								<View style={[styles.textInputMobile, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}

								>
									<Text style={{
										fontSize: FontSize.FS_14,
										color: City == "" ? Colors.lightGrey : Colors.dimGray,
										fontFamily: ConstantKey.MONTS_REGULAR,
										// marginTop:15
									}}>
										{City == "" ? "Select city" : City}
									</Text>
									<Icon name={"chevron-down"} size={14} color={Colors.lightGrey} />
								</View>
							</TouchableOpacity>


							

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

							<TouchableOpacity style={styles.btnLogin}
								onPress={() => btnCreateBusinessProfileTap()}>
								<Text style={styles.loginText}>
									{ BusinessData != null ? i18n.t('editProfile') : i18n.t('SaveProfile')}
								</Text>
							</TouchableOpacity>
						</View>
				</ScrollView>
			</View>

			{isLoading ?
				<LoadingView />
				: null}

			<RBSheet
			 height={ConstantKey.SCREEN_WIDTH}
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
				
				<SearchBar
							lightTheme={true}
							showCancel
							// containerStyle={{
							// 	backgroundColor: Colors.white, marginHorizontal : 10,
							// 	borderRadius: 5, height: 50, marginTop: 20,
							// }}
							inputContainerStyle={{ backgroundColor: Colors.white,  padding: 0,}}
							onClear={() => {

								setFilterCategory(CategoryData)
							}}
							value={txtSearchCategory}
							inputStyle={{ 
								fontFamily: ConstantKey.MONTS_REGULAR, fontSize: FontSize.FS_14, color: Colors.black, height: 50 }}
							placeholder={'Search here...'}
							onChangeText={onSearchCategory}
						/>
				<ScrollView>
					<FlatList
						showsHorizontalScrollIndicator={false}
						style={{ marginTop: 10 }}
						data={filterCategory}
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

								setCity("")
								setCityId("")
								Api_Get_City(true, item)
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


			<RBSheet 
			height={ConstantKey.SCREEN_WIDTH * 1.3}
				ref={CitySheet}
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

								setFilterCity(CityData)
							}}
							value={txtSearchCity}
							inputStyle={{ 
								fontFamily: ConstantKey.MONTS_REGULAR, fontSize: FontSize.FS_14, color: Colors.black, height: 50 }}
							placeholder={'Search here...'}
							onChangeText={onSearchCity}
						/>
				
				<ScrollView>
					<FlatList
						showsHorizontalScrollIndicator={false}
						style={{ marginTop: 10 }}
						data={filterCity}
						ItemSeparatorComponent={<View style={{ width: 20, }}></View>}
						renderItem={({ item, index }) => (
							<TouchableOpacity onPress={() => {
								CitySheet.current.close()
								setCity(item?.name)
								setCityId(item?.id)
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
export default AddBusinessProfile