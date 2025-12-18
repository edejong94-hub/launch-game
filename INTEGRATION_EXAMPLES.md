# Integration Examples
## Quick Copy-Paste Code for Launch Game

---

## 🚀 Quick Start - 3 Easy Steps

### Step 1: Add to LaunchGameApp Component (Inside App.js)

Find your main component function and add the toast hook:

```javascript
function LaunchGameApp() {
  const config = GAME_CONFIG;

  // ADD THIS LINE at the top of your component
  const toast = useToast();

  // ... rest of your existing state declarations
  const [teamName, setTeamName] = useState(initialData?.teamName || "");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ... etc
```

### Step 2: Add Toast Container to Your Render

Find your return statement and add the container:

```javascript
return (
  <Shell
    currentRound={currentRound}
    teamName={teamName}
    onReset={handleReset}
  >
    {/* ADD THIS LINE right after Shell opens */}
    <toast.ToastContainer />

    {/* Rest of your existing JSX */}
    {!ideaConfirmed && currentRound === 1 ? (
      // ... your existing code
```

### Step 3: Replace Alert with Toast in handleSubmit

**Find this code around line 2025:**
```javascript
.catch((err) => {
  console.error("❌ Firebase round save error:", err);
  console.error("Error code:", err.code);
  console.error("Error message:", err.message);
  alert(`⚠️ Failed to save your progress to the cloud: ${err.message}\n\nYour data is saved locally, but please check your internet connection.`);
});
```

**Replace with:**
```javascript
.catch((err) => {
  logError('Firebase Round Save', err, {
    gameId,
    oderId,
    currentRound
  });
  const errorMsg = getFirebaseErrorMessage(err);
  toast.error(errorMsg);
  setFormError(errorMsg);
});
```

**And find this code around line 2057:**
```javascript
.catch((err) => {
  console.error("❌ Firebase team save error:", err);
  console.error("Error code:", err.code);
  console.error("Error message:", err.message);
  alert(`⚠️ Failed to save team data to the cloud: ${err.message}\n\nYour data is saved locally, but please check your internet connection.`);
});
```

**Replace with:**
```javascript
.catch((err) => {
  logError('Firebase Team Save', err, {
    gameId,
    oderId
  });
  toast.error(getFirebaseErrorMessage(err));
});
```

---

## 🎯 Complete handleSubmit Function (Copy-Paste Ready)

Here's your complete improved `handleSubmit` function. **Replace your entire handleSubmit function** (around line 1828-2064) with this:

```javascript
const handleSubmit = async () => {
  // Prevent double submission
  if (isSubmitting) return;

  // Validation
  if (!teamName) {
    setFormError("Fill in your team name first.");
    return;
  }

  // Validate equity
  const newEquityInput = Number(funding.investorEquity || 0);
  const currentEquity = teamData.investorEquity || 0;
  const projectedTotalEquity = currentEquity + newEquityInput;

  if (newEquityInput < 0) {
    setFormError("Equity percentage cannot be negative.");
    return;
  }

  if (projectedTotalEquity > 100) {
    setFormError(`Total equity cannot exceed 100%. You've already given away ${currentEquity}%. Maximum you can give this round: ${100 - currentEquity}%.`);
    return;
  }

  // Validate money inputs
  const moneyFields = {
    revenue: 'Revenue',
    subsidy: 'Subsidy',
    investment: 'Investment',
    loan: 'Loan'
  };

  for (const [field, label] of Object.entries(moneyFields)) {
    if (funding[field]) {
      const value = Number(funding[field]);
      if (isNaN(value)) {
        setFormError(`${label} must be a valid number.`);
        return;
      }
      if (value < 0) {
        setFormError(`${label} cannot be negative.`);
        return;
      }
    }
  }

  // Check network
  if (!isOnline()) {
    toast.warning('You are offline. Data will be saved locally and synced when you reconnect.', 8000);
  }

  setFormError("");
  setIsSubmitting(true);

  try {
    // ... Your existing calculation code here ...
    // (All the code that calculates newTeamData)
    // Don't change this part, just wrap Firebase calls below

    const newCompletedActivities = [...(teamData.completedActivities || [])];
    Object.keys(activities).forEach((key) => {
      if (activities[key] && !newCompletedActivities.includes(key)) {
        newCompletedActivities.push(key);
      }
    });

    // ... rest of your calculation code through newTeamData creation ...

    setTeamData(newTeamData);
    setShowReport(true);

    const gameId = getGameId();
    let oderId = localStorage.getItem("oderId");
    if (!oderId) {
      oderId = crypto.randomUUID();
      localStorage.setItem("oderId", oderId);
    }

    const roundData = {
      ...newTeamData,
      oderId,
      gameId,
      gameMode: config.gameMode,
      round: currentRound,
      submittedAt: serverTimestamp(),
      progress: calculateProgress(
        {
          ...newTeamData,
          office,
          activities,
          founders,
          round: currentRound,
          legalForm,
          juniorHiresThisRound: juniorHires,
          funding,
        },
        config
      ),
    };

    // IMPROVED: Save with retry logic
    await retryOperation(async () => {
      await setDoc(
        doc(db, "games", gameId, "teams", oderId, "rounds", String(currentRound)),
        sanitizeForFirestore(roundData)
      );
    }, 3, 1000);  // 3 retries, 1 second delay

    console.log("✅ Round data saved successfully");

    const teamDocData = {
      oderId,
      teamName: newTeamData.teamName,
      startupIdea: newTeamData.startupIdea,
      currentRound,
      gameMode: config.gameMode,
      lastUpdated: serverTimestamp(),
    };

    if (isResearchMode) {
      teamDocData.teamProfiles = newTeamData.teamProfiles || null;
      teamDocData.licenceAgreement = newTeamData.licenceAgreement || null;
    }

    await retryOperation(async () => {
      await setDoc(
        doc(db, "games", gameId, "teams", oderId),
        sanitizeForFirestore(teamDocData),
        { merge: true }
      );
    }, 3, 1000);

    console.log("✅ Team data saved successfully");
    toast.success('Round submitted successfully!');

  } catch (err) {
    logError('Submit Round', err, {
      gameId: getGameId(),
      currentRound,
      teamName
    });

    const errorMsg = getFirebaseErrorMessage(err);
    setFormError(errorMsg);
    toast.error(errorMsg);

    if (!isOnline()) {
      toast.info('Your progress is saved locally and will sync when you reconnect.');
    }
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 🌐 Add Network Status Detection

**Add this useEffect** somewhere after your state declarations in LaunchGameApp:

```javascript
// Network status detection
const [isOffline, setIsOffline] = useState(!isOnline());

useEffect(() => {
  const handleOnline = () => {
    setIsOffline(false);
    toast.success('Connection restored! 🎉');
  };

  const handleOffline = () => {
    setIsOffline(true);
    toast.warning('You are offline. Changes will be saved locally.', 0);
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, [toast]);
```

**And add this to your render** (at the top, before the main content):

```javascript
return (
  <Shell currentRound={currentRound} teamName={teamName} onReset={handleReset}>
    <toast.ToastContainer />

    {/* ADD THIS OFFLINE BANNER */}
    {isOffline && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f59e0b',
        color: 'white',
        padding: '12px',
        textAlign: 'center',
        fontWeight: '600',
        zIndex: 9998,
      }}>
        ⚠️ You are offline. Changes are being saved locally and will sync when you reconnect.
      </div>
    )}

    {/* Rest of your existing JSX */}
```

---

## 🔄 Improved Session Restore (LaunchGame component)

**Find your restoreSession function** around line 3077 and replace with this improved version:

```javascript
useEffect(() => {
  const restoreSession = async () => {
    // First check localStorage
    const savedSession = loadSession();

    if (savedSession && savedSession.teamName) {
      setInitialData(savedSession);
      setLoading(false);
      return;
    }

    // Check if we have an oderId but no local session
    const oderId = localStorage.getItem("oderId");
    const gameId = getGameId();

    if (oderId && gameId) {
      try {
        // Check network first
        if (!isOnline()) {
          console.warn('Offline - cannot restore from Firebase');
          setLoading(false);
          return;
        }

        // Try to restore from Firebase
        const teamDoc = await getDoc(doc(db, "games", gameId, "teams", oderId));

        if (teamDoc.exists()) {
          const data = teamDoc.data();

          // Validate data integrity
          if (!data.teamName || !data.startupIdea) {
            console.error("Invalid team data - missing required fields");
            setLoading(false);
            return;
          }

          const currentRound = data.currentRound || 1;

          // Get the latest round data
          const roundDoc = await getDoc(
            doc(db, "games", gameId, "teams", oderId, "rounds", String(currentRound))
          );

          if (roundDoc.exists()) {
            const roundData = roundDoc.data();

            // Restore full session from Firebase
            const restoredData = {
              teamName: data.teamName,
              founders: roundData.founders || (isResearchMode ? 3 : 4),
              office: roundData.office,
              legalForm: roundData.legalForm,
              currentRound: currentRound,
              showReport: true,
              ideaConfirmed: true,
              teamProfiles: data.teamProfiles || ["", "", ""],
              licenceAgreement: data.licenceAgreement,
              hiredProfiles: roundData.hiredProfiles || [],
              diversityEventSeen: currentRound >= 2,
              startupIdea: data.startupIdea || roundData.startupIdea,
              teamData: {
                cash: roundData.progress?.cash || roundData.cash || GAME_CONFIG.gameInfo.startingCapital,
                phase: roundData.phase || 1,
                employees: roundData.employees || 0,
                hasSenior: roundData.hasSenior || false,
                seniorUnlocked: roundData.seniorUnlocked || false,
                completedActivities: roundData.completedActivities || [],
                trl: roundData.trl || roundData.progress?.currentTRL || 3,
                interviewCount: roundData.interviewCount || roundData.progress?.interviewsTotal || 0,
                validationCount: roundData.validationCount || roundData.progress?.validationsTotal || 0,
              },
            };

            setInitialData(restoredData);
            saveSession(restoredData); // Save to localStorage for faster future loads
            setLoading(false);
            console.log('✅ Session restored from Firebase');
            return;
          }
        }
      } catch (err) {
        logError('Session Restore', err, { gameId, oderId });
        console.warn("Falling back to localStorage...");

        // Try localStorage one more time
        const localData = loadSession();
        if (localData?.teamName) {
          setInitialData(localData);
          setLoading(false);
          return;
        }
      }
    }

    // No session found, start fresh
    setLoading(false);
  };

  restoreSession();
}, []);
```

---

## 🎨 Optional: Add Loading Spinner CSS

Add this to your CSS file:

```css
/* Loading spinner on button */
button.loading {
  position: relative;
  pointer-events: none;
}

button.loading::after {
  content: '';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: translateY(-50%) rotate(360deg); }
}

/* Offline banner animation */
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.offline-banner {
  animation: slideDown 0.3s ease;
}
```

---

## ✅ Testing Your Implementation

1. **Test Toast:**
   ```javascript
   // Add a test button temporarily
   <button onClick={() => toast.success('Test!')}>Test Toast</button>
   <button onClick={() => toast.error('Test Error!')}>Test Error</button>
   ```

2. **Test Offline Mode:**
   - Open DevTools → Network tab → Set to "Offline"
   - Try submitting a round
   - Verify offline banner shows
   - Verify toast notification shows
   - Check localStorage for saved data

3. **Test Error Boundary:**
   - Temporarily add: `throw new Error('Test error boundary')`
   - Verify error screen appears
   - Verify "Try Again" works

4. **Test Validation:**
   - Try entering negative revenue
   - Try entering >100% equity
   - Try entering text in number field
   - Verify clear error messages

---

## 🚨 Common Issues & Fixes

**Issue: "useToast is not defined"**
```javascript
// Make sure you imported it at the top of App.js:
import { useToast } from './Components/Toast';

// And initialized it in your component:
const toast = useToast();
```

**Issue: "Toast not showing"**
```javascript
// Make sure you added the container to your render:
return (
  <Shell>
    <toast.ToastContainer />  {/* ← Must be here */}
    {/* rest of JSX */}
  </Shell>
);
```

**Issue: "getFirebaseErrorMessage is not defined"**
```javascript
// Make sure you imported error utilities:
import {
  getFirebaseErrorMessage,
  logError,
  retryOperation,
  isOnline,
} from './utils/errorHandling';
```

**Issue: "Module not found: Can't resolve './utils/errorHandling'"**
```
Make sure the file exists at:
src/utils/errorHandling.js

If not, copy it from the ERROR_HANDLING_GUIDE.md
```

---

## 📦 Complete File Checklist

Make sure you have all these files:

- ✅ `src/utils/errorHandling.js` (Created)
- ✅ `src/Components/ErrorBoundary.js` (Created)
- ✅ `src/Components/Toast.js` (Created)
- ✅ `src/index.js` (Modified - ErrorBoundary added)
- ✅ `src/App.js` (Modified - imports added)
- ⏳ `src/App.js` (To modify - handleSubmit)
- ⏳ `src/App.js` (To modify - network detection)
- ⏳ `src/App.js` (To modify - session restore)

---

That's it! Your error handling is now production-ready. 🎉
