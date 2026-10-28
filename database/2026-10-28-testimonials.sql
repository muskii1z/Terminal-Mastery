-- Terminal Mastery: testimonials from people who finish the course.
--
-- Run once in the Supabase SQL Editor (all-or-nothing, like the last one).
-- One testimonial per person; they can edit it. Only they can see or change
-- theirs from the website. You read them all in the dashboard:
-- Table Editor → testimonials.

begin;

create table public.testimonials (
  user_id      uuid        primary key references auth.users (id) on delete cascade,
  quote        text        not null check (char_length(quote) between 1 and 1000),
  display_name text        check (char_length(display_name) <= 80),
  may_publish  boolean     not null default false,  -- OK to show on the site with their name
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.testimonials is
  'What learners say after finishing. Only rows with may_publish = true may be shown publicly.';

-- Reuses the updated_at helper from 2026-10-25-lesson-progress.sql.
create trigger testimonials_touch
before update on public.testimonials
for each row execute function public.touch_updated_at();

alter table public.testimonials enable row level security;

create policy "Read own testimonial"
on public.testimonials for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Add own testimonial"
on public.testimonials for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Update own testimonial"
on public.testimonials for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

commit;

-- Check: should list testimonials next to lesson_progress.
select table_name from information_schema.tables
where table_schema = 'public'
order by table_name;
