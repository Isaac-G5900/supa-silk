## For Future Collaborators

Note: All inquiries regarding contribution, feel free to contact isaacxg59@gmail.com

1. Assuming you have requested permissions to the Supabase Project, Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

2. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT PROVIDED SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT PROVIDED SUPABASE PROJECT API ANON KEY]
   ```
   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   This should now be running on [localhost:3000](http://localhost:3000/).

>For those not entirely familiar, Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.
