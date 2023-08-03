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


import RBSheet from "react-native-raw-bottom-sheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { moderateScale } from 'react-native-size-matters';
import Contacts from 'react-native-contacts';


// create a component
const ViewProfile = (props, ref) => {

	const refRBProfile = useRef();

	const Data = JSON.parse(props.data)


	useImperativeHandle(ref, () => ({
		// methods connected to `ref`
		OpenPopUp: () => { OpenPopUp() },
		ClosePopUp: () => { ClosePopUp() }
	}))
	

	const OpenPopUp = () => {
		refRBProfile.current.open()
	}

	const ClosePopUp = () => {

		refRBProfile.current.close()

	}


	const AcionButtonsTap = (type) => {

		if(type == 'call'){

			Linking.openURL('tel:'+Data.mobile);
			
		}else if(type == 'email'){

			Linking.openURL('mailto:'+Data.email);

		}else if(type == 'website'){
			
			Linking.openURL(Data.website);
		}else{
			var scheme = Platform.OS === 'ios' ? 'http://maps.apple.com/?daddr=' : 'http://maps.google.com/maps?daddr='
			var url = String(scheme + Number(Data.latitude) + ',' + Number(Data.longitude))
				console.log("URl : " + url, "Dal LOng : "+Number(Data.latitude) + ',' + Number(Data.longitude))
			// openExternalApp(url)
			Linking.openURL(url);
		}
	}


	const ContactFormSave = () => {

		console.log("Member profile data : "+JSON.stringify(Data))

		var newPerson = {
			emailAddresses: [{
			  label: "Bni Magnus",
			  email: Data.email,
			}],
			phoneNumbers: [{
			  label: 'mobile',
			  number: Data.mobile,
			}],
			// familyName: "Desai",
			displayName: Data.name + " - Bni Magnus",
			givenName: Data.name + " - Bni Magnus",
		  }
		  Contacts.openContactForm(newPerson).then((contact) => {

			  console.log("Saved Sucessfully : ",contact)

			  if(contact != undefined){
				  alert("Contact Saved Sucessfully")
			  }
		  }).catch((error) => {
			  console.log("error : ",error);
		  })
	}

	const requestContactPermission = async () => {
		try {
		  const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
			{
			  title: "Contacts",
			  message:
				"This app would like to view your contacts.",
			  buttonNeutral: "Ask Me Later",
			  buttonNegative: "Cancel",
			  buttonPositive: "OK"
			}
		  );
		  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log("You can use the contacts");

			ContactFormSave()

		  } else {
			console.log("Camera permission denied");
			requestContactPermission()
		  }
		} catch (err) {
		  console.warn(err);
		}
	  };



	const SaveContact = () => {
		if(Platform.OS == 'ios'){

			// ContactFormSave()
			Contacts.checkPermission().then(permission => {

				console.log(" Permisson is : " + permission)
				// Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
				if (permission === 'undefined') {
					Contacts.requestPermission().then(permission => {
						if (permission == 'authorized') {

							ContactFormSave()

						}
					})
				}
				if (permission === 'authorized') {

					ContactFormSave()

				}
				if (permission === 'denied') {
					Contacts.requestPermission().then((permission) => {
						if (permission == 'authorized') {

							ContactFormSave()

						}
					})
				}
			})
		  }
		  else {

			console.log("Android call")
			requestContactPermission()

			// Contacts.checkPermission().then(permission => {

			//   console.log(" Permisson is : " + permission)
			//   // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
			//   if (permission === 'undefined') {
			// 	Contacts.requestPermission().then(permission => {
			// 	  if (permission == 'authorized') {

			// 		ContactFormSave()

			// 	  }
			// 	})
			//   }
			//   if (permission === 'authorized') {

			// 	ContactFormSave()

			//   }
			//   if (permission === 'denied') {
			// 	Contacts.requestPermission().then((permission) => {
			// 	  if (permission == 'authorized') {
					  
			// 		ContactFormSave()

			// 	  }
			// 	})
			//   }
			// })
		  }
  
	}


	const openExternalApp = (url) => {
		Linking.canOpenURL(url).then(supported => {
			if (supported) {
				Linking.openURL(url);
			} else {
				Alert.alert(
					'ERROR',
					'Unable to open: ' + url,
					[
						{ text: 'OK' },
					]
				);
			}
		});
	}


	const btnViewGainSheet = () => {
		requestAnimationFrame(() => {

			refRBProfile.current.close()
			props.onViewGainTap(Data.gain_sheet)
		})
	}
	

	const btnAddToContact = () => {
		requestAnimationFrame(() => {

			SaveContact()
		})
	}


	
	return (
		<>
			<RBSheet
				ref={refRBProfile}
				closeOnDragDown={true}
				closeOnPressMask={true}
				height={ConstantKey.SCREEN_HEIGHT / 1.2}
				dragFromTopOnly={true}
				customStyles={{
					wrapper: {
						backgroundColor: Colors.black03 //"transparent"
					},
					draggableIcon: {
						backgroundColor: Colors.primaryRed
					},
					container: {
						borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor : Colors.solitude
					}
				}}
			>
				{Data != null ?
					<ScrollView style={{ paddingLeft: 15, paddingRight: 15, marginTop : 10}} showsVerticalScrollIndicator={false}>

						<View style={{
							backgroundColor: Colors.white, borderRadius: 10, borderWidth: 2, borderColor: Colors.primaryRed,
							shadowColor: Colors.black, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 4
						}}>
							<Image style={{ height: 200, width: '100%', borderRadius: 10, }}
								source={Images.ProfileBackground} />

						<View style={{ position: 'absolute', height: '100%', width: '100%', flexDirection : 'row',
							justifyContent : 'center', marginHorizontal : 20 }}>

							<View style={{flex : 1, justifyContent : 'center'}}>
								<View style={{ borderRadius: 40, height: 80, width: 80, borderColor: Colors.carrotOrange, borderWidth: 2, backgroundColor: Colors.white }}>
									<Image style={{ flex: 1, borderRadius: 40 }}
										resizeMode='cover'
										source={Data.profile_image != null ? { uri: Data.profile_image } : Data.company_logo != null ? { uri: Data.company_logo } : Images.UserPlaceHolder} />
									{/* source={Data.company_logo == null && Data.profile_image == null ? Images.UserPlaceHolder : Data.profile_image == null ? { uri: Data.company_logo } : Data.company_logo == null ? {uri : Data.profile_image} : Images.UserPlaceHolder } /> */}
								</View>

								<Text style={[styles.calloutTitle, { color: Colors.white, marginTop: 10 }]}>{Data.name}</Text>
								{Data.business_profile != null ?
									<Text style={[styles.calloutbusinessname, { color: Colors.white }]}>{Data.business_profile}</Text>
								: null}

							</View>

						</View>
				</View>

				<View style={{flexDirection : 'row', marginTop : 20, borderWidth : 3, borderColor : Colors.white,  borderRadius : 10,
					backgroundColor : Colors.solitude, justifyContent : 'space-evenly'}}>
						
						<View style={{flex : 0.25, alignItems : 'center', justifyContent : 'center', paddingVertical : 10}}>

							<TouchableOpacity style={{width : moderateScale(60), height : moderateScale(60), backgroundColor : Colors.endeavour,
								borderRadius : (moderateScale(60) / 2), borderWidth : 3, borderColor : Colors.white, alignItems : 'center', justifyContent : 'center',
								shadowColor : Colors.black, shadowOffset : {width : 3, height : 3}, shadowOpacity : 0.4, shadowRadius : 4, elevation : 4}}
								onPress={() => AcionButtonsTap('location')}>

								<Icon name={'route'} size={moderateScale(20)} color={Colors.white} />
							</TouchableOpacity>

							<Text style={{ fontSize: FontSize.FS_13, fontFamily: ConstantKey.MONTS_MEDIUM, color: Colors.black, marginLeft: 5, marginTop: 10 }}>
								Navigate
							</Text>
						</View>

					{Data.mobile != null ?

							<View style={{ flex: 0.25, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>

								<TouchableOpacity style={{
									width: moderateScale(60), height: moderateScale(60), backgroundColor: Colors.chateauGreen,
									borderRadius: (moderateScale(60) / 2), borderWidth: 3, borderColor: Colors.white, alignItems: 'center', justifyContent: 'center',
									shadowColor : Colors.black, shadowOffset : {width : 3, height : 3}, shadowOpacity : 0.4, shadowRadius : 4, elevation : 4
								}}
									onPress={() => AcionButtonsTap('call')}>

									<Icon name={'phone-alt'} size={moderateScale(20)} color={Colors.white} />
								</TouchableOpacity>

								<Text style={{ fontSize: FontSize.FS_13, fontFamily: ConstantKey.MONTS_MEDIUM, color: Colors.black, marginLeft: 5, marginTop: 10 }}>
									Call
								</Text>
							</View>

					: null}

					{Data.website != null ?


							<View style={{ flex: 0.25, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>

								<TouchableOpacity style={{
									width: moderateScale(60), height: moderateScale(60), backgroundColor: Colors.dodgerBlue,
									borderRadius: (moderateScale(60) / 2), borderWidth: 3, borderColor: Colors.white, alignItems: 'center', justifyContent: 'center',
									shadowColor : Colors.black, shadowOffset : {width : 3, height : 3}, shadowOpacity : 0.4, shadowRadius : 4, elevation : 4
								}}
									onPress={() => AcionButtonsTap('website')}>

									<Icon name={'globe'} size={moderateScale(20)} color={Colors.white} />
								</TouchableOpacity>

								<Text style={{ fontSize: FontSize.FS_13, fontFamily: ConstantKey.MONTS_MEDIUM, color: Colors.black, marginLeft: 5, marginTop: 10 }}>
									Website
								</Text>
							</View>

						: null}

					{Data.email != null ?

							<View style={{ flex: 0.25, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>

								<TouchableOpacity style={{
									width: moderateScale(60), height: moderateScale(60), backgroundColor: Colors.carrotOrange,
									borderRadius: (moderateScale(60) / 2), borderWidth: 3, borderColor: Colors.white, alignItems: 'center', justifyContent: 'center',
									shadowColor : Colors.black, shadowOffset : {width : 3, height : 3}, shadowOpacity : 0.4, shadowRadius : 4, elevation : 4
								}}
									onPress={() => AcionButtonsTap('email')}>

									<Icon name={'at'} size={moderateScale(20)} color={Colors.white} />
								</TouchableOpacity>

								<Text style={{ fontSize: FontSize.FS_13, fontFamily: ConstantKey.MONTS_MEDIUM, color: Colors.black, marginLeft: 5, marginTop: 10 }}>
									Email
								</Text>
							</View>

					: null}

				</View>


						<TouchableOpacity style={styles.btnViewGainSheet}
							onPress={() => btnAddToContact()}>
							<Text style={[styles.txtViewGainSheet]}>
								{i18n.t('add_to_contact')}
							</Text>
						</TouchableOpacity>


						<View style={{ flex: 1, marginVertical: 20, flexDirection: 'row' }}>

							{Data.gain_sheet != null ?
								<View style={{ flex: 0.25, alignItems: 'center', }}>

									<TouchableOpacity style={{
										borderWidth: 3, borderColor: Colors.white, borderRadius: 10, alignItems: 'center',
										width: moderateScale(75), paddingVertical: 15, backgroundColor: Colors.solitude,
										shadowColor: Colors.black, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 4
									}}
										onPress={() => btnViewGainSheet()}>

										<Icon name={'file-alt'} size={30} color={Colors.darkGrey} />

										<Text style={{
											fontSize: FontSize.FS_12, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR,
											marginTop: 10, textAlign: 'center'
										}}>
											{i18n.t('gain_sheet')}
										</Text>
									</TouchableOpacity>
								</View>
								: null}

							{Data.business_description != null ?
								<View style={{ flex: 0.25, alignItems: 'center', }}>

									<TouchableOpacity style={{
										borderWidth: 3, borderColor: Colors.white, borderRadius: 10, alignItems: 'center',
										width: moderateScale(75), paddingVertical: 15, backgroundColor: Colors.solitude,
										shadowColor: Colors.black, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 4
									}}
										onPress={() => Alert.alert(i18n.t('about_us'), Data.business_description)}>

										<Icon name={'user'} size={30} color={Colors.darkGrey} />

										<Text style={{
											fontSize: FontSize.FS_12, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR,
											marginTop: 10
										}}>
											{i18n.t('about_us')}
										</Text>
									</TouchableOpacity>
								</View>
								: null}

							{Data.special_ask != null ?
								<View style={{ flex: 0.25, alignItems: 'center', }}>

									<TouchableOpacity style={{
										borderWidth: 3, borderColor: Colors.white, borderRadius: 10, alignItems: 'center',
										width: moderateScale(75), paddingVertical: 15, backgroundColor: Colors.solitude,
										shadowColor: Colors.black, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 4
									}}
										onPress={() => Alert.alert(i18n.t('special_ask'), Data.special_ask.description)}>

										<Icon name={'info-circle'} size={30} color={Colors.darkGrey} />

										<Text style={{
											fontSize: FontSize.FS_12, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR,
											marginTop: 10
										}}>
											{i18n.t('special_ask')}
										</Text>
									</TouchableOpacity>
								</View>
								: null}


							{Data.profile_address != null ?
								<View style={{ flex: 0.25, alignItems: 'center' }}>


									<TouchableOpacity style={{
										borderWidth: 3, borderColor: Colors.white, borderRadius: 10, alignItems: 'center',
										width: moderateScale(75), paddingVertical: 15, backgroundColor: Colors.solitude,
										shadowColor: Colors.black, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 4
									}}
										onPress={() => Alert.alert(i18n.t('address'), Data.profile_address)}>

										<Icon name={'map-marker-alt'} size={30} color={Colors.darkGrey} />

										<Text style={{
											fontSize: FontSize.FS_12, color: Colors.black, fontFamily: ConstantKey.MONTS_REGULAR,
											marginTop: 10
										}}>
											{i18n.t('address')}
										</Text>
									</TouchableOpacity>

								</View>
								: null}
						</View>



						{/* <View style={{ flexDirection: 'row', justifyContent: 'center', }}>

							<View style={{
								backgroundColor: Colors.white, borderRadius: 10, marginLeft : 5,marginTop : 5,height: 90,width: 90, alignItems : 'center', justifyContent : 'center',
								// shadowColor: Colors.black03, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.5, shadowRadius: 4, elevation: 4
							}}>
								<Image style={{ height: 80, width: 80, }}
									resizeMode='cover'
									source={Data.company_logo == null ? Images.UserPlaceHolder : { uri: Data.company_logo }} />
							</View>


							<View style={{ flex: 1, marginLeft: 20, backgroundColor: Colors.white }}>
								<Text style={styles.calloutTitle}>{Data.name}</Text>
								{Data.business_profile != null ?
									<Text style={styles.calloutbusinessname}>{Data.business_profile}</Text>
								: null}

								{Data.email != null ?
									<Text style={styles.calloutDescription}>{Data.email}</Text>
								: null}

								{Data.mobile != null ?
									<Text style={styles.calloutDescription}>+91 {Data.mobile}</Text>
								: null}
								
							</View>

						</View>


						<View style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'space-around' }}>

							<TouchableOpacity style={{
								flex: 0.25, borderColor: Colors.primaryRed, borderWidth: 1, padding: 5, justifyContent: 'center', alignItems: 'center',
								borderRadius: 8
							}}
								onPress={() => AcionButtonsTap('location')}>
								<Icon name={'route'} size={20} color={Colors.primaryRed} />
								<Text style={{ fontSize: FontSize.FS_14, fontFamily: ConstantKey.MONTS_MEDIUM, color: Colors.primaryRed, marginLeft: 5 , marginTop : 5}}>
									Navigate
								</Text>
							</TouchableOpacity>

							{Data.mobile != null ?

								<TouchableOpacity style={{
									flex: 0.20, borderColor: Colors.primaryRed, borderWidth: 1, padding: 5, justifyContent: 'center', alignItems: 'center',
									 borderRadius: 8
								}}
									onPress={() => AcionButtonsTap('call')}>
									<Icon name={'phone-alt'} size={20} color={Colors.primaryRed} />
									<Text style={{ fontSize: FontSize.FS_14, fontFamily: ConstantKey.MONTS_MEDIUM, color: Colors.primaryRed, marginLeft: 5 , marginTop : 5}}>
										Call
									</Text>
								</TouchableOpacity>
								: null}

							{Data.website != null ?

								<TouchableOpacity style={{
									flex: 0.25, borderColor: Colors.primaryRed, borderWidth: 1, padding: 5, justifyContent: 'center', alignItems: 'center',
									borderRadius: 8
								}}
									onPress={() => AcionButtonsTap('website')}>
									<Icon name={'globe'} size={20} color={Colors.primaryRed} />
									<Text style={{ fontSize: FontSize.FS_14, fontFamily: ConstantKey.MONTS_MEDIUM, color: Colors.primaryRed, marginLeft: 5 , marginTop : 5}}>
										Website
									</Text>
								</TouchableOpacity>
								: null}

							{Data.email != null ?

								<TouchableOpacity style={{
									flex: 0.20, borderColor: Colors.primaryRed, borderWidth: 1, padding: 5, justifyContent: 'center', alignItems: 'center',
									 borderRadius: 8
								}}
									onPress={() => AcionButtonsTap('email')}>
									<Icon name={'envelope'} size={20} color={Colors.primaryRed} />
									<Text style={{ fontSize: FontSize.FS_14, fontFamily: ConstantKey.MONTS_MEDIUM, color: Colors.primaryRed, marginLeft: 5 , marginTop : 5}}>
										Email
									</Text>
								</TouchableOpacity>
								: null}

						</View>

						{Data.gain_sheet != null ?
							<TouchableOpacity style={styles.btnViewGainSheet}
								onPress={() => btnViewGainSheet()}>
								<Text style={[styles.txtViewGainSheet]}>
									{i18n.t('view_gain_sheet')}
								</Text>
							</TouchableOpacity>
							: null}

						<View style={{flex : 1}}>

							{Data.profile_address != null ?
								<>
									<Text style={[styles.calloutbusinessname, { marginTop: 15 }]}>Address</Text>
									<Text style={styles.calloutDescription}>{Data.profile_address}</Text>
								</>
								: null}

							{Data.business_tag != null ?
								<>
									<Text style={[styles.calloutbusinessname, { marginTop: 10 }]}>Business Tag</Text>
									<Text style={[styles.calloutDescription]}>{Data.business_tag}</Text>
								</>
								: null}

							{Data.business_description != null ?
								<>
									<Text style={[styles.calloutbusinessname, { marginTop: 10 }]}>Description</Text>
									<Text style={[styles.calloutDescription]}>{Data.business_description}</Text>
								</>
								: null}
						</View> */}
						
					</ScrollView>
					: null}


			</RBSheet>
		</>
	);
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,

		backgroundColor: '#2c3e50',
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
	txtViewGainSheet: {
		fontSize: FontSize.FS_18, color: Colors.primaryRed,
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


export default forwardRef(ViewProfile)