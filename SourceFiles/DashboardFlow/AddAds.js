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


const AddAds = (props) => {


    const [isLoading, setIsLoading] = useState(false)
    // const [userData, setUserData] = useState(JSON.parse(props.route.params.userData))
    const [AdsData, setAdsData] = useState(props.route.params.AdsData || null)
    const [isEdit, setIsEdit] = useState(props.route.params.isEdit)
    // const [isEdit, setIsEdit] = useState(false)

    const [TxtTitle, setTxtTitle] = useState('')
    const [txtMeetingDesc, setTxtMeetingDesc] = useState('')
    const [txtMeetingLink, setTxtMeetingLink] = useState('')

    const [AdsImg, setAdsImg] = useState(null)
    const [visibleImg, setIsVisibleImg] = useState(false);


    useEffect(() => {
        if (isEdit) {
            // console.log("Ads Data : " + JSON.stringify(AdsData))

            setTxtTitle(AdsData.advertise_name)
            setTxtMeetingLink(AdsData.url != null ? AdsData.url : '')

            if (AdsData.image_url != null) {
                var data = {}
                data['data'] = null
                data['path'] = String(AdsData.image_url)
                setAdsImg(data)
            }

        }

    }, [])


    // Add Ads
    const Api_AddAds = (isLoad) => {
        setIsLoading(isLoad)

        let body = new FormData();

        body.append('advertise_name', TxtTitle)
        body.append('url', txtMeetingLink)

        if (AdsImg != null) {
            body.append('image',
                {
                    uri: AdsImg.path,
                    name: Platform.OS == 'android' ? "image.jpeg" : AdsImg.filename,
                    type: AdsImg.mime
                });
        }


        Webservice.post(APIURL.AddAds, body)
            .then(response => {
                setIsLoading(false)
                // console.log(JSON.stringify("Api_AddAds Response : " + JSON.stringify(response)));

                if (response.data.status == true) {
                    Alert.alert("Success", "Advertise Added Successfully", [
                        {
                            text: 'Ok',
                            onPress: () => {
                                // props.route.params.onGoBack();
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
    const Api_Edit_Ads = (isLoad) => {
        setIsLoading(isLoad)
        let body = new FormData();

        body.append('advertise_id', AdsData.id)
        body.append('advertise_name', TxtTitle)
        body.append('url', txtMeetingLink)

        if (AdsImg != null && AdsImg.data != null) {
            body.append('image',
                {
                    uri: AdsImg.path,
                    name: Platform.OS == 'android' ? "image.jpeg" : AdsImg.filename,
                    type: AdsImg.mime
                });
        }


        Webservice.post(APIURL.EditAds, body)
            .then(response => {
                setIsLoading(false)
                // console.log(JSON.stringify("Api_Edit_Ads Response : " + JSON.stringify(response)));

                if (response.data.status == true) {

                    Alert.alert("Success", "Advertise Updated Sucessfully", [
                        {
                            text: 'Ok',
                            onPress: () => {
                                // props.route.params.onGoBack();
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

    const btnAddEditTap = () => {
        requestAnimationFrame(() => {


            if (AdsImg == null) {
                Toast.showWithGravity("Please upload Advertise image", Toast.LONG, Toast.BOTTOM);
            }
            else if (TxtTitle == "") {
                Toast.showWithGravity(('Please enter Advertise title'), Toast.LONG, Toast.BOTTOM);
            } else if (txtMeetingLink == "") {
                Toast.showWithGravity("Please enter Advertise link", Toast.LONG, Toast.BOTTOM);
            } else {

                if (isEdit) {
                    Api_Edit_Ads(true)
                }
                else {
                    Api_AddAds(true)
                }
            }
        })
    }


    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.container}>

                <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
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
                              {isEdit ? "Edit" : i18n.t("add_ads")}
                        </Text>

                    </View>
                    <View style={{
                        marginHorizontal: 20, marginVertical: 20, borderRadius: 6, borderWidth: 1, borderColor: Colors.black,
                        height: 200
                    }}>
                        {AdsImg == null ?
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
                                }}>Upload Ads photo</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={() => AdsImg != null ? setIsVisibleImg(true) : {}}>
                                <Image style={{ height: '100%', width: '100%', resizeMode: AdsImg == null ? 'contain' : 'cover', borderRadius: 6, }}
                                    source={AdsImg == null ? Images.MagnusLogo : { uri: AdsImg.path }} />
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
                        <Text style={{ fontSize: FontSize.FS_14, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 5 }}>
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
                        <Text style={{ fontSize: FontSize.FS_14, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 5 }}>
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
                                {isEdit ? "Save Ads" : i18n.t("add_ads")}
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
            {isLoading ?
                <LoadingView />
                : null}
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
        marginLeft: 10, marginRight: 10, flex: 1, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
        color: Colors.black, paddingVertical: 0
    },
    btnAddEdit: {
        backgroundColor: Colors.black,
        marginTop: 30, height: 45, borderRadius: 6, alignItems: 'center', justifyContent: 'center',
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
