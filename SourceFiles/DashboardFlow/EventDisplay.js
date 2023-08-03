//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, SafeAreaView, Linking } from 'react-native';
import { Colors } from '../Constants/Colors';

import Carousel from 'react-native-banner-carousel';
import { ConstantKey } from '../Constants/ConstantKey';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FontSize } from '../Constants/FontSize';
import i18n from '../Localize/i18n'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// create a component
const EventDisplay = ({ isOpen, data, onCloseTap, onEventButtonTap }) => {


	const btnNavigateTap = (item) => {
		requestAnimationFrame(() => {

			if(item.is_type == 'birthday'){

				onEventButtonTap(item)
				
			}else{
				Linking.openURL(item.event_link);
			}
			
		})
	}


	const renderEvent = (data, index) => {

		return (
			<View style={{ width: '100%', height: '100%' }}
				key={index}>

				{data.is_type == 'birthday' ?

					(data.event_image == null ?
					<View style={{ flex: 1 }}>

						<View style={{flex : 1 , justifyContent : 'center'}}>

							<Image style={{ flex: 1, resizeMode: 'contain', }} 
								source={{ uri: data.birth_day_image }} 
							/>
							
						</View>
						<View style={{position: 'absolute', backgroundColor : Colors.transparent, left: 0, right : 0, bottom : moderateScale(105),
								top: 0,justifyContent : 'center', alignItems : 'center'}}>

							<View style={{ alignSelf : 'center', justifyContent : 'center',alignItems : 'center'}}>
								<Text style={{top : moderateScale(12), color: Colors.mckenzie, fontFamily: ConstantKey.MILKSHAKE, fontSize: RFValue(35,ConstantKey.SCREEN_HEIGHT),
									textAlign : 'center', marginHorizontal: moderateScale(50), lineHeight : moderateScale(40)}}
									numberOfLines={2}>
									{data.member_details.name}
								</Text>

								<Text style={{marginTop : moderateScale(5), color: Colors.indianTan, fontFamily: ConstantKey.MONTS_REGULAR, fontSize: RFValue(15, ConstantKey.SCREEN_HEIGHT) }}>
									{data.member_details.business_profile}
								</Text>
							</View>


						</View>

						<TouchableOpacity style={styles.btnNavigate}
								onPress={() => btnNavigateTap(data)}>
								<Text style={styles.navigateText}>
									{i18n.t('view_profile')}
								</Text>
							</TouchableOpacity>
					</View>
					: 
					<View style={{ flex: 1 }}>

						<Image style={{ flex: 1, resizeMode: 'contain' }} source={{ uri: data.event_image }} />

							<TouchableOpacity style={styles.btnNavigate}
								onPress={() => btnNavigateTap(data)}>
								<Text style={styles.navigateText}>
									{i18n.t('view_profile')}
								</Text>
							</TouchableOpacity>

					</View>		
					)
					:

					<View style={{ flex: 1 }}>

						<Image style={{ flex: 1, resizeMode: 'contain' }} source={{ uri: data.event_image }} />

						{data.event_link != null ?
							<TouchableOpacity style={styles.btnNavigate}
								onPress={() => btnNavigateTap(data)}>
								<Text style={styles.navigateText}>
									{i18n.t('navigate')}
								</Text>
							</TouchableOpacity>
							: null
						}

					</View>
				}

			</View>

		);
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
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container}>
					<Carousel
						autoplay={false}
						// loop
						index={0}
						pageSize={ConstantKey.SCREEN_WIDTH}
						pageIndicatorStyle={{ backgroundColor: Colors.darkGrey }}
						activePageIndicatorStyle={{ backgroundColor: Colors.primaryRed }}
					>
						{data.map((image, index) => renderEvent(image, index))}
					</Carousel>

					<View style={{ position: 'absolute', alignSelf: 'flex-end' }}>
						<TouchableOpacity style={{ marginRight: 10, borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}
						onPress={() => onCloseTap()}>
							<Icon name="times-circle" size={40} color={Colors.primaryRed} solid />
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		</Modal>
	);
};

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	btnNavigate: {
		backgroundColor: Colors.primaryRed,
		height: moderateScale(45), borderRadius: 10, alignItems: 'center', justifyContent: 'center',
		shadowColor: Colors.primaryRed,
		shadowOffset: { width: 0, height: 2 }, width: '50%', alignSelf: 'center',
		shadowOpacity: 0.4, shadowRadius: 2, elevation: 2, marginVertical: moderateScale(30)
	},
	navigateText: {
		fontSize: FontSize.FS_20, color: Colors.white,
		fontFamily: ConstantKey.MONTS_SEMIBOLD
	},
});

//make this component available to the app
export default EventDisplay;
