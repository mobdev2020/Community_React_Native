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
import { WebView } from 'react-native-webview';


// create a component
const PolicyModal = ({ isOpen, onClose }) => {


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
				<View style={{ width: ConstantKey.SCREEN_WIDTH - 60, height: ConstantKey.SCREEN_HEIGHT - 150, backgroundColor: Colors.white, borderRadius: 20, padding: 20 }}>

					<View style={{ flexDirection: 'row' }}>
						<Text style={{ flex: 1, fontSize: FontSize.FS_14, color: Colors.primaryRed, fontFamily: ConstantKey.MONTS_SEMIBOLD }}>
							{i18n.t('privacyPolicy')}
						</Text>
						
						{/* <TouchableOpacity onPress={() => {
							onClose()
						}}>
							<Icon name="times-circle" size={25} color={Colors.primaryRed} />
						</TouchableOpacity> */}
					</View>

					<View style={{flex : 1, backgroundColor : 'red', marginTop : 10, marginBottom : 10}}>
						
						<WebView source={{ uri: 'http://magnus.thewebtual.com/privacy.html' }} />
					</View>
					
					<View style={{alignItems: 'flex-end'}}>

							<TouchableOpacity onPress={() => onClose()}>
								<Text style={{fontSize : FontSize.FS_16, color : Colors.primaryRed, fontFamily : ConstantKey.MONTS_MEDIUM}}>Accept</Text>
							</TouchableOpacity>
					</View>
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
});

//make this component available to the app
export default PolicyModal;
