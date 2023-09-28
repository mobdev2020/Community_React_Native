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

// Third Party
import { StackActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import ImageView from "react-native-image-viewing";
import { moderateScale } from 'react-native-size-matters';


const Meetings = (props) => {


	const [isLoading, setIsLoading] = useState(false)
	const [isRefresh, setIsRefresh] = useState(false)
	const [UserData, setUserData] = useState(null)

	const [ArrMeetings, setArrMeetings] = useState([])

	const [visibleImg, setIsVisibleImg] = useState(false);

	const [SelectedImg, setSelectedImg] = useState(null)



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

				Api_MeetingsList(true)
			}
			else {

			}
		} catch (e) {
			console.log("Error : " + e)
		}

	}


	// Get all Meetings list
	const Api_MeetingsList = (isLoad) => {

		setIsLoading(isLoad)

		console.log("Api_MeetingsList User na Data :" + JSON.stringify(UserData))

		Webservice.get(APIURL.getMeeting)
			.then(response => {

				setIsLoading(false)
				setIsRefresh(false)
				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("Api_MeetingsList Response : " + JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.Status == '1') {

					setArrMeetings(response.data.Data)
				} else {

					setArrMeetings(response.data.Data)
					// alert(response.data.Msg)
				}

			})
			.catch((error) => {

				setIsRefresh(false)
				setIsLoading(false)
				console.log(error)
			})
	}


	// Delete Meeting
	const Api_DeleteMeeting = (isLoad, item) => {

		setIsLoading(isLoad)

		console.log("Api_DeleteMeeting User na Data :" + JSON.stringify(UserData))

		Webservice.post(APIURL.deleteMeeting,{
			meeting_id : item.id
		})
			.then(response => {

				setIsLoading(false)
				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("Api_DeleteMeeting Response : " + JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.Status == '1') {

					Api_MeetingsList(true)
				} else {
					alert(response.data.Msg)
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}


	const OnRefresh = () => {
		setIsRefresh(true)
		Api_MeetingsList(true)
	}


	const btnAllMeetingsTap = () => {
		props.navigation.navigate('AddMeeting', { userData : JSON.stringify(UserData), isEdit : false, meetingData : null})
	}

	const btnEditTap = (item) => {
		props.navigation.navigate('AddMeeting', { userData : JSON.stringify(UserData), isEdit : true, meetingData : JSON.stringify(item)})
	}

	const btnDeleteTap = (item) => {
		Alert.alert("Alert","Are you sure you want to delete this meeting?",[
			{
				text : 'Yes',
				onPress : () => Api_DeleteMeeting(true, item),
			},
			{
				text : 'No',
				onPress : () => console.log("No Tap"),
				style : 'cancel'
			}
		])
	}


	const btnNavigateTap = () => {
		Linking.openURL(SelectedImg.location_link)
	}

	// Render Sprator
	const Saprator = () => {
		return (
			<View style={{ height: 20, }}></View>
		)
	}


	return (
		<SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'}/>

			<View style={styles.container}>


				{ArrMeetings.length != 0 ?

					<FlatList
						data={ArrMeetings}
						keyExtractor={(item, index) => index}
						onRefresh={() => OnRefresh()}
						refreshing={isRefresh}
						ListHeaderComponent={Saprator}
						ListFooterComponent={Saprator}
						extraData={ArrMeetings}
						ItemSeparatorComponent={Saprator}
						renderItem={({ item, index }) => {
							return (
								<View style={{
									backgroundColor: Colors.white,
									marginHorizontal: 20, borderRadius: 6, shadowColor: Colors.black, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 4,
									elevation: 3
								}}>

									<View style={{
										backgroundColor: Colors.primaryRed, borderTopLeftRadius: 5, borderTopRightRadius: 5, paddingHorizontal: 10,
										paddingVertical: 5, alignItems: 'center', flexDirection: 'row'
									}}>

										
											<Text style={{ fontSize: FontSize.FS_14, fontFamily: Colors.MONTS_SEMIBOLD, color: Colors.white, flex: 1 }}>
												Date : {moment(item.meeting_date).format("DD-MM-YYYY")}
											</Text>
									

									</View>


									<View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10, }}>

										<TouchableOpacity style={{
											alignItems: 'center', backgroundColor: Colors.white
										}}
											onPress={() => {
												if (item.meeting_image != null) {
													setSelectedImg(item)
													setIsVisibleImg(true)
												}

											}}>

											<Image style={{ width: 60, height: 60, resizeMode: 'cover', borderRadius: 6 }}
												source={item.meeting_image != null ? { uri: item.meeting_image } : Images.UserPlaceHolder} />

										</TouchableOpacity>

										{/* <Image source={{uri : item.service_icon}}
							style={{width : moderateScale(60), height : moderateScale(60), resizeMode : 'contain'}}/> */}

										<View style={{ flex: 1, marginLeft: 10, }}>

											<Text style={{ fontSize: 16, fontFamily: ConstantKey.MONTS_SEMIBOLD, color: Colors.primaryRed }}>
												{item.title}
											</Text>

											<Text style={{ marginTop: 5, fontSize: 14, fontFamily: ConstantKey.MONTS_REGULAR, color: Colors.black }}>
												{item.description}
											</Text>

											{/* <Text style={{marginTop : 5, fontSize : 14, fontFamily : ConstantKey.MONTS_REGULAR, color : Colors.darkGrey}}>                
								Trigger at : {moment(item.expired_at).format('DD-MM-YYYY')}
							</Text> */}

											{item.location_link != null ?
												<TouchableOpacity style={{flexDirection : 'row', backgroundColor : Colors.primaryRed, padding : 5, width : '60%',
													borderRadius : 5, marginTop : moderateScale(5), alignItems : 'center', justifyContent : 'center'}}
													onPress={() => Linking.openURL(item.location_link)}>
													{/* <Text style={{ marginTop: 5, fontSize: 14, fontFamily: ConstantKey.MONTS_REGULAR, color: Colors.darkGrey }}>
														Link : {item.location_link}
													</Text> */}

													<Text style={[styles.navigateText,{textAlign : 'center',}]}>
														Navigate
													</Text>

													<Icon name='location-arrow' size={14} color={Colors.white} style={{marginLeft : 10}}/>
												</TouchableOpacity>
												: null}


										</View>
									</View>

									{UserData != null && UserData.permission.meeting == 1 ?
										<View style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 10 }}>

											<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
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
										: null}

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


				{UserData != null && UserData.permission.meeting == 1 ?
					<TouchableOpacity style={{ backgroundColor: Colors.primaryRed, padding: 10, alignItems: 'center', justifyContent: 'center' }}
						onPress={() => btnAllMeetingsTap()}>
						<Text style={{ color: Colors.white, fontFamily: ConstantKey.MONTS_SEMIBOLD, fontSize: FontSize.FS_16 }}>Add Meeting</Text>
					</TouchableOpacity>
				: null}


				{SelectedImg != null ?
					<ImageView
						images={[{ uri: SelectedImg.meeting_image }]}
						imageIndex={0}
						visible={visibleImg}
						FooterComponent={() => {
							return(
								SelectedImg.location_link != null ?
								<TouchableOpacity style={styles.btnNavigate}
									onPress={() => btnNavigateTap(SelectedImg)}>
									<Text style={styles.navigateText}>
										{i18n.t('navigate')}
									</Text>
								</TouchableOpacity>
								: null
							)
						}}
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
	btnNavigate: {
		backgroundColor: Colors.primaryRed,
		height: moderateScale(45), borderRadius: 10, alignItems: 'center', justifyContent: 'center',
		shadowColor: Colors.primaryRed,
		shadowOffset: { width: 0, height: 2 }, width: '50%', alignSelf: 'center',
		shadowOpacity: 0.4, shadowRadius: 2, elevation: 2, marginVertical: moderateScale(15)
	},
	navigateText: {
		fontSize: FontSize.FS_20, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default Meetings;
