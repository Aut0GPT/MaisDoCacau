# Mais do Cacau - World MiniApp

[Mini apps](https://docs.worldcoin.org/mini-apps) enable third-party developers to create native-like applications within World App.

This Mais do Cacau MiniApp showcases authentic cacau products from Bahia, Brazil, with full Supabase integration for user authentication and product inventory management.

## Getting Started

1. cp .env.example .env.local
2. Follow the instructions in the .env.local file
3. Run `npm run dev`
4. Run `ngrok http 3000`
5. Run `npx auth secret` to update the `AUTH_SECRET` in the .env.local file
6. Add your domain to the `allowedDevOrigins` in the next.config.ts file.
7. [For Testing] If you're using a proxy like ngrok, you need to update the `AUTH_URL` in the .env.local file to your ngrok url.
8. Continue to developer.worldcoin.org and make sure your app is connected to the right ngrok url
9. [Optional] For Verify and Send Transaction to work you need to do some more setup in the dev portal. The steps are outlined in the respective component files.

## Authentication

This starter kit uses [Minikit's](https://github.com/worldcoin/minikit-js) wallet auth to authenticate users, and [next-auth](https://authjs.dev/getting-started) to manage sessions.

## UI Library

This app uses [Mini Apps UI Kit](https://github.com/worldcoin/mini-apps-ui-kit) to style the app, ensuring compliance with [World App's design system](https://docs.world.org/mini-apps/design/app-guidelines).

## Supabase Integration

This app uses Supabase for database and authentication:

1. User profiles are stored in Supabase, linked to wallet addresses
2. Product inventory with stock management is implemented
3. A demonstration notes page shows how to fetch and display data from Supabase

To set up the database:
1. Create a Supabase project
2. Run the `supabase-setup.sql` script in the SQL Editor
3. Update the environment variables in `.env.local`

## Eruda

[Eruda](https://github.com/liriliri/eruda) is a tool that allows you to inspect the console while building as a mini app. You should disable this in production.

## Contributing

This template was made with help from the amazing [supercorp-ai](https://github.com/supercorp-ai) team.
