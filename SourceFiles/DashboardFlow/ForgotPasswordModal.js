//import liraries
import React, { Component, useLayoutEffect, useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, FlatList, Platform, Modal, TextInput, Linking, Alert, PermissionsAndroid, Image, Keyboard, ScrollView } from 'react-native';

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
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-simple-toast';


// create a component
const ForgotPasswordModal = ({ isOpen, onClose, onSubmit }) => {


	const [txtMobile, setTxtMobile] = useState('')
	const [txtPassword, setTxtPassword] = useState('')


	// Action Methods
	const btnLoginTap = () => {
		requestAnimationFrame(() => {

			Keyboard.dismiss()

			if(txtMobile == ''){
				Toast.showWithGravity(i18n.t('enterMobileNumber'), Toast.LONG, Toast.BOTTOM);
			}
			else if(txtMobile.length < 10){
				Toast.showWithGravity(i18n.t('validMobile'), Toast.LONG, Toast.BOTTOM);
			}
			else{

				var dict = {}
				dict['mobile'] = txtMobile
				onSubmit(dict)
			}
			
		})
	}

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={isOpen}
			onRequestClose={() => {
				//Alert.alert("Modal has been closed.");
			}}
		>
			<View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: Colors.black03 }} >
				<View style={{ width: ConstantKey.SCREEN_WIDTH - 60, backgroundColor: Colors.white, borderRadius: 20, padding: 20 }}>

					<View style={{ flexDirection: 'row' }}>
						<Text style={{ flex: 1, fontSize: FontSize.FS_18, color: Colors.primaryRed, fontFamily: ConstantKey.MONTS_SEMIBOLD }}>
								{i18n.t('forgot_password')}
						</Text>
						<TouchableOpacity onPress={() => {
							onClose()
						}}>
							<Icon name="times-circle" size={25} color={Colors.primaryRed} />
						</TouchableOpacity>
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


					<TouchableOpacity style={styles.btnLogin}
						onPress={() => btnLoginTap()}>
						<Text style={styles.loginText}>
							Check
						</Text>
					</TouchableOpacity>
					
				</View>
			</View>
		</Modal>

	);
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#2c3e50',
	},
	mobileView: {
		marginTop: 20, flexDirection: 'row', borderWidth: 1, borderColor: Colors.darkGrey, borderRadius: 10, backgroundColor: Colors.white,
		height: 50, alignItems: 'center'
	},
	textInputMobile: {
		marginLeft: 10, marginRight: 10, height: 50, flex: 1, fontSize: FontSize.FS_16, fontFamily: ConstantKey.MONTS_REGULAR,
		color: Colors.black,
	},
	btnLogin: {
		backgroundColor: Colors.primaryRed,
		marginTop: 30, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
		shadowColor: Colors.primaryRed,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
	},
	loginText: {
		fontSize: FontSize.FS_20, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default ForgotPasswordModal;
