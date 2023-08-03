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
const Report = (props) => {


	const [isLoading, setIsLoading] = useState(false)
	const [txtDescription, setTxtDescription] = useState('')

	const [UserData, setUserData] = useState(JSON.parse(props.route.params.userData))

	// Set Navigation Bar
	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerTitle: i18n.t('suggetion'),
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



		// API Add Sugession
		const Api_Add_Suggetions = (isLoad) => {

			setIsLoading(isLoad)
	
			Webservice.post(APIURL.addSuggestion,{
				member_id : UserData.id,
				description : txtDescription
			})
				.then(response => {
	
					if (response == null) {
						setIsLoading(false)
					}
					console.log(JSON.stringify(response));
					setIsLoading(false)
	
					if (response.data.Status == '1') {
	
						Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
						setTxtDescription('')

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
	const btnAddTap = () => {
		requestAnimationFrame(() => {

			if(txtDescription == ''){
				alert("Please add message")
			}else{
				Keyboard.dismiss()
				Api_Add_Suggetions(true)
			}
		})
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.container}>

				<ScrollView style={styles.container}>
					<View style={{ marginHorizontal: 20, }}>

						<Text style={{ fontSize: FontSize.FS_14, color: Colors.primaryRed, fontFamily: ConstantKey.MONTS_MEDIUM, marginTop: 15 }}>
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
		marginTop: 10, flexDirection: 'row', borderWidth: 1, borderColor: Colors.darkGrey, borderRadius: 10, backgroundColor: Colors.white,
		paddingVertical : 10, minHeight : 100
	},
	textInputMobile: {
		marginLeft: 10, marginRight: 10, flex: 1, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black,  paddingVertical: 0,
	},
	btnSubmit: {
		backgroundColor: Colors.primaryRed,
		marginTop: 30, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
		shadowColor: Colors.primaryRed, marginBottom : 20,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
	},
	submitText: {
		fontSize: FontSize.FS_20, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default Report;
