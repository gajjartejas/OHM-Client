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
  imageBackground: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 16,
  },
  appNameText: {
    marginTop: 16,
    fontSize: 18,
  },
  appVersion: {
    marginTop: 8,
    fontSize: 13,
  },
  cardContainer: {
    flex: 1,
    marginTop: 32,
    marginHorizontal: 8,
  },
  listItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  listIcon: {
    alignSelf: 'center',
    marginRight: 20,
  },
  divider: {
    marginHorizontal: 20,
  },
  cardTablet: {
    width: '70%',
    alignSelf: 'center',
  },
});

export default styles;
