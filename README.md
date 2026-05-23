# Line Workers Template

Language: [English](README.md) | [繁體中文](README.zh-TW.md)

An “out-of-the-box” LINE Official Account webhook template for Cloudflare Workers.

[![Deploy to Cloudflare]][Cloudflare]

[![Code Style: Prettier]][Prettier]

## ✨ Features

- Signature verification (validate webhook request source)
- Reply messages
- Mark messages as read
- Message loading animation

## 🖊️ How to use this template

1. Create a repo from this template
   1. `Use this template` => `Create a new repository`
   2. Fill in `Repository name` and other repository info
2. Customize the code
   1. Message routing/handling: `src/eventRouter.ts`
   2. Config: `wrangler.toml`
      1. `name` 2. `secrets`
         1. `LINE_CHANNEL_SECRET`
         2. `LINE_CHANNEL_ACCESS_TOKEN`
            -> set these using `wrangler secret put` or the Cloudflare dashboard
3. Deploy
   1. Cloudflare
   2. `Workers & Pages`
   3. `Create application`
   4. `Continue with GitHub`
   5. Fill in the required info

## ⚙️ Configuration

|  Type   |           Name            |                Description                 | Purpose  |
| :-----: | :-----------------------: | :----------------------------------------: | :------: |
| Secrets |    LINE_CHANNEL_SECRET    |    LINE Official Account channel secret    | Validate |
| Secrets | LINE_CHANNEL_ACCESS_TOKEN | LINE Official Account channel access token | Validate |

<!-- Links -->
<!-- Cloudflare -->

[Deploy to Cloudflare]: https://deploy.workers.cloudflare.com/button
[Cloudflare]: https://deploy.workers.cloudflare.com/?url=https://github.com/c-c-epr/line-workers-template

<!-- Prettier -->

[Code Style: Prettier]: https://img.shields.io/badge/Code_Style-Prettier-ff69b4.svg?style=flat-square
[Prettier]: https://github.com/prettier/prettier
