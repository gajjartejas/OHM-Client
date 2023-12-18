import React, { forwardRef, memo, useState } from 'react';
import { Text, TextInputProps, View, StyleSheet, ViewStyle, TextInputFocusEventData, TextInput } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';

interface IAppTextInputProps extends TextInputProps {
  errorText?: string | null;
  containerStyle?: ViewStyle;
  RightAccessoryView?: React.JSX.Element;
}

const AppTextInput = forwardRef<TextInput, IAppTextInputProps>((props, ref) => {
  const theme = useTheme();
  const { errorText, containerStyle, onBlur, RightAccessoryView, ...otherProps } = props;

  const [isFocused, setIsFocused] = useState(false);

  const handleOnBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    if (onBlur) {
      onBlur(event);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.titleTextStyle, { color: theme.colors.primary }]}>{props.placeholder}</Text>

      <View style={[styles.textInputContainer, { borderBottomColor: theme.colors.primary }]}>
        <TextInput
          ref={ref}
          {...otherProps}
          onBlur={handleOnBlur}
          placeholderTextColor={`${theme.colors.onBackground}80`}
          style={[styles.textInput, { borderBottomColor: theme.colors.primary, color: theme.colors.onBackground }]}
        />
        {RightAccessoryView}
      </View>

      {isFocused && !!errorText && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errorText}</Text>}
    </View>
  );
});

AppTextInput.displayName = 'AppTextInput';

const styles = StyleSheet.create({
  container: {},
  textInputContainer: { flexDirection: 'row', width: '100%', borderBottomWidth: 1 },
  errorText: {
    fontSize: 12,
    marginTop: 8,
  },
  textInput: {
    height: 50,
    flex: 1,
  },
  titleTextStyle: {
    fontSize: 12,
    fontWeight: '400',
  },
});

export default memo(AppTextInput);
