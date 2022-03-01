import React, { useState } from 'react';
import Navigator from 'app/navigation';
import RNBootSplash, { Config } from 'react-native-bootsplash';

//Redux
import * as devicesActions from 'app/store/actions/devicesActions';
import { useDispatch } from 'react-redux';

const Loading: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    dispatch(devicesActions.configureStartup());
    RNBootSplash.hide({ duration: 250 } as Config).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  return loading ? null : <Navigator />;
};

export default Loading;
