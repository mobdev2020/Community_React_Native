import React from 'react';
import Carousel from 'react-native-banner-carousel';
import { StyleSheet, Image, View, Dimensions } from 'react-native';
import { FontSize } from '../Constants/FontSize';
import { Colors } from '../Constants/Colors';
import { ConstantKey } from '../Constants/ConstantKey';
import moment from 'moment';
import { Text } from 'react-native';

const BannerWidth = Dimensions.get('window').width - 30;
const BannerHeight = 260;


const CustomSlider = ({ data }) => {
    const renderPage = (item, index) => {
        return (
            // <View style={{flexDirection:"row"}}>
            <View key={index} style={{
                marginBottom: 30,
                padding: 10,
                borderRadius: 6,
                backgroundColor: Colors.white,

                // height: 148,
                marginHorizontal:10,
                marginTop:7,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.20,
                shadowRadius: 1.41,
                elevation: 3,
            }}>
                <Text style={{
                    fontSize: FontSize.FS_8,
                    color: Colors.grey,
                    fontFamily: ConstantKey.MONTS_REGULAR,
                    textAlign: "right",
                }}> {moment(item.created_at).format('DD/MM/YYYY')}
                </Text>
                <Text style={{
                    fontSize: FontSize.FS_12,
                    color: Colors.black,
                    fontFamily: ConstantKey.MONTS_SEMIBOLD,
                    textAlign: "center",
                }}>
                    {item?.title}
                </Text>
                <Text numberOfLines={3}
                    style={{
                        fontSize: FontSize.FS_10,
                        color: Colors.black,
                        fontFamily: ConstantKey.MONTS_REGULAR,
                        textAlign: "center",
                        marginTop: 10,
                    }}>
                    {item?.notice}
                </Text>
            </View>
            // {/* <View style={{width:5,backgroundColor:"red"}}></View> */}
            // </View>
        );
    }

    return (
        <View style={styles.container}>
            <Carousel
                pageIndicatorStyle={{ marginTop: 50, backgroundColor : Colors.primaryLight }}
                // pageIndicatorStyle={{position:"absolute",top:20,left:0,right: 0,bottom:0}}
                autoplay
                autoplayTimeout={5000}
                loop
                index={0}
                pageSize={BannerWidth}
                activePageIndicatorStyle={{ backgroundColor: Colors.primary }}
                

            >
                {data.map((item, index) => renderPage(item, index))}
            </Carousel>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Colors.white,
        // marginHorizontal:-20,
        // justifyContent: 'center',
        // marginHorizontal: 20,
        // marginBottom: 10,
        // borderWidth:1,
        alignSelf: "center",
        // alignItems: "center",
        // alignContent: "center"
        // padding:10
    },
});

export default CustomSlider