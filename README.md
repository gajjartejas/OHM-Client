[<img align="right" src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/instagram.svg" width="50" height="50" />](http://www.instagram.com/gajjartejas)
[<img align="right" src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/twitter.svg" width="50" height="50" />](http://www.twitter.com/gajjartejas)

# Introduction

`OHM-Client` is an unofficial open-source open hardware monitor client app for Android and iOS written in react-native. Using this app you can monitor open hardware monitor web server.

## Installation

Get the app from Google Play:

<a href="https://play.google.com/store/apps/details?id=com.tejasgajjar.ohmc">
  <img alt="Android app on Google Play" src="http://developer.android.com/images/brand/en_generic_rgb_wo_60.png" />
</a>

### Screenshots

|               Auto Scan Network               |                Add Device Manually                |                Home - 1                 |                Home - 2                 |                 Setting                  |
|:---------------------------------------------:|:-------------------------------------------------:|:---------------------------------------:|:---------------------------------------:|:----------------------------------------:|
| ![Accounts List](docs/images/v2.1/scan-1.png) | ![Transactions List](docs/images/v2.1/scan-2.png) | ![Reports](docs/images/v2.1/home-1.png) | ![Reports](docs/images/v2.1/home-2.png) | ![Reports](docs/images/v2.1/setting.png) |

The application supports Android 5.0 (API 21) and above.

## Features include:

- Auto scan live open hardware monitor remote web server.
- Add manually remote web server using IP address and port.
- Auto refresh system information from the remote web server.
- Dark theme support.
- Multi-language support.

## Building

### Basic setup

If you want to build from source, just do

    git clone https://github.com/gajjartejas/OHM-Client.git
    cd OHM-Client
    `npm install` or `yarn`
    cd ios && pod install && cd..

### With Android Studio

1. Clone repo `git clone https://github.com/gajjartejas/OHM-Client.git`
2. In Android Studio select "Open an existing Android Studio Project"
3. Wait for Gradel to sync and then run or build.

### With Xcode

1. Clone repo `git clone https://github.com/gajjartejas/OHM-Client.git`
2. Navigate to `OHM-Client/ios` and open `OpenHardwareMonClient.xcworkspace` folder.
3. Run the project.

## Todo

1. List all remote web servers within the network. - Done
2. Share text, pdf via react-native-share, print system info or HTML download.
3. Real-time chart.
4. Take a snapshot of data in the database at a particular time or manually.
5. Display data over the internet.
6. Widget support.
7. Alert based on CPU usage, GPU usage or device goes offline.
8. Firebase real-time support with a separate electron app that syncs data with Firebase login and QR code support.

## Contributing

There are many ways you can contribute to the development.

- Pull requests are always welcome!
- You must respect conventional commits for your commits and MR title.
- You can merge only if your CI is green.
- give priority to squash and merge, and not merge with a merge commit
- Please visit [CrowdIn](https://crowdin.com/project/openhardwaremonitorclient) in order to update and create new translations

## License

OHM-Client is licensed under the [MIT License](https://github.com/gajjartejas/OHM-Client/blob/main/LICENSE).
