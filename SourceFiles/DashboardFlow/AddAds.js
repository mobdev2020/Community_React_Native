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


const AddAds = ({ navigation }) => {


    const [isLoading, setIsLoading] = useState(false)
    // const [userData, setUserData] = useState(JSON.parse(props.route.params.userData))
    // const [MeetingData, setMeetingData] = useState(JSON.parse(props.route.params.meetingData))
    // const [isEdit, setIsEdit] = useState(props.route.params.isEdit)
    const [isEdit, setIsEdit] = useState(false)

    const [TxtTitle, setTxtTitle] = useState('')
    const [txtMeetingDesc, setTxtMeetingDesc] = useState('')
    const [txtMeetingLink, setTxtMeetingLink] = useState('')

    const [AdsImg, setAdsImg] = useState(null)
    const [visibleImg, setIsVisibleImg] = useState(false);


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
    // 			setAdsImg(data)
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
    // 	if (AdsImg != null) {
    // 		body.append('meeting_image',
    // 			{
    // 				uri: AdsImg.path,
    // 				name: Platform.OS == 'android' ? "image.jpeg" : AdsImg.filename,
    // 				type: AdsImg.mime
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
    // 	if (AdsImg != null && AdsImg.data != null) {
    // 		body.append('meeting_image',
    // 			{
    // 				uri: AdsImg.path,
    // 				name: Platform.OS == 'android' ? "image.jpeg" : AdsImg.filename,
    // 				type: AdsImg.mime
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
                            setAdsImg(images)

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

                            setAdsImg(images)

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


    // 		if(txtMeetingTitle == ''){
    // 			Toast.showWithGravity(i18n.t('enter_meeting_name'), Toast.LONG, Toast.BOTTOM);
    // 		}else if(txtMeetingDesc == ''){
    // 			Toast.showWithGravity(i18n.t('enter_event_desc'), Toast.LONG, Toast.BOTTOM);
    // 		}else if(StartDate == null){
    // 			Toast.showWithGravity(i18n.t('enter_event_date'), Toast.LONG, Toast.BOTTOM);
    // 		}else if(AdsImg == null){
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
                            {i18n.t('add_ads')}
                        </Text>

                    </View>
                    <View style={{
                        marginHorizontal: 20, marginVertical: 20, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary,
                        height: 200
                    }}>
                        {AdsImg == null ?
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
                                }}>Upload Ads photo</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={() => AdsImg != null ? setIsVisibleImg(true) : {}}>
                                <Image style={{ height: '100%', width: '100%', resizeMode: AdsImg == null ? 'contain' : 'cover', borderRadius: 10, }}
                                    source={AdsImg == null ? Images.MagnusLogo : { uri: AdsImg.path }} />
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
                        <Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 5 }}>
                            Title
                        </Text>
                        <View style={styles.mobileView}>

                            <Icon name={"heading"} size={20} color={Colors.primary} style={{ marginLeft: 10, }} />

                            <TextInput style={styles.textInputMobile}
                                value={TxtTitle}
                                placeholder={'Title'}
                                onChangeText={(link) => setTxtTitle(link)}
                            />

                        </View>
                        <Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 5 }}>
                            Link
                        </Text>

                        <View style={styles.mobileView}>

                            <Icon name={"link"} size={20} color={Colors.primary} style={{ marginLeft: 10, }} />

                            <TextInput style={styles.textInputMobile}
                                value={txtMeetingLink}
                                placeholder={'Ads link'}
                                onChangeText={(link) => setTxtMeetingLink(link)}
                            />

                        </View>
                        <TouchableOpacity style={styles.btnAddEdit}
                            onPress={() => btnAddEditTap()}>
                            <Text style={styles.AddEditText}>
                                {isEdit ? i18n.t("edit_meeting") : i18n.t("add_ads")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {AdsImg != null ?
                        <ImageView
                            images={[{ uri: AdsImg.path }]}
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
export default AddAds;
