---
description: How to build and deploy the application to Firebase Hosting
---

1. Ensure you are logged into Firebase:
```bash
npx firebase login
```

2. Run the full build and deploy command:
// turbo
```bash
npm run deploy
```

Alternatively, if you only want to deploy specific parts:
- **Hosting only**: `npm run build && npx firebase deploy --only hosting`
- **Rules only**: `npx firebase deploy --only firestore:rules`
- **Everything**: `npm run build && npx firebase deploy`
