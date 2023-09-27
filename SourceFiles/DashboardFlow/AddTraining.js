//import liraries
import React, { Component, useLayoutEffect, useEffect, useState, useRef } from 'react';
import {
	View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions,
	TouchableOpacity, FlatList, Platform, Modal, TextInput, Linking, Alert, PermissionsAndroid, Image, Keyboard, Switch, ImageBackground
} from 'react-native';


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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import ImageView from "react-native-image-viewing";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


// create a component
const AddTraining = ({navigation}) => {


	const [isLoading, setIsLoading] = useState(false)
	// const [UserData, setUserData] = useState(JSON.parse(props.route.params.user_data))
	// const [TrainingData, setTrainingData] = useState(JSON.parse(props.route.params.training_data) || null)
	const [TrainingData, setTrainingData] = useState( null)

	const [IsVisibleImg, setIsVisibleImg] = useState(false)

	const [txtTitle, setTxtTitle] = useState('')
	const [txtDescription, setTxtDescription] = useState('')

	const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
	const [StartDate, setStartDate] = useState(new Date())

	const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
	const [EndDate, setEndDate] = useState(new Date())

	const [ImgTraining, setImgTraining] = useState(true)


	// Set Navigation Bar
	// useLayoutEffect(() => {
	// 	props.navigation.setOptions({
	// 		headerTitle: TrainingData == null ? i18n.t('add_training') : i18n.t('update_training'),
	// 		headerTitleStyle: {
	// 			fontFamily: ConstantKey.MONTS_SEMIBOLD
	// 		},
	// 		headerStyle: {
	// 			backgroundColor: Colors.white,
	// 		},
	// 		headerTintColor: Colors.primary,
	// 		headerBackTitleVisible: false,
	// 	});
	// }, [props, TrainingData]);



	// useEffect(() => {

	// 	console.log('====================================');
	// 	console.log("Training Data :" + JSON.stringify(UserData));
	// 	console.log('====================================');


	// 	if (TrainingData != null) {

	// 		setTxtTitle(TrainingData.title)
	// 		setTxtDescription(TrainingData.description)
	// 		setStartDate(new Date(TrainingData.start_date))
	// 		setEndDate(new Date(TrainingData.end_date))

	// 		if (TrainingData.training_image != null) {
	// 			var data = {}
	// 			data['data'] = null
	// 			data['path'] = String(TrainingData.training_image)
	// 			setImgTraining(data)
	// 		}

	// 	}

	// 	return () => {

	// 	}
	// }, [])


	// Add Training
	// const Api_AddTraining = (isLoad) => {

	// 	setIsLoading(isLoad)

	// 	let body = new FormData();

	// 	body.append('member_id', UserData.id)
	// 	body.append('title', txtTitle)
	// 	body.append('description', txtDescription)
	// 	body.append('start_date', moment(StartDate).format("DD-MM-YYYY"))
	// 	body.append('end_date', moment(EndDate).format("DD-MM-YYYY"))
		
	// 	if(TrainingData != null){
	// 		body.append('training_id', TrainingData.id)
	// 	}
	// 	if (ImgTraining != null && ImgTraining.path != TrainingData.training_image) {
	// 		body.append('training_image',
	// 			{
	// 				uri: ImgTraining.path,
	// 				name: Platform.OS == 'android' ? "image.jpeg" : ImgTraining.filename,
	// 				type: ImgTraining.mime
	// 			});
	// 	}


	// 	Webservice.post(APIURL.AddEditTraining, body)
	// 		.then(response => {

	// 			setIsLoading(false)
	// 			if (response == null) {
	// 				setIsLoading(false)
	// 			}
	// 			console.log(JSON.stringify("Api_AddTraining Response : " + JSON.stringify(response)));
	// 			// setIsLoading(false)

	// 			if (response.data.Status == '1') {

	// 				Alert.alert("Sucess", "Training Added Sucessfully", [
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


	// Edit Training
	// const Api_EditTraining = (isLoad) => {

	// 	setIsLoading(isLoad)

	// 	let body = new FormData();

	// 	body.append('member_id', UserData.id)
	// 	body.append('title', txtTitle)
	// 	body.append('description', txtDescription)
	// 	body.append('start_date', moment(StartDate).format("DD-MM-YYYY"))
	// 	body.append('end_date', moment(EndDate).format("DD-MM-YYYY"))
		
	// 	if(TrainingData != null){
	// 		body.append('training_id', TrainingData.id)
	// 	}
	// 	if (ImgTraining != null && ImgTraining.path != TrainingData.training_image) {
	// 		body.append('training_image',
	// 			{
	// 				uri: ImgTraining.path,
	// 				name: Platform.OS == 'android' ? "image.jpeg" : ImgTraining.filename,
	// 				type: ImgTraining.mime
	// 			});
	// 	}

	// 	Webservice.post(APIURL.AddEditTraining, body)
	// 		.then(response => {

	// 			setIsLoading(false)
	// 			if (response == null) {
	// 				setIsLoading(false)
	// 			}
	// 			console.log(JSON.stringify("Api_EditTraining Response : " + JSON.stringify(response)));
	// 			// setIsLoading(false)

	// 			if (response.data.Status == '1') {

	// 				Alert.alert("Sucess", "Training Updated Sucessfully", [
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



	// Date Picker Actions
	const showDatePicker = (type) => {

		if(type == 'Start Date'){
			
			setOpenStartDatePicker(true);
		}else{
			setOpenEndDatePicker(true)
		}
	};


	const hideDatePicker = (type) => {
		
		if(type == 'Start Date'){
			setOpenStartDatePicker(false);
		}
		else{
			setOpenEndDatePicker(false)
		}
	};


	// const handleConfirm = (date, type) => {
	// 	console.warn("A date has been picked: ", date);

	// 	setOpenStartDatePicker(false);
	// 	setOpenEndDatePicker(false)
	
	// 	if(type == 'Start Date'){
	// 		setStartDate(date)
	// 	}else{
	// 		setEndDate(date)
	// 	}
		
	
	// };


	function daysInMonth (month, year) {
		return new Date(year, month, 0).getDate();
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

							console.log(images);

							setIsLoading(false)
							setImgTraining(images)

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

							setImgTraining(images)

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


	// const btnAddEditTap = () => {
	// 	requestAnimationFrame(() => {

	// 		if(txtTitle == ''){
	// 			Toast.showWithGravity(i18n.t('enter_title'), Toast.LONG, Toast.BOTTOM);
	// 		}else if(txtDescription == ''){
	// 			Toast.showWithGravity(i18n.t('enter_event_desc'), Toast.LONG, Toast.BOTTOM);
	// 		}else if(StartDate == null){
	// 			Toast.showWithGravity(i18n.t('enter_event_date'), Toast.LONG, Toast.BOTTOM);
	// 		}else if(EndDate == null){
	// 			Toast.showWithGravity(i18n.t('enter_event_date'), Toast.LONG, Toast.BOTTOM);
	// 		}else if(ImgTraining == null){
	// 			Toast.showWithGravity(i18n.t('select_event_image'), Toast.LONG, Toast.BOTTOM);
	// 		}else{

	// 			if(TrainingData != null){
	// 				Api_EditTraining(true)
	// 			}
	// 			else{
	// 				Api_AddTraining(true)
	// 			}
	// 		}
	// 	})
	// }


	return (
		<SafeAreaView style={styles.container}>

			<View style={styles.container}>


				<ScrollView style={{ flex: 1 }}>
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
							{i18n.t('add_training')}
						</Text>

					</View>
					<View style={{
						marginHorizontal: 20, marginVertical: 20, borderRadius: 6, borderWidth: 1, borderColor: Colors.primary,
						height: 200,
					}}>

						{/* <TouchableOpacity onPress={() => TrainingData != null ? setIsVisibleImg(true) : {}}>
							<Image style={{ height: '100%', width: '100%', resizeMode: TrainingData == null ? 'contain' : 'cover', borderRadius: 6, }}
								source={TrainingData == null ? Images.MagnusLogo : { uri: ImgTraining.path }} />
						</TouchableOpacity> */}

						{TrainingData == null ?
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
                            }}>Upload Training photo</Text>
							</TouchableOpacity> :
							<TouchableOpacity onPress={() => TrainingData != null ? setIsVisibleImg(true) : {}}>
								<Image style={{ height: '100%', width: '100%', resizeMode: TrainingData == null ? 'contain' : 'cover', borderRadius: 6, }}
									source={TrainingData == null ? Images.MagnusLogo : { uri: EventImg.path }} />
							</TouchableOpacity>
						}
						<View style={{ position: 'absolute', width: '100%' }}>
							<TouchableOpacity style={{
								alignSelf: 'flex-end', backgroundColor: Colors.primary, padding: 10,
								borderBottomLeftRadius: 5, borderTopRightRadius: 5
							}}
								onPress={() => btnSelectImage()}>

								<Icon name='upload' size={15} color={Colors.white} />
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ marginHorizontal: 20, }}>

						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Title
						</Text>

						<View style={styles.mobileView}>

							<Icon name={"newspaper"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10, }} />

							<TextInput style={styles.textInputMobile}
								value={txtTitle}
								placeholder={'Title'}
								returnKeyType={'next'}
								onChangeText={(txtName) => setTxtTitle(txtName)}
							/>

						</View>

						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Description
						</Text>
						<View style={[styles.mobileView]}>

							{/* <Icon name={"info"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }} /> */}

							<TextInput style={[styles.textInputMobile]}
								value={txtDescription}
								multiline
								placeholder={'Description'}
								returnKeyType={'next'}
								onChangeText={(desc) => setTxtDescription(desc)}
							/>

						</View>

						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Start date
						</Text>
						<TouchableOpacity style={[styles.mobileView]} onPress={() => showDatePicker('Start Date')}>

							<Icon name={"calendar-alt"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }} />

							<Text style={[styles.textInputMobile]}>
								{moment(StartDate).format("DD-MM-YYYY")}
							</Text>

						</TouchableOpacity>


						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							End date
						</Text>
						<TouchableOpacity style={[styles.mobileView]} onPress={() => showDatePicker('End Date')}>

							<Icon name={"calendar-alt"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }} />

							<Text style={[styles.textInputMobile]}>
								{moment(EndDate).format("DD-MM-YYYY")}
							</Text>

						</TouchableOpacity>

						<TouchableOpacity style={styles.btnSubmit}
							onPress={() => btnAddEditTap()}>
							<Text style={styles.submitText}>
								{TrainingData != null ? i18n.t("update_training") : i18n.t("add_training")}
							</Text>
						</TouchableOpacity>
						
					</View>

					<DateTimePickerModal
						isVisible={openStartDatePicker}
						date={StartDate}
						mode="date"
						minimumDate={new Date(new Date().getFullYear(),new Date().getMonth(), 1)}
						maximumDate={new Date(new Date().getFullYear(),
							new Date().getMonth(), daysInMonth(new Date().getMonth()+1,
							new Date().getFullYear()))}
						onConfirm={(date) => handleConfirm(date, 'Start Date')}
						onCancel={hideDatePicker}
						display={Platform.OS === "ios" ? "inline" : "default"} 
					/>

					<DateTimePickerModal
						isVisible={openEndDatePicker}
						date={EndDate}
						mode="date"
						minimumDate={moment(new Date()).startOf('month').format('YYYY-MM-DD hh:mm')}
						maximumDate={moment(new Date()).endOf('month').format('YYYY-MM-DD hh:mm')}
						onConfirm={(date) => handleConfirm(date, 'End Date')}
						onCancel={hideDatePicker}
						display={Platform.OS === "ios" ? "inline" : "default"} 
					/>


					{ImgTraining != null ?
						<ImageView
							images={[{ uri: ImgTraining.path }]}
							imageIndex={0}
							visible={IsVisibleImg}
							onRequestClose={() => setIsVisibleImg(false)}
						/>

						: null}


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
		marginTop: 5, flexDirection: 'row', borderWidth: 1, borderColor: Colors.darkGrey, borderRadius: 6, backgroundColor: Colors.white,
		paddingVertical : 10//alignItems: 'center'
	},
	textInputMobile: {
		marginLeft: 10, marginRight: 10, flex: 1, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black,  paddingVertical: 0
	},
	btnSubmit: {
		backgroundColor: Colors.primary,
		marginTop: 30, height: 45, borderRadius: 6, alignItems: 'center', justifyContent: 'center',
		shadowColor: Colors.primary, marginBottom : 20,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
	},
	submitText: {
		fontSize: FontSize.FS_20, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default AddTraining;
