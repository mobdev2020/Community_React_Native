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
import moment from 'moment';

// create a component
const EventsList = (props) => {

	const [isLoading, setIsLoading] = useState(false)
	const [isRefresh, setIsRefresh] = useState(false)
	const [userData, setUserData] = useState(null)

	const [ArrEvents, setArrEvents] = useState([])


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
			headerRight: () => (
				
					<>
						{/* <TouchableOpacity style={{marginRight : 10}} onPress={() => setModalVisible(true)}>
						<Icon name="plus" size={20} color={Colors.primaryRed} />
					</TouchableOpacity> */}

						<TouchableOpacity style={{
							height: 30, width: 30, 
							borderColor: Colors.primaryRed, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center'
						}}
							onPress={() => btnAddTap()}>
							<Icon name="plus" size={15} color={Colors.primaryRed} />
						</TouchableOpacity>

					</>
				
			),
			headerTintColor: Colors.primaryRed,
			headerBackTitleVisible: false,
		});
	}, [props, userData]);



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

				Api_EventsList(true, data)
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

		console.log("Api_EventsList User na Data :" + JSON.stringify(userData))


		Webservice.get(APIURL.getEvents)
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


	// Active / In-Active Event
	const Api_ActiveInActiveEvent = (isLoad, item, isActive) => {

		setIsLoading(isLoad)

		console.log("Api_ActiveInActiveEvent User na Data :" + JSON.stringify(userData))

		Webservice.post(APIURL.updateStatusEvent,{
			event_id : item.id,
			is_active : isActive
		})
			.then(response => {

				setIsLoading(false)
				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("Api_ActiveInActiveEvent Response : " + JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.Status == '1') {

					Api_EventsList(true)
				} else {
					alert(response.data.Msg)
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}


	// Delete Event
	const Api_DeleteEvent = (isLoad, item) => {

		setIsLoading(isLoad)

		console.log("Api_DeleteEvent User na Data :" + JSON.stringify(userData))

		Webservice.post(APIURL.deleteEvent,{
			event_id : item.id
		})
			.then(response => {

				setIsLoading(false)
				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("Api_DeleteEvent Response : " + JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.Status == '1') {

					Api_EventsList(true)
				} else {
					alert(response.data.Msg)
				}

			})
			.catch((error) => {

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

	// Action Methods

	const btnAddTap = () => {
		requestAnimationFrame(() => {

			props.navigation.navigate('AddEvent', { userData : JSON.stringify(userData), isEdit : false, eventData : null, onGoBack : () => refresh()})
			
		})
	}

	const btnEditTap = (item) => {
		requestAnimationFrame(() => {
			props.navigation.navigate('AddEvent', { userData : JSON.stringify(userData), isEdit : true, eventData : JSON.stringify(item), onGoBack : () => refresh()})
		})
	}


	const btnDeleteTap = (item) => {
		requestAnimationFrame(() => {

			Alert.alert("Alert","Are you sure you wan't to delete this event?",[
				{
					text : 'Yes',
					onPress : () => Api_DeleteEvent(true, item),
				},
				{
					text : 'No',
					onPress : () => console.log("No Tap"),
					style : 'cancel'
				}
			])
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

										<View style={{
											alignItems: 'center', backgroundColor: Colors.white
										}}>

											<Image style={{ width: 60, height: 60, resizeMode: 'cover' , borderRadius : 10}}
												source={item.event_image != null ? { uri: item.event_image } : Images.UserPlaceHolder} />
	
										</View>

										{/* <Image source={{uri : item.service_icon}}
												style={{width : moderateScale(60), height : moderateScale(60), resizeMode : 'contain'}}/> */}

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

									<View style={{ flexDirection: 'row',  paddingHorizontal : 10, marginBottom : 10 }}>

										<View style={{width : 60, alignItems : 'flex-start'}}>
											<Switch 
												value={item.is_active == 1 ? true : false}
												thumbColor={Colors.white}
												trackColor={{ true: Colors.primaryRed }}
												onValueChange={(value) => Api_ActiveInActiveEvent(true, item, value ? 1 : 0)} />
										</View>
										

										<View style={{flex : 1, flexDirection: 'row', alignItems : 'center', justifyContent: 'flex-end' }}>
											<TouchableOpacity style={{
												borderRadius: 5, borderWidth: 1, borderColor: Colors.primaryRed,
												alignItems: 'center', justifyContent: 'center', marginRight: 10, paddingVertical: 5, paddingHorizontal: 10,
											}}
												onPress={() => btnEditTap(item)}>

												<Icon name='edit' size={15} color={Colors.primaryRed} />
												{/* <Text style={{fontSize: 14, fontFamily: ConstantKey.MONTS_REGULAR, color: Colors.primaryRed }}>
															Edit
														</Text> */}
											</TouchableOpacity>

											<TouchableOpacity style={{
												borderRadius: 5, borderWidth: 1, borderColor: Colors.primaryRed,
												alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 5
											}}
												onPress={() => btnDeleteTap(item)}>

												<Icon name='trash-alt' size={15} color={Colors.primaryRed} />
												{/* <Text style={{fontSize: 14, fontFamily: ConstantKey.MONTS_REGULAR, color: Colors.primaryRed }}>
															Delete
														</Text> */}
											</TouchableOpacity>
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
export default EventsList;
