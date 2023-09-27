// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function App(): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	View, Platform, Alert, Linking, TouchableOpacity, LogBox
} from 'react-native';

import {ConstantKey} from './SourceFiles/Constants/ConstantKey'
import Navigation from './SourceFiles/Constants/Navigation';
import * as  NavigationService from './SourceFiles/Constants/NavigationService';

import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageView from "react-native-image-viewing";
import i18n from './SourceFiles/Localize/i18n';
import { Colors } from './SourceFiles/Constants/Colors';
import { moderateScale } from 'react-native-size-matters';
import { FontSize } from './SourceFiles/Constants/FontSize';


const App = () => {

	const [visibleImg, setIsVisibleImg] = useState(false);

	const [SelectedImg, setSelectedImg] = useState(null)


	useEffect(() => {
		LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
		if (Platform.OS == 'ios') {
			requestUserPermission();
		} else {
			getFcmToken()
		}


		messaging().getInitialNotification().then(async (remoteMessage) => {
			if (remoteMessage) {
				console.log(
					'getInitialNotification:' +
					'Notification caused app to open from quit state',
				);
				console.log(remoteMessage);

				var notification = remoteMessage.data

				console.log("Noti : " + JSON.stringify(notification));

				setTimeout(() => {
					
					if(notification.click_action == 'member' || notification.click_action == 'birthday'){

						NavigationService.navigate('MembersProfile',{ member_data :  String(notification.member_id)})
					}
					else if (notification.click_action == 'meeting') {
						setSelectedImg(notification)
						setIsVisibleImg(true)					

						NavigationService.navigate('Meetings')
					}
					else{
						// NavigationService.navigate('MembersProfile',{ member_data :  String(69)})
					}
				}, 1000);
				
	
			}
		})


		messaging().onNotificationOpenedApp(async (remoteMessage) => {
			if (remoteMessage) {
				console.log(
					'onNotification Opened App: ' +
					remoteMessage,
				);

				// console.log(remoteMessage);

				var notification = remoteMessage.data

				console.log("Noti : " + JSON.stringify(notification));

				if(notification.click_action == 'member' || notification.click_action == 'birthday'){

					NavigationService.navigate('MembersProfile',{ member_data :  String(notification.member_id)})
				}
				else if(notification.click_action == 'meeting'){

					setSelectedImg(notification)
					setIsVisibleImg(true)					

					NavigationService.navigate('Meetings')
				}
				else{
					// NavigationService.navigate('MembersProfile',{ member_data :  String(69)})
				}
	
			}
		})


		const unsubscribe = messaging().onMessage(async remoteMessage => {
			console.log("A new FCM message arrived!" + JSON.stringify(remoteMessage));

			let notification = remoteMessage.data

			console.log("NotiF Data" + JSON.stringify(notification));

			// For Display Notification Banner when app is in Forground State


			if (notification.click_action == 'member' || notification.click_action == 'birthday') {

				Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body, [
					{
						text: "View profile",
						onPress: () => NavigationService.navigate('MembersProfile', { member_data: String(notification.member_id) }),
						style: "cancel"
					},
					{ text: "Close", onPress: () => {} }
				])


			}else if(notification.click_action == 'meeting'){
				Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body, [
					{
						text: "View",
						onPress: () => {

							setSelectedImg(notification)
							setIsVisibleImg(true)
							NavigationService.navigate('Meetings')
						},
						style: "cancel"
					},
					{ text: "Close", onPress: () => console.log("OK Pressed") }
				])
			}
			 else {

				// NavigationService.navigate('MembersProfile',{ member_data :  String(69)})
			}


		});
		return () => {
			unsubscribe;
		
		}
		
	}, []);
	

	const requestUserPermission = async () => {
		const authStatus = await messaging().requestPermission();
		const enabled =
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL;

		if (enabled) {

			console.log('Authorization status:', authStatus);
			const asc = await messaging().registerDeviceForRemoteMessages()
			getFcmToken()

		} else {
			await messaging().requestPermission({
				sound: true,
				alert: true,
				badge: true,
				announcement: true,
				// ... other permission settings
			});
		}
	}
	const sleep = ms => {
		return new Promise(resolve => setTimeout(resolve, ms));
	  };

	  async function requestPermissionForNotification() {
		try {
		  const permission = await requestNotifications(["alert", "badge", "sound"]);
		  if (permission.status === "granted") {
			setupNotification();
		  }
		} catch (e) {
		  console.log(e)
		}
	  };

	async function setupNotification() {
		try {
	
		  await sleep(5000)
		  // TODO no need token for now, Will be used for future releases 
		  const enabled = await firebase.messaging().hasPermission();
		  await requestNotifications(['alert', 'badge', 'sound']);
		  await messaging().registerForRemoteNotifications();
		  const token = await firebase.messaging().getToken();
		 
		  firebase.messaging().onMessage(async (remoteMessage) => {
	   
		  });
		} catch (e) {
		  console.log(e)
	
		}
	  }


	const getFcmToken = async () => {
		const fcmToken = await messaging().getToken();
		console.log("APP Your Firebase Token is :", fcmToken);
		if (fcmToken) {

			storeToken(JSON.stringify(fcmToken))
			console.log("Your Firebase Token is:", fcmToken);

			//   Api_Send_Device_Token(fcmToken)

		} else {
			console.log("Failed", "No token received");
		}
	}

	//Helper Methods
	const storeToken = async (value) => {
		console.log("STORE Your Firebase Token is :", value);

		try {
			await AsyncStorage.setItem(ConstantKey.FCM_TOKEN, value)

		} catch (e) {
			console.log("ASYNC ERROR",e)
		}
	}



	const btnNavigateTap = () => {
		Linking.openURL(SelectedImg.url)
	}

	return (
		<>
			<Navigation />
			{SelectedImg != null ?
				<ImageView
					images={[{ uri: SelectedImg["media-url"] }]}
					imageIndex={0}
					visible={visibleImg}
					FooterComponent={() => {
						return (
							SelectedImg.url != "" ?
								<TouchableOpacity style={styles.btnNavigate}
									onPress={() => btnNavigateTap()}>
									<Text style={styles.navigateText}>
										{i18n.t('navigate')}
									</Text>
								</TouchableOpacity>
								: null
						)
					}}
					onRequestClose={() => {
						setIsVisibleImg(false)
						setSelectedImg(null)
					}}
				/>
				: null}
		</>

	);
};

const styles = StyleSheet.create({
	btnNavigate: {
		backgroundColor: Colors.primaryRed,
		height: moderateScale(45), borderRadius: 6, alignItems: 'center', justifyContent: 'center',
		shadowColor: Colors.primaryRed,
		shadowOffset: { width: 0, height: 2 }, width: '50%', alignSelf: 'center',
		shadowOpacity: 0.4, shadowRadius: 2, elevation: 2, marginVertical: moderateScale(15)
	},
	navigateText: {
		fontSize: FontSize.FS_20, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
})

export default App;

