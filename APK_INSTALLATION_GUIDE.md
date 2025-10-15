# Installing the CRED Loan App APK

## APK Details

- **File Name:** `cred-loan-app-debug.apk`
- **File Size:** 4.1 MB
- **Package Name:** `com.credloan.app`
- **App Name:** CRED Loan App
- **Version:** 1.0 (Debug Build)
- **Min Android:** 5.1 (API 22)
- **Target Android:** 14 (API 34)

## Installation Methods

### Method 1: Direct Installation (Recommended)

1. **Transfer the APK to your Android device:**
   - Email it to yourself
   - Use Google Drive / Dropbox
   - Connect via USB and copy to device
   - Use AirDrop (if supported)

2. **On your Android device:**
   - Open the APK file from your file manager or downloads
   - You may see "Install blocked" message
   - Go to **Settings → Security → Unknown Sources**
   - Enable "Allow from this source" or "Install unknown apps"
   - Return and tap **Install**
   - Wait for installation to complete
   - Tap **Open** to launch the app

### Method 2: Install via ADB (Developer Method)

If you have Android Debug Bridge (ADB) installed:

```bash
# Connect your Android device via USB
# Enable USB Debugging on your device (Developer Options)

# Install the APK
adb install cred-loan-app-debug.apk

# Or force reinstall if already installed
adb install -r cred-loan-app-debug.apk
```

## Enabling Unknown Sources (Android Settings)

### Android 8.0+
1. Go to **Settings → Apps & Notifications**
2. Tap **Advanced → Special app access**
3. Tap **Install unknown apps**
4. Select the app you'll use to install (e.g., Chrome, Files, Gmail)
5. Toggle **Allow from this source**

### Android 7.1 and Earlier
1. Go to **Settings → Security**
2. Toggle **Unknown Sources** ON
3. Confirm the warning

## What to Expect

After installation, you'll see:

✅ **Full-screen mobile experience**
- No device frame, uses your entire screen
- Native scrolling
- Large, easy-to-tap buttons
- Smooth animations

✅ **Instant EMI calculations**
- Pre-filled with default values (₹5L, 24 months, 10%)
- Real-time updates as you adjust sliders
- Quick preset buttons: ₹5L, ₹10L, ₹20L, ₹50L

✅ **Three tabs:**
- **Calculator:** EMI calculator with charts
- **Loan:** Loan application flow
- **Score:** Credit score tracker

## Features

- 📱 Native Android app experience
- 🎨 CRED-inspired dark theme
- 📊 Interactive charts (Pie chart, Line chart)
- 💾 Remembers your last inputs
- 📤 Export and share functionality
- 🎯 Responsive and fast

## Troubleshooting

### APK won't install
- **Solution:** Uninstall any previous version first
- Check minimum Android version (5.1+)
- Ensure "Unknown Sources" is enabled

### App crashes on open
- **Solution:** Uninstall and reinstall
- Clear app cache: Settings → Apps → CRED Loan App → Clear Cache
- Ensure Android WebView is updated

### Charts not loading
- **Solution:** Check internet connection (if needed for fonts)
- Update Android System WebView from Play Store
- Restart the app

### Can't find the app after install
- **Solution:** Check your app drawer
- Search for "CRED" in your device search
- Look in Settings → Apps for "CRED Loan App"

## Updating the App

To update to a newer version:

1. Download the new APK
2. Install it directly (will replace the old version)
3. Your data (last inputs) will be preserved

Or:

1. Uninstall the old version
2. Install the new APK
3. Your data will be lost (fresh start)

## Security Note

This is a **debug APK** intended for testing purposes. For production use:
- Build a **signed release APK** (see BUILD_APK.md)
- Publish to Google Play Store for automatic updates
- Enable ProGuard for code obfuscation

## Getting the Latest Version

To rebuild the APK with latest changes:

```bash
# 1. Rebuild web app for Android
BUILD_TARGET=android npm run build

# 2. Sync to Capacitor
npx cap sync android

# 3. Build APK
export JAVA_HOME="/opt/homebrew/opt/openjdk@21"
cd android && ./gradlew assembleDebug
```

APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

## Uninstalling

**From Device:**
- Settings → Apps → CRED Loan App → Uninstall

**Via ADB:**
```bash
adb uninstall com.credloan.app
```

---

## File Location

The APK is located at:
- **Project Root:** `cred-loan-app-debug.apk`
- **Build Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

## Next Steps

1. Install the APK on your Android device
2. Test all features
3. Report any issues
4. Build a signed release APK for production

---

**Built with:** React + Vite + TailwindCSS + Capacitor
**Last Built:** October 15, 2025
