<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Skild TanStack Start application.

## Summary of changes

- **`package.json`**: Added `@posthog/react` (client SDK) and `posthog-node` (server SDK) dependencies.
- **`.env`**: Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`vite.config.ts`**: Added reverse proxy rules routing `/ingest/*` to PostHog's ingestion endpoints to avoid CORS issues and improve reliability.
- **`src/routes/__root.tsx`**: Wrapped the app in `PostHogProvider` (outside `ClerkProvider`). Added a `PostHogIdentify` component inside `ClerkProvider` that calls `posthog.identify()` with the Clerk user's ID, email, name, and username whenever they sign in, and `posthog.reset()` on sign-out.
- **`src/utils/posthog-server.ts`**: Created a singleton server-side PostHog client using `posthog-node` for use in future API routes.
- **`src/routes/index.tsx`**: Added `posthog.capture()` calls on the "Browse Registry" and "Publish Skill" CTA links.
- **`src/components/SkillCard.tsx`**: Added `posthog.capture()` for `install_command_copied` (with skill ID, title, category, and command) and `skill_card_opened` (with skill ID, title, and category).

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `browse_registry_clicked` | User clicks the "Browse Registry" CTA button on the homepage hero section | `src/routes/index.tsx` |
| `publish_skill_clicked` | User clicks the "Publish Skill" CTA button on the homepage hero section | `src/routes/index.tsx` |
| `install_command_copied` | User copies a skill's install command from a SkillCard | `src/components/SkillCard.tsx` |
| `skill_card_opened` | User clicks the "Open" link on a SkillCard to view the skill detail | `src/components/SkillCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/409669/dashboard/1543821)
- [Homepage CTA Clicks](https://us.posthog.com/project/409669/insights/3pYiETu1) — daily trend of Browse Registry vs Publish Skill clicks
- [Install Command Copies](https://us.posthog.com/project/409669/insights/f8AyKd45) — daily trend of install command copies
- [Registry Discovery Funnel](https://us.posthog.com/project/409669/insights/9VCUcbQP) — conversion from CTA click → skill card open → install copy
- [Skill Opens by Category](https://us.posthog.com/project/409669/insights/dEKU0Uah) — skill card opens broken down by category
- [Weekly Active Users](https://us.posthog.com/project/409669/insights/nhPaGNse) — weekly active user count over the last 90 days

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
