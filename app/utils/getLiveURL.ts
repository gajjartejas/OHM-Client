const getLiveURL = (serverURLs: string[], controller: AbortController): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const { signal } = controller;
    for (let i = 0; i < serverURLs.length; i++) {
      let url = serverURLs[i];
      fetch(url, {
        method: 'GET',
        signal,
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
        .then(response => {
          if (response.ok) {
            resolve(url);
          }
        })
        .catch(e => {
          console.log(`getLiveURL->error: ${serverURLs}:`, e);
          reject();
        });
    }
  });
};

export default getLiveURL;
