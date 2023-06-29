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
    fontSize: 12,
    alignSelf: 'center',
    fontWeight: '400',
  },
  listIcon: { alignSelf: 'center', marginHorizontal: 16 },
  listSubHeader: { marginLeft: 36 },
  listItem: {
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 8,
    shadowOpacity: 0.2,
  },
  listContainer: { paddingTop: 16, paddingBottom: 8 },
});

export default styles;
