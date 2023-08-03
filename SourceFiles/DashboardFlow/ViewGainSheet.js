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
import { WebView } from 'react-native-webview';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util'


// create a component
const ViewGainSheet = (props) => {

	const [isLoading, setIsLoading] = useState(false)
	const [URL , setURL] = useState(props.route.params.url)
	const [LoadPercent, setLoadPercent] = useState(0)


	// Set Navigation Bar
	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerTitle: i18n.t('gain_sheet'),
			headerTitleStyle: {
				fontFamily: ConstantKey.MONTS_SEMIBOLD
			},
			headerStyle: {
				backgroundColor: Colors.white,
			},
			headerRight : () => (
				<>
					<TouchableOpacity style={{
						height: 30, width: 30,
						borderColor: Colors.primaryRed, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center'
					}}
						onPress={() => btnDownloadTap()}>
						<Icon name="download" size={15} color={Colors.primaryRed} />
					</TouchableOpacity>
				</>
			),
			headerTintColor: Colors.primaryRed,
			headerBackTitleVisible: false,
		});
	}, [props]);


	const DownloadPDF = () => {

		setIsLoading(true)
		var fileName = URL.substring(URL.lastIndexOf('/') + 1, URL.length)


		ReactNativeBlobUtil
			.config({
				// add this option that makes response data to be stored as a file,
				// this is much more performant.
				fileCache: true,
				path : Platform.OS == 'android' ? ReactNativeBlobUtil.fs.dirs.DownloadDir + '/' + fileName : ReactNativeBlobUtil.fs.dirs.DownloadDir + '/' + fileName,
				addAndroidDownloads : {
					useDownloadManager : true, // <-- this is the only thing required
					// Optional, override notification setting (default to true)
					notification : true,
					// Optional, but recommended since android DownloadManager will fail when
					// the url does not contains a file extension, by default the mime type will be text/plain
					// mime : 'text/plain',
					// description : 'File downloaded by download manager.'
				}
			})
			.fetch('GET', URL, {
				//some headers ..
			})
			.then((res) => {
				// the temp file path
				console.log('The file saved to ', res.path())

				setIsLoading(false)

				alert("File downloaded sucessfully")
				
			})
			.catch(e => {
				console.log(e)
				setIsLoading(false)
			})
	}
	

	// Action Methods
	const btnDownloadTap = () => {
		requestAnimationFrame(() => {

			DownloadPDF()
		})
	}


	return (
		<SafeAreaView style={styles.container}>
			
			<View style={styles.container}> 

				{/* <WebView 
					source={{uri : 'http://docs.google.com/gview?embedded=true&url=https://ppe.thewebtual.com/magnus/public/storage/gainsheet/59_gain1641471323.pdf'}}
					style={{width : '100%', height : '100%'}}
				/> */}

				<Pdf
					source={{ uri: URL, cache: false }}
					onLoadComplete={(numberOfPages, filePath) => {
						console.log(`Number of pages: ${numberOfPages}`);
					}}
					onPageChanged={(page, numberOfPages) => {
						console.log(`Current page: ${page}`);
					}}
					onError={(error) => {
						console.log(error);
					}}
					onLoadProgress={(percent) => {
						setLoadPercent(percent)
					}}
					renderActivityIndicator={() => (
						<>
							{LoadPercent > 0 && (
								<Text style={{ fontSize: FontSize.FS_12, color: Colors.darkGrey, fontFamily: ConstantKey.MONTS_REGULAR }}>
									{`${(Math.round(LoadPercent * 10000) / 100).toFixed(2)} %`}
								</Text>
							)}
						</>
					)}
					onPressLink={(uri) => {
						console.log(`Link pressed: ${uri}`);
					}}
					style={{ flex: 1 }} />

			
			</View>
			
					{isLoading ? <LoadingView /> : null}
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
export default ViewGainSheet;
