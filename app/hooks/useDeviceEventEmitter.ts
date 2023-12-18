import { useEffect } from 'react';
import { DeviceEventEmitter, EmitterSubscription } from 'react-native'; // Assuming you are using React Native

const useEventEmitter = <T>(eventName: string, callback?: (eventData: T) => void): ((eventData: T) => void) => {
  useEffect(() => {
    if (callback === undefined) {
      return;
    }
    const listener: EmitterSubscription = DeviceEventEmitter.addListener(eventName, callback);
    return () => {
      listener.remove();
    };
  }, [eventName, callback]);

  return (eventData: T): void => {
    DeviceEventEmitter.emit(eventName, eventData);
  };
};

export default useEventEmitter;
