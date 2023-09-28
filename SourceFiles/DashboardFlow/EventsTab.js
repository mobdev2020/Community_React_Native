
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TouchableHighlight, TouchableHighlightBase, Linking, Alert, SafeAreaView, StatusBar } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Colors } from '../Constants/Colors'
import { ConstantKey } from '../Constants/ConstantKey'
import { FontSize } from '../Constants/FontSize'
import { Touchable } from 'react-native'
import { navigate } from '../Constants/NavigationService'
import FastImage from 'react-native-fast-image'
import { Images } from '../Constants/Images'
import { APIURL } from '../Constants/APIURL'
import LoadingView from '../Constants/LoadingView'
import Webservice from '../Constants/API'
import { useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment'

const EventsTab = (props) => {

	const [isLoading, setIsLoading] = useState(false)
	const [EventHidePagination, setEventHidePagination] = useState(false)
	const [TrainingHidePagination, setTrainingHidePagination] = useState(false)
	const [MeetingHidePagination, setMeetingHidePagination] = useState(false)
	const [index, setIndex] = useState(0)
	const [EventsData, setEventsData] = useState([])
	const [TrainingData, setTrainingData] = useState([])
	const [MeetingData, setMeetingData] = useState([])
	const [EventCurrentPage, setEventCurrentPage] = useState(1)
	const [TrainingCurrentPage, setTrainingCurrentPage] = useState(1)
	const [MeetingCurrentPage, setMeetingCurrentPage] = useState(1)
	const [Role, setRole] = useState("")


	useFocusEffect(
		useCallback(() => {
			console.log("ENTER EVENTS TAB = TRUE")
			setIsLoading(true)
			Api_Get_Events(true)
			Api_Get_Training(true)
			Api_Get_Meeting(true)
			Api_Get_Profile(true)
			return () => {
				console.log("EXIT FROM EVENTS TAB = TRUE")
				setEventCurrentPage(1)
				setTrainingCurrentPage(1)
				setMeetingCurrentPage(1)
				setEventHidePagination(false)
				setTrainingHidePagination(false)
				setMeetingHidePagination(false)
				setEventsData([])
				setTrainingData([])
				setMeetingData([])
			}
		}, [])
	);

	const Api_Get_Events = async (isLoad) => {
		setIsLoading(isLoad);
		console.log("EventCurrentPage :", EventCurrentPage);

		try {
			const response = await Webservice.get(APIURL.GetEvents + "?page=" + EventCurrentPage);
			console.log("Api_Get_Events Response: " + JSON.stringify(response));

			if (response.data.status === true) {
				var data = response.data.data?.data;
				const unique = [...new Map(data.map(m => [m.id, m])).values()];
				const updatedEventsData = [...EventsData, ...unique];

				await setEventsData(updatedEventsData);
				setIsLoading(false);


				if (response.data.data.next_page_url === null) {
					setEventHidePagination(true);
				} else {
					setEventCurrentPage(EventCurrentPage + 1);
				}
			} else {
				// alert(response.data.message);
				setIsLoading(false);
				setEventHidePagination(true);

			}
		} catch (error) {
			setIsLoading(false);
			console.log(error);
			setEventHidePagination(true);
		}
	}
	const Api_Delete_Events = async (isLoad, items) => {
		setIsLoading(isLoad)
		console.log("items?.id", items?.id)
		let body = new FormData();
		body.append('event_id', items?.id)
		Webservice.post(APIURL.DeleteEvent, body)
			.then(response => {
				setIsLoading(false)
				// console.log("Api_Delete_Events Response : " + JSON.stringify(response?.data));
				if (response.data.status == true) {
					var data = EventsData.filter((item) => item.id !== items.id)
					setEventsData(data)
					// setEventCurrentPage(EventCurrentPage - 1)
					Alert.alert("Success", "Event Deleted Successfully", [
						{
							text: 'Ok',
							onPress: () => {
								console.log("EventCurrentPage", EventCurrentPage)
								// Api_Get_Events(true)

							}
						}
					], { cancelable: true })
				} else {
					alert(response.data.Msg)
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}
	const Api_Get_Training = async (isLoad) => {
		setIsLoading(isLoad)

		try {
			const response = await Webservice.get(APIURL.GetTrainings + "?page=" + TrainingCurrentPage);
			console.log("Api_Get_Training Response :", JSON.stringify(response?.data?.data))
			if (response.data.status == true) {

				var data = response.data.data?.data;
				const unique = [...new Map(data.map(m => [m.id, m])).values()];
				const updatedMeetingsData = [...TrainingData, ...unique];
				await setTrainingData(updatedMeetingsData);
				setIsLoading(false);

				if (response.data.data.next_page_url == null) {
					setTrainingHidePagination(true)
				}
				else {
					setTrainingCurrentPage(TrainingCurrentPage + 1)
				}

			} else {
				// alert(response.data.message)
				setTrainingHidePagination(true)
				setIsLoading(false);
			}
		}
		catch (error) {
			setIsLoading(false)
			console.log(error)
			setTrainingHidePagination(true)
		}
	}
	const Api_Get_Meeting = async (isLoad) => {
		setIsLoading(isLoad)

		try {
			const response = await Webservice.get(APIURL.GetMeetings + "?page=" + MeetingCurrentPage);
			console.log("Api_Get_Meeting Response: " + JSON.stringify(response.data.data));

			if (response.data.status == true) {
				var data = response.data.data?.data
				const unique = [...new Map(data.map(m => [m.id, m])).values()];
				const updatedEventsData = [...MeetingData, ...unique];
				await setMeetingData(updatedEventsData);
				setIsLoading(false);

				if (response.data.data.next_page_url == null) {
					setMeetingHidePagination(true)
				} else {
					setMeetingCurrentPage(MeetingCurrentPage + 1)
				}

			} else {
				// alert(response.data.message)
				setIsLoading(false);
				setMeetingHidePagination(true);
			}
		}
		catch (error) {
			setIsLoading(false)
			setMeetingHidePagination(true);
			console.log(error)
		}
	}
	const Api_Delete_Meeting = async (isLoad, items) => {
		setIsLoading(isLoad)
		let body = new FormData();
		body.append('meeting_id', items?.id)
		Webservice.post(APIURL.DeleteMeeting, body)
			.then(response => {
				setIsLoading(false)
				// console.log("Api_Delete_Meeting Response : " + JSON.stringify(response?.data));
				if (response.data.status == true) {
					var data = MeetingData.filter((item) => item.id !== items.id)
					setMeetingData(data)
					Alert.alert("Success", "Meeting Deleted Successfully", [
						{
							text: 'Ok',
							onPress: () => {

							}
						}
					], { cancelable: true })
				} else {
					alert(response.data.Msg)
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}
	const Api_Get_Profile = (isLoad) => {
		setIsLoading(isLoad)
		Webservice.get(APIURL.GetProfile)
			.then(response => {
				setIsLoading(false)
				// console.log(JSON.stringify("Api_Get_Profile Response : " + JSON.stringify(response)));
				if (response.data.status == true) {
					var Role = response.data.data.role
					setRole(Role)
				} else {
					alert(response.data.message)
				}
			})
			.catch((error) => {
				setIsLoading(false)
				console.log(error)
			})
	}

	const btnSelectEventTap = (item) => {
		console.log(item)
		var dict = {
			...item, 
			description : item?.event_desc,
			end_date : item?.event_end_date,
			image : item?.event_image,
			image_url : item?.event_image_url,
			link : item?.event_link,
			name : item?.event_name,
			start_date : item?.event_start_date,
		}

		navigate('Details', {data: dict});

	}

	const btnSelectTrainingTap = (item) => {
		console.log(item)

		var dict = {
			...item, 
			description : item?.training_desc,
			end_date : item?.training_end_date,
			image : item?.training_image,
			image_url : item?.training_image_url,
			link : item?.training_link,
			name : item?.training_name,
			start_date : item?.training_start_date,
		}

		navigate('Details', {data: dict});
	}

	const btnSelectMeetingTap = (item) => {
		console.log(item)

		var dict = {
			...item, 
			description : item?.meeting_desc,
			end_date : item?.meeting_end_date,
			image : item?.meeting_image,
			image_url : item?.meeting_image_url,
			link : item?.meeting_link,
			name : item?.meeting_name,
			start_date : item?.meeting_start_date,
		}

		navigate('Details', {data: dict});
	}

	return (
		<SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'}/>

		<View style={{ flex: 1, backgroundColor: Colors.white }}>
			<View style={{ marginVertical: 20 }}>
				{(Role == "school" && index == 0) ?
					<TouchableOpacity onPress={() => {
						navigate("AddEvent", { isEdit: false })
					}}
						style={{
							alignSelf: 'flex-end',
							backgroundColor: '#ffffff',
							paddingHorizontal: 14,
							marginBottom: 20,
							marginHorizontal: 20,
							height: 34,
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: 6,
							borderWidth: 1,
							borderColor: Colors.primary
						}}>
						<Text style={{
							textAlign: 'center',
							color: Colors.black,
							alignSelf: 'center',
						}}>
							Add Event
						</Text>
					</TouchableOpacity>
					: null
				}
				{/* {(Role == "school" && index == 1) ?
					<TouchableOpacity onPress={() => { navigate("AddTraining") }}
						style={{
							alignSelf: 'flex-end',
							backgroundColor: '#ffffff',
							paddingHorizontal: 14,
							marginBottom: 20,
							marginHorizontal: 20,
							height: 34,
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: 6,
							borderWidth: 1,
							borderColor: Colors.primary
						}}>
						<Text style={{
							textAlign: 'center',
							color: Colors.black,
							alignSelf: 'center',
						}}>
							Add Training
						</Text>
					</TouchableOpacity>
					: null
				} */}
				{(Role == "school" && index == 2) ?
					<TouchableOpacity onPress={() => { navigate("AddMeeting", { isEdit: false }) }}
						style={{
							alignSelf: 'flex-end',
							backgroundColor: '#ffffff',
							paddingHorizontal: 14,
							marginBottom: 20,
							marginHorizontal: 20,
							height: 34,
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: 6,
							borderWidth: 1,
							borderColor: Colors.primary
						}}>
						<Text style={{
							textAlign: 'center',
							color: Colors.black,
							alignSelf: 'center',
						}}>
							Add Meeting
						</Text>
					</TouchableOpacity>
					: null
				}
				<View style={{ flexDirection: "row", height: 34, alignSelf: "center", alignContent: "center", marginHorizontal: 20, }}>

					<TouchableOpacity onPress={() => {
						setIndex(0)
					}} style={{
						flex: 1, marginLeft: 8, borderRadius: 6, height: 34, backgroundColor: index == 0 ? Colors.black : Colors.lightGrey01
					}}>

						<View style={styles.buttonContainer}>
							<Text style={[styles.buttonText, { color: index == 0 ? Colors.white : Colors.lightGrey }]}>
								Events
							</Text>
						</View>

					</TouchableOpacity>

					<TouchableOpacity onPress={() => {
						setIndex(1)
					}} style={{
						flex: 1, marginLeft: 8, borderRadius: 6, height: 34, backgroundColor: index == 1 ? Colors.black : Colors.lightGrey01
					}}>

						<View style={styles.buttonContainer}>
							<Text style={[styles.buttonText, { color: index == 1 ? Colors.white : Colors.lightGrey }]}>
								Trainings
							</Text>
						</View>

					</TouchableOpacity>

					<TouchableOpacity onPress={() => {
						setIndex(2)
					}} style={{
						flex: 1, marginLeft: 8, borderRadius: 6, height: 34, backgroundColor: index == 2 ? Colors.black : Colors.lightGrey01
					}}>
						<View style={styles.buttonContainer}>
							<Text style={[styles.buttonText, { color: index == 2 ? Colors.white : Colors.lightGrey }]}>
								Meeting
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
			{console.log("EventsData Final :", EventsData.length)}
			{(EventsData.length >= 0 && index == 0 && isLoading == false) ?
				<FlatList
					data={EventsData}
					contentContainerStyle={{ paddingBottom: 40 }}
					keyExtractor={(item, index) => index}
					ListFooterComponent={
						(EventHidePagination == false && index == 0 && isLoading == false && EventsData.length >= 0) &&
						<View>
							<TouchableOpacity onPress={() => {
								Api_Get_Events(true)
							}}
								style={{ marginVertical: 25, alignSelf: "center" }}>
								<Text style={{ fontSize: FontSize.FS_18, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM }}>{"See More"}</Text>

							</TouchableOpacity>
						</View>
					}
					ListEmptyComponent={
						(isLoading === false && EventsData.length <= 0) &&
						<View style={{ justifyContent: "center", alignItems: "center", padding: 10, alignSelf: "center", borderRadius: 6, marginTop: 100 }}>
							<Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, }}>{"No Data Found"}</Text>
						</View>}
					renderItem={({ item, index }) => {
						return (

							<TouchableOpacity style={{
								marginHorizontal: 20,
								marginVertical: 5,
								backgroundColor: Colors.white,
								borderBottomLeftRadius: 8,
								borderBottomRightRadius: 8,
								shadowColor: "#000",
								shadowOffset: {
									width: 0,
									height: 2,
								},
								shadowOpacity: 0.20,
								shadowRadius: 4,
								elevation: 5,
								borderRadius : 10
							}}
							onPress={() => btnSelectEventTap(item)}>
								<View style={{ width: "100%", height: ConstantKey.SCREEN_HEIGHT / 4.5, borderTopRightRadius : 10 , borderTopLeftRadius : 10,}}>
									<FastImage style={{ flex: 1, borderTopLeftRadius : 10, borderTopRightRadius : 10 }}
										source={{ uri: item?.event_image_url }}
										resizeMode='cover'
									/>
									<View style={{ backgroundColor: Colors.white, position: "absolute", right: 0, paddingHorizontal: 12, paddingVertical: 6,
								borderTopRightRadius : 10 }}>
										<Text style={{ fontSize: FontSize.FS_10, color: Colors.black, fontFamily: ConstantKey.MONTS_SEMIBOLD }}>
											{moment(item?.event_start_date).format("DD MMM YY")}
										</Text>
									</View>
								</View>
								<View style={{
									padding: 8
								}}>
									<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
										{item?.event_name && <Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_SEMIBOLD }}>{item?.event_name}</Text>}

									</View>
									<Text numberOfLines={2} style={{marginTop : 4, fontSize: FontSize.FS_12, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR }}>{item?.event_desc}</Text>
									{item?.event_link && <Text onPress={() => { Linking.openURL(item?.event_link) }} numberOfLines={1} style={{ fontSize: FontSize.FS_12, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR, marginTop: 4 ,textDecorationLine:"underline"}}>{item?.event_link}</Text>}
									{Role == "school" &&
										<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end",
											 marginBottom: 5 , marginVertical : 10 }}>
											<TouchableOpacity onPress={() => {
												Alert.alert("Alert", "Are you sure you want to delete event?", [
													{
														text: 'No',
														onPress: () => {
														}
													},
													{
														text: 'Yes',
														onPress: () => {
															Api_Delete_Events(true, item)
														}
													}
												], { cancelable: true })
											}}
												style={{ paddingHorizontal: 20 }}>
												<FastImage style={{ width: 20, height: 20 }} source={Images.ic_delete} />

											</TouchableOpacity>
											<TouchableOpacity onPress={() => { navigate("AddEvent", { isEdit: true, EventData: item }) }}
												style={{ paddingRight: 10 }}>
												<FastImage style={{ width: 20, height: 20 }} source={Images.ic_edit} />

											</TouchableOpacity>
										</View>}
								</View>
							</TouchableOpacity>
						)
					}}
				/> : null}

			{index == 1 ?
				<FlatList
					data={TrainingData}
					keyExtractor={(item, index) => index}
					ListFooterComponent={
						(TrainingHidePagination == false && index == 1 && isLoading == false && TrainingData.length >= 0) &&
						<View>
							<TouchableOpacity onPress={() => {
								Api_Get_Training(true)
							}}
								style={{ marginVertical: 25, alignSelf: "center" }}>
								<Text style={{ fontSize: FontSize.FS_18, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM }}>{"See More"}</Text>

							</TouchableOpacity>
						</View>
					}
					ListEmptyComponent={
						(isLoading == false && TrainingData.length <= 0) &&
						<View style={{ justifyContent: "center", alignItems: "center", padding: 10, alignSelf: "center", borderRadius: 6, marginTop: 100 }}>
							<Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, }}>{"No Data Found"}</Text>
						</View>}
					renderItem={({ item, index }) => {
						return (
							<TouchableOpacity style={{
								marginHorizontal: 20,
								marginVertical: 5,
								backgroundColor: Colors.white,
								borderBottomLeftRadius: 8,
								borderBottomRightRadius: 8,
								shadowColor: "#000",
								shadowOffset: {
									width: 0,
									height: 1,
								},
								shadowOpacity: 0.20,
								shadowRadius: 1.41,
								elevation: 2,
								borderRadius : 10
							}}
							onPress={() => btnSelectTrainingTap(item)}>

								<View style={{ width: "100%", height: ConstantKey.SCREEN_HEIGHT / 4.5 }}>
									<FastImage style={{ flex: 1, borderTopLeftRadius : 10, borderTopRightRadius : 10}}
										source={{ uri: item?.training_image_url }}
										resizeMode='cover'
									/>
									<View style={{ backgroundColor: Colors.white, position: "absolute", right: 0, paddingHorizontal: 12, paddingVertical: 6 }}>
										<Text style={{ fontSize: FontSize.FS_10, color: Colors.black, fontFamily: ConstantKey.MONTS_SEMIBOLD }}>{moment(item?.training_start_date).format("DD MMM YY")}</Text>
									</View>
								</View>
								<View style={{
									padding: 8
								}}>


									<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
										<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_SEMIBOLD }}>{item?.training_name}</Text>
									</View>
									<Text numberOfLines={2} style={{marginTop : 4, fontSize: FontSize.FS_12, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR }}>{item?.training_desc}</Text>
									<Text onPress={() => { Linking.openURL(item?.training_link) }} numberOfLines={1} style={{ fontSize: FontSize.FS_12, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR, marginTop: 4 }}>{item?.training_link}</Text>


								</View>
							</TouchableOpacity>
						)
					}}
				/> : null}
			{console.log("MeetingData.length :", MeetingData.length)}
			{index == 2 ?
				<FlatList
					data={MeetingData}
					keyExtractor={(item, index) => index}
					ListFooterComponent={
						(MeetingHidePagination == false && index == 2 && isLoading == false && MeetingData.length >= 0) &&
						<View>
							<TouchableOpacity onPress={() => {
								Api_Get_Meeting(true)
							}}
								style={{ marginVertical: 25, alignSelf: "center" }}>
								<Text style={{ fontSize: FontSize.FS_18, color: Colors.primary, fontFamily: ConstantKey.MONTS_MEDIUM }}>{"See More"}</Text>

							</TouchableOpacity>
						</View>
					}
					ListEmptyComponent={
						!isLoading && MeetingData.length <= 0 &&
						<View style={{ justifyContent: "center", alignItems: "center", padding: 10, alignSelf: "center", borderRadius: 6, marginTop: 100 }}>
							<Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, }}>{"No Data Found"}</Text>
						</View>
					}
					renderItem={({ item, index }) => {
						return (
							<TouchableOpacity style={{
								marginHorizontal: 20,
								marginVertical: 5,
								backgroundColor: Colors.white,
								borderBottomLeftRadius: 8,
								borderBottomRightRadius: 8,
								shadowColor: "#000",
								shadowOffset: {
									width: 0,
									height: 1,
								},
								shadowOpacity: 0.20,
								shadowRadius: 1.41,
								elevation: 2,
								borderRadius : 10
							}}
							onPress={() => btnSelectMeetingTap(item)}>

								<View style={{ width: "100%", height: ConstantKey.SCREEN_HEIGHT / 4.5 }}>
									<FastImage style={{ flex: 1,borderTopLeftRadius : 10, borderTopRightRadius : 10 }}
										source={{ uri: item?.meeting_image_url }}
										resizeMode='cover'
									/>
									<View style={{ backgroundColor: Colors.white, position: "absolute", right: 0, paddingHorizontal: 12, paddingVertical: 6 }}>
										<Text style={{ fontSize: FontSize.FS_10, color: Colors.black, fontFamily: ConstantKey.MONTS_SEMIBOLD }}>{moment(item?.meeting_start_date).format("DD MMM YY")}</Text>
									</View>
								</View>
								<View style={{
									padding: 8
								}}>
									<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
										<Text style={{ fontSize: FontSize.FS_14, color: Colors.primary, fontFamily: ConstantKey.MONTS_SEMIBOLD }}>{item?.meeting_name}</Text>
									</View>
									<Text numberOfLines={2} style={{marginTop : 4, fontSize: FontSize.FS_12, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR }}>{item?.meeting_desc}</Text>
									<Text onPress={() => { Linking.openURL(item?.meeting_link) }} numberOfLines={1} style={{ fontSize: FontSize.FS_12, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR, marginTop: 4 ,textDecorationLine:"underline"}}>{item?.meeting_link}</Text>

									{Role == "school" &&

										<View style={{ flexDirection: "row", alignItems: "center", 
										justifyContent: "flex-end", marginVertical : 10 }}>
											<TouchableOpacity onPress={() => {
												Alert.alert("Alert", "Are you sure you want to delete meeting?", [
													{
														text: 'No',
														onPress: () => {
														}
													},
													{
														text: 'Yes',
														onPress: () => {
															Api_Delete_Meeting(true, item)
														}
													}
												], { cancelable: true })
											}}
												style={{ paddingHorizontal: 20 }}>
												<FastImage style={{ width: 20, height: 20 }} source={Images.ic_delete} />

											</TouchableOpacity>
											<TouchableOpacity onPress={() => { navigate("AddMeeting", { isEdit: true, meetingData: item }) }}
												style={{ paddingRight: 10 }}>
												<FastImage style={{ width: 20, height: 20 }} source={Images.ic_edit} />

											</TouchableOpacity>
										</View>}
								</View>
							</TouchableOpacity>
						)
					}}
				/> : null}
			{isLoading ? <LoadingView /> : null}
		</View >
		</SafeAreaView>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	buttonContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: FontSize.FS_14,
		textAlign: 'center',
		color: Colors.white,
		fontFamily: ConstantKey.MONTS_MEDIUM
	}
});
export default EventsTab