//import liraries
import React, { Component, useLayoutEffect, useEffect, useState, useRef , useCallback} from 'react';
import {
	View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions,
	TouchableOpacity, FlatList, Platform, Modal, TextInput, Linking, Alert, PermissionsAndroid, Image, Keyboard, Switch, LayoutAnimation
} from 'react-native';


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
import YoutubePlayer from "react-native-youtube-iframe";

// create a component
const Help = (props) => {

	const [isLoading, setIsLoading] = useState(false)
	const [UserData, setUserData] = useState(null)
	const [ArrHelp, setArrHelp] = useState([])

	const [playing, setPlaying] = useState(false);

	const [Description_expanded, setDescription_expanded] = useState(false)
	const [questionIndex, setQuestionIndex] = useState(0)

	// Set Navigation Bar
	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerTitle: i18n.t('help'),
			headerTitleStyle: {
				fontFamily: ConstantKey.MONTS_SEMIBOLD
			},
			headerStyle: {
				backgroundColor: Colors.white,
			},
			headerTintColor: Colors.primaryRed,
			headerBackTitleVisible: false,
		});
	}, [props]);



	useEffect(() => {

		getUserData()

		// const unsubscribe = props.navigation.addListener('focus', () => {

		// });


		// return () => {
		// 	unsubscribe
		// }
	}, [])


	const getUserData = async () => {


		try {
			const value = await AsyncStorage.getItem(ConstantKey.USER_DATA)
			if (value !== null) {
				// value previously stored

				var data = JSON.parse(value)
				console.log("User Data: " + value)

				setUserData(data)

				Api_HelpList(true, data.id)
			}
			else {

			}
		} catch (e) {
			console.log("Error : " + e)
		}

	}


	// Get all Help
	const Api_HelpList = (isLoad, user_id) => {

		setIsLoading(isLoad)

		Webservice.post(APIURL.getHelp, {
			member_id: user_id
		})
			.then(response => {

				setIsLoading(false)
				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("Api_HelpList Response : " + JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.Status == '1') {

					setArrHelp(response.data.Data)
				} else {

					setArrHelp(response.data.Data)
					// alert(response.data.Msg)
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}


	const Description_changeLayout = (index) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setDescription_expanded(!Description_expanded)
		setQuestionIndex(index)
	}


	// Youtube Player 
	const onStateChange = useCallback((state) => {
		if (state === "ended") {
		  setPlaying(false);
		  Alert.alert("video has finished playing!");
		}
	  }, []);
	
	  const togglePlaying = useCallback(() => {
		setPlaying((prev) => !prev);
	  }, []);


	  const splitString = (url) => {

		let videoId = url.split('/')

		console.log("video : "+JSON.stringify(videoId.slice(-1)[0]))

		return videoId.slice(-1)[0]
	  }

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.container}>

				<View style={styles.mainView}>

					<FlatList
						style={{ marginTop: 10 }}
						data={ArrHelp}
						renderItem={({ item, index }) => (
							<View style={{
								marginBottom: 10,
								shadowColor: Colors.black03, backgroundColor: Colors.white, borderBottomColor: Colors.darkGrey, borderBottomWidth: 1
							}}>

								<TouchableOpacity
									onPress={() => Description_changeLayout(index)}
									style={{
										alignItems: 'center', flexDirection: 'row', height: 50, borderRadius: 10, backgroundColor: Colors.white,
										borderRadius: 10, justifyContent: 'space-between'
									}}>

									<Text style={{
										marginLeft: 20, color: Colors.black, fontFamily: ConstantKey.MONTS_SEMIBOLD, fontSize: FontSize.FS_14,
										color: Colors.nero, justifyContent: 'center', marginRight: 10, flex: 1,
									}}
										numberOfLines={2}>
										{item.description}
									</Text>

									<Icon size={10} color={Colors.nero}
										style={{ marginRight: 20 }}
										name={questionIndex == index ? Description_expanded ? 'chevron-up' : 'chevron-down' : "chevron-down"} />

								</TouchableOpacity>
								{questionIndex == index ?

									<View style={{
										height: Description_expanded ? null : 0, overflow: 'hidden', marginLeft: 20, marginRight: 20,
										backgroundColor: Colors.white
									}}>
										<YoutubePlayer
											height={220}
											play={playing}
											videoId={splitString(item.video_url)}
											onChangeState={onStateChange}
										/>
									</View>
									:
									<View style={{ height: 0, overflow: 'hidden' }}>
										<YoutubePlayer
											height={0}
											play={playing}
											videoId={splitString(item.video_url)}
											onChangeState={onStateChange}
										/>
									</View>
								}
							</View>

						)}
					/>

				</View>
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
export default Help;
