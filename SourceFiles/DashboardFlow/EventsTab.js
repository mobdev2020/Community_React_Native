
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TouchableHighlight, TouchableHighlightBase, Linking, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
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

const EventsTab = () => {

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
			console.log("Api_Get_Events Response: " + JSON.stringify(response.data.data));

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
				alert(response.data.message);
				setIsLoading(false);

			}
		} catch (error) {
			setIsLoading(false);
			console.log(error);
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
					Alert.alert("Sucess", "Advertises Deleted Sucessfully", [
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
				alert(response.data.message)
				setIsLoading(false);
			}
		}
		catch (error) {
			setIsLoading(false)
			console.log(error)
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
				alert(response.data.message)
				setIsLoading(false);
			}
		}
		catch (error) {
			setIsLoading(false)
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
					Alert.alert("Sucess", "Meeting Deleted Sucessfully", [
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

	return (
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
							borderRadius: 8,
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
							borderRadius: 8,
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
							borderRadius: 8,
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
						flex: 1, marginLeft: 8, borderRadius: 8, height: 34, backgroundColor: index == 0 ? Colors.primary : Colors.lightGrey01
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
						flex: 1, marginLeft: 8, borderRadius: 8, height: 34, backgroundColor: index == 1 ? Colors.primary : Colors.lightGrey01
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
						flex: 1, marginLeft: 8, borderRadius: 8, height: 34, backgroundColor: index == 2 ? Colors.primary : Colors.lightGrey01
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
			{index == 0 ?
				<FlatList
					data={EventsData}
					keyExtractor={(item, index) => index}
					ListFooterComponent={
						(EventHidePagination == false && index == 0 && isLoading == false) &&
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
						!isLoading &&
						<View style={{ justifyContent: "center", alignItems: "center", padding: 10, alignSelf: "center", borderRadius: 10, marginTop: 100 }}>
							<Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, }}>{"No Data Found"}</Text>
						</View>}
					renderItem={({ item, index }) => {
						return (

							<View style={{ marginHorizontal: 20, marginVertical: 5, backgroundColor: Colors.lightGrey01, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary }}>
								<View style={{ width: "100%", height: ConstantKey.SCREEN_HEIGHT / 4.5 }}>
									<FastImage style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, flex: 1, borderRadius: 12 }}
										source={{ uri: item?.event_image_url }}
										resizeMode='cover'
									/>
								</View>
								<View style={{
									borderBottomLeftRadius: 12,
									borderBottomRightRadius: 12,
									padding: 8
								}}>
									<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
									{item?.event_name &&	<Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM }}>{item?.event_name}</Text> }
										<Text style={{ fontSize: FontSize.FS_10, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR }}>{item?.event_start_date}</Text>
									</View>
									<Text numberOfLines={2} style={{ fontSize: FontSize.FS_12, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR }}>{item?.event_desc}</Text>
									{item?.event_link &&<Text onPress={() => { Linking.openURL(item?.event_link) }} numberOfLines={1} style={{ fontSize: FontSize.FS_12, color: Colors.endeavour, fontFamily: ConstantKey.MONTS_REGULAR, marginTop: 4 }}>{item?.event_link}</Text> }
									{Role == "school" &&
									<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginVertical: 5 }}>
										<TouchableOpacity onPress={() => {
											Alert.alert("Alert", "Are you sure wan't to delete advertises?", [
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
											style={{ borderColor: Colors.grey01, borderRadius: 25, paddingVertical: 2, paddingHorizontal: 20, alignItems: "center", borderWidth: 1, marginRight: 12 }}>
											<Text style={{ fontSize: FontSize.FS_13, color: Colors.grey01, fontFamily: ConstantKey.MONTS_REGULAR, }}>{"Delete"}</Text>

										</TouchableOpacity>
										<TouchableOpacity onPress={() => { navigate("AddEvent", { isEdit: true, EventData: item }) }}
											style={{ backgroundColor: Colors.primary, borderRadius: 25, paddingVertical: 2, paddingHorizontal: 26, alignItems: "center" }}>
											<Text style={{ fontSize: FontSize.FS_13, color: Colors.white, fontFamily: ConstantKey.MONTS_REGULAR }}>{"Edit"}</Text>

										</TouchableOpacity>
									</View> }
								</View>
							</View>
						)
					}}
				/> : null}

			{index == 1 && TrainingData.length > 0  ?
				<FlatList
					data={TrainingData}
					keyExtractor={(item, index) => index}
					ListFooterComponent={
						(TrainingHidePagination == false && index == 1 && isLoading == false) &&
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
						<View style={{ justifyContent: "center", alignItems: "center", padding: 10, alignSelf: "center", borderRadius: 10, marginTop: 100 }}>
							<Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, }}>{"No Data Found"}</Text>
						</View>}
					renderItem={({ item, index }) => {
						return (
							<View style={{ marginHorizontal: 20, marginVertical: 5, backgroundColor: Colors.lightGrey01, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary }}>
								<View style={{ width: "100%", height: ConstantKey.SCREEN_HEIGHT / 4.5 }}>
									<FastImage style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, flex: 1, borderRadius: 12 }}
										source={{ uri: item?.training_image_url }}
										resizeMode='cover'
									/>
								</View>
								<View style={{
									borderBottomLeftRadius: 12,
									borderBottomRightRadius: 12,
									padding: 8
								}}>


									<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
										<Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM }}>{item?.training_name}</Text>
										<Text style={{ fontSize: FontSize.FS_10, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR }}>{item?.training_start_date}</Text>
									</View>
									<Text numberOfLines={2} style={{ fontSize: FontSize.FS_12, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR }}>{item?.training_desc}</Text>
									<Text onPress={() => { Linking.openURL(item?.training_link) }} numberOfLines={1} style={{ fontSize: FontSize.FS_12, color: Colors.endeavour, fontFamily: ConstantKey.MONTS_REGULAR, marginTop: 4 }}>{item?.training_link}</Text>


								</View>
							</View>
						)
					}}
				/> : null}

			{index == 2 && MeetingData.length > 0  ?
				<FlatList
					data={MeetingData}
					keyExtractor={(item, index) => index}
					ListFooterComponent={
						(MeetingHidePagination == false && index == 2 && isLoading == false) &&
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
						(isLoading == false) &&
						<View style={{ justifyContent: "center", alignItems: "center", padding: 10, alignSelf: "center", borderRadius: 10, marginTop: 100 }}>
							<Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, }}>{"No Data Found"}</Text>
						</View>}
					renderItem={({ item, index }) => {
						return (

							<View style={{ marginHorizontal: 20, marginVertical: 5, backgroundColor: Colors.lightGrey01, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary }}>
								<View style={{ width: "100%", height: ConstantKey.SCREEN_HEIGHT / 4.5 }}>
									<FastImage style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, flex: 1, borderRadius: 12 }}
										source={{ uri: item?.meeting_image_url }}
										resizeMode='cover'
									/>
								</View>
								<View style={{
									borderBottomLeftRadius: 12,
									borderBottomRightRadius: 12,
									padding: 8
								}}>
									<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
										<Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM }}>{item?.meeting_name}</Text>
										<Text style={{ fontSize: FontSize.FS_10, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR }}>{item?.meeting_start_date}</Text>
									</View>
									<Text numberOfLines={2} style={{ fontSize: FontSize.FS_12, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR }}>{item?.meeting_desc}</Text>
									<Text onPress={() => { Linking.openURL(item?.meeting_link) }} numberOfLines={1} style={{ fontSize: FontSize.FS_12, color: Colors.endeavour, fontFamily: ConstantKey.MONTS_REGULAR, marginTop: 4 }}>{item?.meeting_link}</Text>

									{Role == "school" &&
										<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginVertical: 5 }}>
											<TouchableOpacity onPress={() => {
												Alert.alert("Alert", "Are you sure wan't to delete meeting?", [
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
												style={{ borderColor: Colors.grey01, borderRadius: 25, paddingVertical: 2, paddingHorizontal: 20, alignItems: "center", borderWidth: 1, marginRight: 12 }}>
												<Text style={{ fontSize: FontSize.FS_13, color: Colors.grey01, fontFamily: ConstantKey.MONTS_REGULAR, }}>{"Delete"}</Text>

											</TouchableOpacity>
											<TouchableOpacity onPress={() => { navigate("AddMeeting", { isEdit: true, meetingData: item }) }}
												style={{ backgroundColor: Colors.primary, borderRadius: 25, paddingVertical: 2, paddingHorizontal: 26, alignItems: "center" }}>
												<Text style={{ fontSize: FontSize.FS_13, color: Colors.white, fontFamily: ConstantKey.MONTS_REGULAR }}>{"Edit"}</Text>
											</TouchableOpacity>
										</View>}
								</View>
							</View>
						)
					}}
				/> : null}
			{isLoading ? <LoadingView /> : null}
		</View >
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