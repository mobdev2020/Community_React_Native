import AsyncStorage from '@react-native-async-storage/async-storage';


export function storeData(key, detail, success, failure) {
	AsyncStorage.setItem(key, JSON.stringify(detail)).then(
		data => { if (success) success(data) },
		fail => { if (failure) failure(fail) },
	);
}


export function getData(key, success, failure) {
	AsyncStorage.getItem(key).then(
		data => { if (success) success(JSON.parse(data)) },
		fail => { if (failure) failure(fail) },
	);
}


export function removeData(key, success, failure) {
	AsyncStorage.removeItem(key).then(
		data => { if (success) success(data) },
		fail => { if (failure) failure(fail) },
	);
}


export function removeAllData(success, failure) {
	AsyncStorage.clear().then(
		data => { if (success) success(data) },
		fail => { if (failure) failure(fail) },
	);
}