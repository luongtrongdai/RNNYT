import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  LayoutAnimation,
  Animated
} from 'react-native';
import OnboardingButtons from './OnboardingButtons';
import OnboardingPanel from './OnboardingPanel';
import onboardingContent from '../config/onboarding';
import AppText from './AppText';
import CollapsibleView from './CollapsibleView';
import { ACCENT_COLORS } from '../styles/global';
import { DEVICE_WIDTH } from '../config/device';

export default class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.moveNext = this.moveNext.bind(this);
    this.movePrevious = this.movePrevious.bind(this);
    this.transitionToNextPanel = this.transitionToNextPanel.bind(this);
    this.moveFinal = this.moveFinal.bind(this);
    this.state = {
      currentIndex: 0,
      isDone: false,
      pan: new Animated.Value(0)
    };
  }

  moveFinal() {
    LayoutAnimation.configureNext({
      duration: 1250,
      update: {
        springDamping: 0.4,
        type: LayoutAnimation.Types.spring
      }
    });
    this.setState({ isDone: true });
    setTimeout(() => {
      this.props.navigation.navigate('Home');
    }, 2000);
  }

  movePrevious() {
    this.transitionToNextPanel(this.state.currentIndex - 1);
  }

  moveNext() {
    this.transitionToNextPanel(this.state.currentIndex + 1);
  }

  transitionToNextPanel(nextIndex) {
    Animated.timing(this.state.pan, {
      toValue: nextIndex * DEVICE_WIDTH * -1,
      duration: 300
    }).start(() => {
      this.setState({
        currentIndex: nextIndex
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <CollapsibleView
          style={[
            styles.container
          ]}
          hide={this.state.isDone}
        >
          <Animated.View
            style={[
              styles.panelContainer,
              { width: DEVICE_WIDTH * onboardingContent.length },
              {
                transform: [{
                  translateX: this.state.pan
                }]
              }
            ]}
          >
            {onboardingContent.map((panel, i) => (
              <OnboardingPanel key={i} {...panel} />
            ))}
          </Animated.View>
          <OnboardingButtons
            totalItems={onboardingContent.length}
            currentIndex={this.state.currentIndex}
            movePrevious={this.movePrevious}
            moveNext={this.moveNext}
            moveFinal={this.moveFinal}
          />
        </CollapsibleView>
        <CollapsibleView hide={!this.state.isDone} style={styles.doneContainer}>
          <AppText style={styles.doneText}>Let's read the news!</AppText>
        </CollapsibleView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  panelContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  hidden: {
    width: 0, flex: 0
  },
  doneContainer: {
    overflow: 'hidden',
    backgroundColor: ACCENT_COLORS[0],
    justifyContent: 'center',
    alignItems: 'center'
  },
  doneText: {
    fontSize: 20
  }
});
