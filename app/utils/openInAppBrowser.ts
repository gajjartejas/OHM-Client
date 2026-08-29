import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Alert, Linking } from 'react-native';
import {
  getCrashlytics,
  recordError,
} from '@react-native-firebase/crashlytics';

const openInAppBrowser = async (url: string) => {
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url);
    } else {
      await Linking.openURL(url);
    }
  } catch (e: any) {
    recordError(getCrashlytics(), e, 'openInAppBrowser.ts->openInAppBrowser');
    Alert.alert(JSON.stringify(e));
  }
};

export const openBrowser = async (url: string) => {
  try {
    await Linking.openURL(url);
  } catch (e: any) {
    recordError(getCrashlytics(), e, 'openInAppBrowser.ts->openBrowser');
    Alert.alert(e.message);
  }
};

export default openInAppBrowser;
