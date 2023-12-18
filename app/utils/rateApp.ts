import InAppReview from 'react-native-in-app-review';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rateApp = async () => {
  let lastDateAppReviewed = await AsyncStorage.getItem('APP_LAST_REVIEW_DATE');
  if (lastDateAppReviewed !== null) {
    let today: any = new Date();
    const leftTime = Math.abs(today - Date.parse(lastDateAppReviewed));
    let leftDays = Math.ceil(leftTime / (1000 * 60 * 60 * 24));
    if (leftDays > 15) {
      await AsyncStorage.setItem('APP_LAST_REVIEW_DATE', new Date().toString());
      InAppReview.RequestInAppReview();
    }
  } else {
    await AsyncStorage.setItem('APP_LAST_REVIEW_DATE', new Date().toString());
    InAppReview.RequestInAppReview();
  }
};

const rateAppIfNeeded = async () => {
  let appItemsViews = await getItems();
  let appItemsViewsCount = appItemsViews.length;
  if (appItemsViewsCount >= 2) {
    rateApp();
  }
};

const saveItem = async (item: any) => {
  let rawAppItemsViews = await AsyncStorage.getItem('APP_ITEM_VIEWS');
  let appItemsViews = [item.id];
  if (rawAppItemsViews) {
    appItemsViews = JSON.parse(rawAppItemsViews);
    if (Array.isArray(appItemsViews) && appItemsViews.indexOf(item.id) === -1) {
      appItemsViews.push(item.id);
    }
  }
  AsyncStorage.setItem('APP_ITEM_VIEWS', JSON.stringify(appItemsViews));
};

const getItems = async () => {
  let rawAppItemsViews = await AsyncStorage.getItem('APP_ITEM_VIEWS');
  let appItemsViews = [];
  if (rawAppItemsViews) {
    appItemsViews = JSON.parse(rawAppItemsViews);
    if (Array.isArray(appItemsViews)) {
      return appItemsViews;
    }
  }
  return [];
};

export default { rateAppIfNeeded, saveItem };
