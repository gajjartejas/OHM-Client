import * as React from 'react';

//App Modules
import AppToast, { IAppSuccessToastProps } from 'app/components/AppToast';
import { ToastConfigParams } from 'react-native-toast-message/lib/src/types';

const useToastConfig = () => {
  return {
    success: (props: ToastConfigParams<IAppSuccessToastProps>) => <AppToast {...props} type={'success'} />,
    error: (props: ToastConfigParams<IAppSuccessToastProps>) => <AppToast {...props} type={'error'} />,
    info: (props: ToastConfigParams<IAppSuccessToastProps>) => <AppToast {...props} type={'info'} />,
  };
};

export default useToastConfig;
