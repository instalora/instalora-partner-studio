# Campaigns API

## Paths

- `GET /v1.0/campaigns`
  - Requires the authenticated user header `X-User-Id`.
  - Resolves `account_id` by joining `users` and `team_members` for the current user.
  - Returns `403` when the user is not a team member and `404` when the user record is missing.
  - Responds with `{ "campaigns": [...] }` where each campaign is scoped to the derived `account_id`.

- `POST /v1.0/campaigns`
  - Requires the authenticated user header `X-User-Id`.
  - Uses the derived `account_id` so callers cannot submit an explicit account.
  - Body: `{ "name": string, "objective"?: string, "status"?: string }`.
  - Returns the created campaign record.
