//import liraries
import React, { Component, useEffect , useState, useCallback} from 'react';
import { View, Text, StyleSheet, SafeAreaView , Alert} from 'react-native';

// Constants
import { Colors } from '../Constants/Colors';

// Third Party
import VideoPlayer from 'react-native-video-controls';
import { ConstantKey } from '../Constants/ConstantKey';


// create a component
const VideoPlay = (props) => {

	const [playing, setPlaying] = useState(false);

    const [videoUrl, setVideoUrl] = useState(props?.route?.params?.url);

    useEffect(() => {

      
    },[])


    console.log(props?.route?.params?.url)

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.container}>
				
                <VideoPlayer
                    // source={require('../Assets/Images/KamdhenuAssuredBenefits.mp4')}
					source={{uri: videoUrl}}
                    navigator={props.navigator}
                    onBack={() => props.navigation.goBack()}
                />
            </View>
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
});

//make this component available to the app
export default VideoPlay;