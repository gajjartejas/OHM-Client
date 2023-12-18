import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';

//Third Party
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

//Screens
import LoggedInTabNavigator from 'app/navigation/HomeTabNavigator';

//App Modules
import { HomeTabNavigatorParams } from 'app/navigation/types';
import useToastConfig from 'app/hooks/useToastConfig';
import { PaperThemeDark, PaperThemeDefault } from 'app/config/app-theme-config';
import useThemeConfigStore from 'app/store/themeConfig';
import { navigationRef } from 'app/navigation/NavigationService';

const homeOptions: Object = {
  title: 'Home',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerShown: false,
};

const RootNavigation: React.FC = () => {
  const isDark = useThemeConfigStore(state => state.isDark);
  const primary = useThemeConfigStore(state => state.primary);
  const onPrimary = useThemeConfigStore(state => state.onPrimary);
  const secondaryContainer = useThemeConfigStore(state => state.secondaryContainer);
  const onSecondary = useThemeConfigStore(state => state.onSecondary);
  const Stack = createNativeStackNavigator<HomeTabNavigatorParams>();
  const toastConfig = useToastConfig();
  const theme = isDark
    ? {
        ...PaperThemeDark,
        colors: {
          ...PaperThemeDark.colors,
          primary: primary,
          onPrimary: onPrimary,
          secondaryContainer: secondaryContainer,
          onSecondary: onSecondary,
        },
      }
    : {
        ...PaperThemeDefault,
        colors: {
          ...PaperThemeDefault.colors,
          primary: primary,
          onPrimary: onPrimary,
          secondaryContainer: secondaryContainer,
          onSecondary: onSecondary,
        },
      };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      return;
    }
    let to = setTimeout(() => {
      StatusBar.setBackgroundColor('#FFFFFF01');
    }, 500);

    return () => clearTimeout(to);
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer ref={navigationRef} theme={theme}>
        <StatusBar
          backgroundColor={'#FFFFFF01'}
          barStyle={isDark ? 'light-content' : 'dark-content'}
          translucent={true}
        />
        <Stack.Navigator>
          <Stack.Screen name="LoggedInTabNavigator" component={LoggedInTabNavigator} options={homeOptions} />
        </Stack.Navigator>
        <Toast config={toastConfig} />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default RootNavigation;
