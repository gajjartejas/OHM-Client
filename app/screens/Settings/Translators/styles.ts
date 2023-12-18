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
  flatlist: {
    paddingHorizontal: 16,
  },
  subView: {},
  listItemImage: {
    width: 36,
    height: 36,
    alignSelf: 'center',
    marginHorizontal: 8,
  },
  listItemContainer: {
    marginHorizontal: 8,
    marginTop: 12,
    borderRadius: 8,
  },
  cardTablet: {
    width: '70%',
    alignSelf: 'center',
    flex: 1,
  },
  titleTextStyle: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyListContainer: {
    flex: 1,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
