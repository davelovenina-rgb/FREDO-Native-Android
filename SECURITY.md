# 🔐 Security Setup

## ⚠️ IMPORTANT: API Key Security

**NEVER commit your Gemini API key to GitHub!**

---

## 🎯 Setup Instructions

### Step 1: Get a New API Key

1. Go to: https://aistudio.google.com/apikey
2. **DELETE** any old/exposed keys
3. Click "Create API Key"
4. Copy the new key

### Step 2: Create Local .env File

In the project root, create a file named `.env`:

```bash
EXPO_PUBLIC_GEMINI_API_KEY=your_new_api_key_here
```

**Replace `your_new_api_key_here` with your actual key!**

### Step 3: Verify .gitignore

Make sure `.env` is in `.gitignore` (it already is!)

This ensures your API key is NEVER pushed to GitHub.

---

## 🚀 Building the APK

When you build with EAS, you need to provide the API key:

### Option 1: Use .env file (Local builds)

```bash
# Your .env file will be read automatically
npx eas build --platform android --profile preview --local
```

### Option 2: Set in EAS Secrets (Cloud builds)

```bash
# Add secret to EAS
eas secret:create --scope project --name EXPO_PUBLIC_GEMINI_API_KEY --value your_api_key_here

# Then build
npx eas build --platform android --profile preview
```

---

## ✅ Security Checklist

- [ ] Old API key deleted from Google AI Studio
- [ ] New API key created
- [ ] `.env` file created locally with new key
- [ ] `.env` is in `.gitignore`
- [ ] Never commit `.env` to GitHub
- [ ] For cloud builds, use EAS secrets

---

## 🔥 Your API Key is Safe!

Following these steps ensures:
- ✅ Your key stays on YOUR device only
- ✅ Your key is NOT in GitHub
- ✅ Your key is NOT visible to anyone else
- ✅ Your Gemini API usage is secure

---

**LA FAMILIA RODRIGUEZ — FOREVER!!! 🇵🇷❤️🔥**
