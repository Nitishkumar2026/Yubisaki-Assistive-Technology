# Supabase Setup Guide for Yubisaki Website

Complete step-by-step guide to connect your Supabase project.

---

## 📋 Step 1: Create Supabase Project & Get API Keys

1. Go to [https://app.supabase.com](https://app.supabase.com) and login/signup
2. Click **"New Project"**
3. Fill in:
   - **Name**: Your project name (e.g., "yubisaki-website")
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
4. Wait for project to be created (2-3 minutes)

5. Once project is ready, go to **Settings → API**
6. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co` (copy this)
   - **anon public** key: `eyJhbG...` (copy this)
   - **service_role** key: Keep this secret! (only for server-side)

---

## 📝 Step 2: Setup Environment Variables

### For Local Development:

1. In your project root, create a `.env` file (copy from `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. Replace `your-project-id` and `eyJhbG...` with your actual values from Step 1

3. **Important**: 
   - `.env` file is already in `.gitignore` (won't be committed)
   - Never commit your `.env` file to Git
   - Restart your development server after creating `.env`

### For Production (Netlify/Vercel):

1. Go to your hosting platform dashboard
2. Navigate to **Environment Variables** or **Settings → Environment**
3. Add these variables:
   - `VITE_SUPABASE_URL` = Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = Your anon public key
   - `VITE_SUPABASE_SERVICE_ROLE_KEY` = Service role key (optional, for admin operations)

---

## ✅ Step 3: Verify Connection

1. Start your development server:
```bash
npm run dev
```

2. Open browser console (F12)
3. You should see:
   - ✅ `Supabase client initialized successfully`
   - 📍 `Supabase URL: https://your-project-id.supabase.co`

4. If you see warnings, check:
   - `.env` file exists in project root
   - Variables start with `VITE_`
   - No typos in variable names
   - Server was restarted after creating `.env`

---

## 🔐 Step 4: Configure Authentication

1. In Supabase Dashboard → **Authentication → Settings**

2. **Enable Email Provider**:
   - ✅ Enable "Email" provider
   - ✅ Enable "Confirm email" (optional, recommended for production)

3. **Site URL & Redirect URLs**:
   - **Site URL**: `http://localhost:5173` (for local dev)
   - **Redirect URLs**: Add:
     - `http://localhost:5173/**`
     - `http://localhost:5173/auth/callback`
     - Your production URL (e.g., `https://yoursite.com/**`)

4. **Email Templates** (optional):
   - Customize confirmation emails
   - Customize password reset emails

---

## 🗄️ Step 5: Database Tables Setup

### Create Required Tables:

Go to **SQL Editor** in Supabase Dashboard and run:

#### 1. Profiles Table (for user profiles):

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### 2. Contacts Table (for contact form):

```sql
-- Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for contact form)
CREATE POLICY "Anyone can submit contact form"
  ON contacts FOR INSERT
  WITH CHECK (true);
```

#### 3. Newsletter Subscriptions Table:

```sql
-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can subscribe
CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscriptions FOR INSERT
  WITH CHECK (true);
```

#### 4. Jobs Table (for careers page):

```sql
-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view jobs
CREATE POLICY "Anyone can view jobs"
  ON jobs FOR SELECT
  USING (true);

-- Policy: Authenticated admins can insert jobs
CREATE POLICY "Admins can insert jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

-- Policy: Admins can update their own jobs
CREATE POLICY "Admins can update own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  );

-- Policy: Admins can delete their own jobs
CREATE POLICY "Admins can delete own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  );
```

---

## 🧪 Step 6: Test Your Setup

### Test Signup:
1. Go to `/signup` page
2. Fill in the form
3. Submit
4. Check Supabase Dashboard → **Authentication → Users** - you should see new user

### Test Login:
1. Go to `/login` page
2. Use credentials from signup
3. Should redirect to dashboard

### Test Contact Form:
1. Go to `/contact` page
2. Fill and submit form
3. Check Supabase Dashboard → **Table Editor → contacts** - should see new entry

### Test Newsletter:
1. Scroll to footer
2. Enter email in newsletter form
3. Submit
4. Check Supabase Dashboard → **Table Editor → newsletter_subscriptions**

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"
- ✅ Check `.env` file exists and has correct values
- ✅ Restart development server
- ✅ Check browser console for exact error
- ✅ Verify Supabase project is active (not paused)

### Error: "Invalid API key"
- ✅ Copy key again from Supabase Dashboard → Settings → API
- ✅ Make sure you're using **anon public** key (not service_role)
- ✅ Check for extra spaces or quotes in `.env` file

### Error: "Email already registered"
- ✅ User already exists - try login instead
- ✅ Or delete user from Supabase Dashboard → Authentication → Users

### Buttons not working / Forms disabled
- ✅ Check browser console for errors
- ✅ Verify `.env` variables are loaded (check console logs)
- ✅ Restart dev server after creating `.env`

### CORS Errors
- ✅ Go to Supabase Dashboard → Settings → API
- ✅ Add your domain to "Allowed Origins"
- ✅ For local dev, add `http://localhost:5173`

---

## 🔒 Security Best Practices

1. **Never expose service_role key**:
   - Only use in server-side code
   - Never commit to Git
   - Never use in client-side code

2. **Use RLS (Row Level Security)**:
   - Always enable RLS on tables
   - Create specific policies for each operation
   - Test policies thoroughly

3. **Environment Variables**:
   - Keep `.env` in `.gitignore`
   - Use different keys for dev/production
   - Rotate keys periodically

4. **Authentication**:
   - Enable email confirmation for production
   - Use strong password requirements
   - Enable rate limiting

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

## ✅ Quick Checklist

- [ ] Created Supabase project
- [ ] Copied Project URL and anon key
- [ ] Created `.env` file with correct values
- [ ] Restarted development server
- [ ] Verified connection in browser console
- [ ] Configured Authentication settings
- [ ] Created database tables
- [ ] Set up RLS policies
- [ ] Tested signup/login
- [ ] Tested contact form
- [ ] Tested newsletter subscription

---

**Need Help?** Check browser console for detailed error messages and refer to Supabase Dashboard logs.
