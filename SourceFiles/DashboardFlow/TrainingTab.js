//import liraries
import React, { Component, useLayoutEffect, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, 
		TouchableOpacity, FlatList, Platform, Modal, TextInput, Linking, Alert, PermissionsAndroid, Image, Keyboard, Switch, ImageBackground } from 'react-native';


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
import ImageView from "react-native-image-viewing";


// create a component
const TrainingTab = (props) => {


	const [isLoading, setIsLoading] = useState(false)
	const [UserData ,setUserData] = useState(null)
	const [Trainings, setTrainings] = useState(null)

	const [IsVisibleImg, setIsVisibleImg] = useState(false)


	// Set Navigation Bar
	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerTitle: i18n.t('training'),
			headerTitleStyle: {
				fontFamily: ConstantKey.MONTS_SEMIBOLD
			},
			headerStyle: {
				backgroundColor: Colors.white,
			},
			headerRight: () => (
				
				(UserData != null && UserData.permission.training == 1 ?

					<TouchableOpacity style={{
						height: 30, width: 30, marginRight : 10,
						borderColor: Colors.primaryRed, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center'
					}}
						onPress={() => btnAddTap(UserData)}>
						<Icon name={Trainings == null ? "plus" : "edit"} size={15} color={Colors.primaryRed} solid/>
					</TouchableOpacity>

				:null
				)
			
		),
			headerTintColor: Colors.primaryRed,
			headerBackTitleVisible: false,
		});
	}, [props,UserData, Trainings]);



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

				Api_TrainingList(true, data.id)
			}
			else {

			}
		} catch (e) {
			console.log("Error : " + e)
		}

	}


	// Get all Training
	const Api_TrainingList = (isLoad, user_id) => {

		setIsLoading(isLoad)

		Webservice.post(APIURL.getTraining,{
			member_id : user_id
		})
			.then(response => {

				setIsLoading(false)
				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("Api_TrainingList Response : " + JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.Status == '1') {

					setTrainings(response.data.Data)
				} else {

					setTrainings(response.data.Data)
					// alert(response.data.Msg)
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}


	// Action Methods
	const btnAddTap = (userData) => {
		requestAnimationFrame(() => {

			props.navigation.navigate('AddTraining',{user_data : JSON.stringify(userData), training_data : JSON.stringify(Trainings)})

		})
	}


	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.container}>

				{Trainings != null ?
				<ScrollView style={{ flex: 1 }}>

					<View style={{
						marginHorizontal: 20, marginVertical: 20, borderRadius: 10, borderWidth: 1, borderColor: Colors.primaryRed,
						height: 200,
					}}>

						<TouchableOpacity onPress={() => setIsVisibleImg(true) }>
							<Image style={{ height: '100%', width: '100%', borderRadius: 10, }}
								source={{uri : Trainings.training_image}} />
						</TouchableOpacity>

					</View>

					<View style={{marginHorizontal : 20}}>

						<Text style={[styles.calloutbusinessname]}>Title</Text>
						<Text style={[styles.calloutDescription]}>{Trainings.title}</Text>

						<Text style={[styles.calloutbusinessname,{marginTop : 20}]}>Description</Text>
						<Text style={[styles.calloutDescription]}>{Trainings.description}</Text>

					</View>
					
						<ImageView
							images={[{ uri: Trainings.training_image }]}
							imageIndex={0}
							visible={IsVisibleImg}
							onRequestClose={() => setIsVisibleImg(false)}
						/>

					</ScrollView>

					:
					(!isLoading ?
						<View style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', }}>

							<Icon name='' size={40} color={Colors.darkGrey} />
							<Text style={{ fontSize: FontSize.FS_16, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR }}>
								Data not found
							</Text>
						</View>
					: null)
				}

				{UserData != null && UserData.permission.training == 1 ?
					<TouchableOpacity style={{ backgroundColor: Colors.primaryRed, padding: 10, alignItems: 'center', justifyContent: 'center' }}
						onPress={() => btnAddTap(UserData)}>
						<Text style={{ color: Colors.white, fontFamily: ConstantKey.MONTS_SEMIBOLD, fontSize: FontSize.FS_16 }}>
							Update Training
						</Text>
					</TouchableOpacity>
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
	calloutbusinessname: {
		fontSize: FontSize.FS_14,
		fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black,
		marginTop : 5
	},
	calloutDescription: {
		marginTop: 5,
		fontSize: FontSize.FS_14,
		fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.darkGrey,
		
	},
});

//make this component available to the app
export default TrainingTab;
