import * as React from 'react';
import { StatusBar } from 'react-native';

//Third Party
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme, NavigationContainerRef } from '@react-navigation/native';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import analytics from '@react-native-firebase/analytics';

//Screens
import HomeTabNavigator from 'app/navigation/HomeTabNavigator';

//Redux
import IState from 'app/models/models/appState';

//App Modules

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      primary: string;
      onPrimary: string;

      background: string;
      onBackground: string;

      surface: string;
      onSurface: string;

      error: string;
    }

    interface Theme {}
  }
}

const Stack = createNativeStackNavigator();

const homeOptions: Object = {
  title: 'Home',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerShown: false,
};

interface IProps {
  theme: Theme;
}

const Navigator: React.FC<IProps> = (props: IProps) => {
  const routeNameRef = React.useRef<string | null>();
  const navigationRef = React.useRef<any>();

  const { theme } = props;
  const isDark = useSelector((state: IState) => state.themeReducer.isDark);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current!.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}
      theme={theme}>
      <StatusBar
        backgroundColor={isDark ? '#000000' : '#00000000'}
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent={false}
      />
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeTabNavigator} options={homeOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const RootNavigation: React.FC = () => {
  const primary = useSelector((state: IState) => state.themeReducer.primary);

  const PaperThemeDefault = {
    ...PaperDefaultTheme,
    colors: {
      ...PaperDefaultTheme.colors,
      primary: primary,
      onPrimary: '#FFFFFF',

      background: '#FFFFFF',
      onBackground: '#000000',

      surface: '#eeeeee',
      onSurface: '#000000',

      error: '#FF0000',
    },
  };

  const PaperThemeDark = {
    ...PaperDarkTheme,
    colors: {
      ...PaperDarkTheme.colors,
      primary: primary,
      onPrimary: '#000000',

      background: '#000000',
      onBackground: '#FFFFFF',

      surface: '#222222',
      onSurface: '#FFFFFF',

      error: '#FF0000',
    },
  };

  const CombinedDefaultTheme = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
    },
  };

  const CombinedDarkTheme = {
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
    },
  };

  const isDark = useSelector((state: IState) => state.themeReducer.isDark);

  return (
    <PaperProvider theme={isDark ? PaperThemeDark : PaperThemeDefault}>
      <Navigator theme={isDark ? CombinedDarkTheme : CombinedDefaultTheme} />
    </PaperProvider>
  );
};

export default RootNavigation;
