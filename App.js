import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Main from './src/pages/Main';
import { StatusBar, YellowBox } from 'react-native'


YellowBox.ignoreWarnings([
  'Expected style'
])

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Main/>
    </>
  );
}
