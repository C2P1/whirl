import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { colors, fonts } from '../theme';

export default ({
  placeholder,
  onChangeText,
  type,
  placeholderTextColor = '#ffffff',
  multiline = false,
  ref,
  autoCapitalize = 'none',
  ...props
}) => (
  <TextInput
    autoCapitalize={autoCapitalize}
    autoCorrect={false}
    style={[styles.input]}
    placeholder={placeholder}
    placeholderTextColor={placeholderTextColor}
    onChangeText={value => onChangeText(type, value)}
    underlineColorAndroid="transparent"
    multiline={multiline}
    ref={ref}
    {...props}
  />
);

const styles = StyleSheet.create({
  input: {
    color: '#ffffff',
    padding: 10,
    fontSize: 16,
    fontFamily: fonts.light,
    fontWeight: 'bold'
  }
});
