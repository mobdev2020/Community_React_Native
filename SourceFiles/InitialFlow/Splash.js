//import liraries
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, Platform, Linking, LogBox } from 'react-native';

// Constants
import { Images } from '../Constants/Images';
import { ConstantKey } from '../Constants/ConstantKey'
import Webservice from '../Constants/API'
import { version as versionNo } from '../../package.json'
import i18n from '../Localize/i18n'


//Third Party
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../Constants/Colors';
import { APIURL } from '../Constants/APIURL';


// create a component
const Splash = ({navigation}) => {

	useEffect(() => {
		LogBox.ignoreLogs(['Warning: ...']);
		getUserData()
		// Api_VersionCheck(false)
	},[])


	const Api_VersionCheck = (isLoad) => {

		// setIsLoading(isLoad)

		Webservice.post(APIURL.versionCheck, {
			version: versionNo,
		})
			.then(response => {
				//   this.setState({spinner: false});
				if (response == null) {
					// this.setState({ isloading: false, isRefresh: false });
					setIsLoading(false)
					alert('error');
				}
				//   console.log(response);

				console.log('Get Version Check Response : ' + JSON.stringify(response))

				if (response.data.Status == '0') {

					Alert.alert(
						i18n.t('update'),
						i18n.t('updateAppDesc'),
						[
							{
								text: "OK", onPress: () => {

									if (Platform.OS == 'android') {

										Linking.openURL('market://details?id=com.webtual.magnusnetwork')
									} else {
										Linking.openURL('itms-apps://itunes.apple.com/us/app/1587460944?mt=8')
									}

								}
							},
						],
						{ cancelable: false }
					);

				} else {
					getUserData()
				}
			})
			.catch((error) => {
				console.log(error.message)

			})
	}

	const getUserData = async () => {
		try {
			const value = await AsyncStorage.getItem(ConstantKey.USER_DATA)
			if (value !== null && value !== "") {
				// value previously stored

				var data = JSON.parse(value)
				console.log("User Data: " + value)

				navigation.replace('Home')
				// navigation.replace('QrCode')
			}
			else {

				navigation.replace('Login')
				// navigation.replace('BusinessProfile')
			}
		} catch (e) {
			navigation.replace('Login')
			console.log("Error : " + e)
		}

	}

	return (
		<View style={styles.container}>
			
			<Image 
				style={{ width:"100%",height:"100%"}}
				source={Images.SplashScreen}
			/>
		</View>
	);
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		// justifyContent: 'center',
		// alignItems: 'center',
		// backgroundColor : Colors.white
	},
});

//make this component available to the app
export default Splash;
