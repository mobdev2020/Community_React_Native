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
const ChangePasswordModal = ({ isOpen, onClose, onSubmit, userData }) => {

	const [isLoading, setIsLoading] = useState(false)

	const [txtOldPassword, setTxtOldPassword] = useState('')
	const [txtNewPassword, setTxtNewPassword] = useState('')
	const [txtConfirmPassword, setTxtConfirmPassword] = useState('')


	// Action Methods
	const btnConfirmTap = () => {
		requestAnimationFrame(() => {

			Keyboard.dismiss()

			if(txtOldPassword == ''){
				Toast.showWithGravity(i18n.t('enter_old_password'), Toast.LONG, Toast.BOTTOM);
			}
			else if(txtNewPassword.length < 6){
				Toast.showWithGravity(i18n.t('enter_new_password'), Toast.LONG, Toast.BOTTOM);
			}
			else if(txtConfirmPassword == ''){
				Toast.showWithGravity(i18n.t('enter_confirm_password'), Toast.LONG, Toast.BOTTOM);
				
			}else if(txtNewPassword != txtConfirmPassword){
				Toast.showWithGravity(i18n.t('not_valid_password'), Toast.LONG, Toast.BOTTOM);
			}
			else{

				var dict = {}
				dict['old_password'] = txtOldPassword
				dict['new_password'] = txtNewPassword
				
				Api_ChangePassword(true,dict)
			}
			
		})
	}


	// API Change Password
	const Api_ChangePassword = (isLoad, data) => {

		setIsLoading(isLoad)

		Webservice.post(APIURL.changePassword,{
			id : userData.id,
			old_password : txtOldPassword,
			new_password : txtNewPassword
		})
			.then(response => {

				if (response == null) {
					setIsLoading(false)
				}
				console.log(JSON.stringify(response));
				setIsLoading(false)

				if (response.data.Status == '1') {

					setTxtOldPassword('')
					setTxtNewPassword('')
					setTxtConfirmPassword('')

					Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
					onSubmit(response.data.Msg)

				} else {
					Toast.showWithGravity(response.data.Msg, Toast.LONG, Toast.BOTTOM);
				}

			})
			.catch((error) => {

				setIsLoading(false)
				console.log(error)
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
						<Text style={{ flex: 1, fontSize: FontSize.FS_14, color: Colors.primaryRed, fontFamily: ConstantKey.MONTS_SEMIBOLD }}>
								{i18n.t('change_password')}
						</Text>
						<TouchableOpacity onPress={() => {
							setTxtOldPassword('')
							setTxtNewPassword('')
							setTxtConfirmPassword('')

							onClose()
						}}>
							<Icon name="times-circle" size={25} color={Colors.primaryRed} />
						</TouchableOpacity>
					</View>


					<View style={styles.mobileView}>

						<Icon name={"mobile-alt"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }} />

						<TextInput style={styles.textInputMobile}
							value={txtOldPassword}
							placeholder={'Old Password'}
							returnKeyType={'next'}
							onChangeText={(txtOld) => setTxtOldPassword(txtOld)}
						/>

					</View>

					<View style={styles.mobileView}>

						<Icon name={"key"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }} />

						<TextInput style={styles.textInputMobile}
							value={txtNewPassword}
							placeholder={'New Password'}
							secureTextEntry={true}
							returnKeyType={'done'}
							onChangeText={(txtPassword) => setTxtNewPassword(txtPassword)}
						/>

					</View>


					<View style={styles.mobileView}>

						<Icon name={"key"} size={20} color={Colors.darkGrey} style={{ marginLeft: 10 }} />

						<TextInput style={styles.textInputMobile}
							value={txtConfirmPassword}
							placeholder={'Confirm Password'}
							secureTextEntry={true}
							returnKeyType={'done'}
							onChangeText={(txtPassword) => setTxtConfirmPassword(txtPassword)}
						/>

					</View>


					<TouchableOpacity style={[styles.btnLogin,{opacity : isLoading ? 0.5 : 1}]}
						disabled={isLoading}
						onPress={() => btnConfirmTap()}>
						<Text style={styles.loginText}>
							{i18n.t('confirm')}
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
export default ChangePasswordModal;
