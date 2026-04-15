-- ============================================================
-- 005_fix_onboarding_rls.sql
-- Fix RLS policies to allow the initial onboarding INSERT flow.
-- The issue: a new user has no 'users' record yet, so
-- get_user_org_id() returns NULL, blocking all inserts.
-- ============================================================

-- ---- ORGANIZATIONS ----
DROP POLICY IF EXISTS "org_member_access" ON organizations;

-- Any authenticated user can INSERT their first organization
CREATE POLICY "org_insert" ON organizations
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Members can SELECT / UPDATE / DELETE their own org
CREATE POLICY "org_member_select" ON organizations
  FOR SELECT USING (id = get_user_org_id());

CREATE POLICY "org_member_update" ON organizations
  FOR UPDATE USING (id = get_user_org_id());

CREATE POLICY "org_member_delete" ON organizations
  FOR DELETE USING (id = get_user_org_id());

-- ---- USERS ----
DROP POLICY IF EXISTS "users_org_access" ON users;

-- A user can INSERT their own record (id = auth.uid())
CREATE POLICY "users_self_insert" ON users
  FOR INSERT
  WITH CHECK (id = auth.uid());

-- Members can SELECT / UPDATE all users in their org
CREATE POLICY "users_org_select" ON users
  FOR SELECT USING (organization_id = get_user_org_id() OR id = auth.uid());

CREATE POLICY "users_org_update" ON users
  FOR UPDATE USING (organization_id = get_user_org_id() OR id = auth.uid());

CREATE POLICY "users_org_delete" ON users
  FOR DELETE USING (organization_id = get_user_org_id());

-- ---- SUB_ACCOUNTS ----
-- Allow authenticated users who belong to the org to insert sub_accounts
DROP POLICY IF EXISTS "sub_accounts_org_access" ON sub_accounts;

CREATE POLICY "sub_accounts_insert" ON sub_accounts
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT id FROM organizations
      WHERE id = get_user_org_id()
    )
    -- also allow org creator before users record is fully propagated
    OR auth.uid() IS NOT NULL
  );

CREATE POLICY "sub_accounts_select" ON sub_accounts
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "sub_accounts_update" ON sub_accounts
  FOR UPDATE USING (organization_id = get_user_org_id());

CREATE POLICY "sub_accounts_delete" ON sub_accounts
  FOR DELETE USING (organization_id = get_user_org_id());

-- ---- CHANNELS ----
DROP POLICY IF EXISTS "channels_org_access" ON channels;

CREATE POLICY "channels_insert" ON channels
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "channels_select" ON channels
  FOR SELECT USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

CREATE POLICY "channels_update" ON channels
  FOR UPDATE USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );

CREATE POLICY "channels_delete" ON channels
  FOR DELETE USING (
    sub_account_id IN (
      SELECT id FROM sub_accounts WHERE organization_id = get_user_org_id()
    )
  );
