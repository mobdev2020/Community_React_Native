//import liraries
import React, { Component, useLayoutEffect, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, FlatList, Platform, Modal, TextInput, Linking, Alert, PermissionsAndroid, Image, Keyboard, Switch } from 'react-native';


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
import ChangePasswordModal from './ChangePasswordModal';

// Third Party
import { StackActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ImageView from "react-native-image-viewing";
import RBSheet from "react-native-raw-bottom-sheet";
import { SearchBar } from 'react-native-elements';
import Navigation from '../Constants/Navigation';
import { navigate } from '../Constants/NavigationService';


// create a component
const AddEvent = ({ navigation }) => {
	const refRBUsers = useRef();

	const [isLoading, setIsLoading] = useState(false)
	// const [userData, setUserData] = useState(JSON.parse(props.route.params.userData || null))
	// const [EventData, setEventData] = useState(JSON.parse(props.route.params.eventData || null))
	// const [isEdit, setIsEdit] = useState(props.route.params.isEdit || false)
	const [isEdit, setIsEdit] = useState(false)

	const [txtEventName, setTxtEventName] = useState('')
	const [txtEventDesc, setTxtEventDesc] = useState('')
	const [txtEventLink, setTxtEventLink] = useState('')

	const [openDatePicker, setOpenDatePicker] = useState(false);
	const [StartDate, setStartDate] = useState(new Date())

	const [openEndDatePicker, setOpenEndDatePicker] = useState(false)
	const [EndDate, setEndDate] = useState(new Date())

	const [isPushNow, setIsPushNow] = useState(0);

	const [EventImg, setEventImg] = useState(null)
	const [visibleImg, setIsVisibleImg] = useState(false);

	const [EventType, setEventType] = useState('announcement');

	const [ContactList, setContactList] = useState([])
	const [FilterContactList, setFilterContactList] = useState([])
	const [SelectedUser, setSelectedUser] = useState(null)
	const [FilteredName, setFilteredName] = useState('')


	// Set Navigation Bar
	// useLayoutEffect(() => {
	// 	props.navigation.setOptions({
	// 		headerTitle: isEdit ? i18n.t('edit_event') : i18n.t('add_event'),
	// 		headerTitleStyle: {
	// 			fontFamily: ConstantKey.MONTS_SEMIBOLD
	// 		},
	// 		headerStyle: {
	// 			backgroundColor: Colors.white,
	// 		},
	// 		headerTintColor: Colors.primary,
	// 		headerBackTitleVisible: false,
	// 	});
	// }, [props, isEdit]);



	useEffect(() => {

		// Api_GetContacts(true, userData)

		// if (isEdit) {
		// 	console.log("Event Data : " + JSON.stringify(EventData))

		// 	setTxtEventName(EventData.event_name)
		// 	setTxtEventDesc(EventData.event_desc)
		// 	setTxtEventLink(EventData.event_link != null ? EventData.event_link : '')
		// 	setStartDate(new Date(EventData.event_start_date))
		// 	setEndDate(new Date(EventData.event_end_date))
		// 	setEventType(EventData.is_type)
		// 	setIsPushNow(EventData.is_push)

		// 	if (EventData.event_image != null) {
		// 		var data = {}
		// 		data['data'] = null
		// 		data['path'] = String(EventData.event_image)
		// 		setEventImg(data)
		// 	}

		// }

		return () => { }
	}, [])


	// const Api_GetContacts = (isLoad, user_data) => {

	// 	setIsLoading(isLoad)

	// 	console.log("Api_GetContacts User na Data :"+JSON.stringify(user_data))

	// 	Webservice.post(APIURL.getContacts,{
	// 		member_id : user_data.id
	// 	})
	// 		.then(response => {

	// 			if (response == null) {
	// 				setIsLoading(false)
	// 			}
	// 			console.log(JSON.stringify(response));
	// 			setIsLoading(false)

	// 			if (response.data.Status == '1') {

	// 				var data = response.data.Data

	// 				var filterActive = data.filter((item) => item.isVisible == "1")

	// 				setContactList(filterActive)
	// 				setFilterContactList(filterActive)


	// 				if(isEdit && EventData.is_type == 'birthday'){
	// 					var filterSelected = data.filter((item) => item.id == EventData.member_id)

	// 					setSelectedUser(filterSelected[0])

	// 					console.log("Selected User  : "+JSON.stringify(filterSelected[0]))
	// 				}


	// 			} else {
	// 				Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
	// 			}

	// 		})
	// 		.catch((error) => {

	// 			setIsLoading(false)
	// 			console.log(error)
	// 		})
	// }



	// Add Event
	// const Api_AddEvent = (isLoad) => {

	// 	setIsLoading(isLoad)

	// 	let body = new FormData();

	// 	body.append('is_type', EventType)
	// 	body.append('event_name', txtEventName)
	// 	body.append('event_desc', txtEventDesc)
	// 	body.append('event_link', txtEventLink)
	// 	body.append('event_start_date', moment(StartDate).format("DD-MM-YYYY"))
	// 	body.append('event_end_date', moment(EndDate).format("DD-MM-YYYY"))
	// 	body.append('is_push', isPushNow)
	// 	if(EventType == 'birthday'){
	// 		body.append('member_id', SelectedUser.id)
	// 	}
	// 	if (EventImg != null) {
	// 		body.append('event_image',
	// 			{
	// 				uri: EventImg.path,
	// 				name: Platform.OS == 'android' ? "image.jpeg" : EventImg.filename,
	// 				type: EventImg.mime
	// 			});
	// 	}


	// 	Webservice.post(APIURL.addEvent, body)
	// 		.then(response => {

	// 			setIsLoading(false)
	// 			if (response == null) {
	// 				setIsLoading(false)
	// 			}
	// 			console.log(JSON.stringify("Api_AddEvent Response : " + JSON.stringify(response)));
	// 			// setIsLoading(false)

	// 			if (response.data.Status == '1') {

	// 				Alert.alert("Sucess", "Event Added Sucessfully", [
	// 					{
	// 						text: 'Ok',
	// 						onPress: () => {
	// 							props.route.params.onGoBack();
	// 							props.navigation.goBack()
	// 						}
	// 					}
	// 				], { cancelable: false })
	// 			} else {
	// 				alert(response.data.Msg)
	// 			}

	// 		})
	// 		.catch((error) => {

	// 			setIsLoading(false)
	// 			console.log(error)
	// 		})
	// }


	// Edit Event
	// const Api_EditEvent = (isLoad) => {

	// 	setIsLoading(isLoad)

	// 	let body = new FormData();

	// 	body.append('is_type', EventType)
	// 	body.append('event_id', EventData.id)
	// 	body.append('event_name', txtEventName)
	// 	body.append('event_desc', txtEventDesc)
	// 	body.append('event_link', txtEventLink)
	// 	body.append('event_start_date', moment(StartDate).format("DD-MM-YYYY"))
	// 	body.append('event_end_date', moment(EndDate).format("DD-MM-YYYY"))
	// 	body.append('is_push', isPushNow)
	// 	if(EventType == 'birthday'){
	// 		body.append('member_id', SelectedUser.id)
	// 	}
	// 	if (EventImg != null && EventImg.data != null) {
	// 		body.append('event_image',
	// 			{
	// 				uri: EventImg.path,
	// 				name: moment()+".png",
	// 				type: EventImg.mime
	// 			});
	// 	}


	// 	Webservice.post(APIURL.editEvent, body)
	// 		.then(response => {

	// 			setIsLoading(false)
	// 			if (response == null) {
	// 				setIsLoading(false)
	// 			}
	// 			console.log(JSON.stringify("Api_AddEvent Response : " + JSON.stringify(response)));
	// 			// setIsLoading(false)

	// 			if (response.data.Status == '1') {

	// 				Alert.alert("Sucess", "Event Updated Sucessfully", [
	// 					{
	// 						text: 'Ok',
	// 						onPress: () => {
	// 							props.route.params.onGoBack();
	// 							props.navigation.goBack()
	// 						}
	// 					}
	// 				], { cancelable: false })
	// 			} else {
	// 				alert(response.data.Msg)
	// 			}

	// 		})
	// 		.catch((error) => {

	// 			setIsLoading(false)
	// 			console.log(error)
	// 		})
	// }


	// Action Methods
	// For Get Select Images
	const btnSelectImage = () => {

		Alert.alert(
			"",
			i18n.t('chooseOption'),
			[
				{
					text: 'Camera', onPress: () => {

						setIsLoading(true)

						ImagePicker.openCamera({
							width: ConstantKey.SCREEN_WIDTH,
							height: ConstantKey.SCREEN_WIDTH,
							cropping: true,
							multiple: false,
							includeBase64: true,
							mediaType: 'photo',
							multipleShot: false,
							compressImageQuality: 0.6
						}).then(images => {

							console.log(images);

							setIsLoading(false)
							setEventImg(images)

						}).catch((error) => {

							setIsLoading(false)

							console.log(error)
						});

					}
				},
				{
					text: 'Gallary',
					onPress: () => {

						setIsLoading(true)

						ImagePicker.openPicker({
							multiple: false,
							freeStyleCropEnabled: true,
							cropping: true,
							mediaType: 'photo',
							includeBase64: true,
							compressImageQuality: 0.6
						}).then(images => {

							console.log(images);

							setIsLoading(false)

							setEventImg(images)

						}).catch((error) => {

							setIsLoading(false)

							console.log(error)
						});
					}
				},
				{
					text: 'Cancel',
					style: 'destructive'
				},
			],
			// { cancelable: true }
		);
	}


	// Date Picker Actions
	const showDatePicker = (type) => {

		if (type == 'Start Date') {

			setOpenDatePicker(true);
		} else {
			setOpenEndDatePicker(true)
		}
	};


	const hideDatePicker = (type) => {

		if (type == 'Start Date') {
			setOpenDatePicker(false);
		}
		else {
			setOpenEndDatePicker(false)
		}
	};


	const handleConfirm = (date, type) => {
		console.warn("A date has been picked: ", date);

		setOpenDatePicker(false);
		setOpenEndDatePicker(false)

		if (type == 'Start Date') {
			setStartDate(date)
		} else {
			setEndDate(date)
		}


	};



	const btnAddEditTap = () => {
		requestAnimationFrame(() => {


			if (txtEventName == '') {
				Toast.showWithGravity(i18n.t('enter_event_name'), Toast.LONG, Toast.BOTTOM);
			} else if (txtEventDesc == '') {
				Toast.showWithGravity(i18n.t('enter_event_desc'), Toast.LONG, Toast.BOTTOM);
			} else if (StartDate == null) {
				Toast.showWithGravity(i18n.t('enter_event_date'), Toast.LONG, Toast.BOTTOM);
			} else if (EndDate == null) {
				Toast.showWithGravity(i18n.t('enter_event_date'), Toast.LONG, Toast.BOTTOM);
			} else if (EventImg == null) {
				Toast.showWithGravity(i18n.t('select_event_image'), Toast.LONG, Toast.BOTTOM);
			} else {

				// if(isEdit){
				// 	Api_EditEvent(true)
				// }
				// else{
				// 	Api_AddEvent(true)
				// }
			}
		})
	}


	// const btnToggleEventType = (item) => {
	// 	requestAnimationFrame(() => {

	// 		if(isEdit){

	// 		}else{

	// 			if(item == 'birthday'){

	// 				setTxtEventName('Birthday Wishes')
	// 				setTxtEventDesc('Happy Birthday - '+(SelectedUser != null ? SelectedUser.name : ''))
	// 			}else{
	// 				setTxtEventName('')
	// 				setTxtEventDesc('')
	// 			}
	// 			setEventType(item)
	// 		}

	// 	})
	// }


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


	// Action Methods
	const SelectUserTap = (item) => {
		requestAnimationFrame(() => {

			const index2 = ContactList.map(item => item.id).indexOf(item.id);
			console.log('Index: ', index2); // Found the object index

			setSelectedUser(item)

			refRBUsers.current.close()

		})
	}


	// Render Sprator
	const Saprator = () => {
		return (
			<View style={{ height: 10, }}></View>
		)
	}



	return (
		<SafeAreaView style={styles.container}>

			<View style={styles.container}>

				<ScrollView style={{ flex: 1, marginVertical: 10, }} keyboardShouldPersistTaps='always'>
					<View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 10 }}>
						<TouchableOpacity onPress={() => { navigation.goBack() }}
							style={{ marginRight: 10, marginBottom: 5, padding: 10 }}>
							<Icon name={"chevron-left"} size={18} color={Colors.black} />

						</TouchableOpacity>

						<Text style={{
							fontSize: FontSize.FS_22,
							color: Colors.black,
							fontFamily: ConstantKey.MONTS_SEMIBOLD,
						}}>
							{i18n.t('add_event')}
						</Text>

					</View>
					<View style={{
						marginHorizontal: 20, marginVertical: 20, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary,
						height: 200,
					}}>

						{/* <TouchableOpacity onPress={() => EventImg != null ?  setIsVisibleImg(true) : {}}>
						<Image style={{height : '100%', width : '100%', resizeMode : EventImg == null ? 'contain' : 'cover',  borderRadius : 10,}}
							source={EventImg == null ? Images.MagnusLogo : {uri : EventImg.path}}/>
					</TouchableOpacity> */}
						{EventImg == null ?
							<TouchableOpacity onPress={() =>{
								btnSelectImage()
							}}
							style={{flex:1,alignSelf:"center",justifyContent:"center",alignItems:"center"}}>
								<MaterialCommunityIcons name={"cloud-upload-outline"} size={40} color={Colors.primary} />
								<Text style={{
                                fontSize: FontSize.FS_16,
                                color: Colors.primary,
                                fontFamily: ConstantKey.MONTS_SEMIBOLD,
								textAlign:"center"
                            }}>Upload Event photo</Text>
							</TouchableOpacity> :
							<TouchableOpacity onPress={() => EventImg != null ? setIsVisibleImg(true) : {}}>
								<Image style={{ height: '100%', width: '100%', resizeMode: EventImg == null ? 'contain' : 'cover', borderRadius: 10, }}
									source={EventImg == null ? Images.MagnusLogo : { uri: EventImg.path }} />
							</TouchableOpacity>
						}

						<View style={{ position: 'absolute', width: '100%' }}>

							<TouchableOpacity style={{
								alignSelf: 'flex-end', backgroundColor: Colors.primary, padding: 10,
								borderBottomLeftRadius: 10, borderTopRightRadius: 10
							}}
								onPress={() => btnSelectImage()}>

								<Icon name='upload' size={15} color={Colors.white} />
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ marginHorizontal: 20, }}>

						{/* <Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Event Type
						</Text> */}

						{/* <View style={{ flexDirection: 'row', marginTop: 10, }}>

							<TouchableOpacity style={{ flexDirection: 'row', flex: 0.5 }}
								onPress={() => btnToggleEventType('announcement')}>
								<Icon name={EventType == 'announcement' ? 'dot-circle' : 'circle'} size={20} color={Colors.primary} />
								<Text style={{ marginLeft: 5, fontFamily: ConstantKey.MONTS_REGULAR, fontSize: FontSize.FS_16, color: Colors.black, }}>
									{i18n.t('announcement')}
								</Text>
							</TouchableOpacity>

							<TouchableOpacity style={{ flexDirection: 'row', flex: 0.5 }}
								onPress={() => btnToggleEventType('birthday')}>
								<Icon name={EventType == 'birthday' ? 'dot-circle' : 'circle'} size={20} color={Colors.primary} />
								<Text style={{ marginLeft: 5, fontFamily: ConstantKey.MONTS_REGULAR, fontSize: FontSize.FS_16, color: Colors.black, }}>
									{i18n.t('birthday')}
								</Text>
							</TouchableOpacity>

						</View> */}


						{/* {EventType == 'birthday' ?
							<>
								<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
									Select Member
								</Text>
								<TouchableOpacity style={[styles.mobileView]} onPress={() => {
										if(isEdit){

										}else{
											refRBUsers.current.open()
										}
									}}>

									<Icon name={"user"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />

									<Text style={[styles.textInputMobile]}>
										{SelectedUser == null ? '' : SelectedUser.name}
									</Text>
									<Icon name={"chevron-down"} size={20} color={Colors.primary} style={{ marginRight: 10 }} />
								</TouchableOpacity>
							</>
							: null} */}


						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Event Name
						</Text>

						<View style={styles.mobileView}>

							<Icon name={"calendar-day"} size={20} color={Colors.primary} style={{ marginLeft: 10, }} />

							<TextInput style={styles.textInputMobile}
								value={txtEventName}
								placeholder={'Event name'}
								returnKeyType={'next'}
								onChangeText={(txtName) => setTxtEventName(txtName)}
							/>

						</View>

						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Event description
						</Text>
						<View style={[styles.mobileView]}>

							{/* <Icon name={"info"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} /> */}

							<TextInput style={[styles.textInputMobile]}
								value={txtEventDesc}
								multiline
								placeholder={'Event description'}
								returnKeyType={'next'}
								onChangeText={(desc) => setTxtEventDesc(desc)}
							/>

						</View>

						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Event start date
						</Text>
						<TouchableOpacity style={[styles.mobileView]} onPress={() => showDatePicker('Start Date')}>

							<Icon name={"calendar-alt"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />

							<Text style={[styles.textInputMobile]}>
								{moment(StartDate).format("DD-MM-YYYY")}
							</Text>

						</TouchableOpacity>


						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Event end date
						</Text>
						<TouchableOpacity style={[styles.mobileView]} onPress={() => showDatePicker('End Date')}>

							<Icon name={"calendar-alt"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />

							<Text style={[styles.textInputMobile]}>
								{moment(EndDate).format("DD-MM-YYYY")}
							</Text>

						</TouchableOpacity>


						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Event Link <Text style={{ color: Colors.primary }}>( Optional )</Text>
						</Text>

						<View style={styles.mobileView}>

							<Icon name={"link"} size={20} color={Colors.primary} style={{ marginLeft: 10, }} />

							<TextInput style={styles.textInputMobile}
								value={txtEventLink}
								placeholder={'Event link'}
								onChangeText={(link) => setTxtEventLink(link)}
							/>

						</View>


						{/* <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>

							<TouchableOpacity onPress={() => setIsPushNow(isPushNow == 0 ? 1 : 0)}>
								<Icon name={isPushNow == 1 ? 'check-square' : 'square'} size={25} color={Colors.primary} />
							</TouchableOpacity>

							<Text style={{ fontFamily: ConstantKey.MONTS_REGULAR, color: Colors.black, fontSize: FontSize.FS_16, marginLeft: 10 }}>
								{i18n.t('push_now')}?
							</Text>

						</View> */}


						<TouchableOpacity style={styles.btnLogin}
							onPress={() => btnAddEditTap()}>
							<Text style={styles.loginText}>
								{isEdit ? i18n.t("edit_event") : i18n.t("add_event")}
							</Text>
						</TouchableOpacity>

					</View>

					<DateTimePickerModal
						isVisible={openDatePicker}
						date={StartDate}
						mode="date"
						minimumDate={new Date()}
						onConfirm={(date) => handleConfirm(date, 'Start Date')}
						onCancel={hideDatePicker}
						display={Platform.OS === "ios" ? "inline" : "default"}
					/>

					<DateTimePickerModal
						isVisible={openEndDatePicker}
						date={EndDate}
						mode="date"
						onConfirm={(date) => handleConfirm(date, 'End Date')}
						onCancel={hideDatePicker}
					// display={Platform.OS === "ios" ? "inline" : "default"} 
					/>

					{EventImg != null ?
						<ImageView
							images={[{ uri: EventImg.path }]}
							imageIndex={0}
							visible={visibleImg}
							onRequestClose={() => setIsVisibleImg(false)}
						/> : null}


					{ /* User picker PopUp */}
					<RBSheet
						ref={refRBUsers}
						closeOnDragDown={true}
						closeOnPressMask={true}
						height={ConstantKey.SCREEN_HEIGHT / 1.5}
						customStyles={{
							wrapper: {
								backgroundColor: Colors.black03 //"transparent"
							},
							draggableIcon: {
								backgroundColor: Colors.primary
							},
							container: {
								borderTopLeftRadius: 20, borderTopRightRadius: 20
							}
						}}
					>
						<View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20 }}>
							<Text style={{ flex: 1, fontSize: FontSize.FS_16, color: Colors.primary, fontFamily: ConstantKey.MONTS_BOLD }}>
								{i18n.t('selectMember')}
							</Text>

							<TouchableOpacity>
								<Text style={{ fontSize: FontSize.FS_16, color: Colors.primary, fontFamily: ConstantKey.MONTS_BOLD }}
									onPress={() => refRBUsers.current.close()}>
									{i18n.t('done')}
								</Text>
							</TouchableOpacity>
						</View>

						<SearchBar
							lightTheme
							showCancel
							round
							placeholder="Search Here..."
							containerStyle={{
								backgroundColor: Colors.white, borderWidth: 1, borderColor: 'rgba(173,186,200,0.4)',
								borderRadius: 5, height: 50, marginLeft: 20, marginRight: 20, marginTop: 20
							}}
							inputContainerStyle={{ backgroundColor: Colors.white, height: 30, padding: 0 }}
							onClear={() => {
								setFilteredName('')
								setFilterContactList(ContactList)
							}}
							inputStyle={{ fontFamily: ConstantKey.MONTS_SEMIBOLD, fontSize: FontSize.FS_14, color: Colors.black, height: 50 }}
							onChangeText={updateSearch}
							value={FilteredName}
						/>

						<FlatList style={{ marginTop: 20 }}
							data={FilterContactList}
							keyboardShouldPersistTaps={'handled'}
							ListHeaderComponent={Saprator}
							ListFooterComponent={Saprator}
							ItemSeparatorComponent={Saprator}
							keyExtractor={(item, index) => index}
							renderItem={({ item, index }) => {
								return (
									<TouchableOpacity style={{
										borderRadius: 10, backgroundColor: Colors.white, padding: 10, marginBottom: 10, marginLeft: 20, marginRight: 20,
										borderColor: SelectedUser == null ? Colors.primary : (SelectedUser.id == item.id ? Colors.primary : Colors.primary), borderWidth: 1
									}}
										onPress={() => SelectUserTap(item)}>

										<Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_SEMIBOLD, }}>
											{item.name}
										</Text>

										{item.business_profile != null ?
											<Text style={{ marginTop: 10, fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_REGULAR, }}>
												{item.business_profile}
											</Text>
											: null}

									</TouchableOpacity>
								)
							}}
						/>
					</RBSheet>



				</ScrollView>
				{isLoading ? <LoadingView /> : null}
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
		marginTop: 5, flexDirection: 'row', borderWidth: 1, borderColor: Colors.primary, borderRadius: 10, backgroundColor: Colors.white,
		paddingVertical: 10//alignItems: 'center'
	},
	textInputMobile: {
		marginLeft: 10, marginRight: 10, flex: 1, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black, paddingVertical: 0
	},
	btnLogin: {
		backgroundColor: Colors.primary,
		marginTop: 30, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
		shadowColor: Colors.primary, marginBottom: 20,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
	},
	loginText: {
		fontSize: FontSize.FS_20, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default AddEvent;
