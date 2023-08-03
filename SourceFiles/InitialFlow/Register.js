//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, Keyboard, ImageBackground, ScrollView } from 'react-native';


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
import PolicyModal from '../DashboardFlow/PolicyModal';


//Third Party
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';


// create a component
const Register = (props) => {

	const [isLoading, setIsLoading] = useState(false)
	const [txtName, setTxtName] = useState('')
	const [txtEmail, setTxtEmail] = useState('')
	const [txtMobile, setTxtMobile] = useState('')
	const [txtPassword, setTxtPassword] = useState('')
	const [acceptTerms, setAcceptTerms] = useState(true)
	const [openPrivacy, setOpenPrivacy] = useState(false)


	const Api_Register = (isLoad) => {

		setIsLoading(isLoad)

		Webservice.post(APIURL.registerUser, {
			name : txtName,
			email : txtEmail,
			mobile: txtMobile,
			password: txtPassword

		})
			.then(response => {

				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify(response));
				setIsLoading(false)

				if (response.data.Status == '1') {

					// storeUserData(JSON.stringify(response.data.Data[0]))
					Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
					props.navigation.replace('Login')
				} else {
					Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
			})
	}

	const storeUserData = async (value) => {
		try {
			await AsyncStorage.setItem(ConstantKey.USER_DATA, value)
			props.navigation.replace('Home')
		} catch (e) {
			// saving error
		}
	}

	// Action Methods
	const btnRegisterTap = () => {
		requestAnimationFrame(() => {

			Keyboard.dismiss()

			if(txtName == ''){
				Toast.showWithGravity(i18n.t('enterName'), Toast.LONG, Toast.BOTTOM);
			}
			else if (txtMobile == '') {
				Toast.showWithGravity(i18n.t('enterMobileNumber'), Toast.LONG, Toast.BOTTOM);
			}
			else if (txtMobile.length < 10) {
				Toast.showWithGravity(i18n.t('validMobile'), Toast.LONG, Toast.BOTTOM);
			}
			else if (txtPassword == '') {
				Toast.showWithGravity(i18n.t('enterPassword'), Toast.LONG, Toast.BOTTOM);
			} else {
				Api_Register(true)
			}

		})
	}

	const toggleTerms = (value) => {

		setAcceptTerms(!acceptTerms)
	}

	const btnLoginTap = () => {
		requestAnimationFrame(() => {

			props.navigation.replace('Login')

		})
	}


	return (
		// <SafeAreaView style={styles.container}>
		<View style={styles.container}>
			<View style={{ flex: 1, backgroundColor: Colors.white }}>

				<ImageBackground
					style={{ flex: 1, opacity: 0.4 }}
					source={Images.Background} />

				<ScrollView style={{ flexGrow: 1, height : '100%', width : '100%', position: 'absolute', }}>


					<SafeAreaView style={{flex : 1, marginTop : 100}}>

					
					<Image style={{ width: '60%', height: 150, alignSelf: 'center', resizeMode: 'contain' }}
						source={Images.MagnusLogo} />

					<View style={styles.mobileView}>

						<Icon name={"user"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }} />

						<TextInput style={styles.textInputMobile}
							value={txtName}
							placeholder={'Name'}
							returnKeyType={'done'}
							onChangeText={(txtname) => setTxtName(txtname)}
						/>

					</View>


					<View style={styles.mobileView}>

						<Icon name={"envelope"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }} />

						<TextInput style={styles.textInputMobile}
							value={txtEmail}
							autoCapitalize={'none'}
							placeholder={'Email ID'}
							returnKeyType={'done'}
							onChangeText={(txtEmail) => setTxtEmail(txtEmail)}
						/>

					</View>


					<View style={styles.mobileView}>

						<Icon name={"mobile-alt"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }} />

						<TextInput style={styles.textInputMobile}
							maxLength={10}
							value={txtMobile}
							placeholder={'Mobile number'}
							keyboardType={'number-pad'}
							returnKeyType={'next'}
							onChangeText={(txtMobile) => setTxtMobile(txtMobile.replace(/[^0-9]/g, ''))}
						/>

					</View>

					<View style={styles.mobileView}>

						<Icon name={"key"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }} />

						<TextInput style={styles.textInputMobile}
							value={txtPassword}
							placeholder={'Password'}
							secureTextEntry={true}
							returnKeyType={'done'}
							onChangeText={(txtPassword) => setTxtPassword(txtPassword)}
						/>


					</View>

					<View style={{flexDirection : 'row',  marginLeft : 20, marginRight : 20, marginTop : 10, alignItems : 'center'}}>
						<TouchableOpacity style={{padding : 5, justifyContent : 'center', alignItems : 'center'}}
							onPress={() => toggleTerms()}>
							<Icon name={acceptTerms ? "check-square" : 'square'} size={20} color={Colors.primaryRed}/>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => setOpenPrivacy(true)}>
					
						<Text style={{marginLeft : 5, fontSize: FontSize.FS_12, color: Colors.black,
									fontFamily: ConstantKey.MONTS_SEMIBOLD}}>
							By Continuing, you accept privacy policy
						</Text>
						</TouchableOpacity>
					</View>


					<TouchableOpacity style={styles.btnLogin}
						onPress={() => btnRegisterTap()}>
						<Text style={styles.loginText}>
							Register
						</Text>
					</TouchableOpacity>

					<View style={{ margin: 20 }}>

						{isLoading == false ?
							<TouchableOpacity style={{ alignSelf: 'center' }}>
								<Text style={{
									textAlign: 'center', fontSize: FontSize.FS_14, color: Colors.black,
									fontFamily: ConstantKey.MONTS_SEMIBOLD
								}}
									onPress={() => btnLoginTap()}>
									Already Register? Login
								</Text>
							</TouchableOpacity>
							: null}

					</View>

					<PolicyModal
					isOpen={openPrivacy}
					onClose={() => {
						setOpenPrivacy(false)
					}}
				/>

					</SafeAreaView>
					{/* </ScrollView> */}
				</ScrollView>
			</View>

			{isLoading ?
				<LoadingView text={"Please Wait..."} />
				: null}
		</View>
		// </SafeAreaView>
	);
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	mobileView: {
		marginTop: 20, flexDirection: 'row', borderWidth: 1, borderColor: Colors.darkGrey, borderRadius: 10, backgroundColor: Colors.white,
		height: 50, marginLeft: 20, marginRight: 20, alignItems: 'center'
	},
	countryCodeText: {
		marginLeft: 10, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black
	},
	textInputMobile: {
		marginLeft: 10, marginRight: 10, height: 50, flex: 1, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black,
	},
	btnLogin: {
		marginLeft: 20, marginRight: 20, backgroundColor: Colors.primaryRed,
		marginTop: 30, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
		shadowColor: Colors.primaryRed,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
	},
	loginText: {
		fontSize: FontSize.FS_18, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default Register;
