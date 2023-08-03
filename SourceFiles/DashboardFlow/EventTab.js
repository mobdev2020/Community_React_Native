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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import ImageView from "react-native-image-viewing";

// create a component
const EventTab = (props) => {


	const [isLoading, setIsLoading] = useState(false)
	const [isRefresh, setIsRefresh] = useState(false)
	const [UserData, setUserData] = useState(null)

	const [ArrEvents, setArrEvents] = useState([])

	const [visibleImg, setIsVisibleImg] = useState(false);

	const [SelectedImg, setSelectedImg] = useState(null)


	// Set Navigation Bar
	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerTitle: i18n.t('events'),
			headerTitleStyle: {
				fontFamily: ConstantKey.MONTS_SEMIBOLD
			},
			headerStyle: {
				backgroundColor: Colors.white,
			},
			headerTintColor: Colors.primaryRed,
			headerBackTitleVisible: false,
		});
	}, [props,UserData, ArrEvents]);



	useEffect(() => {

		const unsubscribe = props.navigation.addListener('focus', () => {
			getUserData()
		});

		return () => {
			unsubscribe
		}

	}, [])


	const getUserData = async () => {

		try {
			const value = await AsyncStorage.getItem(ConstantKey.USER_DATA)
			if (value !== null) {
				// value previously stored

				var data = JSON.parse(value)
				console.log("User Data: " + value)

				setUserData(data)

				Api_EventsList(true)
			}
			else {

			}
		} catch (e) {
			console.log("Error : " + e)
		}

	}


	// Get all events list
	const Api_EventsList = (isLoad) => {

		setIsLoading(isLoad)

		console.log("Api_EventsList User na Data :" + JSON.stringify(UserData))

		Webservice.get(APIURL.getEventList)
			.then(response => {

				setIsLoading(false)
				setIsRefresh(false)
				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("Api_EventsList Response : " + JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.Status == '1') {

					setArrEvents(response.data.Data)
				} else {

					setArrEvents(response.data.Data)
					// alert(response.data.Msg)
				}

			})
			.catch((error) => {

				setIsRefresh(false)
				setIsLoading(false)
				console.log(error)
			})
	}


	const refresh = () => {
		Api_EventsList(true)
	}

	const OnRefresh = () => {
		setIsRefresh(true)
		Api_EventsList(true)
	}

	const btnEventsTap = () => {
		requestAnimationFrame(() => {

			props.navigation.navigate('EventsList', { userData : JSON.stringify(UserData)})
		})
	}


	// Render Sprator
	const Saprator = () => {
		return (
			<View style={{ height: 20, }}></View>
		)
	}

	return (
		<SafeAreaView style={styles.container}>

			<View style={styles.container}>

				{ArrEvents.length != 0 ?

					<FlatList
						data={ArrEvents}
						keyExtractor={(item, index) => index}
						onRefresh={() => OnRefresh()}
						refreshing={isRefresh}
						ListHeaderComponent={Saprator}
						ListFooterComponent={Saprator}
						extraData={ArrEvents}
						ItemSeparatorComponent={Saprator}
						renderItem={({ item, index }) => {
							return (
								<View style={{ backgroundColor: Colors.white,
									marginHorizontal : 20, borderRadius : 10, shadowColor : Colors.black, shadowOffset : {width : 0, height : 3}, shadowOpacity : 0.4, shadowRadius : 4,
										elevation : 3}}>

									<View style={{
										backgroundColor: Colors.primaryRed, borderTopLeftRadius: 5, borderTopRightRadius: 5, paddingHorizontal: 10,
										paddingVertical: 5, alignItems: 'center',flexDirection: 'row'
									}}>

										{item.event_start_date != item.event_end_date ?
											<Text style={{ fontSize: FontSize.FS_14, fontFamily: Colors.MONTS_SEMIBOLD, color: Colors.white, flex: 1 }}>
												Date : {moment(item.event_start_date).format("DD-MM-YYYY")} To {moment(item.event_end_date).format("DD-MM-YYYY")}
											</Text>
										: 
											<Text style={{ fontSize: FontSize.FS_14, fontFamily: Colors.MONTS_SEMIBOLD, color: Colors.white, flex: 1 }}>
												Date : {moment(item.event_start_date).format("DD-MM-YYYY")}
											</Text>
										}

									</View>


									<View style={{ flexDirection: 'row',  paddingHorizontal : 10, paddingVertical : 10,}}>

										<TouchableOpacity style={{
											alignItems: 'center', backgroundColor: Colors.white
										}}
											onPress={() => {
												if(item.event_image != null){
													setSelectedImg(item)
													setIsVisibleImg(true)
												}
												
											}}>

											<Image style={{ width: 60, height: 60, resizeMode: 'cover' , borderRadius : 10}}
												source={item.event_image != null ? { uri: item.event_image } : Images.UserPlaceHolder} />
	
										</TouchableOpacity>

									

										<View style={{ flex: 1, marginLeft: 10,}}>

												<Text style={{fontSize : 16, fontFamily : ConstantKey.MONTS_SEMIBOLD, color : Colors.primaryRed}}>
													{item.event_name}
												</Text>

												<Text style={{marginTop : 5, fontSize : 14, fontFamily : ConstantKey.MONTS_REGULAR, color : Colors.black}}>                
													{item.event_desc}
												</Text>

												{/* <Text style={{marginTop : 5, fontSize : 14, fontFamily : ConstantKey.MONTS_REGULAR, color : Colors.darkGrey}}>                
													Trigger at : {moment(item.expired_at).format('DD-MM-YYYY')}
												</Text> */}

												{item.event_link != null ?
													<TouchableOpacity onPress={() => Linking.openURL(item.event_link)}>
														<Text style={{ marginTop: 5, fontSize: 14, fontFamily: ConstantKey.MONTS_REGULAR, color: Colors.darkGrey }}>
															Link : {item.event_link}
														</Text>
													</TouchableOpacity>
												: null}
 
												
										</View>
									</View>
								</View>
							)
						}}
					/>
					:
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ fontSize: FontSize.FS_14, color: Colors.darkGrey, fontFamily: ConstantKey.MONTS_REGULAR }}>
							No Data Found
						</Text>
					</View>
				}

				{UserData != null && UserData.permission.event == 1 ?
					<TouchableOpacity style={{ backgroundColor: Colors.primaryRed, padding: 10, alignItems: 'center', justifyContent: 'center' }}
						onPress={() => btnEventsTap()}>
						<Text style={{ color: Colors.white, fontFamily: ConstantKey.MONTS_SEMIBOLD, fontSize: FontSize.FS_16 }}>All Events</Text>
					</TouchableOpacity>
				: null}


				{SelectedImg != null ?
					<ImageView
						images={[{ uri: SelectedImg.event_image }]}
						imageIndex={0}
						visible={visibleImg}
						onRequestClose={() => setIsVisibleImg(false)}
					/> 
				: null}


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
});

//make this component available to the app
export default EventTab;
