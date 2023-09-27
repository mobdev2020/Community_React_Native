import React, { Component, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, ScrollView, Alert, FlatList, Modal } from 'react-native';


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
import RBSheet from 'react-native-raw-bottom-sheet';


let SearchEnable = false;

const SearchScreen = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false)
    // const [SearchEnablenable, setSearchEnablenable] = useState(false)
    const [SearchText, setSearchText] = useState('')
    const [BusinessData, setBusinessData] = useState([])
    const [CurrentPage, setCurrentPage] = useState(1)
    const [HidePagination, setHidePagination] = useState(false)
    const [CategoryData, setCategoryData] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [clear, setClear] = useState(false);
    const [SelectedBusinessData, setSelectedBusinessData] = useState([])

    const refRBSheet = useRef();


    useEffect(() => {
        console.log("route.params.isSearch ::", route.params.isSearch)

        if (route.params.isSearch == false) {
            setSelectedBusinessData(route.params.category)
            setSearchText(route.params.category?.name)
            Api_Get_Business(true, route.params.category)
            Api_Get_Category(true)

        }
        if (route.params.isSearch == true) {
            SearchButton((callback) => {
                if (callback == true && SearchEnable == true) {
                    setSelectedBusinessData([]);
                    Api_Get_Business(true);
                    Api_Get_Category(true)

                }
            }).catch((error) => {
                console.error(error);
            });
        }
        return () => {
            setSearchText("")
            setSelectedBusinessData([]);
            setBusinessData([])
            SearchEnable = false

        }
    }, [])

    useEffect(() => {
        console.log("B")
        if (SearchText == "" && clear == true) {
            console.log("A")

            SearchButton((callback) => {
                if (callback == true && SearchEnable == true) {
                    setSelectedBusinessData([]);
                    Api_Get_Business(true);
                    Api_Get_Category(true)

                }
            })
        }

    }, [SearchText])

    const Api_Get_Business = (isLoad, item) => {
        setIsLoading(isLoad)
        let body = new FormData();
        if (!SearchEnable && item?.id) {
            body.append('category_id', item?.id ? item?.id : null)
        }
        else if (SearchEnable && SearchText !== "") {
            body.append('keyword', SearchText.toLowerCase())
        }
        else {

        }
        body.append('page', CurrentPage)

        console.log("Final Body :", body)

        Webservice.post(APIURL.GetBusiness, body)
            .then(response => {
                setIsLoading(false)
                console.log("Api_Get_Business Response : " + JSON.stringify(response.data.data));
                if (response.data.status == true) {

                    var data = response.data.data?.data
                    if (CurrentPage > 1) {
                        const unique = [...new Map(data.map(m => [m.id, m])).values()];
                        console.log("unique", unique.length)
                        console.log("BusinessData", BusinessData.length)
                        const NewBusinessData = [...BusinessData, ...unique];
                        console.log("NewBusinessData", NewBusinessData.length)
                        setBusinessData(NewBusinessData);

                    }
                    else {
                        console.log("BusinessData", data.length)
                        setBusinessData(data);

                    }

                    setIsLoading(false);
                    console.log("response.data.data.next_page_url", response.data.data.next_page_url)

                    if (response.data.data.next_page_url == null) {
                        setHidePagination(true)
                    } else {
                        setHidePagination(false)
                        setCurrentPage(CurrentPage + 1)
                    }



                } else {
                    console.log("Buis", BusinessData.length)
                    setBusinessData([])
                    setHidePagination(true)
                    setIsLoading(false)
                    console.log(response.data.message)
                    // alert(response.data.message)
                }
            })
            .catch((error) => {
                setIsLoading(false)
                setHidePagination(true)
                console.log(error)
            })
    }
    const Api_Get_Category = (isLoad) => {
        setIsLoading(isLoad)
        Webservice.get(APIURL.GetCategory, {
            mobile_number: 9016089923
        })
            .then(response => {
                // console.log("Get Category Response : ", response.data)

                if (response.data.status == true) {
                    setCategoryData(response.data.data)
                    setIsLoading(false)
                } else {
                    Toast.showWithGravity(response.data.message, Toast.LONG, Toast.BOTTOM);
                    setIsLoading(false)
                }
            })
            .catch((error) => {

                setIsLoading(false)
                console.log(error)
            })
    }

    const SearchButton = async (callback) => {
        SearchEnable = true
        if (callback) {
            callback(true);
        }
    }

    const handleBlur = (txt) => {
        // Check if the TextInput value has become blank and it was not blank before
        console.log("BLur Call ::::", txt)
        if (txt === true) {
            SearchButton((callback) => {
                if (callback == true && SearchEnable == true) {
                    setSelectedBusinessData([]);
                    Api_Get_Business(true);
                    Api_Get_Category(true)

                }
            })
        }
    };
    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.container}>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between",marginHorizontal : 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", }}>
                            <TouchableOpacity onPress={() => { navigation.goBack() }}
                                style={{ marginRight: 10, padding: 10 }}>
                                <Icon name={"chevron-left"} size={18} color={Colors.black} />

                            </TouchableOpacity>

                            <Text style={{
                                fontSize: FontSize.FS_18,
                                color: Colors.black,
                                fontFamily: ConstantKey.MONTS_SEMIBOLD,
                            }}>
                                {i18n.t('Search')}
                            </Text>
                        </View>

                        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                            SearchEnable = false
                            setCurrentPage(1)
                            refRBSheet.current.open()
                        }}>
                            <MaterialCommunityIcons name={"filter-outline"} size={28} color={Colors.primary} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                    </View>

            <ScrollView >
                   
                    <View style={{ marginHorizontal: 20 }}>

                        <View style={styles.mobileView}>
                            <MaterialCommunityIcons name={"magnify"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />
                            <TextInput style={styles.textInputMobile}
                                value={SearchText}
                                placeholder={i18n.t('searchHere')}
                                returnKeyType={'done'}
                                // onBlur={()=>handleBlur()}
                                onChangeText={(txtname) => {
                                    {
                                        setSearchText(txtname)
                                        setCurrentPage(1)
                                        console.log("txtname", txtname.length)
                                        if (txtname.length == 0) {
                                            console.log("if")
                                            setSearchText("")
                                            setClear(true)
                                            // handleBlur(true)
                                        }
                                        // if (txtname.length == 0) {
                                        //     console.log("txtname blank")
                                        //     SearchButton((callback) => {
                                        //         if (callback == true && SearchEnable == true) {
                                        //             setSelectedBusinessData([]);
                                        //             Api_Get_Business(true);
                                        //             Api_Get_Category(true)

                                        //         }
                                        //     })
                                        // }
                                        // else {


                                        // }
                                    }
                                }}

                            // autoFocus={route.params.isSearch == true ? true : false}
                            />
                            {/* <TouchableOpacity  onPress={() => refRBSheet.current.open()}>
                                <MaterialCommunityIcons name={"filter-outline"} size={20} color={Colors.primary} style={{ marginRight: 10 }} />
                            </TouchableOpacity> */}
                            {SearchText.length > 0 && <TouchableOpacity onPress={() => {
                                setSelectedBusinessData([]);
                                setClear(true)
                                setSearchText("")
                                // Api_Get_Business(true);
                                // Api_Get_Category(true)

                            }}>
                                <MaterialCommunityIcons name={"close"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />
                            </TouchableOpacity>}
                            <TouchableOpacity onPress={() => {
                                if (SearchText.length > 0) {
                                    SearchButton((callback) => {
                                        if (callback == true && SearchEnable == true) {
                                            // setSelectedBusinessData([])
                                            Api_Get_Business(true)
                                        }
                                    })
                                }



                            }}
                                style={{ backgroundColor: SearchText.length > 0 ? Colors.primary : Colors.lightGrey, padding: 8, marginHorizontal: 5, borderRadius: 6 }} >
                                <Text style={{
                                    fontSize: FontSize.FS_14,
                                    color: Colors.white,
                                    fontFamily: ConstantKey.MONTS_MEDIUM,
                                }}>
                                    {i18n.t('Search')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <FlatList
                        style={{ marginTop: 10 }}
                        data={BusinessData}
                        // ListFooterComponent={<View style={{ height: 40 }}></View>}
                        ListEmptyComponent={
                            (!isLoading && BusinessData.length <= 0) &&
                            <View style={{ justifyContent: "center", alignItems: "center", padding: 10, alignSelf: "center", borderRadius: 6, marginTop: 100 }}>
                                <Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, }}>{"No Data Found"}</Text>

                            </View>}
                        ListFooterComponent=
                        {

                            HidePagination == false && !isLoading && BusinessData.length >= 0 ?
                                <TouchableOpacity onPress={() => {
                                    Api_Get_Business(true)
                                }}
                                    style={{ marginVertical: 25, alignSelf: "center" }}>
                                    <Text style={{ fontSize: FontSize.FS_18, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM }}>{"See More"}</Text>

                                </TouchableOpacity> : <View style={{ height: 20 }}></View>

                        }
                        renderItem={({ item, index }) => (
                            <View key={item.business_name} style={{
                                borderRadius: 10,
                                backgroundColor : Colors.white,
                                marginHorizontal: 20,
                                marginTop: 20,
                                padding: 12,
                                shadowColor: "#000",
								shadowOffset: {
									width: 0,
									height: 2,
								},
								shadowOpacity: 0.20,
								shadowRadius: 4,
								elevation: 5,
                            }}>

                                <View style={{ flex: 1, backgroundColor: Colors.white }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        {/* <MaterialCommunityIcons name={"domain"} size={18} color={Colors.primary} style={{ marginRight: 5 }} /> */}
                                        <Text style={[styles.calloutTitle, { marginTop: 4 }]}>{item?.business_name}</Text>
                                    </View>
                                    <View style={{ flexDirection: "column", alignItems: "center" , marginTop : 5}}>
                                        {/* <MaterialCommunityIcons name={"domain"} size={18} color={Colors.primary} style={{ marginRight: 5 }} /> */}
                                        <View style={{ flexDirection: "row", alignItems: "center" , flex : 1}}>
                                            <Text style={[styles.calloutSubTitle, { marginTop: 4 }]}>{"Category : "}</Text>
                                            <Text style={[styles.calloutDescription, { marginTop: 4, flex : 1 }]}>{item?.category?.name}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center", flex:1 }}>
                                            <Text style={[styles.calloutSubTitle, { marginTop: 4 }]}>{"Sub Category : "}</Text>
                                            <Text style={[styles.calloutDescription, { marginTop: 4,flex : 1 }]}>{item?.subcategory_name}</Text>
                                        </View>

                                    </View>
                                   
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop : 10 }}>
                                        <MaterialCommunityIcons name={"phone"} size={18} color={Colors.black} style={{ marginRight: 5 }} />
                                        <Text style={[styles.calloutDescription,{marginTop : 0}]}>{item?.phone}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" ,marginTop : 10}}>
                                        <MaterialCommunityIcons name={"email"} size={18} color={Colors.black} style={{ marginRight: 5 }} />
                                        <Text style={[styles.calloutDescription,{marginTop : 0}]}>{item?.email}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" ,marginTop : 10}}>
                                        {/* <MaterialCommunityIcons name={"map-marker-outline"} size={18} color={Colors.black} style={{ marginRight: 5 }} /> */}
                                        <Text style={[styles.calloutDescription,{marginTop : 0}]}>{item?.address}</Text>
                                    </View>
                                </View>
                            </View>

                        )}
                    />


                <RBSheet
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
                    <ScrollView >
                        <Text style={{
                            fontSize: FontSize.FS_20,
                            color: Colors.black,
                            fontFamily: ConstantKey.MONTS_MEDIUM,
                            marginHorizontal: 20
                        }}>
                            {"Filter Business Category"}
                        </Text>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            style={{ marginTop: 10 }}
                            data={CategoryData}
                            ItemSeparatorComponent={<View style={{ width: 20, }}></View>}
                            renderItem={({ item, index }) => (
                                // <View style={{ alignItems: "center" }}>
                                <TouchableOpacity onPress={() => {
                                    refRBSheet.current.close()
                                    setSelectedBusinessData(item)
                                    setSearchText(item?.name)
                                    Api_Get_Business(true, item)
                                }}
                                    style={{
                                        padding: 15,
                                        alignItems: "center",
                                        flexDirection: "row",
                                        justifyContent: "space-between"
                                    }}>

                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                                    </View>
                                    <View style={{}}>
                                        {SelectedBusinessData.id == item.id ?
                                            <MaterialCommunityIcons name={"check"} size={18} color={Colors.primary} /> : null}
                                    </View>
                                </TouchableOpacity>

                                // </View>

                            )}
                        />
                    </ScrollView>
                </RBSheet>
            </ScrollView>
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
        justifyContent: "center",

    },
    mobileView: {
        marginTop: 10, flexDirection: 'row', backgroundColor: Colors.lightGrey01, borderRadius: 6,
        height: 50, alignItems: 'center', borderWidth: 1, borderColor: Colors.primary
    },
    textInputMobile: {
        marginLeft: 10, marginRight: 10, height: 50, flex: 1, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
        color: Colors.black,
    },
    btnLogin: {
        backgroundColor: Colors.primary,
        marginTop: 48, height: 45, borderRadius: 6, alignItems: 'center', justifyContent: 'center',
    },
    loginText: {
        fontSize: FontSize.FS_18, color: Colors.white,
        fontFamily: ConstantKey.MONTS_SEMIBOLD
    },
    calloutTitle: {
        fontSize: FontSize.FS_12,
        fontFamily: ConstantKey.MONTS_SEMIBOLD,
        color: Colors.black
    },
    calloutSubTitle: {
        fontSize: FontSize.FS_10,
        fontFamily: ConstantKey.MONTS_MEDIUM,
        color: Colors.black
    },
    calloutDescription: {
        marginTop: 5,
        fontSize: FontSize.FS_10,
        fontFamily: ConstantKey.MONTS_REGULAR,
        color: Colors.black,

    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
export default SearchScreen