import React, { PropTypes, Component } from 'react';
import {
  ListView,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  WebView,
  RefreshControl,
  ActivityIndicator,
  NetInfo
} from 'react-native';

import SmallText from './SmallText';
import NewsItem from './NewsItem';
import AppText from './AppText';
import * as globalStyles from '../styles/global';

export default class NewsFeed extends Component {

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.title !== row2.title
    });
    this.state = {
      dataSource: this.ds.cloneWithRows(props.news),
      initialLoading: true,
      modalVisible: false,
      refreshing: false,
      connected: true
    };

    this.refresh = this.refresh.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
    this.onModalOpen = this.onModalOpen.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
  }

  componentWillMount() {
    NetInfo.isConnected.addEventListener('change', this.handleConnectivityChange);

    this.refresh();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.news),
      initialLoading: false
    });
  }

  componentWillUnmount() { 
    NetInfo.isConnected.removeEventListener('change', this.handleConnectivityChange); 
  }

  
  onModalOpen(url) {
    this.setState({
      modalVisible: true,
      modalUrl: url
    });
  }
  
  onModalClose() {
    this.setState({
      modalVisible: false
    });
  }

  handleConnectivityChange(isConnected) { 
    this.setState({ 
      connected: isConnected 
    }); 
    if (isConnected) { 
      this.refresh(); 
    } 
  }
  
  refresh() {
    if (this.props.loadNews) {
      this.props.loadNews();
    }
  }

  renderRow(rowData, ...rest) {
    const index = parseInt(rest[1], 10);
    return (
      <NewsItem
        onPress={() => this.onModalOpen(rowData.url)}
        style={styles.newsItem}
        index={index}
        {...rowData}
      />
    );
  }

  renderModal() {
    return (
      <Modal 
        visible={this.state.modalVisible}
        animationType="slide"
        onRequestClose={this.onModalClose}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={this.onModalClose}
            style={styles.closeButton}
          >
            <SmallText>Close</SmallText>
          </TouchableOpacity>
          <WebView
            source={{ uri: this.state.modalUrl }}
            scalesPageToFit 
          />
        </View>
      </Modal>
    );
  }

  render() {
    const {
      listStyles = globalStyles.COMMON_STYLES.pageContainer,
      showLoadingSpinner
    } = this.props;
    const { initialLoading, refreshing, dataSource } = this.state;

    if (!this.state.connected) { 
      return ( 
        <View style={[globalStyles.COMMON_STYLES.pageContainer, styles.loadingContainer]}> 
          <AppText> 
            No Connection 
          </AppText> 
        </View> 
      ); 
    }

    return (
      (initialLoading && showLoadingSpinner
        ? (
          <View style={[listStyles, styles.loadingContainer]}>
            <ActivityIndicator
              animating
              size="small"
              {...this.props}
            />
          </View>
        ) : (
          <View style={styles.container}>
            <ListView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.refresh}
                />
              }
              enableEmptySections
              dataSource={dataSource}
              renderRow={this.renderRow}
              style={listStyles}
            />
            {this.renderModal()}
          </View>
        )
      )
    );
  }

}

NewsFeed.propTypes = {
  // news: PropTypes.arrayOf(PropTypes.object),
  listStyles: View.propTypes.style,
  // loadNews: PropTypes.func
};

NewsFeed.defaultProps = {
  showLoadingSpinner: true
};

const styles = StyleSheet.create({
  newsItem: {
    marginBottom: 20
  }, 
  container: { 
    flex: 1 
  }, 
  loadingContainer: { 
    alignItems: 'center',
    justifyContent: 'center' 
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    backgroundColor: globalStyles.BG_COLOR
  },
  closeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row'
  }
});
