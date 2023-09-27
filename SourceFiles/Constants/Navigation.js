import React, { Component } from 'react';
import { Button, TouchableOpacity, Image, View, Text, Platform } from 'react-native';

//Constant Files
import { Colors } from '../Constants/Colors';
import { Images } from '../Constants/Images';
import { ConstantKey } from '../Constants/ConstantKey';
import { FontSize } from '../Constants/FontSize';

//Navigation Files
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef, isReadyRef } from './NavigationService';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


// Create constanst for navigations
const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

// Dashboard Flow Files
import Home from '../DashboardFlow/Home';
import Login from '../InitialFlow/Login';
import Register from '../InitialFlow/Register';
import Splash from '../InitialFlow/Splash';
import Profile from '../DashboardFlow/Profile';
import AddEvent from '../DashboardFlow/AddEvent';
import TrainingTab from '../DashboardFlow/TrainingTab';
import AddTraining from '../DashboardFlow/AddTraining';
import AddAsk from '../DashboardFlow/AddAsk';
import EventsTab from '../DashboardFlow/EventsTab';
import AddMeeting from '../DashboardFlow/AddMeeting';
import Meetings from '../DashboardFlow/Meetings';
import Report from '../DashboardFlow/Report';
import Otp from '../InitialFlow/Otp';
import MyAds from '../DashboardFlow/MyAds';
import SchoolInfo from '../DashboardFlow/SchoolInfo';
import BusinessProfile from '../DashboardFlow/BusinessProfile';
import PersonalProfile from '../DashboardFlow/PersonalProfile';
import ViewAllCategories from '../DashboardFlow/ViewAllCategories';
import SearchScreen from '../DashboardFlow/SearchScreen';
import AddAds from '../DashboardFlow/AddAds';
import AskBusinessProfile from '../InitialFlow/AskBusinessProfile';
import QrCode from '../DashboardFlow/QrCode';
import WelcomeScreen from '../InitialFlow/WelcomeScreen';


// Initial Flow 
function InitialFlow() {
	return (
		<Stack.Navigator initialRouteName="Splash">
			<Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
			<Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
			<Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
			<Stack.Screen name="Otp" component={Otp} options={{ headerShown: false }} />
			<Stack.Screen name="Home" component={DashboardFlow} options={{ headerShown: false }} />
			<Stack.Screen name="BusinessProfile" component={BusinessProfile} options={{ headerShown: false }} />
			<Stack.Screen name="PersonalProfile" component={PersonalProfile} options={{ headerShown: false }} />
			<Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
			<Stack.Screen name="AskBusinessProfile" component={AskBusinessProfile} options={{ headerShown: false }} />
			<Stack.Screen name="QrCode" component={QrCode} options={{ headerShown: false }} />
			<Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
		</Stack.Navigator>
	)
}


function TabFlow() {
	return (

		<Tab.Navigator screenOptions={{
			// activeTintColor: Colors.black,
			tabBarActiveTintColor: Colors.primary,
			inactiveTintColor: Colors.darkGrey,
			// showLabel: false,
			tabStyle: {
				backgroundColor: Colors.white,

			},
			tabBarIconStyle: { marginTop: 5 },
			tabBarStyle: {
				height: Platform.OS === "android" ? 58 : 90,
				// backgroundColor:"red"
			},
			tabBarLabelStyle: { fontSize: FontSize.FS_10, fontFamily: ConstantKey.MONTS_REGULAR }

		}}
			initialRouteName="Home">
			<Tab.Screen name="Home" component={Home}
				options={({ route }) => ({
					tabBarLabel: 'Dashboard',
					headerShown: false,
					tabBarIcon: ({ focused, color, size }) => (
						<View style={{ alignItems: "center" }}>
							<Image source={focused ? Images.ActiveDashboard : Images.InActiveDashboard}
								style={{ height: size, width: size, resizeMode: 'contain', tintColor: color }} />
							{focused ? <View style={{ width: 24, height: 3, backgroundColor: color, borderRadius: 6, marginTop: 4 }}></View> : null}
						</View>

					),
				})}
			/>

			<Tab.Screen name="Events" component={EventsTab}
				options={({ route }) => ({
					tabBarLabel: 'Events',
					headerShown: false,
					tabBarIcon: ({ focused, color, size }) => (
						<View style={{ alignItems: "center" }}>
							<Image source={focused ? Images.ActiveCalender : Images.InActiveCalender}
								style={{ height: size, width: size, resizeMode: 'contain', tintColor: color }} />
							{focused ? <View style={{ width: 24, height: 3, backgroundColor: color, borderRadius: 6, marginTop: 4 }}></View> : null}
						</View>

					),
				})}
			/>

			<Tab.Screen name="MyAds" component={MyAds}
				options={({ route }) => ({
					tabBarLabel: 'My Ads',
					headerShown: false,
					tabBarIcon: ({ focused, color, size }) => (
						<View style={{ alignItems: "center" }}>
							<Image source={focused ? Images.ActiveAd : Images.InActiveAd}
								style={{ height: size, width: size, resizeMode: 'contain', tintColor: color }} />
							{focused ? <View style={{ width: 24, height: 3, backgroundColor: color, borderRadius: 6, marginTop: 4 }}></View> : null}
						</View>

					),
				})}
			/>
			<Tab.Screen name="SchoolInfo" component={SchoolInfo}
				options={({ route }) => ({
					tabBarLabel: 'School Info',
					headerShown: false,
					tabBarIcon: ({ focused, color, size }) => (
						<View style={{ alignItems: "center" }}>
							<Image source={focused ? Images.ActiveCInfo : Images.InActiveInfo}
								style={{ height: size, width: size, resizeMode: 'contain', tintColor: color }} />
							{focused ? <View style={{ width: 24, height: 3, backgroundColor: color, borderRadius: 6, marginTop: 4 }}></View> : null}
						</View>

					),
				})}
			/>
		</Tab.Navigator>
	);
}

// Dashboard Flow 
function DashboardFlow() {
	return (
		<Stack.Navigator initialRouteName="Home">
			<Stack.Screen name="Home" component={TabFlow} options={{ headerShown: false }} />
			<Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
			<Stack.Screen name="AddEvent" component={AddEvent} options={{ headerShown: false }} />
			<Stack.Screen name="AddTraining" component={AddTraining} options={{ headerShown: false }} />
			<Stack.Screen name="AddAsk" component={AddAsk} options={{ headerShown: true }} />
			<Stack.Screen name="AddMeeting" component={AddMeeting} options={{ headerShown: false }} />
			<Stack.Screen name="Meetings" component={Meetings} options={{ headerShown: true }} />
			<Stack.Screen name="Report" component={Report} options={{ headerShown: false }} />
			<Stack.Screen name="BusinessProfile" component={BusinessProfile} options={{ headerShown: false }} />
			<Stack.Screen name="PersonalProfile" component={PersonalProfile} options={{ headerShown: false }} />
			<Stack.Screen name="ViewAllCategories" component={ViewAllCategories} options={{ headerShown: false }} />
			<Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
			<Stack.Screen name="AddAds" component={AddAds} options={{ headerShown: false }} />
			<Stack.Screen name="AskBusinessProfile" component={AskBusinessProfile} options={{ headerShown: false }} />



		</Stack.Navigator>
	)
}


const Navigation = () => {
	return (
		<NavigationContainer
			ref={navigationRef}
			onReady={() => {
				isReadyRef.current = true;
			}}>
			<InitialFlow />
		</NavigationContainer>
	)
}

export default Navigation;
