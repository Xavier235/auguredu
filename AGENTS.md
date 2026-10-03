# Project architecture rules

- Read authenticated display names from auth user metadata and fall back gracefully, because the home greeting must not depend on a profile row.
- Keep the saved student track setup collapsed behind an explicit “Change setup” action, because the selector should disappear after completion.
