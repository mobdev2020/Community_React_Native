//import liraries
import React, { Component, useLayoutEffect, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, 
		TouchableOpacity, FlatList, Platform, Modal, TextInput, Linking, Alert, PermissionsAndroid, Image, Keyboard, Switch, ImageBackground, StatusBar } from 'react-native';


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

// Third Party
import { StackActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import moment from 'moment';



// create a component
const Report = (props) => {


	const [isLoading, setIsLoading] = useState(false)
	const [txtDescription, setTxtDescription] = useState('')




		// API Add Sugession
		const Api_Add_Suggetions = (isLoad) => {
			setIsLoading(isLoad)
			Webservice.post(APIURL.AddSuggestion,{
				description : txtDescription
			})
				.then(response => {
					console.log("Api_Add_Suggetions",JSON.stringify(response));
					setIsLoading(false)
					if (response.data.status == true) {
						Toast.showWithGravity(response.data.message, Toast.LONG, Toast.CENTER);
						setTxtDescription('')
					} else {
						Toast.showWithGravity(response.data.message, Toast.LONG, Toast.CENTER);
					}
				})
				.catch((error) => {
					setIsLoading(false)
					console.log(error)
				})
		}




	// Action Methods
	const btnAddTap = () => {
		requestAnimationFrame(() => {

			if(txtDescription == ''){
				Toast.showWithGravity("Please add message", Toast.LONG, Toast.CENTER);
			}else{
				Keyboard.dismiss()
				Api_Add_Suggetions(true)
			}
		})
	}

	return (
		<SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'}/>

			<View style={styles.container}>

			<View style={{ flexDirection: "row", alignItems: "center",marginVertical:5 , marginHorizontal : 10 }}>
						<TouchableOpacity onPress={() => { props.navigation.goBack() }}
							style={{ marginRight: 10, padding: 10 }}>
							<Icon name={"chevron-left"} size={18} color={Colors.black} />

						</TouchableOpacity>

						<Text style={{
							fontSize: FontSize.FS_18,
							color: Colors.black,
							fontFamily: ConstantKey.MONTS_SEMIBOLD,
						}}>
							{"Suggestion"}
						</Text>

					</View>
				<ScrollView style={styles.container}>
					<View style={{ marginHorizontal: 20, }}>
					
						<Text style={{ fontSize: FontSize.FS_14, color: Colors.black, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
							Message
						</Text>
						<View style={[styles.mobileView]}>

							{/* <Icon name={"info"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }} /> */}

							<TextInput style={[styles.textInputMobile]}
								value={txtDescription}
								multiline
								// maxLength={250}
								placeholder={'Type here...'}
								returnKeyType={'done'}
								onChangeText={(desc) => setTxtDescription(desc)}
							/>

						</View>

						{/* <Text style={{marginTop : 5, alignSelf :'flex-end', fontSize : FontSize.FS_14, color : Colors.darkGrey, fontFamily : ConstantKey.MONTS_REGULAR}}>
							{txtDescription.length} / 250
						</Text> */}


						<TouchableOpacity style={styles.btnSubmit}
							onPress={() => btnAddTap()}>
							<Text style={styles.submitText}>
								{i18n.t("add")}
							</Text>
						</TouchableOpacity>

					</View>
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
	mobileView: {
		marginTop: 10, flexDirection: 'row', borderRadius: 10, backgroundColor: Colors.lightGrey01,
		paddingVertical : 10, minHeight : 100
	},
	textInputMobile: {
		marginLeft: 10, marginRight: 10, flex: 1, fontSize: FontSize.FS_14, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black,  paddingVertical: 0,
	},
	btnSubmit: {
		backgroundColor: Colors.black,
		marginTop: 30, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',marginBottom : 20,
		// shadowColor: Colors.primaryRed, 
		// shadowOffset: { width: 0, height: 2 },
		// shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
	},
	submitText: {
		fontSize: FontSize.FS_16, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default Report;
