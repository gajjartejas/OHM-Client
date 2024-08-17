import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import zustandStorage from 'app/store/zustandStorage';

interface IAppWebViewConfigState {
  mediaPlaybackRequiresUserAction: boolean;
  scalesPageToFit: boolean;
  domStorageEnabled: boolean;
  javaScriptEnabled: boolean;
  thirdPartyCookiesEnabled: boolean;
  userAgent: string | undefined;
  allowsFullScreenVideo: boolean;
  allowsInlineMediaPlayback: boolean;
  allowsAirPlayForMediaPlayback: boolean;
  bounces: boolean;
  contentMode: string;
  geolocationEnabled: boolean;
  allowFileAccessFromFileUrls: boolean;
  allowsBackForwardNavigationGestures: boolean;
  pullToRefreshEnabled: boolean;
  forceDarkOn: boolean;
  allowsProtectedMedia: boolean;
}

interface IAppWebViewConfigActions {
  setMediaPlaybackRequiresUserAction: (value: boolean) => void;
  setScalesPageToFit: (value: boolean) => void;
  setDomStorageEnabled: (value: boolean) => void;
  setJavaScriptEnabled: (value: boolean) => void;
  setThirdPartyCookiesEnabled: (value: boolean) => void;
  setUserAgent: (value: string | undefined) => void;
  setAllowsFullScreenVideo: (value: boolean) => void;
  setAllowsInlineMediaPlayback: (value: boolean) => void;
  setAllowsAirPlayForMediaPlayback: (value: boolean) => void;
  setBounces: (value: boolean) => void;
  setContentMode: (value: string) => void;
  setGeolocationEnabled: (value: boolean) => void;
  setAllowFileAccessFromFileUrls: (value: boolean) => void;
  setAllowsBackForwardNavigationGestures: (value: boolean) => void;
  setPullToRefreshEnabled: (value: boolean) => void;
  setForceDarkOn: (value: boolean) => void;
  setAllowsProtectedMedia: (value: boolean) => void;
  reset: () => void;
}

const initialState: IAppWebViewConfigState = {
  mediaPlaybackRequiresUserAction: false,
  scalesPageToFit: true,
  domStorageEnabled: true,
  javaScriptEnabled: true,
  thirdPartyCookiesEnabled: true,
  userAgent: undefined,
  allowsFullScreenVideo: false,
  allowsInlineMediaPlayback: false,
  allowsAirPlayForMediaPlayback: false,
  bounces: true,
  contentMode: 'recommended',
  geolocationEnabled: false,
  allowFileAccessFromFileUrls: false,
  allowsBackForwardNavigationGestures: false,
  pullToRefreshEnabled: false,
  forceDarkOn: false,
  allowsProtectedMedia: false,
};

const useAppWebViewConfigStore = create<IAppWebViewConfigState & IAppWebViewConfigActions>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setMediaPlaybackRequiresUserAction: (value: boolean) => set(() => ({ mediaPlaybackRequiresUserAction: value })),
        setScalesPageToFit: (value: boolean) => set(() => ({ scalesPageToFit: value })),
        setDomStorageEnabled: (value: boolean) => set(() => ({ domStorageEnabled: value })),
        setJavaScriptEnabled: (value: boolean) => set(() => ({ javaScriptEnabled: value })),
        setThirdPartyCookiesEnabled: (value: boolean) => set(() => ({ thirdPartyCookiesEnabled: value })),
        setUserAgent: (value: string | undefined) => set(() => ({ userAgent: value })),
        setAllowsFullScreenVideo: (value: boolean) => set(() => ({ allowsFullScreenVideo: value })),
        setAllowsInlineMediaPlayback: (value: boolean) => set(() => ({ allowsInlineMediaPlayback: value })),
        setAllowsAirPlayForMediaPlayback: (value: boolean) => set(() => ({ allowsAirPlayForMediaPlayback: value })),
        setBounces: (value: boolean) => set(() => ({ bounces: value })),
        setContentMode: (value: string) => set(() => ({ contentMode: value })),
        setGeolocationEnabled: (value: boolean) => set(() => ({ geolocationEnabled: value })),
        setAllowFileAccessFromFileUrls: (value: boolean) => set(() => ({ allowFileAccessFromFileUrls: value })),
        setAllowsBackForwardNavigationGestures: (value: boolean) =>
          set(() => ({ allowsBackForwardNavigationGestures: value })),
        setPullToRefreshEnabled: (value: boolean) => set(() => ({ pullToRefreshEnabled: value })),
        setForceDarkOn: (value: boolean) => set(() => ({ forceDarkOn: value })),
        setAllowsProtectedMedia: (value: boolean) => set(() => ({ allowsProtectedMedia: value })),
        reset: () => set(_state => ({ ...initialState })),
      }),
      {
        name: 'app-scan-config-storage',
        storage: createJSONStorage(() => zustandStorage),
        onRehydrateStorage: state => {
          console.log('useAppWebViewConfigStore->hydration starts', state);
        },
        version: 1,
      },
    ),
  ),
);

export default useAppWebViewConfigStore;
