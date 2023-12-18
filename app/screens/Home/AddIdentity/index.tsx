import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, Keyboard, TextInput } from 'react-native';

//ThirdParty
import { Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import uuid from 'react-native-uuid';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//App modules
import styles from './styles';

//Redux
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import AppHeader from 'app/components/AppHeader';
import Components from 'app/components';
import useAppConfigStore from 'app/store/appConfig';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'AddIdentity'>;

const AddIdentity = ({ navigation, route }: Props) => {
  //Refs
  let nameRef = useRef<TextInput | null>(null);
  let userNameRef = useRef<TextInput | null>(null);
  let passwordRef = useRef<TextInput | null>(null);

  //Constants
  const { colors } = useTheme();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const upsertIdentity = useAppConfigStore(store => store.upsertIdentity);
  const identity = route.params.identity;
  const largeScreenMode = useLargeScreenMode();

  //States
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    //identity
    setName(identity?.name ?? '');
    setUserName(identity?.username ?? '');
    setPassword(identity?.password ?? '');
  }, [identity?.name, identity?.password, identity?.username]);

  const onPressSave = useCallback(() => {
    Keyboard.dismiss();

    let identityAddOrUpdate = {
      id: identity ? identity.id : uuid.v4().toString(),
      name: name,
      username: userName,
      password: password,
    };

    upsertIdentity(identityAddOrUpdate);
    navigation.pop();
  }, [identity, name, navigation, password, upsertIdentity, userName]);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const validUserName = useCallback(
    (field: string): string | null => {
      return !field || field.trim().length < 1 ? t('addIdentity.usernameRequired') : null;
    },
    [t],
  );

  const validPassword = useCallback(
    (field: string): string | null => {
      return !field || field.trim().length < 1 ? t('addIdentity.passwordRequired') : null;
    },
    [t],
  );

  const validInputs = useMemo(() => {
    return validUserName(userName) !== null || validPassword(password) !== null;
  }, [password, userName, validPassword, validUserName]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={identity ? t('addIdentity.titleUpdate') : t('addIdentity.titleAddIdentity')}
        style={{ backgroundColor: colors.background }}
      />
      <View style={styles.subView}>
        <ScrollView style={styles.scrollView}>
          <View style={[styles.centeredView]}>
            <View
              style={[
                styles.modalView,
                largeScreenMode && styles.cardTablet,
                { backgroundColor: `${theme.colors.background}` },
              ]}>
              <Components.AppTextInput
                ref={nameRef}
                autoCapitalize="none"
                value={name}
                onChangeText={value => setName(value)}
                placeholder={t('addIdentity.inputPlaceholder1')!}
                containerStyle={styles.inputStyle}
                placeholderTextColor={theme.colors.onSurface}
                onSubmitEditing={() => userNameRef.current?.focus()}
                keyboardType={'default'}
                returnKeyType={'next'}
              />

              <Components.AppTextInput
                ref={userNameRef}
                autoCapitalize="none"
                value={userName}
                onChangeText={value => setUserName(value)}
                placeholder={t('addIdentity.inputPlaceholder2')!}
                errorText={validUserName(userName)}
                containerStyle={styles.inputStyle}
                placeholderTextColor={theme.colors.onSurface}
                onSubmitEditing={() => passwordRef.current?.focus()}
                keyboardType={'default'}
                returnKeyType={'next'}
              />

              <Components.AppTextInput
                ref={passwordRef}
                autoCapitalize="none"
                value={password}
                onChangeText={value => setPassword(value)}
                placeholder={t('addIdentity.inputPlaceholder3')!}
                errorText={validPassword(password)}
                containerStyle={styles.inputStyle}
                placeholderTextColor={theme.colors.onSurface}
                onSubmitEditing={onPressSave}
                keyboardType={'visible-password'}
                spellCheck={false}
                returnKeyType={'done'}
              />
            </View>
          </View>
        </ScrollView>

        <Button
          disabled={validInputs}
          mode={'contained'}
          style={[styles.button, largeScreenMode && styles.cardTablet, { marginBottom: insets.bottom + 8 }]}
          onPress={onPressSave}>
          {identity ? t('addIdentity.updateButton') : t('addIdentity.saveButton')}
        </Button>
      </View>
    </View>
  );
};

export default AddIdentity;
