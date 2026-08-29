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
  cardTablet: {
    width: '70%',
    alignSelf: 'center',
  },
  navigationButton: {
    marginHorizontal: 16,
  },
  progressCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressStatusText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  progressPercentageText: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  progressFooterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  discoveredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  discoveredBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scanningEmptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
});

export default styles;
