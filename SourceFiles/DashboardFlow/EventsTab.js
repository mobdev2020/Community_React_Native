// //import liraries
// import React, { Component } from 'react';
// import { View, Text, StyleSheet, SafeAreaView } from 'react-native';


// // Constants
// import i18n from '../Localize/i18n'
// import { ConstantKey } from '../Constants/ConstantKey'
// import { Colors } from '../Constants/Colors';
// import { Images } from '../Constants/Images';
// import { FontSize } from '../Constants/FontSize';
// import Webservice from '../Constants/API'
// import LoadingView from '../Constants/LoadingView'
// import { APIURL } from '../Constants/APIURL';
// import { version as versionNo } from '../../package.json'
// import ChangePasswordModal from './ChangePasswordModal';


// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// const Tab = createMaterialTopTabNavigator()

// import EventTab from './EventTab';
// import TrainingTab from './TrainingTab';
// import BirthdaysTab from './BirthdaysTab';
// import Meetings from './Meetings';

// // create a component
// const EventsTab = () => {
// 	return (
// 		<SafeAreaView style={{flex : 1, backgroundColor : Colors.white}}>
// 		<Tab.Navigator  screenOptions={{
// 			activeTintColor: Colors.primaryRed,
// 			scrollEnabled:true,
// 			inactiveTintColor : Colors.darkGrey,
// 			indicatorStyle: {
// 				backgroundColor: Colors.primaryRed,
// 				flex : 1
// 			},
// 			labelStyle: { fontSize: FontSize.FS_14, fontFamily: ConstantKey.MONTS_SEMIBOLD },
// 			tabStyle: {
// 				width: 'auto'
// 			},
// 			style: { backgroundColor: Colors.white},
// 		}}>
// 			<Tab.Screen name="Events" component={EventTab} />
// 			<Tab.Screen name="Training" component={TrainingTab} />
// 			{/* <Tab.Screen name="Birthday" component={BirthdaysTab} /> */}
// 			<Tab.Screen name="Meetings" component={Meetings} />
// 		</Tab.Navigator>
// 		</SafeAreaView>
// 	);
// };


// // define your styles
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: Colors.white,
// 	},
// });

// //make this component available to the app
// export default EventsTab;

import { View, Text, TouchableOpacity, StyleSheet, FlatList, TouchableHighlight, TouchableHighlightBase, Linking } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Colors } from '../Constants/Colors'
import { ConstantKey } from '../Constants/ConstantKey'
import { FontSize } from '../Constants/FontSize'
import { Touchable } from 'react-native'
import { navigate } from '../Constants/NavigationService'
import FastImage from 'react-native-fast-image'
import { Images } from '../Constants/Images'

const EventsTab = () => {

	const [index, setIndex] = useState(0)

	const colors = [
		"#DAF7FF",
		"#FFE7EE",
		"#FFEFC0",
	]
	return (
		<View style={{ flex: 1, backgroundColor: Colors.white }}>
			<View style={{ marginVertical: 20 }}>

				{index == 0 ?
					<TouchableOpacity onPress={() => {
						navigate("AddEvent")
						console.log("1")
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
					</TouchableOpacity> : null}
				{index == 1 ? <TouchableOpacity onPress={() => { navigate("AddTraining") }}
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
				</TouchableOpacity> : null}
				{index == 2 ? <TouchableOpacity onPress={() => { navigate("AddMeeting") }}
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
				</TouchableOpacity> : null}

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
			<FlatList
				data={[0, 1, 2, 3, 4,]}
				keyExtractor={(item, index) => index}
				// ListHeaderComponent={<View style={{height:20,}}></View>}
				ListFooterComponent={<View style={{ height: 20, }}></View>}
				renderItem={({ item, index }) => {
					return (
						<View style={{ marginHorizontal: 20, marginVertical: 5, backgroundColor: Colors.lightGrey01, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary }}>
							<View style={{width:"100%",height:ConstantKey.SCREEN_HEIGHT/4.5}}>
							<FastImage style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, flex: 1, borderRadius: 12 }}
								source={Images.Poster}
								resizeMode='cover'
							/>
							</View>
							<View style={{
								borderBottomLeftRadius: 12,
								borderBottomRightRadius: 12,
								padding: 8
							}}>


								<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
									<Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM }}>Conference</Text>
									<Text style={{ fontSize: FontSize.FS_10, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR }}>01/08/2023</Text>
								</View>
								<Text numberOfLines={2} style={{ fontSize: FontSize.FS_12, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Text>
								<Text onPress={() => {Linking.openURL("https://wemanage.webtual.com/")}} numberOfLines={1} style={{ fontSize: FontSize.FS_12, color: Colors.endeavour, fontFamily: ConstantKey.MONTS_REGULAR ,marginTop:4}}>https://wemanage.webtual.com/</Text>


							</View>
						</View>
					)
				}}
			/>
		</View>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	grediant: {
		// marginHorizontal: 8,
		height: 34,
		// alignSelf: 'center',
		borderRadius: 8,
		flex: 1
	},
	buttonContainer: {
		flex: 1,
		// width: "100%",
		// height:"100%"
		// alignSelf: 'center',
		justifyContent: 'center',
		// margin: 1,
		// width:ConstantKey.SCREEN_WIDTH/3.8
		// paddingHorizontal: ConstantKey.SCREEN_WIDTH/16
	},
	buttonText: {
		fontSize: FontSize.FS_14,
		textAlign: 'center',
		color: Colors.white,
		fontFamily: ConstantKey.MONTS_MEDIUM
	}
});
export default EventsTab