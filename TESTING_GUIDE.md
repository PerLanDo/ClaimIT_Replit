# ClaimIT - Quick Testing Guide

## 🚀 How to Test the Application

### Step 1: Access the App
The app should already be running at: **http://localhost:5173**

If not running, start it with:
```bash
npm run dev
```

---

## 👤 Test Accounts

### Student Accounts
1. **juan.delacruz@g.msuiit.edu.ph** (Juan Dela Cruz - CS)
   - Has found items, received notifications
   - Has active messages

2. **maria.santos@g.msuiit.edu.ph** (Maria Santos - Engineering)
   - Has submitted claims
   - Has active conversations
   - Has found items

3. **carlo.reyes@g.msuiit.edu.ph** (Carlo Reyes - IT)
4. **anna.garcia@g.msuiit.edu.ph** (Anna Garcia - Math)
5. **pedro.gonzales@g.msuiit.edu.ph** (Pedro Gonzales - Physics)
6. **lisa.manuel@g.msuiit.edu.ph** (Lisa Manuel - Chemistry)

### Faculty Accounts
1. **prof.rodriguez@g.msuiit.edu.ph** (Prof. Ana Rodriguez)
2. **prof.torres@g.msuiit.edu.ph** (Prof. Ricardo Torres)

### Staff Account
1. **admin.registrar@msuiit.edu.ph** (Jennifer Cruz)

### Admin Account
1. **admin.sid@msuiit.edu.ph** (SID Administrator)
   - Access to admin dashboard
   - Can view turnover logs
   - Can manage items

---

## ✅ Features to Test

### 1. **Dashboard** 
- [ ] Click on **ALL** / **LOST** / **FOUND** tabs
- [ ] Verify items filter correctly
- [ ] Check stats cards update (Lost Items, Found Items, Returned, Recovery Rate)
- [ ] Click on an item card to view details

### 2. **Search & Filter**
- [ ] Use search bar to find items (try "phone", "wallet", "keys")
- [ ] Open filter panel and filter by:
  - Category (Electronics, Wallets, Keys, etc.)
  - Status (Open, Pending Claim, Returned)
  - Location (CCS Building, Library, etc.)

### 3. **Item Details**
- [ ] Click any item to see full details
- [ ] View photo gallery (if item has images)
- [ ] Scroll down to see QR code
- [ ] Click "Claim This Item" to submit a claim
- [ ] Click "Message Finder" to start a conversation

### 4. **Report Item**
- [ ] Click the **+ (floating action button)** in bottom-right
- [ ] Toggle between "I LOST something" and "I FOUND something"
- [ ] Fill in:
  - Title
  - Category
  - Location
  - Description
  - Upload photos (optional - simulated)
- [ ] For FOUND items, choose "Turn over to SID" or "Keep for Peer-to-Peer"
- [ ] Submit the report

### 5. **Claims**
- [ ] Navigate to Claims page (bottom nav)
- [ ] View submitted claims
- [ ] Check claim status (Pending, Approved, Completed)
- [ ] View proof of ownership details

### 6. **Messages**
- [ ] Click Messages icon in bottom navigation
- [ ] See conversation list
- [ ] Open a conversation to view messages
- [ ] Try sending a message (simulated)

### 7. **Notifications**
- [ ] Click notification bell icon in header
- [ ] See different notification types:
  - Claim updates
  - New messages
  - Item matches
  - Reminders
- [ ] Click on a notification to navigate to related item
- [ ] Mark notifications as read

### 8. **Profile**
- [ ] Click profile icon in header
- [ ] View user information
- [ ] Check statistics:
  - Items Reported
  - Items Returned
  - Active Claims
  - Reputation Score
- [ ] Try the logout button

### 9. **Admin Dashboard** (SID Admin only)
- [ ] Login with **admin.sid@msuiit.edu.ph**
- [ ] View admin dashboard with:
  - Total Items
  - Pending Claims
  - Returned Items
  - Recovery Rate
- [ ] Check Recent Activity table
- [ ] View turnover logs
- [ ] See high-value items surrendered to SID

---

## 🎯 Specific Test Scenarios

### Scenario 1: Browse Lost Items
1. Login as any student
2. Click **LOST** tab
3. Verify you see 7 lost items
4. Click on "Blue iPhone 14 Pro"
5. View details and QR code

### Scenario 2: Claim a Found Item
1. Login as **anna.garcia@g.msuiit.edu.ph**
2. Click **FOUND** tab
3. Find "Calculus Textbook"
4. Click to view details
5. Click "Claim This Item"
6. Write proof of ownership (min 50 characters)
7. Submit claim

### Scenario 3: Check Messages
1. Login as **juan.delacruz@g.msuiit.edu.ph**
2. Click Messages (bottom nav)
3. See conversation with Maria Santos about keys
4. Open the conversation
5. Read message thread

### Scenario 4: Admin Review
1. Login as **admin.sid@msuiit.edu.ph**
2. View admin dashboard
3. Check "Total Items" card
4. Scroll down to "Recent Activity"
5. See items surrendered to SID
6. Check turnover logs section

### Scenario 5: Search Functionality
1. From dashboard, use search bar
2. Type "tumbler"
3. See 3 results
4. Type "CCS Building"
5. See items from that location

---

## 📊 Expected Data Counts

When testing, you should see:
- **Total Items**: 27 (7 lost + 20 found)
- **Lost Items Tab**: 7 items
- **Found Items Tab**: 20 items
- **Pending Claims**: 2
- **Returned Items**: 3
- **Surrendered to SID**: 3
- **Messages**: 7 total across 3 conversations
- **Notifications**: 10 total

---

## 🎨 UI Elements to Verify

### Mobile View (< 768px)
- [ ] Bottom navigation visible
- [ ] Search bar appears on dashboard
- [ ] Item cards in 2-column grid
- [ ] Floating action button in bottom-right

### Tablet View (768px - 1024px)
- [ ] Admin dashboard optimized layout
- [ ] Item cards in 3-column grid
- [ ] Sidebar navigation for admin

### Desktop View (> 1024px)
- [ ] Item cards in 4-column grid
- [ ] Full search bar always visible
- [ ] Responsive layouts

### Light/Dark Mode
- [ ] Toggle theme in system settings
- [ ] App follows system preference
- [ ] Colors change appropriately

---

## ❌ Common Issues & Solutions

### Issue: "No items found"
**Solution**: The database is seeded on server start. If you see this, restart the server:
```bash
# Stop the server (Ctrl+C)
# Restart it
npm run dev
```

### Issue: Can't login
**Solution**: Make sure you're using one of the test emails exactly as listed above.

### Issue: Images not loading
**Solution**: The prototype uses Unsplash URLs. Make sure you have internet connection.

### Issue: Cannot submit claim
**Solution**: Proof description must be at least 50 characters long.

---

## 🎉 Success Indicators

You'll know everything is working if you can:
- ✅ Login with different account types
- ✅ See 27 items across all categories
- ✅ Switch between Lost/Found/All tabs
- ✅ View item details with QR codes
- ✅ Submit a claim successfully
- ✅ See active conversations in Messages
- ✅ Receive and view notifications
- ✅ Access admin dashboard as SID admin
- ✅ Filter and search items
- ✅ Navigate seamlessly between pages

---

## 📝 Notes

- This is a **prototype** with in-memory storage
- Data resets when server restarts
- File uploads are simulated (not actually stored)
- Some features are demonstration-only (e.g., actual QR scanning not implemented)
- The app is designed to showcase ClaimIT's core functionality

---

**Happy Testing! 🚀**

For issues or questions, check the COMPLETION_REPORT.md for detailed feature documentation.
