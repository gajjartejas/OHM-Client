import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Alert, Linking } from 'react-native';

const openInAppBrowser = async (url: string) => {
  try {
    if (await InAppBrowser.isAvailable()) {
      InAppBrowser.open(url);
    } else {
      Linking.openURL(url);
    }
  } catch (e) {
    Alert.alert(JSON.stringify(e));
  }
};

export default openInAppBrowser;
