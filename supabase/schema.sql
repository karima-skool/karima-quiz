-- ── Initial table creation ──────────────────────────────────────────────────
create table quiz_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  session_id text,
  q1_prior_learning text,
  q1b_prior_subjects text[],
  q1b_other_text text,
  q2_motivation text,
  q3_topic_tags text[],
  q4_life_stage text,
  q4_other_text text,
  q5_time_commitment text,
  q6_format_preference text,
  q7_interest_text text,
  q8_struggle_text text,
  recommended_course_ids text[]
);

-- ── Migration: Q6 changed from single-select to multi-select (max 2) ─────────
-- Run this if the table was already created with the original schema above.
alter table quiz_responses
  alter column q6_format_preference type text[]
  using array[q6_format_preference];
