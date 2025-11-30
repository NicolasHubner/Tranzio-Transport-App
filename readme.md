# ManagerCompany

## Installing the Project

1. Install [Node.js](https://nodejs.org/en/download/) (version 18 or higher).
2. Install [Yarn](https://yarnpkg.com/getting-started/install).
3. Install [Expo](https://docs.expo.io/get-started/installation/).
4. Install [Expo Go](https://expo.io/client).
5. Clone the repository.

## Running the Project

1. Run `yarn install`.
2. Run `yarn android` or `yarn ios`.
3. Run `yarn dev`.
4. Choose Android or iOS to emulate the app.

## Creating an APK for Testing

- Use the standard Linux configuration. If you are on Windows, be mindful of the package.json settings to ensure compatibility between Linux and Windows.

- On Linux, use `./gradlew` instead of `gradlew`.

1. Run `yarn prebuild:release-apk`.
2. Run `yarn build:release-apk`.

## Creating an APK for Production

- Use the standard Linux configuration. If you are on Windows, be mindful of the package.json settings to ensure compatibility between Linux and Windows.

- On Linux, use `./gradlew` instead of `gradlew`.

- Remember to update the version in the `.env` file to the desired version.

- Also, update the `versionCode` and `versionName` in `/android/app/build.gradle` to the desired version.

1. Run `yarn prebuild:release-bundle`.
2. Run `yarn build:release-bundle`.
