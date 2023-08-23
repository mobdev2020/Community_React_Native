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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Third Party
import { StackActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ImageView from "react-native-image-viewing";
import RBSheet from "react-native-raw-bottom-sheet";
import { SearchBar } from 'react-native-elements';


const AddMeeting = ({ navigation }) => {


	const [isLoading, setIsLoading] = useState(false)
	// const [userData, setUserData] = useState(JSON.parse(props.route.params.userData))
	// const [MeetingData, setMeetingData] = useState(JSON.parse(props.route.params.meetingData))
	// const [isEdit, setIsEdit] = useState(props.route.params.isEdit)
	const [isEdit, setIsEdit] = useState(false)

	const [txtMeetingTitle, setTxtMeetingTitle] = useState('')
	const [txtMeetingDesc, setTxtMeetingDesc] = useState('')
	const [txtMeetingLink, setTxtMeetingLink] = useState('')

	const [openDatePicker, setOpenDatePicker] = useState(false);
	const [StartDate, setStartDate] = useState(new Date())

	const [isPushNow, setIsPushNow] = useState(0);

	const [MeetingImg, setMeetingImg] = useState(null)
	const [visibleImg, setIsVisibleImg] = useState(false);


	// Set Navigation Bar
	// useLayoutEffect(() => {
	// 	props.navigation.setOptions({
	// 		headerTitle: isEdit ? i18n.t('edit_meeting') : i18n.t('add_meeting'),
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



	// useEffect(() => {

	// 	if (isEdit) {
	// 		console.log("Meeting Data : " + JSON.stringify(MeetingData))

	// 		setTxtMeetingTitle(MeetingData.title)
	// 		setTxtMeetingDesc(MeetingData.description)
	// 		setTxtMeetingLink(MeetingData.location_link != null ? MeetingData.location_link : '')
	// 		setStartDate(new Date(MeetingData.meeting_date))
	// 		setIsPushNow(MeetingData.is_push == null ? 0 : MeetingData.is_push)

	// 		if (MeetingData.meeting_image != null) {
	// 			var data = {}
	// 			data['data'] = null
	// 			data['path'] = String(MeetingData.meeting_image)
	// 			setMeetingImg(data)
	// 		}

	// 	}

	// }, [])


	// // Add Meeting
	// const Api_AddMeeting = (isLoad) => {

	// 	setIsLoading(isLoad)

	// 	let body = new FormData();

	// 	body.append('title', txtMeetingTitle)
	// 	body.append('description', txtMeetingDesc)
	// 	body.append('meeting_date', moment(StartDate).format("DD-MM-YYYY"))
	// 	body.append('location_link', txtMeetingLink)
	// 	body.append('member_id', userData.id)

	// 	body.append('is_push', isPushNow)
	// 	if (MeetingImg != null) {
	// 		body.append('meeting_image',
	// 			{
	// 				uri: MeetingImg.path,
	// 				name: Platform.OS == 'android' ? "image.jpeg" : MeetingImg.filename,
	// 				type: MeetingImg.mime
	// 			});
	// 	}


	// 	Webservice.post(APIURL.addMeeting, body)
	// 		.then(response => {

	// 			setIsLoading(false)
	// 			if (response == null) {
	// 				setIsLoading(false)
	// 			}
	// 			console.log(JSON.stringify("Api_AddMeeting Response : " + JSON.stringify(response)));
	// 			// setIsLoading(false)

	// 			if (response.data.Status == '1') {

	// 				Alert.alert("Sucess", "Meeting Added Sucessfully", [
	// 					{
	// 						text: 'Ok',
	// 						onPress: () => {
	// 							// props.route.params.onGoBack();
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


	// // Edit Meeting
	// const Api_EditMeeting = (isLoad) => {

	// 	setIsLoading(isLoad)

	// 	let body = new FormData();

	// 	body.append('meeting_id', MeetingData.id)
	// 	body.append('title', txtMeetingTitle)
	// 	body.append('description', txtMeetingDesc)
	// 	body.append('meeting_date', moment(StartDate).format("DD-MM-YYYY"))
	// 	body.append('location_link', txtMeetingLink)
	// 	body.append('member_id', userData.id)

	// 	body.append('is_push', isPushNow)
	// 	if (MeetingImg != null && MeetingImg.data != null) {
	// 		body.append('meeting_image',
	// 			{
	// 				uri: MeetingImg.path,
	// 				name: Platform.OS == 'android' ? "image.jpeg" : MeetingImg.filename,
	// 				type: MeetingImg.mime
	// 			});
	// 	}


	// 	Webservice.post(APIURL.editMeeting, body)
	// 		.then(response => {

	// 			setIsLoading(false)
	// 			if (response == null) {
	// 				setIsLoading(false)
	// 			}
	// 			console.log(JSON.stringify("Api_EditMeeting Response : " + JSON.stringify(response)));
	// 			// setIsLoading(false)

	// 			if (response.data.Status == '1') {

	// 				Alert.alert("Sucess", "Meeting Updated Sucessfully", [
	// 					{
	// 						text: 'Ok',
	// 						onPress: () => {
	// 							// props.route.params.onGoBack();
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
							compressImageQuality: 0.9
						}).then(images => {

							console.log(images);

							setIsLoading(false)
							setMeetingImg(images)

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
							compressImageQuality: 0.9
						}).then(images => {

							console.log(images);

							setIsLoading(false)

							setMeetingImg(images)

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
			// setOpenEndDatePicker(true)
		}
	};


	const hideDatePicker = (type) => {

		if (type == 'Start Date') {
			setOpenDatePicker(false);
		}
		else {
			// setOpenEndDatePicker(false)
		}
	};


	// const handleConfirm = (date, type) => {
	// 	console.warn("A date has been picked: ", date);

	// 	setOpenDatePicker(false);
	// 	// setOpenEndDatePicker(false)

	// 	if(type == 'Start Date'){
	// 		setStartDate(date)
	// 	}else{
	// 		// setEndDate(date)
	// 	}

	// };


	// const btnAddEditTap = () => {
	// 	requestAnimationFrame(() => {


	// 		if(txtMeetingTitle == ''){
	// 			Toast.showWithGravity(i18n.t('enter_meeting_name'), Toast.LONG, Toast.BOTTOM);
	// 		}else if(txtMeetingDesc == ''){
	// 			Toast.showWithGravity(i18n.t('enter_event_desc'), Toast.LONG, Toast.BOTTOM);
	// 		}else if(StartDate == null){
	// 			Toast.showWithGravity(i18n.t('enter_event_date'), Toast.LONG, Toast.BOTTOM);
	// 		}else if(MeetingImg == null){
	// 			Toast.showWithGravity(i18n.t('select_event_image'), Toast.LONG, Toast.BOTTOM);
	// 		}else{

	// 			if(isEdit){
	// 				Api_EditMeeting(true)
	// 			}
	// 			else{
	// 				Api_AddMeeting(true)
	// 			}
	// 		}
	// 	})
	// }


	return (
		<SafeAreaView style={styles.container}>

			<View style={styles.container}>

				<ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
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
							{i18n.t('add_meeting')}
						</Text>

					</View>
					<View style={{
						marginHorizontal: 20, marginVertical: 20, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary,
						height: 200
					}}>

						{/* <TouchableOpacity onPress={() => MeetingImg != null ? setIsVisibleImg(true) : {}}>
							<Image style={{ height: '100%', width: '100%', resizeMode: MeetingImg == null ? 'contain' : 'cover', borderRadius: 10, }}
								source={MeetingImg == null ? Images.MagnusLogo : { uri: MeetingImg.path }} />
						</TouchableOpacity> */}


						{MeetingImg == null ?
							<TouchableOpacity onPress={() => {
								btnSelectImage()
							}}
								style={{ flex: 1, alignSelf: "center", justifyContent: "center", alignItems: "center" }}>
								<MaterialCommunityIcons name={"cloud-upload-outline"} size={40} color={Colors.primary} />
								<Text style={{
									fontSize: FontSize.FS_16,
									color: Colors.primary,
									fontFamily: ConstantKey.MONTS_SEMIBOLD,
									textAlign: "center"
								}}>Upload Meeting photo</Text>
							</TouchableOpacity> :
							<TouchableOpacity onPress={() => MeetingImg != null ? setIsVisibleImg(true) : {}}>
								<Image style={{ height: '100%', width: '100%', resizeMode: MeetingImg == null ? 'contain' : 'cover', borderRadius: 10, }}
									source={MeetingImg == null ? Images.MagnusLogo : { uri: MeetingImg.path }} />
							</TouchableOpacity>
						}

						<View style={{ position: 'absolute', width: '100%' }}>

							<TouchableOpacity style={{
								alignSelf: 'flex-end', backgroundColor: Colors.primary, padding: 10,
								borderBottomLeftRadius: 10, borderTopRightRadius: 10
							}}
								onPress={() => btnSelectImage()}>

								<Icon name='upload' size={15} color={Colors.white} />
								{/* <Text style={{color : Colors.white, fontFamily : ConstantKey.MONTS_REGULAR, fontSize : FontSize.FS_12}}>
								Upload
							</Text> */}
							</TouchableOpacity>
						</View>
					</View>


					<View style={{ marginHorizontal: 20, }}>


						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Title
						</Text>

						<View style={styles.mobileView}>

							<Icon name={"calendar-day"} size={20} color={Colors.primary} style={{ marginLeft: 10, }} />

							<TextInput style={styles.textInputMobile}
								value={txtMeetingTitle}
								placeholder={'Meeting title'}
								returnKeyType={'next'}
								onChangeText={(txtName) => setTxtMeetingTitle(txtName)}
							/>

						</View>

						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Description
						</Text>
						<View style={[styles.mobileView]}>

							{/* <Icon name={"info"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} /> */}

							<TextInput style={[styles.textInputMobile]}
								value={txtMeetingDesc}
								multiline
								placeholder={'Meeting description'}
								returnKeyType={'next'}
								onChangeText={(desc) => setTxtMeetingDesc(desc)}
							/>

						</View>

						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Meeting date
						</Text>
						<TouchableOpacity style={[styles.mobileView]} onPress={() => showDatePicker('Start Date')}>

							<Icon name={"calendar-alt"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />

							<Text style={[styles.textInputMobile]}>
								{moment(StartDate).format("DD-MM-YYYY")}
							</Text>

						</TouchableOpacity>



						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Location Link <Text style={{ color: Colors.primary }}>( Optional )</Text>
						</Text>

						<View style={styles.mobileView}>

							<Icon name={"link"} size={20} color={Colors.primary} style={{ marginLeft: 10, }} />

							<TextInput style={styles.textInputMobile}
								value={txtMeetingLink}
								placeholder={'Location link'}
								onChangeText={(link) => setTxtMeetingLink(link)}
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


						<TouchableOpacity style={styles.btnAddEdit}
							onPress={() => btnAddEditTap()}>
							<Text style={styles.AddEditText}>
								{isEdit ? i18n.t("edit_meeting") : i18n.t("add_meeting")}
							</Text>
						</TouchableOpacity>


					</View>


					<DateTimePickerModal
						isVisible={openDatePicker}
						date={StartDate}
						mode="date"
						minimumDate={new Date()}
						onConfirm={(date) => handleConfirm(date, 'Start Date')}
						onCancel={() => hideDatePicker("Start Date")}
						display={Platform.OS === "ios" ? "inline" : "default"}
					/>


					{MeetingImg != null ?
						<ImageView
							images={[{ uri: MeetingImg.path }]}
							imageIndex={0}
							visible={visibleImg}
							onRequestClose={() => setIsVisibleImg(false)}
						/> : null}

				</ScrollView>

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
	btnAddEdit: {
		backgroundColor: Colors.primary,
		marginTop: 30, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
		shadowColor: Colors.primary, marginBottom: 20,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
	},
	AddEditText: {
		fontSize: FontSize.FS_20, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default AddMeeting;
