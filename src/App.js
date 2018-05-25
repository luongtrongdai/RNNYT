import React from 'react';
import { Provider } from 'react-redux';
import { StackNavigator } from 'react-navigation';

import HomeScreen from './components/HomeScreen';
import IntroScreen from './components/IntroScreen';
import Onboarding from './components/Onboarding';
import createStore from './createStore';

const store = createStore();

const RootStack = StackNavigator({
  Intro: {
    screen: IntroScreen,
  },
  Home: {
    screen: HomeScreen,
  },
  Boarding: {
    screen: Onboarding
  }
}, {
  initialRouteName: 'Boarding',
});

export default () => (
  <Provider store={store}>
    <RootStack />
  </Provider>
);
