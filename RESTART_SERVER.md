# Server Restart Instructions

## The payment routes were added but the server needs to restart

### Steps:

1. **Stop the current dev server:**
   - Press `Ctrl + C` in the terminal running the server
   - Or kill the process if needed

2. **Restart the dev server:**
   ```bash
   cd c:\projects\jobHive-server
   npm run dev
   ```

3. **Verify the routes are loaded:**
   - Check the console for any errors during startup
   - Test the route: `http://localhost:5000/api/payment/success?tran_id=test&jobId=1`
   - You should get a redirect instead of "Route not found"

### Route Configuration:
✅ Payment router is imported in `src/app.ts`
✅ Routes are defined in `src/modules/payment/payment.route.ts`:
   - GET `/api/payment/success` ✓
   - GET `/api/payment/fail` ✓
   - POST `/api/payment/ipn` ✓

### If still having issues:
- Check `.env` file has `BASE_URL` and `FRONTEND_URL` configured
- Clear `node_modules` and reinstall: `npm install`
- Check for TypeScript compilation errors
