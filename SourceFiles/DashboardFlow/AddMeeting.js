//import liraries
import React, { Component, useLayoutEffect, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, FlatList, Platform, Modal, TextInput, Linking, Alert, PermissionsAndroid, Image, Keyboard, Switch, StatusBar } from 'react-native';


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


const AddMeeting = (props) => {


	const [isLoading, setIsLoading] = useState(false)
	// const [userData, setUserData] = useState(JSON.parse(props.route.params.userData))
	const [MeetingData, setMeetingData] = useState(props.route.params.meetingData || [])
	const [isEdit, setIsEdit] = useState(props.route.params.isEdit || false)

	const [txtMeetingTitle, setTxtMeetingTitle] = useState('')
	const [txtMeetingDesc, setTxtMeetingDesc] = useState('')
	const [txtMeetingLink, setTxtMeetingLink] = useState('')

	const [openDatePicker, setOpenDatePicker] = useState(false);
	const [StartDate, setStartDate] = useState(new Date())
	const [openEndDatePicker, setOpenEndDatePicker] = useState(false)
	const [EndDate, setEndDate] = useState(new Date())

	const [isPushNow, setIsPushNow] = useState(0);

	const [MeetingImg, setMeetingImg] = useState(null)
	const [visibleImg, setIsVisibleImg] = useState(false);


	useEffect(() => {

		if (isEdit) {
			console.log("Meeting Data : " + JSON.stringify(MeetingData))

			setTxtMeetingTitle(MeetingData.meeting_name)
			setTxtMeetingDesc(MeetingData.meeting_desc)
			setTxtMeetingLink(MeetingData.meeting_link != null ? MeetingData.meeting_link : '')
			setStartDate(new Date(MeetingData.meeting_start_date))
			setEndDate(new Date(MeetingData.meeting_end_date))
			// setIsPushNow(MeetingData.is_push == null ? 0 : MeetingData.is_push)

			if (MeetingData.meeting_image != null) {
				var data = {}
				data['data'] = null
				data['path'] = String(MeetingData.meeting_image_url)
				setMeetingImg(data)
			}

		}

	}, [])


	// Add Meeting
	const Api_AddMeeting = (isLoad) => {
		setIsLoading(isLoad)
		let body = new FormData();
		body.append('meeting_name', txtMeetingTitle)
		body.append('meeting_desc', txtMeetingDesc)
		body.append('meeting_start_date', moment(StartDate).format("DD-MM-YYYY"))
		body.append('meeting_end_date', moment(EndDate).format("DD-MM-YYYY"))
		body.append('meeting_link', txtMeetingLink)

		body.append('is_push', isPushNow)
		if (MeetingImg != null) {
			body.append('meeting_image',
				{
					uri: MeetingImg.path,
					name: Platform.OS == 'android' ? "image.jpeg" : MeetingImg.filename,
					type: MeetingImg.mime
				});
		}
		Webservice.post(APIURL.AddMeeting, body)
			.then(response => {
				setIsLoading(false)
				console.log(JSON.stringify("Api_AddMeeting Response : " + JSON.stringify(response)));

				if (response.data.status == true) {
					Alert.alert("Success", "Meeting Added Successfully", [
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


	// Edit Meeting
	const Api_EditMeeting = (isLoad) => {

		setIsLoading(isLoad)

		let body = new FormData();

		body.append('meeting_id', MeetingData.id)
		body.append('meeting_name', txtMeetingTitle)
		body.append('meeting_desc', txtMeetingDesc)
		body.append('meeting_start_date', moment(StartDate).format("DD-MM-YYYY"))
		body.append('meeting_end_date', moment(StartDate).format("DD-MM-YYYY"))
		body.append('meeting_link', txtMeetingLink)
		// body.append('is_push', isPushNow)
		if (MeetingImg != null && MeetingImg.data != null) {
			body.append('meeting_image',
				{
					uri: MeetingImg.path,
					name: Platform.OS == 'android' ? "image.jpeg" : MeetingImg.filename,
					type: MeetingImg.mime
				});
		}

		Webservice.post(APIURL.EditMeeting, body)
			.then(response => {
				setIsLoading(false)
				console.log(JSON.stringify("Api_EditMeeting Response : " + JSON.stringify(response)));
				if (response.data.status == true) {

					Alert.alert("Success", "Meeting Updated Successfully", [
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
			if (MeetingImg == null) {
				Toast.showWithGravity(i18n.t('select_event_image'), Toast.LONG, Toast.CENTER);
			}
			else if (txtMeetingTitle == '') {
				Toast.showWithGravity(i18n.t('enter_meeting_name'), Toast.LONG, Toast.CENTER);
			} else if (txtMeetingDesc == '') {
				Toast.showWithGravity(i18n.t('enter_event_desc'), Toast.LONG, Toast.CENTER);
			} else if (StartDate == null) {
				Toast.showWithGravity(i18n.t('enter_event_date'), Toast.LONG, Toast.CENTER);
			} else {

				if (isEdit) {
					Api_EditMeeting(true)
				}
				else {
					Api_AddMeeting(true)
				}
			}
		})
	}


	return (
		<SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'}/>

			<View style={styles.container}>

			<View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 10 }}>
						<TouchableOpacity onPress={() => { props.navigation.goBack() }}
							style={{ marginRight: 10, padding: 10 }}>
							<Icon name={"chevron-left"} size={18} color={Colors.black} />

						</TouchableOpacity>

						<Text style={{
							fontSize: FontSize.FS_18,
							color: Colors.black,
							fontFamily: ConstantKey.MONTS_SEMIBOLD,
						}}>
							{isEdit ? i18n.t("edit_meeting") : i18n.t("add_meeting")}
						</Text>

					</View>

				<ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
					
					<View style={{
						marginHorizontal: 20, marginVertical: 20, borderRadius: 6, borderWidth: 1, borderColor: Colors.black,
						height: 200
					}}>

						{/* <TouchableOpacity onPress={() => MeetingImg != null ? setIsVisibleImg(true) : {}}>
							<Image style={{ height: '100%', width: '100%', resizeMode: MeetingImg == null ? 'contain' : 'cover', borderRadius: 6, }}
								source={MeetingImg == null ? Images.MagnusLogo : { uri: MeetingImg.path }} />
						</TouchableOpacity> */}


						{MeetingImg == null ?
							<TouchableOpacity onPress={() => {
								btnSelectImage()
							}}
								style={{ flex: 1, alignSelf: "center", justifyContent: "center", alignItems: "center" }}>
								<MaterialCommunityIcons name={"cloud-upload-outline"} size={40} color={Colors.black} />
								<Text style={{
									fontSize: FontSize.FS_14,
									color: Colors.black,
									fontFamily: ConstantKey.MONTS_SEMIBOLD,
									textAlign: "center"
								}}>Upload Meeting photo</Text>
							</TouchableOpacity> :
							<TouchableOpacity onPress={() => MeetingImg != null ? setIsVisibleImg(true) : {}}>
								<Image style={{ height: '100%', width: '100%', resizeMode: MeetingImg == null ? 'contain' : 'cover', borderRadius: 6, }}
									source={MeetingImg == null ? Images.MagnusLogo : { uri: MeetingImg.path }} />
							</TouchableOpacity>
						}

						<View style={{ position: 'absolute', width: '100%' }}>

							<TouchableOpacity style={{
								alignSelf: 'flex-end', backgroundColor: Colors.black, padding: 10,
								borderBottomLeftRadius: 5, borderTopRightRadius: 5
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


						<Text style={{ fontSize: FontSize.FS_14, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Meeting Title
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

						<Text style={{ fontSize: FontSize.FS_14, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
						Meeting Description
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

						<Text style={{ fontSize: FontSize.FS_14, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Meeting start date
						</Text>
						<TouchableOpacity style={[styles.mobileView]} onPress={() => showDatePicker('Start Date')}>

							<Icon name={"calendar-alt"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />

							<Text style={[styles.textInputMobile]}>
								{moment(StartDate).format("DD-MM-YYYY")}
							</Text>

						</TouchableOpacity>

						<Text style={{ fontSize: FontSize.FS_14, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Meeting end date
						</Text>
						<TouchableOpacity style={[styles.mobileView,]} onPress={() => showDatePicker('End Date')}>

							<Icon name={"calendar-alt"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />

							<Text style={[styles.textInputMobile]}>
								{moment(EndDate).format("DD-MM-YYYY")}
							</Text>

						</TouchableOpacity>

						<Text style={{ fontSize: FontSize.FS_14, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Location Link <Text style={{ color: Colors.black }}>( Optional )</Text>
						</Text>

						<View style={styles.mobileView}>

							<Icon name={"link"} size={20} color={Colors.primary} style={{ marginLeft: 10, }} />

							<TextInput style={styles.textInputMobile}
								value={txtMeetingLink}
								placeholder={'Location link'}
								onChangeText={(link) => setTxtMeetingLink(link)}
							/>

						</View>



						{!isEdit  &&
							<View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>

								<TouchableOpacity onPress={() => setIsPushNow(isPushNow == 0 ? 1 : 0)}>
									<Icon name={isPushNow == 1 ? 'check-square' : 'square'} size={20} color={Colors.primary} />
								</TouchableOpacity>

								<Text style={{ fontFamily: ConstantKey.MONTS_REGULAR, color: Colors.black, fontSize: FontSize.FS_14, marginLeft: 10 }}>
									{i18n.t('push_now')}?
								</Text>

							</View>

						}
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
					<DateTimePickerModal
						isVisible={openEndDatePicker}
						date={EndDate}
						mode="date"
						minimumDate={StartDate}
						onConfirm={(date) => handleConfirm(date, 'End Date')}
						onCancel={() => hideDatePicker("End Date")}
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
			{isLoading ? <LoadingView /> : null}
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
		marginTop: 5, flexDirection: 'row', borderWidth: 1, borderColor: Colors.primary, borderRadius: 6, backgroundColor: Colors.white,
		paddingVertical: 10//alignItems: 'center'
	},
	textInputMobile: {
		marginLeft: 10, marginRight: 10, flex: 1, fontSize: FontSize.FS_14, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black, paddingVertical: 0
	},
	btnAddEdit: {
		backgroundColor: Colors.black,
		marginTop: 30, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',marginBottom: 20,
		// shadowColor: Colors.primary, 
		// shadowOffset: { width: 0, height: 2 },
		// shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
	},
	AddEditText: {
		fontSize: FontSize.FS_16, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default AddMeeting;
