import React from 'react';

//Third Party
import { useTheme } from 'react-native-paper';
import { Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-easy-icon';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

//Screens
import DashboardTab from 'app/screens/Home/HomeTabs/DashboardTab';
import MoreTab from 'app/screens/Home/HomeTabs/MoreTab';
import MoreApps from 'app/screens/Settings/MoreApps';
import Settings from 'app/screens/Settings/Settings';
import About from 'app/screens/Settings/About';
import SelectAppearance from 'app/screens/Settings/SelectAppearance';
import License from 'app/screens/Settings/License';
import Translators from 'app/screens/Settings/Translators';
import GeneralSetting from 'app/screens/Settings/GeneralSetting';
import { useSelector } from 'react-redux';
import IState from 'app/models/models/appState';
import DeviceLists from 'app/screens/Home/DeviceLists';

const Tab = createMaterialBottomTabNavigator();

function HomeOrList(props: any) {
  //Constants
  const selectedDevice = useSelector((state: IState) => state.deviceReducer.selectedDevice);

  return (
    <>
      {selectedDevice && selectedDevice.deviceInfo && <DashboardTab {...props} />}
      {(!selectedDevice || !selectedDevice.deviceInfo) && <DeviceLists {...props} />}
    </>
  );
}

function HomeTabs() {
  //Constants
  const { colors } = useTheme();

  return (
    <Tab.Navigator activeColor={colors.primary} barStyle={{ backgroundColor: colors.background }}>
      <Tab.Screen
        name="HomeOrList"
        component={HomeOrList}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Icon type="material-community" name="view-dashboard" color={color} size={21} />,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreTab}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ color }) => <Icon type="material-community" name="dots-horizontal" color={color} size={21} />,
        }}
      />
    </Tab.Navigator>
  );
}

interface IProps {
  theme: Theme;
}

const LoggedInStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

const LoggedInTabNavigator: React.FC<IProps> = () => {
  return (
    <LoggedInStack.Navigator>
      <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
      <Stack.Screen name="MoreApps" component={MoreApps} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={About} options={{ headerShown: false }} />
      <Stack.Screen name="SelectAppearance" component={SelectAppearance} options={{ headerShown: false }} />
      <Stack.Screen name="License" component={License} options={{ headerShown: false }} />
      <Stack.Screen name="Translators" component={Translators} options={{ headerShown: false }} />
      <Stack.Screen name="GeneralSetting" component={GeneralSetting} options={{ headerShown: false }} />
    </LoggedInStack.Navigator>
  );
};

export default LoggedInTabNavigator;
