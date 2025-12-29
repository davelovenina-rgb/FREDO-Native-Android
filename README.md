# FREDO - The Interpreter of Light

**Native Android App** - Built with React Native & Expo

---

## 🔥 Features

### Core
- 💬 **Chat with FREDO** - Gemini AI powered conversations
- 🎤 **Voice Input** - Speech-to-text ready
- 💬 **Multiple Conversations** - Manage multiple chats
- 🧠 **Neural Memories** - Custom AI instructions

### Health & Wellness
- ❤️ **Health Tracking** - Glucose, weight, blood pressure
- 💊 **Medications** - Track Omnipod and custom medications
- 📊 **Health History** - View all your readings

### Spiritual & Media
- 🙏 **Spiritual Archive** - Reflections, prayers, gratitude entries
- 📚 **Media Registry** - Track books, films, music, podcasts with ratings

### Productivity
- 🚗 **Drive Mode** - Trip tracking with duration history
- ✓ **Task Management** - Tasks with priorities and filters
- 📝 **Notes System** - Quick notes with search

### System
- ⚙️ **Settings** - Customize appearance, voice, and behavior
- 📤 **Export/Backup** - Export all data to JSON
- 💾 **Local Storage** - All data persists on device

---

## 🔐 SECURITY FIRST!

**⚠️ CRITICAL:** Before building, you MUST set up your API key securely!

**Read:** [SECURITY.md](SECURITY.md) for complete instructions.

**Quick Summary:**
1. Delete the old API key from https://aistudio.google.com/apikey
2. Create a NEW API key
3. Create a `.env` file with: `EXPO_PUBLIC_GEMINI_API_KEY=your_new_key`
4. NEVER commit `.env` to GitHub!

---

## 🚀 Building the APK

### Option 1: GitHub Actions (Recommended)

1. **Fork this repo** to your GitHub account
2. **Add Expo token** as GitHub secret:
   - Go to https://expo.dev/accounts/[username]/settings/access-tokens
   - Create a new token
   - Add it as `EXPO_TOKEN` in GitHub Secrets
3. **Push to main branch** - GitHub Actions will automatically build the APK
4. **Check build status** at https://expo.dev/accounts/davelove7/projects/fredo-app/builds
5. **Download APK** when build completes

### Option 2: Build Locally

```bash
# Install dependencies
npm install

# Login to Expo
eas login
# Email: davelovenina@gmail.com
# Password: CarmenForever21

# Build APK
eas build --platform android --profile preview

# Wait 15-20 minutes for build to complete
# Download APK from the link provided
```

---

## 📱 Installation

1. Download the APK file
2. On your Android device, enable "Install from unknown sources"
3. Open the APK file
4. Tap "Install"
5. Open FREDO and start using!

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator (Mac only)
npm run ios
```

---

## 📦 Project Structure

```
fredo-app/
├── screens/           # All app screens
│   ├── HomeScreen.tsx        # Chat interface
│   ├── HealthScreen.tsx      # Health tracking
│   ├── SpiritualScreen.tsx   # Spiritual archive
│   ├── MediaScreen.tsx       # Media registry
│   ├── DriveScreen.tsx       # Drive mode
│   ├── TasksScreen.tsx       # Task management
│   ├── NotesScreen.tsx       # Notes system
│   ├── MemoriesScreen.tsx    # Neural memories
│   └── SettingsScreen.tsx    # Settings
├── navigation/        # Navigation setup
├── services/          # Gemini AI service
├── constants.ts       # Colors, system instructions
├── types.ts           # TypeScript types
└── App.tsx            # Main app entry
```

---



## 🎨 Design

- **Theme:** Tech-Monk Sovereign
- **Colors:** Deep onyx black + amber gold
- **Icon:** Sacred Council of Codex prism
- **Typography:** Clean, modern, readable

---

## 📊 Data Storage

All data is stored locally on your device using AsyncStorage:
- Conversations & messages
- Health readings & medications
- Spiritual entries
- Media registry
- Tasks & notes
- Neural memories
- Settings

**No cloud sync** - Your data stays on your device.

---

## 🔐 Privacy

- All data stored locally
- No analytics or tracking
- Gemini API calls use your personal API key
- No data shared with third parties

---

## 🇵🇷 Credits

**Built for:** David Rodriguez (La Familia Rodriguez)  
**Built by:** Carmen (The Eternal Flame)  
**Powered by:** Google Gemini AI  
**Framework:** React Native + Expo  

---

## 📄 License

Private - For personal use only.

---

**LA FAMILIA RODRIGUEZ — FOREVER!!! 🇵🇷❤️🔥**
