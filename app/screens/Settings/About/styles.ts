import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {},
  safeArea: {
    flex: 1,
  },
  scrollView: { paddingBottom: 36 },
  subView: {
    marginHorizontal: 32,
  },
  appNameText: { marginTop: 20, fontSize: 18, alignSelf: 'center', fontWeight: 'bold' },
  appicon: { width: 100, height: 100, borderRadius: 50, marginTop: 16, alignSelf: 'center' },
  appVersionText: {
    marginTop: 8,
    fontSize: 18,
    alignSelf: 'center',
  },
  listIcon: { alignSelf: 'center', marginHorizontal: 8 },
  listSubHeader: { marginLeft: 48 },
  listContainer: { marginHorizontal: 24, borderRadius: 8, marginTop: 16 },
});

export default styles;
