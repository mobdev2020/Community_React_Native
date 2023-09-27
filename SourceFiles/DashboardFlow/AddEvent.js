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
import Navigation from '../Constants/Navigation';
import { navigate } from '../Constants/NavigationService';


// create a component
const AddEvent = (props) => {
	const refRBUsers = useRef();

	const [isLoading, setIsLoading] = useState(false)
	// const [userData, setUserData] = useState(JSON.parse(props.route.params.userData || null))
	const [EventData, setEventData] = useState(props.route.params.EventData || null)
	const [isEdit, setIsEdit] = useState(props.route.params.isEdit || false)

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

	useEffect(() => {

		// Api_GetContacts(true, userData)

		if (isEdit) {
			// console.log("Event Data : " + JSON.stringify(EventData))

			setTxtEventName(EventData.event_name)
			setTxtEventDesc(EventData.event_desc)
			setTxtEventLink(EventData.event_link != null ? EventData.event_link : '')
			setStartDate(new Date(EventData.event_start_date))
			setEndDate(new Date(EventData.event_end_date))
			setEventType(EventData.is_type)
			setIsPushNow(EventData.is_push)

			if (EventData.event_image_url != null) {
				var data = {}
				data['data'] = null
				data['path'] = String(EventData.event_image_url)
				setEventImg(data)
			}

		}

		return () => { }
	}, [])


	
	// Add Event
	const Api_AddEvent = (isLoad) => {
		setIsLoading(isLoad)
		let body = new FormData();
		body.append('event_name', txtEventName)
		body.append('event_desc', txtEventDesc)
		body.append('event_link', txtEventLink)
		body.append('event_start_date', moment(StartDate).format("DD-MM-YYYY"))
		body.append('event_end_date', moment(EndDate).format("DD-MM-YYYY"))
		body.append('is_push', isPushNow)
		// console.log("EventImg :",EventImg)
		if (EventImg != null) {
			body.append('event_image',
				{
					uri: EventImg.path,
					name: Platform.OS == 'android' ? "image.jpeg" : EventImg.filename,
					type: EventImg.mime
				});
		}


		Webservice.post(APIURL.AddEvents, body)
			.then(response => {

				setIsLoading(false)
				if (response == null) {
					setIsLoading(false)
				}
				// console.log(JSON.stringify("Api_AddEvent Response : " + JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.status == true) {

					Alert.alert("Success", "Event Added Successfully", [
						{
							text: 'Ok',
							onPress: () => {
								props.navigation.goBack()
							}
						}
					], { cancelable: false })
				} else {
					alert(response.data.Msg)
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}


	// Edit Event
	const Api_EditEvent = (isLoad) => {

		setIsLoading(isLoad)

		let body = new FormData();
		body.append('event_id', EventData.id)
		body.append('event_name', txtEventName)
		body.append('event_desc', txtEventDesc)
		body.append('event_link', txtEventLink)
		body.append('event_start_date', moment(StartDate).format("DD-MM-YYYY"))
		body.append('event_end_date', moment(EndDate).format("DD-MM-YYYY"))
		body.append('is_push', isPushNow)
		
		if (EventImg != null && EventImg.data != null) {
			body.append('event_image',
				{
					uri: EventImg.path,
					name: moment()+".png",
					type: EventImg.mime
				});
		}
		Webservice.post(APIURL.EditEvents, body)
			.then(response => {

				setIsLoading(false)
				if (response == null) {
					setIsLoading(false)
				}
				// console.log(JSON.stringify("Api_AddEvent Response : " + JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.status == true) {

					Alert.alert("Sucess", "Event Updated Sucessfully", [
						{
							text: 'Ok',
							onPress: () => {
								props.navigation.goBack()
							}
						}
					], { cancelable: false })
				} else {
					alert(response.data.Msg)
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}


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

							// console.log(images);

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

							// console.log(images);

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

			if (EventImg == null) {
				Toast.showWithGravity(i18n.t('select_event_image'), Toast.LONG, Toast.BOTTOM);
			}
			else if (txtEventName == '') {
				Toast.showWithGravity(i18n.t('enter_event_name'), Toast.LONG, Toast.BOTTOM);
			} else if (txtEventDesc == '') {
				Toast.showWithGravity(i18n.t('enter_event_desc'), Toast.LONG, Toast.BOTTOM);
			} else if (StartDate == null) {
				Toast.showWithGravity(i18n.t('enter_event_date'), Toast.LONG, Toast.BOTTOM);
			} else if (EndDate == null) {
				Toast.showWithGravity(i18n.t('enter_event_date'), Toast.LONG, Toast.BOTTOM);
			} else {

				if(isEdit){
					Api_EditEvent(true)
				}
				else{
					Api_AddEvent(true)
				}
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

	
	return (
		<SafeAreaView style={styles.container}>

			<View style={styles.container}>

				<ScrollView style={{ flex: 1, marginVertical: 10, }} keyboardShouldPersistTaps='always'>
					<View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 10 }}>
						<TouchableOpacity onPress={() => { props.navigation.goBack() }}
							style={{ marginRight: 10, marginBottom: 5, padding: 10 }}>
							<Icon name={"chevron-left"} size={18} color={Colors.black} />

						</TouchableOpacity>

						<Text style={{
							fontSize: FontSize.FS_22,
							color: Colors.black,
							fontFamily: ConstantKey.MONTS_SEMIBOLD,
						}}>
							{isEdit ? i18n.t("edit_event") : i18n.t("add_event")}
						</Text>

					</View>
					<View style={{
						marginHorizontal: 20, marginVertical: 20, borderRadius: 6, borderWidth: 1, borderColor: Colors.black,
						height: 200,
					}}>
						{EventImg == null ?
							<TouchableOpacity onPress={() => {
								btnSelectImage()
							}}
								style={{ flex: 1, alignSelf: "center", justifyContent: "center", alignItems: "center" }}>
								<MaterialCommunityIcons name={"cloud-upload-outline"} size={40} color={Colors.black} />
								<Text style={{
									fontSize: FontSize.FS_16,
									color: Colors.black,
									fontFamily: ConstantKey.MONTS_SEMIBOLD,
									textAlign: "center"
								}}>Upload Event photo</Text>
							</TouchableOpacity> :
							<TouchableOpacity onPress={() => EventImg != null ? setIsVisibleImg(true) : {}}>
								<Image style={{ height: '100%', width: '100%', resizeMode: EventImg == null ? 'contain' : 'cover', borderRadius: 6, }}
									source={{ uri:  EventImg.path }} />
							</TouchableOpacity>
						}

						<View style={{ position: 'absolute', width: '100%' }}>

							<TouchableOpacity style={{
								alignSelf: 'flex-end', backgroundColor: Colors.black, padding: 10,
								borderBottomLeftRadius: 5, borderTopRightRadius: 5
							}}
								onPress={() => btnSelectImage()}>

								<Icon name='upload' size={15} color={Colors.white} />
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ marginHorizontal: 20, }}>
						<Text style={{ fontSize: FontSize.FS_14, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
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

						<Text style={{ fontSize: FontSize.FS_14, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
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

						<Text style={{ fontSize: FontSize.FS_14, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Event start date
						</Text>
						<TouchableOpacity style={[styles.mobileView]} onPress={() => showDatePicker('Start Date')}>

							<Icon name={"calendar-alt"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />

							<Text style={[styles.textInputMobile]}>
								{moment(StartDate).format("DD-MM-YYYY")}
							</Text>

						</TouchableOpacity>


						<Text style={{ fontSize: FontSize.FS_14, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Event end date
						</Text>
						<TouchableOpacity style={[styles.mobileView]} onPress={() => showDatePicker('End Date')}>

							<Icon name={"calendar-alt"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />

							<Text style={[styles.textInputMobile]}>
								{moment(EndDate).format("DD-MM-YYYY")}
							</Text>

						</TouchableOpacity>


						<Text style={{ fontSize: FontSize.FS_14, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Event Link <Text style={{ color: Colors.black }}>( Optional )</Text>
						</Text>

						<View style={styles.mobileView}>

							<Icon name={"link"} size={20} color={Colors.primary} style={{ marginLeft: 10, }} />

							<TextInput style={styles.textInputMobile}
								value={txtEventLink}
								placeholder={'Event link'}
								onChangeText={(link) => setTxtEventLink(link)}
							/>

						</View>

						{!isEdit  &&
						<View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center',marginHorizontal:5 ,}}>

						<TouchableOpacity onPress={() => setIsPushNow(isPushNow == 0 ? 1 : 0)}>
							<Icon name={isPushNow == 1 ? 'check-square' : 'square'} size={25} color={Colors.primary} />
						</TouchableOpacity>

						<Text style={{ fontFamily: ConstantKey.MONTS_REGULAR, color: Colors.black, fontSize: FontSize.FS_16, marginLeft: 10 }}>
							{i18n.t('push_now')}?
						</Text>

					</View>
}

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
						minimumDate={StartDate}
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
		marginTop: 5, flexDirection: 'row',  borderRadius: 6, backgroundColor: Colors.lightGrey01,
		paddingVertical: 10//alignItems: 'center'
	},
	textInputMobile: {
		marginLeft: 10, marginRight: 10, flex: 1, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black, paddingVertical: 0
	},
	btnLogin: {
		backgroundColor: Colors.black,
		marginTop: 30, height: 45, borderRadius: 6, alignItems: 'center', justifyContent: 'center',
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
