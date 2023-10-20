import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Linking,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FontSize} from '../Constants/FontSize';
import {Colors} from '../Constants/Colors';
import {ConstantKey} from '../Constants/ConstantKey';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {APIURL} from '../Constants/APIURL';
import {useSelector} from 'react-redux';
import LoadingView from '../Constants/LoadingView';
import Webservice from '../Constants/API';
import FastImage from 'react-native-fast-image';

const {width, height} = Dimensions.get('window');

const AdsList = props => {
  const [isLoading, setIsLoading] = useState(false);
  const {ads_type} = props?.route?.params;
  const selectedSchoolData = useSelector(state => state.userRedux.school_data);
  const [arrBannerAds, setArrBannerAds] = useState([]);

  useEffect(() => {
    Api_Get_Banner_Advertise(true);
  }, []);

  const Api_Get_Banner_Advertise = isLoad => {
    setIsLoading(isLoad);
    Webservice.get(
      APIURL.GetBannerAds +
        '?page=1&school_user_id=' +
        selectedSchoolData?.school_user_id +
        '&ads_type=' +
        ads_type,
    )
      .then(response => {
        setIsLoading(false);
        console.log(
          'Api_Get_Banner_Advertise Response : ' + JSON.stringify(response),
        );
        if (response.data.status == true) {
          setArrBannerAds(response.data?.data?.data);
        } else {
          alert(response.data.message);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
          style={{marginRight: 10, padding: 10}}>
          <Icon name={'chevron-left'} size={18} color={Colors.black} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: FontSize.FS_18,
            color: Colors.black,
            fontFamily: ConstantKey.MONTS_SEMIBOLD,
            flex: 1,
          }}>
          {'All Advertise'}
        </Text>
      </View>

      <View style={{flex: 1}}>
        <FlatList
          data={arrBannerAds}
          ListHeaderComponent={() => (<View style={{height : 20}}></View>)}
          ItemSeparatorComponent={() => (<View style={{height : 20}}></View>)}
          renderItem={({item, index}) => {
            return (
              <View>
                <>
                  {item?.image && (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        if (item?.video_url != null) {
                          // props.navigation.navigate("VideoPlay")
                          props.navigation.navigate('VideoPlay', {
                            url: item?.video_url,
                          });
                        } else if (item?.url != null) {
                          Linking.openURL(item?.url);
                        }
                      }}
                      style={{
                        width: width - 20,
                        height: height / 3.8,
                        backgroundColor: 'white',
                        marginHorizontal: 10,
                        borderRadius: 6,
                      }}>
                      {item?.video ? (
                        <View>
                          <FastImage
                            style={[{width: width - 20, height: height / 3.8}]}
                            source={{uri: item.image_url}}
                          />

                          <View
                            style={{
                              position: 'absolute',
                              top: 0,
                              bottom: 0,
                              right: 0,
                              left: 0,
                              backgroundColor: Colors.black03,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Icon
                              name="play-circle"
                              size={50}
                              color={Colors.white}
                            />
                          </View>
                        </View>
                      ) : (
                        <FastImage
                          style={{width: width - 20, height: height / 3.8}}
                          source={{uri: item.image_url}}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                </>
              </View>
            );
          }}
        />
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

export default AdsList;
