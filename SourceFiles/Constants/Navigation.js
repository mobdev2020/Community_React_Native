import React, { Component } from 'react';
import { Button, TouchableOpacity, Image, View, Text } from 'react-native';

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

// Third Party
import Icon from 'react-native-vector-icons/FontAwesome5';

// Dashboard Flow Files
import Home from '../DashboardFlow/Home';
import Login from '../InitialFlow/Login';
import Register from '../InitialFlow/Register';
import Splash from '../InitialFlow/Splash';
import Profile from '../DashboardFlow/Profile';
import MembersProfile from '../DashboardFlow/MembersProfile';
import EventsList from '../DashboardFlow/EventsList';
import AddEvent from '../DashboardFlow/AddEvent';
import UpdateProfile from '../DashboardFlow/UpdateProfile';
import BirthdaysTab from '../DashboardFlow/BirthdaysTab';
import TrainingTab from '../DashboardFlow/TrainingTab';
import AddTraining from '../DashboardFlow/AddTraining';
import AddAsk from '../DashboardFlow/AddAsk';
import EventTab from '../DashboardFlow/EventTab';
import ViewGainSheet from '../DashboardFlow/ViewGainSheet';
import Help from '../DashboardFlow/Help';
import EventsTab from '../DashboardFlow/EventsTab';
import AddMeeting from '../DashboardFlow/AddMeeting';
import Meetings from '../DashboardFlow/Meetings';
import Report from '../DashboardFlow/Report';


// Initial Flow 
function InitialFlow() {
    return (
        <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
			<Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
			<Stack.Screen name="Home" component={DashboardFlow} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}


function TabFlow() {
	return (

		<Tab.Navigator screenOptions={{
			activeTintColor: Colors.primaryRed,
			inactiveTintColor: Colors.darkGrey,
			// showLabel: false,
			tabStyle: {
				backgroundColor: Colors.white,
			},
		}}
			initialRouteName="Home">
			<Tab.Screen name="Home" component={Home}
				options={({ route }) => ({
					tabBarLabel: 'Home',
					headerShown : true,
					//  tabBarVisible: getTabBarVisibility(route),
					tabBarIcon: ({ focused, color, size }) => (
						// <Icon name={focused ? Images.HomeSele : Images.Home} size={size} color={color} />

						<Image source={focused ? Images.HomeSele : Images.Home}
							style={{height : size, width : size, resizeMode : 'contain', tintColor : color}} />
					),
				})}
			/>

			<Tab.Screen name="Events" component={EventsTab}
				options={({ route }) => ({
					tabBarLabel: 'Events',
					headerShown : false,
					//  tabBarVisible: getTabBarVisibility(route),
					tabBarIcon: ({ focused, color, size }) => (
						// <Icon name={focused ? Images.EventSele : Images.Event} size={size} color={color} />

						<Image source={focused ? Images.EventSele : Images.Event}
							style={{height : size, width : size, resizeMode : 'contain', tintColor : color}} />
					),
				})}
			/>



			{/* <Tab.Screen name="Birthday" component={BirthdaysTab}
				options={({ route }) => ({
					tabBarLabel: 'Birthday',
					//  tabBarVisible: getTabBarVisibility(route),
					tabBarIcon: ({ focused, color, size }) => (
						<Image source={focused ? Images.BirthdaySele : Images.Birthday}
							style={{height : size, width : size, resizeMode : 'contain', tintColor : color}} />
						// <Icon name={focused ? Images.BirthdaySele : Images.Birthday} size={size} color={color} />
					),
				})}
			/> */}

		</Tab.Navigator>	
	  );
}

// Dashboard Flow 
function DashboardFlow() {
    return (
        <Stack.Navigator initialRouteName="Home">
            {/* <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} /> */}
            <Stack.Screen name="Home" component={TabFlow} options={{ headerShown: false }} />
			<Stack.Screen name="Profile" component={Profile} options={{ headerShown: true }} />
			<Stack.Screen name="MembersProfile" component={MembersProfile} options={{ headerShown: true }} />
			<Stack.Screen name="EventsList" component={EventsList} options={{ headerShown: true }} />
			<Stack.Screen name="AddEvent" component={AddEvent} options={{ headerShown: true }} />
			<Stack.Screen name="UpdateProfile" component={UpdateProfile} options={{ headerShown: true }} />
			<Stack.Screen name="AddTraining" component={AddTraining} options={{ headerShown: true }} />
			<Stack.Screen name="AddAsk" component={AddAsk} options={{ headerShown: true }} />
			<Stack.Screen name="ViewGainSheet" component={ViewGainSheet} options={{ headerShown: true }} />
			<Stack.Screen name="Help" component={Help} options={{ headerShown: true, orientation: 'all' }} />
			<Stack.Screen name="AddMeeting" component={AddMeeting} options={{ headerShown: true }} />
			<Stack.Screen name="Meetings" component={Meetings} options={{ headerShown: true }} />
			<Stack.Screen name="Report" component={Report} options={{ headerShown: true }} />
			
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
