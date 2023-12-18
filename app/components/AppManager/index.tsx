import React, { memo, ReactElement, useEffect } from 'react';
import { Appearance, View } from 'react-native';

//App Modules
import styles from './styles';
import AppearancePreferences = Appearance.AppearancePreferences;
import useThemeConfigStore, { IAppearanceType } from 'app/store/themeConfig';

//Interface
export type Props = {
  children: ReactElement[] | ReactElement;
};

const AppManager = ({ children }: Props) => {
  const setIsDarkMode = useThemeConfigStore(store => store.setIsDarkMode);
  const appearance = useThemeConfigStore(store => store.appearance);

  useEffect(() => {
    const onThemeChange = (preferences: AppearancePreferences) => {
      if (appearance === IAppearanceType.Auto) {
        setIsDarkMode(preferences.colorScheme === 'dark');
      }
    };
    const listener = Appearance.addChangeListener(onThemeChange);
    return () => listener.remove();
  }, [appearance, setIsDarkMode]);

  return (
    <View style={styles.container}>
      <View style={styles.container}>{children}</View>
    </View>
  );
};

export default memo(AppManager);
