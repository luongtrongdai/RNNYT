import React, { Component } from 'react';
// import { StackNavigator } from 'react-navigation';
import {
  DrawerLayoutAndroid,
  View,
  StyleSheet
} from 'react-native';
import SearchContainer from '../containers/SearchContainer';
// import BookmarksContainer from '../containers/BookmarksContainer';
import AppText from './AppText';
import * as globalStyles from '../styles/global';

import NewsFeedContainer from '../containers/NewsFeedContainer';

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
  };

  state = {
    navConfig: {
      order: ['newsFeed', 'search'],
      newsFeed: {
        title: 'News',
        view: <NewsFeedContainer />,
        tab: 'newsFeed'
      },
      search: {
        title: 'Search',
        view: <SearchContainer />,
        tab: 'search'
      }
    }
  }

  constructor(props) { 
    super(props); 
    this.renderDrawer = this.renderDrawer.bind(this); 
  }

  renderDrawer() { 
    return ( 
      <View style={styles.drawer}> 
        {this.state.navConfig.order.map(key => ( 
          <AppText 
            key={key} 
            style={styles.drawerItem} 
            onPress={() => this.props.tab(this.state.navConfig[key].tab)} 
          > 
            {this.state.navConfig[key].title} 
          </AppText> 
        ))} 
      </View> 
    ); 
  }

  render() {
    return (
      <DrawerLayoutAndroid
        ref={(c) => { this.drawer = c; }}
        drawerWidth={310}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        drawerBackgroundColor="rgba(0,0,0,0.5)"
        renderNavigationView={this.renderDrawer}
      >
        <View style={styles.container}>
          <AppText
            style={styles.menuButton}
            onPress={this.showNav}
          >Menu</AppText>
          {/* {this.state.navConfig[this.props.selectedTab].view} */}
        </View>
      </DrawerLayoutAndroid>
    );
  }
}


export default HomeScreen;

// HomeScreen.propTypes = { 
//   selectedTab: PropTypes.string, 
//   tab: PropTypes.func.isRequired 
// };

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalStyles.BG_COLOR,
    flex: 1
  },
  drawer: {
    backgroundColor: globalStyles.BG_COLOR,
    flex: 1,
    padding: 10
  },
  drawerItem: {
    fontSize: 20,
    marginBottom: 5
  },
  menuButton: {
    marginHorizontal: 10,
    marginTop: 10,
    color: globalStyles.LINK_COLOR
  }
});
