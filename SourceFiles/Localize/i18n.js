// import I18n from "i18n-js";

// import * as RNLocalize from "react-native-localize"

// import en from "./en";

// const locales = RNLocalize.getLocales();

// if (Array.isArray(locales)) {
//   I18n.locale = locales[0].languageTag;
// }

// I18n.fallbacks = true;
// I18n.translations = {
//   en
// };

// export default I18n;
import { I18n } from "i18n-js";

import en from './en';

const i18n = new I18n({
	en: en,
});

i18n.fallbacks = true;


export default i18n;