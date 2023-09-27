/**  Third Party  */
import axios from "axios";

/** Constant Files */
import { APIURL } from './APIURL';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConstantKey } from "./ConstantKey";
import { navigate } from "./NavigationService";


const ApiManager = axios.create({
	baseURL: APIURL.BASE_URL,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'multipart/form-data',
		// "Authorization": '',
	},
	timeout: 60000
});

/**  Set the AUTH token for any request  */
ApiManager.interceptors.request.use(async config => {

	/**  Set Barear Token in Haeder */
	var token = await AsyncStorage.getItem(ConstantKey.USER_DATA)
	token = JSON.parse(token)
	// console.log('====================================');
	// console.log("User Token axios: " + token);
	// console.log('====================================');
	if (token) {
		config.headers.Authorization = "Bearer " + token?.token
	}

	return config
});

/** Handle Response error from axios  */
ApiManager.interceptors.response.use(response => {


	return response
}, function (error) {


	console.log("Axios interceptors err : " + JSON.stringify(error))

	if (error.hasOwnProperty("code") && error.code == "ECONNABORTED") {
		Toast.showWithGravity("Server Not Responding", Toast.SHORT, Toast.CENTER);
	}
	else if (error.hasOwnProperty("code") && error.code == 'ERR_NETWORK') {

		Toast.showWithGravity("No Internet Connection", Toast.SHORT, Toast.CENTER);
	}
	else if (error.hasOwnProperty("code") && error.code == 'ERR_NETWORK') {

		Toast.showWithGravity("No Internet Connection", Toast.SHORT, Toast.CENTER);
	}
	else {
		// navigate("Login")
	}
	return Promise.reject(error);
})

export default ApiManager;

/*import { create } from 'apisauce'
import qs from 'qs';
import R from 'ramda';
import Toast from 'react-native-simple-toast';
import { APIURL } from './APIURL';
 
const api = create({
  baseURL: APIURL.BASE_URL,
  headers: {
	  Accept: 'application/json',
	  'Content-Type' : 'application/x-www-form-urlencoded',
	  'Cache-Control': 'no-cache',
	  
  },
  timeout: 100000
});

const monitor = (response) => {
  const { config: { method, url }, data, status } = response;
  console.group(`Requesting [${method.toUpperCase()}] ${url}:`);
  console.log('Response Status:', status);
  console.log('Response Data:', data);
  console.groupEnd();
};
api.addMonitor(monitor);

api.addRequestTransform((request) => {
  if (R.contains(request.method, ['delete', 'post', 'put'])) {
	  if (!(request.data instanceof FormData)) {
		  request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		  request.data = qs.stringify(request.data);
	  }
  }
});


api.addResponseTransform((response) => {
  if(response.problem=='NETWORK_ERROR'){

	Toast.showWithGravity("No Internet Connection", Toast.SHORT, Toast.CENTER);
  }else if(response.problem=='TIMEOUT_ERROR'){

	Toast.showWithGravity("Server Not Responding", Toast.SHORT, Toast.CENTER);
  }
});

export default api;*/