import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {},
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  subView: {
    flex: 1,
  },
  noDataButtonsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  emptyView: {
    marginHorizontal: 20,
  },
  docker: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: 50,
    borderWidth: 1,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dockerLoadingProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    top: 0,
    right: 0,
    zIndex: 10,
    height: 50,
    overflow: 'hidden',
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
  homeBackFwdButtonContainer: {
    flexDirection: 'row',
  },
  separator: {
    width: '90%',
    height: 1,
    alignSelf: 'center',
  },
  cardTablet: {
    width: '70%',
    alignSelf: 'center',
  },
  webview: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'transparent',
  },
});

export default styles;
