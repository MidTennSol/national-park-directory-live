# Resend Email Setup - Quick Guide

## Step 1: Get Your Resend API Key

1. **Visit**: [resend.com](https://resend.com) and sign up for a free account
2. **Go to API Keys**: Click "API Keys" in the dashboard
3. **Create New Key**: Click "Create API Key"
4. **Copy the key**: It will look like `re_xxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx`

## Step 2: Add Your API Key

1. **Create a `.env` file** in your project root:
   ```bash
   # .env
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

2. **Replace** `re_your_actual_api_key_here` with your real API key from Step 1

## Step 3: Set Up Your Domain (Optional but Recommended)

For production, you should:

1. **Add your domain** in Resend dashboard
2. **Update the "from" email** in `src/pages/api/contact.ts`:
   ```typescript
   from: 'National Park Directory <contact@yourdomain.com>',
   ```
3. **Update the "to" email** with your real email address

## Step 4: Test It!

1. **Restart your dev server**: `npm run dev`
2. **Visit**: `http://localhost:4321/contact`
3. **Submit a test message**
4. **Check your email** - you should receive the contact form submission!

## Current Status

✅ **Resend is installed**  
✅ **API endpoint is configured**  
✅ **Form will work with or without API key**

**If no API key**: Messages are logged to console  
**With API key**: Messages are sent via email AND logged

## Troubleshooting

- **Still getting errors?** Check that your API key is correct in `.env`
- **No emails?** Check your spam folder
- **Domain issues?** You can test with the default domain first, then add your own later

The contact form now uses Resend and will gracefully fall back to logging if the API key isn't set up yet! 