//import liraries
import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  ImageBackground,
  Alert,
  Platform,
  PermissionsAndroid,
  StatusBar,
  FlatList,
} from 'react-native';

// Constants
import i18n from '../Localize/i18n';
import {ConstantKey} from '../Constants/ConstantKey';
import {Colors} from '../Constants/Colors';
import {Images} from '../Constants/Images';
import {FontSize} from '../Constants/FontSize';
import Webservice from '../Constants/API';
import LoadingView from '../Constants/LoadingView';
import {APIURL} from '../Constants/APIURL';
import {version as versionNo} from '../../package.json';

//Third Party
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import FastImage from 'react-native-fast-image';
import { storeData } from '../commonComponents/AsyncManager';
import { setSelectedSchool } from '../Redux/reducers/userReducer';
import { useDispatch } from 'react-redux';

// create a component
const WelcomeScreen = props => {

    const dispatch = useDispatch()
    
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [txtMobile, setTxtMobile] = useState(
    props?.route?.params?.data?.mobile_number || '',
  );
  const [txtPassword, setTxtPassword] = useState('');

  const [txtForgotMobile, setTxtForgotMobile] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const [SchoolData, setSchoolData] = useState(null);

  useEffect(() => {
    console.log('DD :', props.route.params.data?.user?.school_data);
    setSchoolData(props?.route?.params?.data?.user?.school_data);
  }, []);

  const Api_Login = isLoad => {
    setIsLoading(isLoad);

    Webservice.post(APIURL.login, {
      mobile_number: txtMobile,
      device_type: Platform.OS == 'android' ? 1 : 2,
      device_token: fcmToken,
    })
      .then(response => {
        // console.log("Login response : ", JSON.stringify(response));
        setIsLoading(false);

        if (response.data.status == true) {
          if (
            response.data.data.is_register == true &&
            response.data.data.is_active == 1
          ) {
            var dict = {};
            dict.mobile_number = txtMobile;
            dict.isFrom = 'LOGIN';
            props.navigation.navigate('Otp', {data: dict});
          }
          // storeUserData(JSON.stringify(response.data.Data[0]))
        } else {
          Toast.showWithGravity(
            response.data.message,
            Toast.LONG,
            Toast.CENTER,
          );
          // var dict = {};
          // dict.mobile_number = txtMobile
          // props.navigation.navigate("Register",{data : dict})
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };

  const storeUserData = async value => {
    try {
      await AsyncStorage.setItem(ConstantKey.USER_DATA, value);
      // props.navigation.replace('Home')
      props.navigation.replace('Otp');
    } catch (e) {
      // saving error
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
      <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />

      <View style={styles.container}>
        <View style={{}}>
          <Text
            style={{
              fontSize: FontSize.FS_26,
              color: Colors.black,
              fontFamily: ConstantKey.MONTS_SEMIBOLD,
              marginVertical: 20,
              textAlign : 'center'
            }}>
            {'Welcome!'}
          </Text>
          {/* <FastImage style={{ width: 100, height: 100 }} 
                    source={props?.route?.params?.data?.user?.school_data?.logo_url ? {uri : props?.route?.params?.data?.user?.school_data?.logo_url}: Images.School_logo} />
                <Text style={{
                    fontSize: FontSize.FS_20,
                    color: Colors.black,
                    fontFamily: ConstantKey.MONTS_MEDIUM,
                    marginTop: 26
                }}>{props?.route?.params?.data?.user?.school_data?.title}</Text> */}

         
        </View>

        <FlatList
            // ListHeaderComponent={() => {
            //   return <View style={{height: 20}}></View>;
            // }}
            data={SchoolData}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    backgroundColor: Colors.white,
                    marginHorizontal: 20,
                    borderRadius: 10,
                    marginBottom: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 5,
                    padding: 15,
                  }}
                  onPress={() => btnSelectSchool(item)}>
                  <Image
                    style={{
                      resizeMode: 'contain',
                      height: 120,
                      borderRadius: 5,
                    }}
                    source={
                      item?.logo_url
                        ? {uri: item?.logo_url}
                        : Images.UserPlaceHolder
                    }
                  />

                  <Text style={styles.schoolTitle}>{item?.title}</Text>
                  <Text style={styles.addressLabel}>{item?.address}</Text>

                  <TouchableOpacity
          style={styles.btnLogin}
          onPress={() => {
            var dict = {};
            dict.mobile_number = txtMobile;

            storeData(ConstantKey.SELECTED_SCHOOL_DATA,item,() => {
                dispatch(setSelectedSchool(item))
                props.navigation.navigate('Register', {
                    data: props?.route?.params?.data,
                    selected_school : item
                  });
            })
            
          }}>
          <Text style={styles.loginText}>{'Create Profile'}</Text>
          <Icon name={"chevron-right"} size={20} color={Colors.white} style={{marginLeft : 10}} /> 
        </TouchableOpacity>
                </View>
              );
            }}
          />
        {/* <TouchableOpacity
          style={styles.btnLogin}
          onPress={() => {
            var dict = {};
            dict.mobile_number = txtMobile;
            props.navigation.navigate('Register', {
              data: props?.route?.params?.data,
            });
          }}>
          <Text style={styles.loginText}>{'Create Profile'}</Text>
          <Icon name={"chevron-right"} size={20} color={Colors.white}  /> 
        </TouchableOpacity> */}
        {isLoading ? <LoadingView /> : null}
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    // justifyContent: "center",
    // alignItems:"center",
    // alignSelf:"center"
  },
  mobileView: {
    marginTop: 10,
    flexDirection: 'row',
    borderRadius: 6,
    backgroundColor: Colors.white,
    height: 50,
    alignItems: 'center',
    backgroundColor: Colors.lightGrey01,
  },
  countryCodeText: {
    marginLeft: 10,
    fontSize: FontSize.FS_16,
    fontFamily: ConstantKey.MONTS_REGULAR,
    color: Colors.black,
  },
  textInputMobile: {
    marginLeft: 10,
    marginRight: 10,
    height: 50,
    flex: 1,
    fontSize: FontSize.FS_14,
    fontFamily: ConstantKey.MONTS_REGULAR,
    color: Colors.black,
  },
  btnLogin: {
    backgroundColor: Colors.primary,
    marginTop: 10,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection : 'row',
    justifyContent: 'center',
    marginHorizontal: 25,
    // shadowColor: Colors.primaryRed,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.4, shadowRadius: 2, elevation: 2
  },
  loginText: {
    fontSize: FontSize.FS_16,
    color: Colors.white,
    fontFamily: ConstantKey.MONTS_SEMIBOLD,
  },
  schoolTitle: {
    fontSize: FontSize.FS_16,
    color: Colors.black,
    fontFamily: ConstantKey.MONTS_SEMIBOLD,
    marginTop: 10,
    textAlign: 'center',
  },
  addressLabel: {
    fontSize: FontSize.FS_12,
    color: Colors.grey,
    fontFamily: ConstantKey.MONTS_SEMIBOLD,
    marginTop: 10,
    textAlign: 'center',
  },
});

//make this component available to the app
export default WelcomeScreen;
