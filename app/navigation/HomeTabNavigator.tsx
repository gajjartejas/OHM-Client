import React from 'react';

//Third Party
import { useTheme } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-easy-icon';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

//Screens
import MoreTab from 'app/screens/Home/MoreTab';
import MoreApps from 'app/screens/Settings/MoreApps';
import Settings from 'app/screens/Settings/Settings';
import About from 'app/screens/Settings/About';
import SelectAppearance from 'app/screens/Settings/SelectAppearance';
import License from 'app/screens/Settings/License';
import Translators from 'app/screens/Settings/Translators';
import ScanSetting from 'app/screens/Settings/ScanSetting';
import AddDevice from 'app/screens/Home/AddDevice';
import Identities from 'app/screens/Home/Identities';
import AddIdentity from 'app/screens/Home/AddIdentity';
import ManageDevices from 'app/screens/Home/ManageDevices';
import ScanDevices from 'app/screens/Home/ScanDevices';
import ChangeLanguage from 'app/screens/Settings/ChangeLanguage';
import Loading from 'app/screens/Loading';

//App Modules
import { HomeTabsNavigatorParams, LoggedInTabNavigatorParams } from 'app/navigation/types';
import { AppTheme } from 'app/models/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeviceInfo from 'app/screens/Home/DeviceInfo';

const Tab = createMaterialBottomTabNavigator<HomeTabsNavigatorParams>();

function HomeTabs() {
  //Constants
  const { colors } = useTheme<AppTheme>();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{}}
      inactiveColor={colors.secondaryContainer}
      activeColor={colors.secondaryContainer}
      barStyle={{ backgroundColor: colors.background, height: insets.bottom + 60 }}>
      <Tab.Screen
        name="ManageDevices"
        component={ManageDevices}
        initialParams={{ mode: 'connect' }}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <Icon
              type="material-community"
              name="view-dashboard"
              color={focused ? colors.white : colors.primary}
              size={21}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MoreTab"
        component={MoreTab}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <Icon
              type="material-community"
              name="dots-horizontal"
              color={focused ? colors.white : colors.primary}
              size={21}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const LoggedInStack = createNativeStackNavigator<LoggedInTabNavigatorParams>();

const LoggedInTabNavigator = () => {
  return (
    <LoggedInStack.Navigator>
      <LoggedInStack.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="MoreApps" component={MoreApps} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="About" component={About} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="SelectAppearance" component={SelectAppearance} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="License" component={License} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="Translators" component={Translators} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="ScanSetting" component={ScanSetting} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="AddDevice" component={AddDevice} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="Identities" component={Identities} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="AddIdentity" component={AddIdentity} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="ManageDevices" component={ManageDevices} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="ScanDevices" component={ScanDevices} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="ChangeLanguage" component={ChangeLanguage} options={{ headerShown: false }} />
      <LoggedInStack.Screen name="DeviceInfo" component={DeviceInfo} options={{ headerShown: false }} />
    </LoggedInStack.Navigator>
  );
};

export default LoggedInTabNavigator;
