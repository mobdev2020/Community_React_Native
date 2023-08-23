//import liraries
import React, { Component, useLayoutEffect, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView,ScrollView, Dimensions, TouchableOpacity, FlatList, Platform, Modal, TextInput, Linking, Alert, PermissionsAndroid, Image, Keyboard, Switch } from 'react-native';


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
const Profile1 = (props) => {

	const [isLoading, setIsLoading] = useState(false)
	const [userData, setUserData] = useState(JSON.parse(props.route.params.userData))
	const [ChangePasswordVisible, setChangePasswordVisible] = useState(false)

	// Set Navigation Bar
	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerTitle: i18n.t('profile'),
			headerTitleStyle: {
				fontFamily: ConstantKey.MONTS_SEMIBOLD
			},
			headerStyle: {
				backgroundColor: Colors.white,
			},
			headerRight: () => (
					<>

					<TouchableOpacity style={{
						height: 30, width: 30, marginRight: 10,
						borderColor: Colors.primaryRed, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center'
					}}
						onPress={() => btnEditProfileTap()}>
						<Icon name="user-edit" size={15} color={Colors.primaryRed} />
					</TouchableOpacity>

						<TouchableOpacity style={{
							height: 30, width: 30,
							borderColor: Colors.primaryRed, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center'
						}}
							onPress={() => {

								if (userData != null) {
									btnLogoutTap()
								}

							}}>  

							{userData != null ?
								<Icon name="sign-out-alt" size={15} color={Colors.primaryRed} />
								: null}
						</TouchableOpacity>
					</>
			),
			// headerLeftContainerStyle: { marginLeft: 10, },
			headerTintColor: Colors.primaryRed,
			headerBackTitleVisible: false,
		});
	}, [props, userData]);


	useEffect(() => {

		
		const unsubscribe = props.navigation.addListener('focus', () => {
			
			console.log("Profile Data : " + JSON.stringify(userData))
			// Api_Get_Profile(true, userData.id)
		
		  });
	  
		  return unsubscribe;


	}, [])


	const Api_Get_Profile = (isLoad, id) => {

		setIsLoading(isLoad)


		Webservice.post(APIURL.getProfile,{
			member_id : id,
		})
			.then(response => {

				setIsLoading(false)
				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("Api_Get_Profile Response : "+JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.Status == '1') {
					
					var data = response.data.Data

					setUserData(response.data.Data)

					if(data.birthdate == null){
					
						Alert.alert("","We didn't find your birthday date, Please add your birthday date.",[
							{
								text : 'Update',
								onPress : () => {
									props.navigation.navigate('UpdateProfile',{userData : JSON.stringify(data)})
								}
							}
	
						],{ cancelable : false })
	
					}

				} else {
					setUserData(null)
					alert(response.data.Msg)
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}



	const Api_Logout = (isLoad) => {

		setIsLoading(isLoad)

		console.log("API_LOGOUT User na Data :"+JSON.stringify(userData))

		Webservice.post(APIURL.logout,{
			member_id : userData.id,
		})
			.then(response => {

				setIsLoading(false)
				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("API_LOGOUT Response : "+JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.Status == '1') {
					clearAll(props)
					// setUserData(null)
				} else {
					alert(response.data.Msg)
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}


	const Api_DeActive_Account = (isLoad) => {

		setIsLoading(isLoad)

		console.log("Api_DeActive_Account User na Data :"+JSON.stringify(userData))

		Webservice.post(APIURL.deactivate,{
			member_id : userData.id,
		})
			.then(response => {

				setIsLoading(false)
				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify("Api_DeActive_Account Response : "+JSON.stringify(response)));
				// setIsLoading(false)

				if (response.data.Status == '1') {

					Toast.showWithGravity("Account Deleted Successfully", Toast.LONG, Toast.BOTTOM);

					clearAll(props)

				} else {
					alert(response.data.Msg)
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}


	const clearAll = async (props) => {

		try {
			await AsyncStorage.clear()
			
			props.navigation.dispatch(
				StackActions.replace('Login')
			);
			
		} catch (e) {
			// clear error
		}
	}


	// API Change Password
	const Api_ChangePassword = (isLoad) => {

		setIsLoading(isLoad)

		Webservice.post(APIURL.changePassword)
			.then(response => {

				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify(response));
				setIsLoading(false)

				if (response.data.Status == '1') {

				} else {
					Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}



	// Action Methods
	const btnEditProfileTap = () => {
		requestAnimationFrame(() => {

			props.navigation.navigate('UpdateProfile',{userData : JSON.stringify(userData)})
		})
	}

	const btnLogoutTap = () => {
		requestAnimationFrame(() => {

			Alert.alert(
				i18n.t('appName'),
				i18n.t('logoutDesc'),
				[
					{ text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
					{
						text: 'Yes',
						onPress: () => {

							Api_Logout(true)
							// clearAll(props)

						}
					},
				],
				{ cancelable: true }
			);
		})
	}


	const ConfirmChangeTap = (item) => {
		requestAnimationFrame(() => {

			console.log(item)
			setChangePasswordVisible(false)

			setTimeout(() => {
				
				Alert.alert(
					'',
					item,
					[
						{
							text: 'OK',
							onPress: () => {
	
								Api_Logout(true)
								// clearAll(props)
	
							}
						},
					],
					{ cancelable: false }
				);

			}, 1000);
			
		})
	}


	const btnViewGainSheet = () => {
		requestAnimationFrame(() => {

			Linking.openURL(userData.gain_sheet)
			// props.navigation.navigate('ViewGainSheet',{url : userData.gain_sheet})
		})
	}


	const btnDeleteAccountTap = () => {
		requestAnimationFrame(() => {
			Alert.alert(
				i18n.t('alert'),
				i18n.t('delete_account_desc'),
				[
					{ text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
					{
						text: 'Yes',
						onPress: () => {

							Api_DeActive_Account(true)
							
						}
					},
				],
				{ cancelable: true }
			);
		})
	}



	return (
		<SafeAreaView style={styles.container}>

			<View style={styles.container}>


				<ScrollView style={{ marginLeft: 15, marginRight: 15, marginTop: 20 }} showsVerticalScrollIndicator={false}>

					<View style={{ flexDirection: 'row', justifyContent: 'center', }}>

						<View style={{
							backgroundColor: Colors.white, borderRadius: 10, marginLeft: 5, marginTop: 5, height: 90, width: 90, alignItems: 'center', justifyContent: 'center',
							// shadowColor: Colors.black03, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.5, shadowRadius: 4, elevation: 4
						}}>
							<Image style={{ height: 80, width: 80, }}
								resizeMode='cover'
								source={userData.company_logo == null ? Images.UserPlaceHolder : { uri: userData.company_logo }} />
						</View>


						<View style={{ flex: 1, marginLeft: 20, backgroundColor: Colors.white }}>
							<Text style={styles.calloutTitle}>{userData.name}</Text>


							{userData.business_profile != null ?
								<Text style={styles.calloutbusinessname}>{userData.business_profile}</Text>
								: null}

							{userData.email != null ?
								<Text style={styles.calloutDescription}>{userData.email}</Text>
								: null}

							{userData.mobile != null ?
								<Text style={styles.calloutDescription}>+91 {userData.mobile}</Text>
								: null}
							{userData.birthdate != null ?
								<Text style={styles.calloutDescription}><Icon name={'birthday-cake'} size={14} color={Colors.darkGrey}/> {moment(userData.birthdate).format("DD-MM-YYYY") }</Text>
								: null}

						</View>
						
					</View>


					<View style={{flex : 1}}>

						{userData.gain_sheet != null ?
							<TouchableOpacity style={styles.btnViewGainSheet}
								onPress={() => btnViewGainSheet()}>
								<Text style={[styles.txtChangePassword,{color : Colors.primaryRed}]}>
									{i18n.t('view_gain_sheet')}
								</Text>
							</TouchableOpacity>
						: null}

							{userData.profile_address != null ?
								<>
									<Text style={[styles.calloutbusinessname,{marginTop : 15}]}>Address</Text>
									<Text style={styles.calloutDescription}>{userData.profile_address}</Text>
								</>
							: null}

							{userData.business_tag != null ?
								<>
									<Text style={[styles.calloutbusinessname, { marginTop: 10 }]}>Business Tag</Text>
									<Text style={[styles.calloutDescription]}>{userData.business_tag}</Text>
								</>
							: null}

							{userData.business_description != null ?
								<>
									<Text style={[styles.calloutbusinessname, { marginTop: 10 }]}>Description</Text>
									<Text style={[styles.calloutDescription]}>{userData.business_description}</Text>
								</>
							: null}


						<TouchableOpacity style={styles.btnChangePassword}
							onPress={() => setChangePasswordVisible(true)}>
							<Text style={styles.txtChangePassword}>
								{i18n.t('change_password')}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.btnDeleteAccount}
							onPress={() => btnDeleteAccountTap()}>
							<Text style={styles.txtDeleteAccount}>
								{i18n.t('delete_account')}
							</Text>
						</TouchableOpacity>

					</View>


					<ChangePasswordModal
						isOpen={ChangePasswordVisible}
						onClose={() => setChangePasswordVisible(false)}
						onSubmit={(data) => ConfirmChangeTap(data)} 
						userData={userData}/>

				</ScrollView>

				{isLoading ? <LoadingView/> : null}
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
	calloutTitle: {
		fontSize: FontSize.FS_18,
		fontFamily: ConstantKey.MONTS_SEMIBOLD,
		color: Colors.primaryRed
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
	btnChangePassword: {
		 backgroundColor: Colors.primaryRed,
		marginTop: 30, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
		shadowColor: Colors.primaryRed,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
	},
	txtChangePassword: {
		fontSize: FontSize.FS_18, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
	btnDeleteAccount: {
		backgroundColor: Colors.primaryRed,
	   marginTop: 20,marginBottom : 30, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
	   shadowColor: Colors.primaryRed,
	   shadowOffset: { width: 0, height: 2 },
	   shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
   },
   txtDeleteAccount: {
	   fontSize: FontSize.FS_18, color: Colors.white,
	   fontFamily: ConstantKey.MONTS_SEMIBOLD
   },
	btnViewGainSheet : {
		backgroundColor: Colors.white, borderWidth : 1, borderColor : Colors.primaryRed,
		marginTop: 20, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
		shadowColor: Colors.primaryRed,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
	},
});

//make this component available to the app
export default Profile1;
