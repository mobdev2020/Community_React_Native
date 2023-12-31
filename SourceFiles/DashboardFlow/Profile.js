//import liraries
import React, { Component, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, ScrollView, Alert, StatusBar } from 'react-native';


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
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { navigate } from '../Constants/NavigationService';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedSchool } from '../Redux/reducers/userReducer';
import { storeData } from '../commonComponents/AsyncManager';
import { FlatList } from 'react-native';
const Profile = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [FullName, setFullName] = useState('')
    const [PhoneNumber, setPhoneNumber] = useState("")
    const [SubCategory, setSubCategory] = useState('')
    const [BusinessPhone, setBusinessPhone] = useState('')
    const [Email, setEmail] = useState('')
    const [ProfileImg, setProfileImg] = useState(null)
    const [Address, setAddress] = useState('')
    const [UserData, setUserData] = useState(null);

    const [BusinessList, setBusinessList] = useState([])

	const selectedSchoolData = useSelector(state => state.userRedux.school_data)

    const dispatch = useDispatch()

    useFocusEffect(
        useCallback(() => {
            Api_Get_Profile(true)
            Api_Get_BusinessProfile(true)
            return () => {
            }
        }, [])
    );

    const Api_Get_Profile = (isLoad) => {
        setIsLoading(isLoad)
        Webservice.get(APIURL.GetProfile+"?school_user_id="+selectedSchoolData?.school_user_id)
            .then(response => {
                setIsLoading(false)
                // console.log(JSON.stringify("Api_Get_Profile Response : " + JSON.stringify(response)));
                if (response.data.status == true) {

                    var data = response.data.data

                console.log(JSON.stringify("Api_Get_Profile Response profile : " + JSON.stringify(data)));

                    var selected_school = data?.user?.school_data

					storeData(ConstantKey.SELECTED_SCHOOL_DATA,selected_school,() => {
						dispatch(setSelectedSchool(selected_school))
					})

                    
                    setUserData(response.data.data)
                    storeUserData(data)
                } else {
                    alert(response.data.message)
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.log(error)
            })
    }


    const Api_Get_BusinessProfile = (isLoad) => {
        setIsLoading(isLoad)
        Webservice.get(APIURL.listBusinessProfile)
            .then(response => {
                setIsLoading(false)
                if (response.data.status == true) {

                    var data = response.data?.data
                    console.log("Api_Get_BusinessProfile Response : " + JSON.stringify(data));

                    setBusinessList(data)

                } else {
                    alert(response.data.message)
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.log(error)
            })
    }
    		
		const Api_Delete_BusinessProfile = (isLoad, data) => {
			setIsLoading(isLoad)
			Webservice.post(APIURL.deleteBusinessProfile,{
				business_id : data?.id
			})
				.then(response => {
					console.log("Api_Delete_BusinessProfile",JSON.stringify(response));
					setIsLoading(false)
					if (response.data.status == true) {
						Toast.showWithGravity("Profile removed successfully", Toast.LONG, Toast.CENTER);
						Api_Get_BusinessProfile(true)
					} else {
						Toast.showWithGravity(response.data.message, Toast.LONG, Toast.CENTER);
					}
				})
				.catch((error) => {
					setIsLoading(false)
					console.log(error)
				})
		}


    const storeUserData = async (value) => {
        try {
            await AsyncStorage.setItem(ConstantKey.USER_DATA,JSON.stringify(value))
        } catch (e) {
            console.log("Error :", e)
        }
    }


    const DeletestoreData = async () => {
        try {
            await AsyncStorage.setItem(ConstantKey.USER_DATA, '')
            console.log("Login")
            navigation.replace("Login")
        } catch (e) {
            console.log("Error :", e)
        }
    }



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'}/>

        <View style={styles.container}>
            <View style={{ flex: 1, backgroundColor: Colors.white }}>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" , marginHorizontal : 10}}>
                            <View style={{ flexDirection: "row", alignItems: "center", }}>
                                <TouchableOpacity onPress={() => { navigation.goBack() }}
                                    style={{ marginRight: 10, padding: 10 }}>
                                    <Icon name={"chevron-left"} size={20} color={Colors.black} />

                                </TouchableOpacity>

                                <Text style={{
                                    fontSize: FontSize.FS_18,
                                    color: Colors.black,
                                    fontFamily: ConstantKey.MONTS_SEMIBOLD,
                                }}>
                                    {"My Profile"}
                                </Text>
                            </View>


                            <TouchableOpacity onPress={() => {
                                Alert.alert("Alert", "Are you sure you want to logout?", [
                                    {
                                        text: 'Cancel',
                                        style: "cancel",
                                        onPress: () => {
                                        }
                                    },
                                    {
                                        text: 'Logout',
                                        onPress: () => {
                                            DeletestoreData()
                                        }
                                    }
                                ], { cancelable: true })
                            }}
                                style={{ backgroundColor: Colors.primaryBlue, padding: 5, borderRadius: 25, marginHorizontal: 10 }}>
                                <MaterialCommunityIcons name={"power-standby"} size={18} color={Colors.white} />
                            </TouchableOpacity>


                        </View>
                <ScrollView style={{}}>
                        
                        {isLoading == false &&  <>
                        <View style={{ marginHorizontal: 20, marginTop: 10, marginBottom: 5 }}>
                            <Text style={{
                                fontSize: FontSize.FS_16,
                                color: Colors.black,
                                fontFamily: ConstantKey.MONTS_SEMIBOLD,

                            }}>
                                {i18n.t('PersonalProfile')}
                            </Text>
                        </View>
                       
                        <View style={{
                            borderRadius: 10,
                            marginTop : 10,
                            marginHorizontal: 20,
                            padding: 15,
                            backgroundColor : Colors.white,
                            shadowColor: "#000",
								shadowOffset: {
									width: 0,
									height: 2,
								},
								shadowOpacity: 0.20,
								shadowRadius: 4,
								elevation: 5,
                        }}>
                            <TouchableOpacity onPress={() => {
                                navigate("PersonalProfile")
                            }}
                                style={{
                                    backgroundColor: Colors.primary,
                                    alignSelf: "flex-end",
                                    paddingVertical: 2,
                                    paddingHorizontal: 20,
                                    borderRadius: 15,
                                }}>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    fontFamily: ConstantKey.MONTS_REGULAR,
                                    color: Colors.white
                                }}>{"Edit"}</Text>
                            </TouchableOpacity>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}  >
                                <View style={{
                                    backgroundColor: Colors.white, borderRadius: 6,height: 90, width: 90, alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Image style={{ height: 80, width: 80, borderRadius : 10 }}
                                        resizeMode='cover'
                                        source={{ uri: UserData?.user?.avatar_url }} />
                                </View>
                                <View style={{ flex: 1, marginLeft: 20, backgroundColor: Colors.white }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                                        <MaterialCommunityIcons name={"account"} size={18} color={Colors.black} style={{ marginRight: 10 }} />
                                        <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[styles.calloutTitle,{marginTop : 0}]}>{UserData?.user?.first_name + " " + UserData?.user?.last_name}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center",  marginTop: 5  }}>
                                        <MaterialCommunityIcons name={"phone"} size={18} color={Colors.darkGrey} style={{ marginRight: 10 }} />
                                        <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[styles.calloutDescription,{marginTop : 0}]}>+91 {UserData?.user?.phone}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" ,  marginTop: 5 }}>
                                        <MaterialCommunityIcons name={"email"} size={18} color={Colors.darkGrey} style={{ marginRight: 10 }} />
                                        <Text style={[styles.calloutDescription,{marginTop : 0}]}>{UserData?.user?.email}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                     
                        <View style={{ marginHorizontal: 20, marginTop: 20, marginBottom: 5, flexDirection : 'row', alignItems : 'center' }}>
                            <Text style={{
                                fontSize: FontSize.FS_16,
                                color: Colors.black,
                                flex : 1,
                                fontFamily: ConstantKey.MONTS_SEMIBOLD,
                            }}>
                                {i18n.t('BusinessProfile')}
                            </Text>

                            <TouchableOpacity onPress={() => {
                                navigate("AddBusinessProfile",{business_data : null})
                            }}
                                style={{
                                    borderColor: Colors.primary,
                                    borderWidth : 1,
                                    alignSelf: "flex-end",
                                    paddingVertical: 2,
                                    paddingHorizontal: 20,
                                    borderRadius: 15,
                                }}>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    fontFamily: ConstantKey.MONTS_REGULAR,
                                    color: Colors.primary
                                }}>{"Add Business"}</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList 
                            data={BusinessList}
                            scrollEnabled={false}
                            ListEmptyComponent={() => {return(
                                <View style={{
                                    borderRadius: 10,
                                    marginVertical : 10,
                                    marginHorizontal: 20,
                                    padding: 15,
                                    backgroundColor : Colors.white,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.20,
                                    shadowRadius: 4,
                                    elevation: 5,
                                    alignItems: "center"
    
                                }}>
                                    <Text style={{
                                        fontSize: FontSize.FS_14,
                                        color: Colors.black,
                                        fontFamily: ConstantKey.MONTS_MEDIUM,
                                        textAlign: "center"
                                    }}>
                                        {"Want To Join \n Business Community ?"}
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                        // navigate("BusinessProfile", { isFrom:"PROFILE" })
                                        navigate("AddBusinessProfile",{business_data : null})
                                    }}
                                        style={{
                                            borderRadius: 50,
                                            marginTop: 20,
                                            paddingVertical: 6,
                                            paddingHorizontal: 30,
                                            alignItems: "center",
                                            backgroundColor: Colors.black
                                        }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_14,
                                            color: Colors.white,
                                            fontFamily: ConstantKey.MONTS_MEDIUM,
                                            textAlign: "center"
                                        }}>
                                            {"Click Here"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}}
                            renderItem={({item, index}) => {
                                return(
                                    <View style={{
                                        borderRadius: 10,
                                        marginHorizontal: 20,
                                        padding: 15,
                                        marginVertical : 10,
                                        backgroundColor : Colors.white,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.20,
                                        shadowRadius: 4,
                                        elevation: 5,
                                    }}>

                                        <View style={{flexDirection : 'row', alignSelf : 'flex-end'}}>
                                        <TouchableOpacity onPress={() => {
                                            // navigate("BusinessProfile",{isFrom:"PROFILE"})
                                            navigate("AddBusinessProfile",{business_data : JSON.stringify(item)})
                                        }}
                                            style={{
                                                // backgroundColor: Colors.primary,
                                                alignSelf: "flex-end",
                                                paddingVertical: 2,
                                                paddingHorizontal: 10,
                                                borderRadius: 15,
                                            }}>
                                                <Icon name='edit' size={20} color={Colors.primary}/>
                                            {/* <Text style={{
                                                fontSize: FontSize.FS_12,
                                                fontFamily: ConstantKey.MONTS_REGULAR,
                                                color: Colors.white
                                            }}>{"Edit"}</Text> */}
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {
                                            Alert.alert("Alert", "Are you sure you want to delete this profile?", [
                                                {
                                                    text: 'Cancel',
                                                    style: "cancel",
                                                    onPress: () => {
                                                    }
                                                },
                                                {
                                                    text: 'Yes',
                                                    onPress: () => {
                                                        Api_Delete_BusinessProfile(true, item)
                                                    }
                                                }
                                            ], { cancelable: true })
                                        }}
                                            style={{
                                                // backgroundColor: Colors.primary,
                                                alignSelf: "flex-end",
                                                paddingVertical: 2,
                                                paddingHorizontal: 10,
                                                borderRadius: 15,
                                            }}>
                                                <Icon name='trash-alt' size={20} color={Colors.primaryRed}/>
                                            {/* <Text style={{
                                                fontSize: FontSize.FS_12,
                                                fontFamily: ConstantKey.MONTS_REGULAR,
                                                color: Colors.white
                                            }}>{"Edit"}</Text> */}
                                        </TouchableOpacity>
                                        </View>
                                        {/* {UserData?.user?.business ? <TouchableOpacity onPress={() => {
                                            navigate("BusinessProfile",{isFrom:"PROFILE"})
                                        }}
                                            style={{
                                                backgroundColor: Colors.primary,
                                                alignSelf: "flex-end",
                                                paddingVertical: 2,
                                                paddingHorizontal: 20,
                                                borderRadius: 15,
                                            }}>
                                            <Text style={{
                                                fontSize: FontSize.FS_12,
                                                fontFamily: ConstantKey.MONTS_REGULAR,
                                                color: Colors.white
                                            }}>{"Edit"}</Text>
                                        </TouchableOpacity> : null} */}
        
                                        <View style={{ flex: 1, backgroundColor: Colors.white }}>
                                            {item?.business_name && <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <MaterialCommunityIcons name={"domain"} size={18} color={Colors.black} style={{ marginRight: 10 }} />
                                                <Text style={[styles.calloutTitle, { marginTop: 0 }]}>{item?.business_name}</Text>
                                            </View>}
        
                                            {item?.category &&
                                                <View style={{ flexDirection: "row", alignItems: "center",  marginTop: 5  }}>
                                                    <MaterialCommunityIcons name={"tag"} size={18} color={Colors.darkGrey} style={{ marginRight: 10 }} />
                                                    <Text style={[styles.calloutDescription, { marginTop: 0 }]}>{item?.category?.name}</Text>
                                                </View>}
                                            {item?.subcategory_name &&
                                                <View style={{ flexDirection: "row", alignItems: "center",  marginTop: 5  }}>
                                                    <MaterialCommunityIcons name={"format-list-checkbox"} size={18} color={Colors.darkGrey} style={{ marginRight: 10 }} />
                                                    <Text style={[styles.calloutDescription, { marginTop: 0 }]}>{item?.subcategory_name}</Text>
                                                </View>}
                                            {item?.phone &&
                                                <View style={{ flexDirection: "row", alignItems: "center",  marginTop: 5 }}>
                                                    <MaterialCommunityIcons name={"phone"} size={18} color={Colors.darkGrey} style={{ marginRight: 10 }} />
                                                    <Text style={[styles.calloutDescription,{ marginTop: 0 }]}>+91 {item?.phone}</Text>
                                                </View>}
                                            {item?.email &&
                                                <View style={{ flexDirection: "row", alignItems: "center",  marginTop: 5 }}>
                                                    <MaterialCommunityIcons name={"email"} size={18} color={Colors.darkGrey} style={{ marginRight: 10 }} />
                                                    <Text style={[styles.calloutDescription,{ marginTop: 0 }]}>{item?.email}</Text>
                                                </View>}
                                            {item?.address &&
                                                <View style={{ flexDirection: "row", alignItems: "center",  marginTop: 5 }}>
                                                    <MaterialCommunityIcons name={"map-marker-outline"} size={18} color={Colors.darkGrey} style={{ marginRight: 10 }} />
                                                    <Text style={[styles.calloutDescription,{ marginTop: 0 }]}>{item?.address}</Text>
                                                </View>}
                                        </View>
                                        {/* </View> */}
                                    </View> 
                                )
                            }}
                        />
                            </> }
                </ScrollView>
            </View>

            {isLoading ?
                <LoadingView />
                : null}
        </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    calloutTitle: {
        fontSize: FontSize.FS_14,
        fontFamily: ConstantKey.MONTS_SEMIBOLD,
        color: Colors.black,
        flex:1
    },
    calloutDescription: {
        marginTop: 5,
        fontSize: FontSize.FS_12,
        fontFamily: ConstantKey.MONTS_REGULAR,
        color: Colors.darkGrey,
        flex:1

    },
});
export default Profile



// {UserData?.user?.is_business_profile == 1 ?
//     <View style={{
//         borderRadius: 10,
//         marginHorizontal: 20,
//         padding: 15,
//         marginVertical : 10,
//         backgroundColor : Colors.white,
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.20,
//         shadowRadius: 4,
//         elevation: 5,
//     }}>
//         {UserData?.user?.business ? <TouchableOpacity onPress={() => {
//             navigate("BusinessProfile",{isFrom:"PROFILE"})
//         }}
//             style={{
//                 backgroundColor: Colors.primary,
//                 alignSelf: "flex-end",
//                 paddingVertical: 2,
//                 paddingHorizontal: 20,
//                 borderRadius: 15,
//             }}>
//             <Text style={{
//                 fontSize: FontSize.FS_12,
//                 fontFamily: ConstantKey.MONTS_REGULAR,
//                 color: Colors.white
//             }}>{"Edit"}</Text>
//         </TouchableOpacity> : null}

//         <View style={{ flex: 1, backgroundColor: Colors.white }}>
//             {UserData?.user?.business?.business_name && <View style={{ flexDirection: "row", alignItems: "center" }}>
//                 <MaterialCommunityIcons name={"domain"} size={18} color={Colors.black} style={{ marginRight: 10 }} />
//                 <Text style={[styles.calloutTitle, { marginTop: 0 }]}>{UserData?.user?.business?.business_name}</Text>
//             </View>}

//             {UserData?.user?.business?.category &&
//                 <View style={{ flexDirection: "row", alignItems: "center",  marginTop: 5  }}>
//                     <MaterialCommunityIcons name={"tag"} size={18} color={Colors.darkGrey} style={{ marginRight: 10 }} />
//                     <Text style={[styles.calloutDescription, { marginTop: 0 }]}>{UserData?.user?.business?.category?.name}</Text>
//                 </View>}
//             {UserData?.user?.business?.subcategory_name &&
//                 <View style={{ flexDirection: "row", alignItems: "center",  marginTop: 5  }}>
//                     <MaterialCommunityIcons name={"format-list-checkbox"} size={18} color={Colors.darkGrey} style={{ marginRight: 10 }} />
//                     <Text style={[styles.calloutDescription, { marginTop: 0 }]}>{UserData?.user?.business?.subcategory_name}</Text>
//                 </View>}
//             {UserData?.user?.business?.phone &&
//                 <View style={{ flexDirection: "row", alignItems: "center",  marginTop: 5 }}>
//                     <MaterialCommunityIcons name={"phone"} size={18} color={Colors.darkGrey} style={{ marginRight: 10 }} />
//                     <Text style={[styles.calloutDescription,{ marginTop: 0 }]}>+91 {UserData?.user?.business?.phone}</Text>
//                 </View>}
//             {UserData?.user?.business?.email &&
//                 <View style={{ flexDirection: "row", alignItems: "center",  marginTop: 5 }}>
//                     <MaterialCommunityIcons name={"email"} size={18} color={Colors.darkGrey} style={{ marginRight: 10 }} />
//                     <Text style={[styles.calloutDescription,{ marginTop: 0 }]}>{UserData?.user?.business?.email}</Text>
//                 </View>}
//             {UserData?.user?.business?.address_line_one &&
//                 <View style={{ flexDirection: "row", alignItems: "center",  marginTop: 5 }}>
//                     <MaterialCommunityIcons name={"map-marker-outline"} size={18} color={Colors.darkGrey} style={{ marginRight: 10 }} />
//                     <Text style={[styles.calloutDescription,{ marginTop: 0 }]}>{UserData?.user?.business?.address_line_one}</Text>
//                 </View>}
//         </View>
//         {/* </View> */}
//     </View>
//     :
//     <View style={{
//         borderRadius: 10,
//         marginVertical : 10,
//         marginHorizontal: 20,
//         padding: 15,
//         backgroundColor : Colors.white,
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.20,
//         shadowRadius: 4,
//         elevation: 5,
//         alignItems: "center"

//     }}>
//         <Text style={{
//             fontSize: FontSize.FS_14,
//             color: Colors.black,
//             fontFamily: ConstantKey.MONTS_MEDIUM,
//             textAlign: "center"
//         }}>
//             {"Want To Join \n Business Community ?"}
//         </Text>
//         <TouchableOpacity onPress={() => {
//             navigate("BusinessProfile", { isFrom:"PROFILE" })
//         }}
//             style={{
//                 borderRadius: 50,
//                 marginTop: 20,
//                 paddingVertical: 6,
//                 paddingHorizontal: 30,
//                 alignItems: "center",
//                 backgroundColor: Colors.black
//             }}>
//             <Text style={{
//                 fontSize: FontSize.FS_14,
//                 color: Colors.white,
//                 fontFamily: ConstantKey.MONTS_MEDIUM,
//                 textAlign: "center"
//             }}>
//                 {"Click Here"}
//             </Text>
//         </TouchableOpacity>
//     </View>}