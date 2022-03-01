 
 [<img align="right" src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/instagram.svg" width="50" height="50" />](http://www.instagram.com/gajjartejas)
 [<img align="right" src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/twitter.svg" width="50" height="50" />](http://www.twitter.com/gajjartejas)

# Introduction

`OHM-Client` is an unofficial open-source open hardware monitor client app for android and iOS written in react-native. Using this app you can monitor open hardware monitor web server.

## Installation
Get app from google play:

<a href="https://play.google.com/store/apps/details?id=com.tejasgajjar.ohmc">
  <img alt="Android app on Google Play" src="http://developer.android.com/images/brand/en_generic_rgb_wo_60.png" />
</a>

## Screeshots
Scan Screen            |  Add Device Screen          |  Home Screen            |  Home Screen
:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:
![Scan](docs/images/v1.0.0/scan.jpg)   |  ![Add Device](docs/images/v1.0.0/add-device.jpg) |  ![Home](docs/images/v1.0.0//home-1.jpg)  |  ![Home](docs/images/v1.0.0//home-2.jpg)


More Screen            |  Setting Screen          |  General Setting Screen
:-------------------------:|:-------------------------:|:-------------------------:
![More](docs/images/v1.0.0/more.jpg)   |  ![Setting](docs/images/v1.0.0/settings.jpg) |  ![Home](docs/images/v1.0.0/general-setting.jpg)

The application supports Android 6.0 (API 23) and above.

## Features include:

* Auto scan live open hardware monitor remote web server.
* Add manually remote web server using ip address and port.
* Auto refresh system information from remote web server.
* Dark theme support.
* Multi language support.

## Building

### Basic setup
If you want to build from source, just do

    git clone https://github.com/gajjartejas/OHM-Client.git
    cd OHM-Client
    `npm install` or `yarn`
    cd ios && pod install && cd..

### With Android Studio

1. Clone repo `git clone https://github.com/gajjartejas/OHM-Client.git`
2. In Android Studio selection "Open an existing Android Studio Project"
3. Wait for Gradel to sync and then run or build.

### With Xcode

1. Clone repo `git clone https://github.com/gajjartejas/OHM-Client.git`
2. Navigate to `OHM-Client/ios` and open `OpenHardwareMonClient.xcworkspace` folder.
3. Run the project.

## Todo
1. List all remote web server within network. - Done
2. Share text, pdf via react-native-share, print system info or html download.
3. Realtime chart.
4. Take a snapshot of data in database at particular time or manually.
5. Display data over internet.
7. Widget support.
10. Alert based on cpu usage, gpu usage or device goes to offline.
11. Firebase realtime support with separate electron app that sync data with firebase/ login and QR code support.

## Contributing

There are many ways you can contribute to the development.

* Pull requests are always welcome! 
* You must respect conventional commits for your commits and MR title.
* You can merge only if your CI is green.
* give priority to squash and merge, and not merge with a merge commit
* Please visit [CrowdIn](https://crowdin.com/project/openhardwaremonitorclient) in order to update and create new translations

## License

OHM-Client is licensed under the [MIT License](https://github.com/gajjartejas/OHM-Client/blob/main/LICENSE).
