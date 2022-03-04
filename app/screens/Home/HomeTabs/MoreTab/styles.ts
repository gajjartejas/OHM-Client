import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {},
  safeArea: {
    flex: 1,
  },
  scrollView: {},
  subView: {
    marginHorizontal: 32,
  },
  imageBackground: {
    height: 200,
    marginTop: 40,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  imageBackgroundCover: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  appIcon: { width: 50, height: 50, borderRadius: 25, marginTop: 16 },
  appNameText: { marginTop: 20, fontSize: 18 },
  appVersion: {
    marginTop: 20,
    fontSize: 18,
  },
  cardContainer: { flex: 1, marginTop: 32, marginHorizontal: 8 },
  listItem: { paddingHorizontal: 20, paddingVertical: 12 },
  listIcon: { alignSelf: 'center', marginRight: 20 },
  divider: { marginHorizontal: 20 },
});

export default styles;
