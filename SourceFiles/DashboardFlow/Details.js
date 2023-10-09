import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../Constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {FontSize} from '../Constants/FontSize';
import {ConstantKey} from '../Constants/ConstantKey';
import ImageView from 'react-native-image-viewing';
import moment from 'moment';
import Share from 'react-native-share';
import ReactNativeBlobUtil from 'react-native-blob-util';

const fs = ReactNativeBlobUtil.fs;

const Details = props => {
  const {data} = props?.route?.params;
  const [visibleImg, setIsVisibleImg] = useState(false);
  console.log(data);

  const btnShareTap = item => {
    console.log(item);

    ReactNativeBlobUtil.config({
      fileCache: true,
    })
      .fetch('GET', item.image_url)
      // the image is now dowloaded to device's storage
      .then(resp => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then(base64Data => {
        // here's base64 encoded image
        var imageUrl = 'data:image/png;base64,' + base64Data;
        let shareImage = {
          title: item?.name, //string
          subject: item?.name + '\n\n' + item.description + '\n\n' + item.link, //string
          message: item?.name + '\n\n' + item.description + '\n\n' + item.link, //string

          url: imageUrl,
          // urls: [item.link], // eg.'http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg',
        };

        console.log('shareImage : ', shareImage);
        Share.open(shareImage)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            err && console.log(err);
          });
        // remove the file from storage
        return fs.unlink(imagePath);
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
          {'Details'}
        </Text>

        <TouchableOpacity
          style={{paddingRight: 10}}
          onPress={() => {
            var dict = {
              name: data.name,
              image_url: data.image_url,
              description: data.description,
              link: data.link,
            };
            btnShareTap(dict);
          }}>
          {/* <FastImage style={{ width: 20, height: 20 }} source={Images} /> */}
          <MaterialCommunityIcons
            name="share-variant"
            color={Colors.primary}
            size={20}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={{}}>
        <TouchableOpacity
          style={{
            marginHorizontal: 20,
            marginVertical: 20,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: Colors.black,
            height: 200,
          }}
          onPress={() => setIsVisibleImg(true)}>
          <Image
            style={{
              height: '100%',
              width: '100%',
              resizeMode: 'cover',
              borderRadius: 6,
            }}
            source={{uri: data?.image_url}}
          />
        </TouchableOpacity>

        <View style={{marginHorizontal: 20, flexDirection: 'row'}}>
          <Text
            style={{
              fontSize: FontSize.FS_18,
              color: Colors.black,
              flex: 1,
              fontFamily: ConstantKey.MONTS_SEMIBOLD,
            }}>
            {data?.name}
          </Text>
          <View>
            {data?.start_date != null && (
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: Colors.primaryLight,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.dateText}>
                  {moment(data?.start_date).format('DD MMM YY')}
                </Text>
              </View>
            )}
            {data?.start_date != data?.end_date && data?.end_date != null && (
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: Colors.primaryLight,
                  borderRadius: 5,
                  marginTop: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.dateText}>
                  {moment(data?.end_date).format('DD MMM YY')}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.descView}>
          <Text style={styles.descText}>{data?.description}</Text>

          <Text
            style={[
              styles.descText,
              {textDecorationLine: 'underline', marginTop: 10},
            ]}
            onPress={() => {
              if (data?.link) {
                Linking.openURL(data?.link);
              }
            }}>
            {data?.link}
          </Text>
        </View>

        {data?.image_url != null ? (
          <ImageView
            images={[{uri: data?.image_url}]}
            imageIndex={0}
            visible={visibleImg}
            onRequestClose={() => {
              setIsVisibleImg(false);
            }}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  dateText: {
    fontSize: FontSize.FS_10,
    color: Colors.black,
    fontFamily: ConstantKey.MONTS_SEMIBOLD,
  },
  descText: {
    fontSize: FontSize.FS_12,
    color: Colors.black,
    fontFamily: ConstantKey.MONTS_REGULAR,
  },
  descView: {
    marginVertical: 20,
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10,
  },
});

export default Details;
