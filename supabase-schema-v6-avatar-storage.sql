-- ============================================================
-- PJAM — Migration v6: real avatar image uploads
-- Run in Supabase SQL Editor, AFTER v2, v3, v4, and v5.
-- ============================================================

-- Public bucket: avatars need to be viewable by everyone (they show up
-- next to usernames on leaderboards), but only uploadable by their owner.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly readable" on storage.objects;
create policy "Avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Files are stored as "<user_id>/avatar.<ext>" — these policies check that
-- the first folder segment of the path matches the uploader's own auth id,
-- so a player can only ever write to their own avatar path.
drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
