import { useEffect, useRef } from 'react';

//ThirdParty
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

//App Modules
import { IHintConfig } from 'app/hooks/useHintConfig';
import {
  getCrashlytics,
  recordError,
} from '@react-native-firebase/crashlytics';

interface ToastMessage {
  type: 'info' | 'success' | 'warning' | 'error';
  text1: string;
  visibilityTime: number;
  position: 'top' | 'bottom';
}

const useToastMessages = (hintConfig: IHintConfig): null => {
  const { id, hints } = hintConfig;
  const timersRef = useRef<any[]>([]);

  useEffect(() => {
    const clearToast = (): void => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current = [];
      Toast.hide();
    };

    const visibilityTime = 4000;
    const delay = 1000;

    AsyncStorage.getItem(id.toString())
      .then(result => {
        if (result === '1' && !__DEV__) {
          return;
        }
        hints.forEach((hint, index) => {
          const timer = setTimeout(() => {
            const toastMessage: ToastMessage = {
              type: 'info',
              text1: hint,
              visibilityTime: visibilityTime,
              position: 'bottom',
            };

            Toast.show(toastMessage);
            if (index === hints.length - 1) {
              AsyncStorage.setItem(id.toString(), '1').then(() => {});
            }
          }, visibilityTime * index + (index + 1) * delay);
          timersRef.current.push(timer);
        });
      })
      .catch((error: any) => {
        recordError(getCrashlytics(), error, 'useToastMessages.ts->readSvg');
        console.log('error', error);
      });

    return clearToast;
  }, [hints, id]);

  return null;
};

export default useToastMessages;
