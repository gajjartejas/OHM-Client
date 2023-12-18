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
    marginHorizontal: 8,
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    justifyContent: 'space-around',
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  textSize: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 16,
  },
  inputStyle: {
    marginBottom: 16,
  },
  inputStyleBottom: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    marginLeft: 4,
  },
  advanceSettingText: {
    fontSize: 12,
    alignSelf: 'flex-end',
    minHeight: 20,
  },
  bottomErrorMessage: {
    fontSize: 12,
    marginBottom: 16,
  },
  touchableAdvanceSetting: {
    marginVertical: 8,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  spacing: {
    width: 8,
  },
  selectIdentity: {
    marginHorizontal: -16,
  },
  bottomMargin: {
    marginBottom: 8,
  },
  cardTablet: {
    width: '70%',
    alignSelf: 'center',
  },
});

export default styles;
