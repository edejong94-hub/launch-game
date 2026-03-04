# 🚀 Deployment Guide - Launch Game

## ✅ Code Pushed to GitHub

Your code is now live on GitHub:
- Repository: https://github.com/edejong94-hub/launch-game
- Latest commit: 851b57a
- Changes: Error handling, accessibility improvements, 10 bug fixes

---

## 🌐 Deploy to Firebase Hosting (Recommended)

Since you're already using Firebase for the database, Firebase Hosting is the easiest option.

### Step 1: Login to Firebase

```bash
npx firebase login
```

This will open a browser window. Sign in with the Google account that has access to your Firebase project (`launch-game-99b20`).

### Step 2: Initialize Firebase Hosting

```bash
npx firebase init hosting
```

When prompted, select:
- **Use an existing project**: Choose `launch-game-99b20`
- **Public directory**: Enter `build`
- **Configure as single-page app**: Enter `y` (yes)
- **Set up automatic builds**: Enter `n` (no)
- **Overwrite build/index.html**: Enter `n` (no)

### Step 3: Build Your App

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Step 4: Deploy to Firebase

```bash
npx firebase deploy --only hosting
```

Your app will be deployed and you'll get a URL like:
```
https://launch-game-99b20.web.app
or
https://launch-game-99b20.firebaseapp.com
```

### Step 5: Test Your Deployment

Visit the URL provided and test:
- [ ] App loads correctly
- [ ] Toast notifications work
- [ ] Firebase database connects
- [ ] Error handling works
- [ ] Forms submit successfully

---

## 🔄 Quick Redeploy (After Changes)

After making code changes:

```bash
# 1. Build
npm run build

# 2. Deploy
npx firebase deploy --only hosting
```

---

## 🎯 Alternative: Deploy to Netlify (Free, Easy)

If you prefer Netlify (doesn't require Firebase login):

### Option 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### Option 2: Netlify Drop

1. Build your app: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag and drop the `build/` folder
4. Done! You get instant URL

### Option 3: Connect GitHub

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select `edejong94-hub/launch-game`
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Environment variables**: Add your Firebase config
6. Click "Deploy"

**Automatic deployments**: Every git push automatically deploys!

---

## 🌍 Alternative: Vercel (Free, Fast)

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (will prompt for login)
vercel --prod
```

### Option 2: Connect GitHub

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import `edejong94-hub/launch-game`
4. Framework: React
5. Build command: `npm run build`
6. Output directory: `build`
7. Environment variables: Add Firebase config
8. Deploy!

**Automatic deployments**: Every git push automatically deploys!

---

## 🔧 Environment Variables for Deployment

When deploying, you need to add your Firebase config as environment variables:

### For Netlify/Vercel

Add these in your deployment platform's dashboard:

```
REACT_APP_FIREBASE_API_KEY=AIzaSyBnkDjxX18z5FuCxsmDPLBg_30OGg04wK4
REACT_APP_FIREBASE_AUTH_DOMAIN=launch-game-99b20.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=launch-game-99b20
REACT_APP_FIREBASE_STORAGE_BUCKET=launch-game-99b20.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=962449052312
REACT_APP_FIREBASE_APP_ID=1:962449052312:web:3a6f916c4226e3ec1b76ed
```

### For Firebase Hosting

No need! You're already in the same Firebase project.

---

## 📊 Deployment Comparison

| Platform | Pros | Cons | Best For |
|----------|------|------|----------|
| **Firebase Hosting** | ✅ Same as DB<br>✅ Fast CDN<br>✅ Free SSL | ⚠️ Requires Firebase login | Already using Firebase |
| **Netlify** | ✅ Super easy<br>✅ Auto deploy from GitHub<br>✅ Great free tier | ⚠️ Need env vars | Quick setup |
| **Vercel** | ✅ Fast edge network<br>✅ Auto deploy<br>✅ Great DX | ⚠️ Need env vars | Production apps |
| **GitHub Pages** | ✅ Free<br>✅ Built into GitHub | ⚠️ No env vars<br>⚠️ No server side | Static sites only (won't work with Firebase) |

**Recommendation**: Use **Firebase Hosting** since you're already using Firebase for the database.

---

## 🔐 Security Checklist Before Deploying

- [x] ✅ Firebase config in environment variables (done)
- [x] ✅ `.env.local` not committed to git (done)
- [x] ✅ Error handling in place (done)
- [x] ✅ Input validation (done)
- [ ] ⏳ Firebase Security Rules configured
- [ ] ⏳ Custom domain setup (optional)

### Firebase Security Rules

Make sure your Firestore rules are set correctly:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId}/teams/{teamId} {
      allow read: if true;
      allow write: if true; // Consider restricting this
    }
    match /games/{gameId}/teams/{teamId}/rounds/{roundId} {
      allow read: if true;
      allow write: if true;
    }
    match /games/{gameId}/settings/{setting} {
      allow read: if true;
      allow write: if true; // Consider restricting to admin only
    }
  }
}
```

---

## 🎯 Post-Deployment Testing

After deploying, test these critical flows:

### 1. Game Flow
- [ ] Create new game with team name
- [ ] Submit Round 1
- [ ] Check data saves to Firebase
- [ ] Reload page - session restores
- [ ] Complete all rounds

### 2. Dashboard
- [ ] Visit `/dashboard`
- [ ] See teams in real-time
- [ ] Check leaderboard updates
- [ ] Verify live activity feed

### 3. Error Handling
- [ ] Disconnect network - see offline banner
- [ ] Try invalid input - see validation errors
- [ ] Check toast notifications appear
- [ ] Reconnect - see "Connected" toast

### 4. Accessibility
- [ ] Tab through all forms
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Check error announcements
- [ ] Verify submit button loading state

---

## 🚨 Troubleshooting

### "Module not found" errors
- Make sure you ran `npm run build` before deploying
- Check all imports are correct

### Firebase connection errors
- Verify environment variables are set
- Check Firebase project is active
- Verify Firestore rules allow access

### App loads but blank screen
- Open browser console (F12)
- Look for errors
- Check if Firebase config is correct

### Slow loading
- Run `npm run build` to create optimized build
- Enable gzip compression (Firebase Hosting does this automatically)

---

## 📈 Monitoring Your Deployment

### Firebase Hosting Analytics

```bash
# View hosting stats
npx firebase hosting:channel:list

# View deployment history
npx firebase hosting:sites:list
```

### Performance Monitoring

Add Firebase Performance Monitoring (optional):

```bash
npm install firebase/performance
```

Then add to your app:

```javascript
import { getPerformance } from "firebase/performance";
const perf = getPerformance(app);
```

---

## 🎉 You're Ready!

Your Launch Game app is ready to deploy with:

✅ **Production-ready error handling**
✅ **Accessibility improvements**
✅ **All critical bugs fixed**
✅ **Toast notifications**
✅ **Network detection**
✅ **Comprehensive documentation**

### Quick Deploy Commands

```bash
# Firebase Hosting (Recommended)
npx firebase login
npx firebase init hosting
npm run build
npx firebase deploy --only hosting

# OR Netlify
npm run build
npx netlify deploy --prod --dir=build

# OR Vercel
npx vercel --prod
```

**Choose your platform and deploy!** 🚀

---

*Need help? Check the official docs:*
- Firebase Hosting: https://firebase.google.com/docs/hosting
- Netlify: https://docs.netlify.com
- Vercel: https://vercel.com/docs
