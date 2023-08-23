import React, { Component, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, ScrollView, Alert, FlatList } from 'react-native';


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
const SearchScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [SearchText, setSearchText] = useState('')

    const inputRef = useRef();


    const btnBusinessProfile = (params) => {
        navigation.navigate('UpdateProfile', { userData: [] })
    }

    useEffect(() => {
        inputRef.current?.focus()
    }, [])


    return (
        <View style={styles.container}>
            <View style={{ flex: 1, backgroundColor: Colors.white }}>


                <ScrollView style={{}}>
                    <SafeAreaView style={{ flex: 1, marginVertical: 10, marginHorizontal: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", }}>
                            <TouchableOpacity onPress={() => { navigation.goBack() }}
                                style={{ marginRight: 10, marginBottom: 5, padding: 10 }}>
                                <Icon name={"chevron-left"} size={18} color={Colors.black} />

                            </TouchableOpacity>

                            <Text style={{
                                fontSize: FontSize.FS_22,
                                color: Colors.black,
                                fontFamily: ConstantKey.MONTS_SEMIBOLD,
                            }}>
                                {i18n.t('Search')}
                            </Text>

                        </View>
                        <View style={{ marginHorizontal: 10 }}>

                            <View style={styles.mobileView}>
                                <MaterialCommunityIcons name={"magnify"} size={20} color={Colors.primary} style={{ marginLeft: 10 }} />
                                <TextInput style={styles.textInputMobile}
                                    value={SearchText}
                                    ref={inputRef}
                                    placeholder={i18n.t('searchHere')}
                                    returnKeyType={'done'}
                                    onChangeText={(txtname) => setSearchText(txtname)}
                                    autoFocus={true}
                                />
                                <TouchableOpacity>
                                    <MaterialCommunityIcons name={"filter-outline"} size={20} color={Colors.primary} style={{ marginRight: 10 }} />
                                </TouchableOpacity>
                            </View>



                        </View>
                        <FlatList
                            style={{ marginTop: 10 }}
                            data={[1, 2, 3, 4, 5]}
                            ListFooterComponent={<View style={{ height: 40 }}></View>}
                            renderItem={({ item, index }) => (
                                <View style={{
                                    borderRadius: 5,
                                    marginHorizontal: 10,
                                    marginTop: 20,
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: Colors.primary,
                                }}>
                                    <View style={{ flex: 1, backgroundColor: Colors.white }}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            {/* <MaterialCommunityIcons name={"domain"} size={18} color={Colors.primary} style={{ marginRight: 5 }} /> */}
                                            <Text style={[styles.calloutTitle, { marginTop: 4 }]}>{"Webtual technologies"}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Text style={[styles.calloutSubTitle, { marginTop: 4 }]}>{"Category : "}</Text>
                                            <Text style={[styles.calloutDescription, { marginTop: 4 }]}>{"It Web & Software Development"}</Text>
                                        </View>

                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <MaterialCommunityIcons name={"phone"} size={18} color={Colors.primary} style={{ marginRight: 5 }} />
                                            <Text style={styles.calloutDescription}>+91 {9999999999}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <MaterialCommunityIcons name={"email"} size={18} color={Colors.primary} style={{ marginRight: 5 }} />
                                            <Text style={styles.calloutDescription}>{"Test@gmail.com"}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <MaterialCommunityIcons name={"map-marker-outline"} size={18} color={Colors.primary} style={{ marginRight: 5 }} />
                                            <Text style={styles.calloutDescription}>{"H-302 SG Business Hub \nNear Gota Ahemdabad"}</Text>
                                        </View>
                                    </View>
                                </View>

                            )}
                        />


                    </SafeAreaView>
                </ScrollView>
            </View>

            {isLoading ?
                <LoadingView text={"Please Wait..."} />
                : null}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    mobileView: {
        marginTop: 10, flexDirection: 'row', backgroundColor: Colors.lightGrey01, borderRadius: 10,
        height: 50, alignItems: 'center', borderWidth: 1, borderColor: Colors.primary
    },
    textInputMobile: {
        marginLeft: 10, marginRight: 10, height: 50, flex: 1, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
        color: Colors.black,
    },
    btnLogin: {
        backgroundColor: Colors.primary,
        marginTop: 48, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    },
    loginText: {
        fontSize: FontSize.FS_18, color: Colors.white,
        fontFamily: ConstantKey.MONTS_SEMIBOLD
    },
    calloutTitle: {
        fontSize: FontSize.FS_16,
        fontFamily: ConstantKey.MONTS_SEMIBOLD,
        color: Colors.primary
    },
    calloutSubTitle: {
        fontSize: FontSize.FS_13,
        fontFamily: ConstantKey.MONTS_MEDIUM,
        color: Colors.primary
    },
    calloutDescription: {
        marginTop: 5,
        fontSize: FontSize.FS_14,
        fontFamily: ConstantKey.MONTS_REGULAR,
        color: Colors.darkGrey,

    },
});
export default SearchScreen