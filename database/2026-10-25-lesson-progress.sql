-- Terminal Mastery: save lesson progress to accounts.
--
-- Run once in the Supabase SQL Editor. It is all-or-nothing: if any line
-- fails, nothing changes.
--
-- 1. Moves the two old tables (the 20-lesson course) into a `legacy` schema.
--    Nothing is deleted, but they're no longer reachable from the website.
-- 2. Creates `lesson_progress`: one row per person per lesson, holding the
--    same things the lesson screen tracks (ticked tasks, step, quiz, finished).
-- 3. Locks it down so each person can only read and change their own rows.
--
-- User accounts (auth.users) are not touched.

begin;

-- 1. Retire the old course tables -------------------------------------------

create schema if not exists legacy;

alter table if exists public.lesson_completions set schema legacy;
alter table if exists public.lessons set schema legacy;

-- 2. New progress table -----------------------------------------------------

create table public.lesson_progress (
  user_id     uuid        not null references auth.users (id) on delete cascade,
  lesson_id   text        not null check (lesson_id ~ '^[0-9]{1,2}$'),
  done        text[]      not null default '{}',   -- ids of the tasks ticked off
  quiz        jsonb       not null default '{}',   -- answers, and whether submitted
  step        integer     not null default 0,      -- the step they were looking at
  furthest    integer     not null default 0,      -- the furthest step reached
  finished    boolean     not null default false,
  finished_at timestamptz,
  updated_at  timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

comment on table public.lesson_progress is
  'Per-lesson progress for each learner. Mirrors what the lesson screen saves in the browser.';

-- Keep updated_at honest without trusting the browser's clock.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger lesson_progress_touch
before update on public.lesson_progress
for each row execute function public.touch_updated_at();

-- 3. Each person sees and changes only their own progress -------------------

alter table public.lesson_progress enable row level security;

create policy "Read own progress"
on public.lesson_progress for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Add own progress"
on public.lesson_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Update own progress"
on public.lesson_progress for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Delete own progress"
on public.lesson_progress for delete
to authenticated
using ((select auth.uid()) = user_id);

commit;

-- Check: this should list lesson_progress in public, and the two old tables
-- in legacy.
select table_schema, table_name
from information_schema.tables
where table_schema in ('public', 'legacy')
order by table_schema, table_name;
