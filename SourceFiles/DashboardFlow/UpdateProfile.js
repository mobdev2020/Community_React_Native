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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';


// create a component
const UpdateProfile = (props) => {

	const [isLoading, setIsLoading] = useState(false)
	const [userData, setUserData] = useState(JSON.parse(props.route.params.userData))

	// DOB
	const [openDatePicker, setOpenDatePicker] = useState(false);
	const [BirthDate, setBirthDate] = useState(null)

	const [isSheetUpdated, setisSheetUpdated] = useState(false)
	const [GainSheet, setGainSheet] = useState(null)

	const [isUpdateImage, setIsUpdateImage] = useState(false)
	const [ProfileImg, setProfileImg] = useState(null)

	
	// Set Navigation Bar
	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerTitle: i18n.t('update_profile'),
			headerTitleStyle: {
				fontFamily: ConstantKey.MONTS_SEMIBOLD
			},
			headerStyle: {
				backgroundColor: Colors.white,
			},
			headerTintColor: Colors.primaryRed,
			headerBackTitleVisible: false,
		});
	}, [props,]);



	useEffect(() => {
		
		console.log('====================================');
		console.log("User Data : "+JSON.stringify(userData));
		console.log('====================================');

		if(userData.birthdate != null){
			setBirthDate(new Date(userData.birthdate))
		}

		if(userData.gain_sheet != null){

			let filename = userData.gain_sheet.substring(userData.gain_sheet.lastIndexOf('/') + 1, userData.gain_sheet.length)

			var dict = {}
			dict['name'] = filename
			dict['uri'] = userData.gain_sheet

			setGainSheet(dict)
		}

		if(userData.profile_image != null){
			var data = {}
			data['data'] = null
			data['path'] = String(userData.profile_image)

			setProfileImg(data)

		}

		return () => {
			
		}
	}, [])


	// API Update Profile
	const Api_UpdateProfile = (isLoad) => {

		setIsLoading(isLoad)

		let body = new FormData();

		body.append('member_id', userData.id)
		body.append('birth_date', moment(BirthDate).format("DD-MM-YYYY"))
		if (isSheetUpdated) {
			body.append('gain_sheet',
				{
					uri: GainSheet.uri,
					name: GainSheet.name,
					type: GainSheet.type
				});
		}
		if(isUpdateImage){
			body.append('profile_image',
			{
				uri: ProfileImg.path,
				name: Platform.OS == 'android' ? "image.jpeg" : ProfileImg.filename,
				type: ProfileImg.mime
			});
		}

		Webservice.post(APIURL.updateProfile,body)
			.then(response => {

				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify(response));
				setIsLoading(false)

				if (response.data.Status == '1') {

					Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
					storeUserData(JSON.stringify(response.data.Data))

				} else {
					Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
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
			props.navigation.goBack()
		} catch (e) {
			// saving error
		}
	}


	// Date Picker Actions
	const showDatePicker = () => {
		setOpenDatePicker(true);
	};


	const hideDatePicker = (type) => {
		setOpenDatePicker(false);
	};


	const handleConfirm = (date) => {
		console.warn("A date has been picked: ", date);

		setOpenDatePicker(false);
		setBirthDate(date)
	};

	// Document Picker
	const selectOneFile = async () => {
		//Opening Document Picker for selection of one file
		try {
		  const res = await DocumentPicker.pick({
			type: [DocumentPicker.types.pdf],
			//There can me more options as well
			// DocumentPicker.types.allFiles
			// DocumentPicker.types.images
			// DocumentPicker.types.plainText
			// DocumentPicker.types.audio
			// DocumentPicker.types.pdf
		  });
		  //Printing the log realted to the file
		  console.log('res : ' + JSON.stringify(res));
		  console.log('URI : ' + res[0].uri);
		  console.log('Type : ' + res[0].type);
		  console.log('File Name : ' + res[0].name);
		  console.log('File Size : ' + res[0].size);
		  //Setting the state to show single file attributes
		  setGainSheet(res[0]);
		  setisSheetUpdated(true)

		} catch (err) {
		  //Handling any exception (If any)
		  if (DocumentPicker.isCancel(err)) {
			//If user canceled the document selection

			// alert('Canceled from single doc picker');
		  } else {
			//For Unknown Error
			
			// alert('Unknown Error: ' + JSON.stringify(err));
			throw err;
		  }
		}
	  };

	// Action Methods
	const btnUpdateTap = () => {
		requestAnimationFrame(() => {
			
			if(BirthDate == null){
				Toast.showWithGravity(i18n.t("please_select_birthdate"), Toast.LONG, Toast.BOTTOM);
			}else{
				Api_UpdateProfile(true)
			}
			
		})
	}


	const btnPickGainSheetTap = () => {
		requestAnimationFrame(() => {

			selectOneFile()
		})
	}


	// For Get Select Images
    const btnSelectImage = () => {

        Alert.alert(
            "",
            'Choose your Suitable Option',
            [
                {
                    text: 'Camera', onPress: () => {

                        setIsLoading(true)

                        ImagePicker.openCamera({
                            width: ConstantKey.SCREEN_WIDTH,
                            height: ConstantKey.SCREEN_WIDTH,
                            cropping: true,
                            multiple: false,
                            mediaType: 'photo',
							includeBase64 : true,
                            multipleShot: false,
                            compressImageQuality: 0.6
                          }).then(images => {

                            console.log(images);

							setIsUpdateImage(true)
							setIsLoading(false)
							setProfileImg(images)

                          }).catch((error) => {
                            
							setIsUpdateImage(false)
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
                            freeStyleCropEnabled : true,
                            cropping : true,
                            mediaType: 'photo',
							includeBase64 : true,
                            compressImageQuality: 0.6
                        }).then(images => {

                            console.log(images);

							setIsLoading(false)
							setIsUpdateImage(true)
							setProfileImg(images)

                        }).catch((error) => {
                            setIsUpdateImage(false)
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



	return (
		<SafeAreaView style={styles.container}>

			<View style={styles.container}>

				<ScrollView style={styles.container}>
					<View style={{ marginHorizontal: 20, }}>


					<View style={{marginLeft : 20, marginRight : 20, marginTop : 30, width : ConstantKey.SCREEN_WIDTH / 3, height : ConstantKey.SCREEN_WIDTH / 3, 
							borderWidth : 1, borderRadius : (ConstantKey.SCREEN_WIDTH / 3)/2, borderColor : Colors.primaryRed ,alignSelf : 'center' }}>

						<TouchableOpacity onPress={() => btnSelectImage()}>
							<Image style={{height : '100%', width : '100%',borderRadius : (ConstantKey.SCREEN_WIDTH / 3)/2, }}
								resizeMode={'cover'}
								source={ProfileImg == null ? Images.UserPlaceHolder : {uri : ProfileImg.path}}/>
						</TouchableOpacity>

					</View>


						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primaryRed, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Date of birth
						</Text>
						<TouchableOpacity style={[styles.mobileView]} onPress={() => showDatePicker()}>

							<Icon name={"calendar-alt"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }} />

							<Text style={BirthDate == null ? [styles.textInputMobile, { color: Colors.darkGrey }] : [styles.textInputMobile]}>
								{BirthDate == null ? i18n.t('select_birthdate') : moment(BirthDate).format("DD-MM-YYYY")}
							</Text>

						</TouchableOpacity>


						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primaryRed, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Gain Sheet <Text style={{color : Colors.darkGrey, fontSize : FontSize.FS_12}}>( upload PDF file )</Text>
						</Text>
						<TouchableOpacity style={[styles.mobileView]} onPress={() => btnPickGainSheetTap()}>

							<Icon name={"file-alt"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }} />

							<Text style={GainSheet == null ? [styles.textInputMobile, { color: Colors.darkGrey }] : [styles.textInputMobile]}
								numberOfLines={1}>
								{GainSheet == null ? i18n.t('gain_sheet') : GainSheet.name}
							</Text>

							<TouchableOpacity onPress={() => {
									if(GainSheet != null){
										
										props.navigation.navigate('ViewGainSheet',{url : GainSheet.uri})
									}
								}}>
									<Icon name={"eye"} size={20} color={Colors.darkGrey} style={{ marginRight: 10 }} />
							</TouchableOpacity>
						</TouchableOpacity>


						<TouchableOpacity style={styles.btnUpdate}
							onPress={() => btnUpdateTap()}>
							<Text style={styles.txtUpdate}>
								{i18n.t('update')}
							</Text>
						</TouchableOpacity>

					</View>
				</ScrollView>


				{isLoading ? <LoadingView/> : null}

				<DateTimePickerModal
						isVisible={openDatePicker}
						date={BirthDate == null ? new Date() : BirthDate}
						mode="date"
						maximumDate={new Date()}
						onConfirm={(date) => handleConfirm(date)}
						onCancel={hideDatePicker}
						display={Platform.OS === "ios" ? "inline" : "default"} 
					/>
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
		marginTop: 5, flexDirection: 'row', borderWidth: 1, borderColor: Colors.darkGrey, borderRadius: 10, backgroundColor: Colors.white,
		paddingVertical: 10//alignItems: 'center'
	},
	textInputMobile: {
		marginLeft: 10, marginRight: 10, flex: 1, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black, paddingVertical: 0
	},
	btnUpdate: {
		 backgroundColor: Colors.primaryRed,
		marginTop: 30,marginBottom : 30, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
		shadowColor: Colors.primaryRed,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
	},
	txtUpdate : {
		fontSize: FontSize.FS_18, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default UpdateProfile;
