# .env File Setup Instructions

## Your Supabase Project Details:
- **Project ID**: `tajcecinwsnxqzjldbvp`
- **Project URL**: `https://tajcecinwsnxqzjldbvp.supabase.co`

## Steps to Setup .env File:

### 1. Open `.env` file in your project root
Location: `E:\current project\Yubisaki Assistive Technology\.env`

### 2. Add/Update these lines:

```env
VITE_SUPABASE_URL=https://tajcecinwsnxqzjldbvp.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Get Your Anon Key:
1. Go to: https://supabase.com/dashboard/project/tajcecinwsnxqzjldbvp/settings/api
2. Under "Project API keys" section
3. Find **"anon public"** key (starts with `eyJhbG...`)
4. Copy the entire key
5. Replace `your-anon-key-here` in `.env` file with the copied key

### 4. Final .env file should look like:

```env
VITE_SUPABASE_URL=https://tajcecinwsnxqzjldbvp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhamNlY2lud3NueHF6amxkYnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNDU2ODAsImV4cCI6MjA0ODgyMTY4MH0.your-actual-key-here
```

### 5. Save the file and restart your development server:

```bash
# Stop current server (Ctrl+C if running)
npm run dev
```

### 6. Verify Connection:
1. Open browser console (F12)
2. You should see:
   - ✅ `Supabase client initialized successfully`
   - 📍 `Supabase URL: https://tajcecinwsnxqzjldbvp.supabase.co`

## Quick Links:
- **Project Dashboard**: https://supabase.com/dashboard/project/tajcecinwsnxqzjldbvp
- **API Settings**: https://supabase.com/dashboard/project/tajcecinwsnxqzjldbvp/settings/api
- **Authentication Settings**: https://supabase.com/dashboard/project/tajcecinwsnxqzjldbvp/auth/providers
- **SQL Editor**: https://supabase.com/dashboard/project/tajcecinwsnxqzjldbvp/sql/new

## Important Notes:
- ✅ `.env` file is already in `.gitignore` (won't be committed to Git)
- ✅ Never share your `.env` file or API keys publicly
- ✅ Restart server after updating `.env` file
- ✅ Use **anon public** key only (never use service_role key in client code)

