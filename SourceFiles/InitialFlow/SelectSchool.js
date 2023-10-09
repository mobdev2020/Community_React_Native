import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../Constants/Colors';
import {getData, storeData} from '../commonComponents/AsyncManager';
import {ConstantKey} from '../Constants/ConstantKey';
import i18n from '../Localize/i18n';
import {FontSize} from '../Constants/FontSize';
import {Images} from '../Constants/Images';
import { useDispatch } from 'react-redux';
import { setSelectedSchool } from '../Redux/reducers/userReducer';

const SelectSchool = (props) => {

    const dispatch = useDispatch()

  const [UserData, setUserData] = useState(null);
  const [SchoolData, setSchoolData] = useState(null);

  useEffect(() => {
    getData(ConstantKey.USER_DATA, data => {
      console.log('USER_DATA', data);
      setUserData(data);
      setSchoolData(data?.user?.school_data);
    });
  }, []);



  const btnSelectSchool = (item) => {

    storeData(ConstantKey.SELECTED_SCHOOL_DATA,item,() => {
        dispatch(setSelectedSchool(item))
        props.navigation.replace('Home')
    })
    
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
      <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />

      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* <TouchableOpacity onPress={() =>  props.navigation.goBack()}>
                            <Icon name={'chevron-left'} color={Colors.black} size={20}/>
                        </TouchableOpacity> */}
          <Text
            style={{
              fontSize: FontSize.FS_18,
              color: Colors.black,
              fontFamily: ConstantKey.MONTS_SEMIBOLD,
              marginHorizontal: 20,
              textAlign: 'center',
            }}>
            {i18n.t('SelectSchool')}
          </Text>
        </View>

        <FlatList
          ListHeaderComponent={() => {
            return <View style={{height: 20}}></View>;
          }}
          data={SchoolData}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
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
                  style={{resizeMode: 'contain', height: 120, borderRadius: 5}}
                  source={
                    item?.logo_url
                      ? {uri: item?.logo_url}
                      : Images.UserPlaceHolder
                  }
                />

                <Text style={styles.schoolTitle}>{item?.title}</Text>
                <Text style={styles.addressLabel}>{item?.address}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
export default SelectSchool;
