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


// create a component
const BirthdaysTab = (props) => {


	const [isLoading, setIsLoading] = useState(false)
	const [UserData ,setUserData] = useState(null)
	const [ArrBirthday, setArrBirthday] = useState([])


	// Set Navigation Bar
	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerTitle: i18n.t('birthday'),
			headerTitleStyle: {
				fontFamily: ConstantKey.MONTS_SEMIBOLD
			},
			headerStyle: {
				backgroundColor: Colors.white,
			},
			headerTintColor: Colors.primaryRed,
			headerBackTitleVisible: false,
		});
	}, [props,]);



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

				Api_BirthdayList(true, data.id)
			}
			else {

			}
		} catch (e) {
			console.log("Error : " + e)
		}

	}


	// Get all Birthday
	const Api_BirthdayList = (isLoad, user_id) => {

		setIsLoading(isLoad)
		// APIURL.getCurrentMonthBirthday
		Webservice.post(APIURL.getAllBirthday,{
			member_id : user_id
		})
			.then(response => {

				setIsLoading(false)
				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("Api_BirthdayList Response : " + JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.Status == '1') {

					var member_data = response.data.member_data
					var upcoming_member_data = response.data.upcoming_member_data
					member_data = member_data.concat(upcoming_member_data)
					console.log("Arr : "+JSON.stringify(member_data))

					setArrBirthday(member_data)
				} else {

					// var arr = []
					// arr.push(response.data.Data.member_data)
					// arr.push(response.data.Data.upcoming_member_data)

					// console.log("Arr : "+JSON.stringify(arr))

					setArrBirthday([])
					// alert(response.data.Msg)
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}


	// Action Methods
	const btnSelectProfile = (item) => {
		requestAnimationFrame(() => {

			props.navigation.navigate('MembersProfile',{ member_data :  String(item.id)})
		})
	}


	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.container}>

				<View style={{marginHorizontal : 20, marginVertical : 20, borderRadius : 50, height : 180, shadowColor : Colors.black, shadowOffset : {width : 0, height : 3},
					shadowOpacity : 0.4, shadowRadius : 4, elevation : 4,}}>

					<Image
						style={{flex : 1, width : '100%', borderRadius : 10}}
						resizeMode={'cover'}
						source={Images.BirthdayCardBG}
					/>

					<View style={{position: 'absolute', height : '100%', width : '100%',justifyContent : 'center'}}>
						<Text style={{marginLeft : 25, fontSize : FontSize.FS_40, fontFamily : ConstantKey.MILKSHAKE, color : Colors.primaryRed}}>
							{/* {moment(new Date()).format('MMMM')+"\n"+"Birthday"} */}
							Birthday's
						</Text>
					</View>

				</View>


					<View style={{backgroundColor : Colors.white, borderRadius : 10, marginHorizontal : 20, shadowColor : Colors.black, shadowOffset : {width : 0, height : 3},
						shadowOpacity : 0.4, shadowRadius : 4, elevation : 4, flex : 1, marginBottom : 20}}>

						<Image
							style={{height : '100%', width : '100%', borderRadius : 10, opacity : 0.6}}
							source={Images.birthDayBg}
						/>

						{ArrBirthday.length != 0 ?
						<FlatList
							style={{position : 'absolute', height : '100%', width : '100%'}}
							data={ArrBirthday}
							renderItem={({item ,index}) => {
								return(
									<>
										<TouchableOpacity style={{ flexDirection: 'row', padding: 10 }}
											onPress={() => btnSelectProfile(item)}>
											<View style={{ flex: 0.5, alignItems : 'center' }}>

												<Text style={{fontSize : FontSize.FS_16, color : Colors.black, fontFamily : ConstantKey.MONTS_MEDIUM}}>
													{moment(item.birthdate).format('D MMMM')}
												</Text>

											</View>
											<View style={{ flex: 0.5 }}>
												<Text style={{fontSize : FontSize.FS_16, color : Colors.primaryRed, fontFamily : ConstantKey.MONTS_BOLD, textTransform : 'capitalize'}}>
													{item.name}
												</Text>
											</View>
										</TouchableOpacity>
										{index == ArrBirthday.length - 1 ? null : <View style={{ height: 1, backgroundColor: Colors.darkGrey, flex: 1, marginHorizontal: 10 }}></View>}
									</>
								)
							}}
						/>

						: 
							(!isLoading ? 
							<View style={{height : '100%', width : '100%', alignItems : 'center', justifyContent : 'center', position : 'absolute'}}>

								<Icon name='' size={40} color={Colors.darkGrey}/>
								<Text style={{fontSize : FontSize.FS_16, color : Colors.black, fontFamily : ConstantKey.MONTS_REGULAR}}>
									Data not found
								</Text>
							</View>
							:null)
						}
					</View>

			</View>

			{isLoading ? <LoadingView/> : null}
			
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
export default BirthdaysTab;
