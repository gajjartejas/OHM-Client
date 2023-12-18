import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Alert, Linking } from 'react-native';

const openInAppBrowser = async (url: string) => {
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url);
    } else {
      await Linking.openURL(url);
    }
  } catch (e) {
    Alert.alert(JSON.stringify(e));
  }
};

export const openBrowser = async (url: string) => {
  try {
    await Linking.openURL(url);
  } catch (e: any) {
    Alert.alert(e.message);
  }
};

export default openInAppBrowser;
