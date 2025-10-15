# Building Android APK

This guide will help you build an installable Android APK for the CRED Loan App.

## Prerequisites

### 1. Install Java Development Kit (JDK)
You need JDK 17 or higher:

**macOS:**
```bash
brew install openjdk@17
```

**Windows:**
Download from [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [Adoptium](https://adoptium.net/)

**Linux:**
```bash
sudo apt install openjdk-17-jdk
```

### 2. Install Android Studio
Download and install from: https://developer.android.com/studio

During installation, make sure to install:
- Android SDK
- Android SDK Platform
- Android Virtual Device (optional, for testing)

### 3. Set Environment Variables

**macOS/Linux** - Add to `~/.zshrc` or `~/.bashrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

**Windows** - Add these to System Environment Variables:
```
ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
PATH += %ANDROID_HOME%\platform-tools
PATH += %ANDROID_HOME%\cmdline-tools\latest\bin
```

## Building the APK

### Method 1: Using Android Studio (Recommended)

1. **Open the project in Android Studio:**
   ```bash
   npx cap open android
   ```

2. **Wait for Gradle sync to complete** (first time may take 5-10 minutes)

3. **Build the APK:**
   - Go to: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
   - Or use menu: **Build → Generate Signed Bundle / APK** (for release)

4. **Find your APK:**
   - Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Release APK: `android/app/build/outputs/apk/release/app-release.apk`

### Method 2: Using Command Line

1. **Navigate to the android directory:**
   ```bash
   cd android
   ```

2. **Build debug APK:**
   ```bash
   ./gradlew assembleDebug
   ```

3. **Build release APK:**
   ```bash
   ./gradlew assembleRelease
   ```

4. **Find your APK:**
   - Debug: `app/build/outputs/apk/debug/app-debug.apk`
   - Release: `app/build/outputs/apk/release/app-release-unsigned.apk`

## Creating a Signed Release APK

For distribution outside Google Play, you need to sign your APK:

### 1. Generate a Keystore

```bash
keytool -genkey -v -keystore cred-loan-app.keystore -alias credloan -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing in Android Studio

1. Open `android/app/build.gradle`
2. Add signing config:

```gradle
android {
    signingConfigs {
        release {
            storeFile file("/path/to/cred-loan-app.keystore")
            storePassword "your-keystore-password"
            keyAlias "credloan"
            keyPassword "your-key-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

3. Build signed release:
```bash
cd android
./gradlew assembleRelease
```

## Updating the App After Changes

Whenever you make changes to the web app:

```bash
# 1. Rebuild the web app
BUILD_TARGET=android npm run build

# 2. Sync changes to Android
npx cap sync android

# 3. Rebuild APK
cd android && ./gradlew assembleDebug
```

## Installing the APK

### On Physical Device:
1. Enable **Developer Options** on your Android device
2. Enable **USB Debugging**
3. Connect device via USB
4. Run:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Manual Installation:
1. Transfer the APK to your device
2. Open the APK file
3. Allow installation from unknown sources if prompted
4. Install the app

## Troubleshooting

### "Unable to locate Java Runtime"
- Ensure JDK 17+ is installed
- Set JAVA_HOME environment variable:
  ```bash
  export JAVA_HOME=/path/to/jdk
  ```

### "SDK location not found"
- Create `android/local.properties`:
  ```
  sdk.dir=/path/to/Android/sdk
  ```

### Gradle sync fails
- Update Android Studio to the latest version
- In Android Studio: **File → Invalidate Caches / Restart**

### APK won't install
- Uninstall any previous version
- Enable "Install from Unknown Sources" in device settings
- Check minimum SDK version compatibility

## App Details

- **Package Name:** com.credloan.app
- **App Name:** CRED Loan App
- **Min SDK:** 22 (Android 5.1+)
- **Target SDK:** 34 (Android 14)

## File Locations

- **Android Project:** `android/`
- **Web Assets:** `dist/` (copied to `android/app/src/main/assets/public/`)
- **Config:** `capacitor.config.json`
- **APK Output:** `android/app/build/outputs/apk/`

---

For more information, visit:
- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Android Developer Guide](https://developer.android.com/studio/build)
