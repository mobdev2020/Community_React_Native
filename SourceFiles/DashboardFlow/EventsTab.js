//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';


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


import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator()

import EventTab from './EventTab';
import TrainingTab from './TrainingTab';
import BirthdaysTab from './BirthdaysTab';
import Meetings from './Meetings';

// create a component
const EventsTab = () => {
	return (
		<SafeAreaView style={{flex : 1, backgroundColor : Colors.white}}>
		<Tab.Navigator  screenOptions={{
			activeTintColor: Colors.primaryRed,
			scrollEnabled:true,
			inactiveTintColor : Colors.darkGrey,
			indicatorStyle: {
				backgroundColor: Colors.primaryRed,
				flex : 1
			},
			labelStyle: { fontSize: FontSize.FS_14, fontFamily: ConstantKey.MONTS_SEMIBOLD },
			tabStyle: {
				width: 'auto'
			},
			style: { backgroundColor: Colors.white},
		}}>
			<Tab.Screen name="Events" component={EventTab} />
			<Tab.Screen name="Training" component={TrainingTab} />
			{/* <Tab.Screen name="Birthday" component={BirthdaysTab} /> */}
			<Tab.Screen name="Meetings" component={Meetings} />
		</Tab.Navigator>
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
export default EventsTab;

    