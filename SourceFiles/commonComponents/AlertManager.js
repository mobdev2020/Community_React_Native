import { showMessage, hideMessage } from "react-native-flash-message";
import { FontSize } from "../Constants/FontSize";
import { ConstantKey } from "../Constants/ConstantKey";
import { Colors } from "../Constants/Colors";

export function DisplayMessage({title, description, type, onPress}) {

	showMessage({
		message: title,
		description: description,
		type: type, // success, warning, info and danger
		duration : 5000,
		icon : type,
		titleStyle : {fontSize : FontSize.FS_14, fontFamily : ConstantKey.MONTS_MEDIUM, color: Colors.white},
		textStyle : {fontFamily : ConstantKey.MONTS_REGULAR, fontSize : FontSize.FS_12,color:Colors.white},
		backgroundColor:"purple",
		onPress : () => {
			onPress()
		}
	  });
}
