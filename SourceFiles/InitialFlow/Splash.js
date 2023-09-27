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
	},[])

	const getUserData = async () => {
		try {
			const value = await AsyncStorage.getItem(ConstantKey.USER_DATA)
			if (value !== null && value !== "") {
				var data = JSON.parse(value)
				console.log("User Data: " + value)
				navigation.replace('Home')
			}
			else {
				navigation.replace('Login')
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
