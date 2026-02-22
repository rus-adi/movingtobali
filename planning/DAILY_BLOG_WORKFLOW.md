# Daily blog workflow (Learning in Bali)

## Create a daily post
npm run new:daily-blog -- "Learning in Bali: Your title"

Optional flags:
- --pillar=visas|housing|areas|family-life|costs|start-here
- --area=sanur (or any area slug)
- --tags=learning,bali,families,ubud

## Write in 30–45 minutes
1) Quick take (answer first)
2) “Why this matters (for kids)”
3) Checklist (copy/paste)
4) Watch-outs (practical)
5) FAQs (3–7)
6) Next steps (use `npm run suggest:links -- blog <slug>`)

## Publish safely
- Set `draft: false`
- Set `noindex: false`
- Run `npm run validate:strict`
