---
id: "001"
status: "complete"
priority: "p1"
description: "Fix app crash after POST /api/lands/farm-plans"
dependencies: []
---

# Issue: App Crash after Farm Plan Creation

The application crashes with `[nodemon] app crashed` immediately after a successful `POST /api/lands/farm-plans` request (201 status code).

## Symptoms
- Request succeeds (201 Created).
- Database transaction commits successfully.
- Nodemon restarts the app immediately after the response is sent.

## Potential Root Causes
- **Idempotency Middleware:** The middleware is globally applied *before* authentication, but it checks for `req.user`.
- **Response Interception:** The `res.json` override in `idempotency.middleware.js` might be causing issues if `res.json` is called multiple times or if the `IdempotencyKey.create` call fails in a way that isn't caught.
- **Async Errors:** Unhandled promise rejections after the response has been sent.

## Plan
1. Reproduce the crash locally using a script or manual request with an `Idempotency-Key` header.
2. Move `idempotency` middleware to be applied after `auth.protect` in specific routes or ensure it handles missing `req.user` correctly.
3. Refactor the `res.json` override to be more robust.
4. Verify the fix with tests.
