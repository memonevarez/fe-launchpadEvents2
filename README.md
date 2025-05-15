# Events Platform Frontend

This is the frontend mobile application for the **Events Platform**, built using **React Native** and **Expo**.

The app allows users to:

- View upcoming events
- Book and bookmark events
- Create new events (for staff members)
- View their profile and update user details
- Request to become a staff member
- Download events to Google Calendar

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- An Android/iOS device or emulator
- Backend API running locally or deployed

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/memonevarez/fe-launchpadEvents2.git
cd fe-launchpadEvents2
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the Expo development server**

```bash
npx expo start
```

This will launch the Expo developer tools in your browser.

4. **Run the app**

- Scan the QR code using the **Expo Go** app on your mobile device.
- Or use an emulator through the browser interface (`Run on Android/iOS simulator`).

## Environment Variables

FirebaseConfig.js sent to Leanne over email

## Project Structure

```
.
├── components/         # Reusable UI components
├── context/            # Global context providers (e.g. Auth)
├── screens/            # App screens (Events, Profile, etc.)
├── navigation/         # Tab and stack navigators
├── assets/             # Images and static files
├── App.js              # Entry point
└── package.json
```

## Demo video

https://drive.google.com/file/d/15rAeUm757t3_Ze1I6bl5V6zPp5UiQ97h/view?usp=drive_link

Built with ❤️ using React Native and Expo.
