# UTM conventions (recommended)

Use UTMs for *campaign attribution*, not vanity.

## Standard parameters
- `utm_source` — where it came from (e.g., instagram, youtube, newsletter)
- `utm_medium` — channel type (e.g., social, video, email, referral)
- `utm_campaign` — your campaign name (e.g., move_to_bali_start_here_2026_02)
- `utm_content` — optional: creative/variant identifier (e.g., reel_01, post_a)
- `utm_term` — optional: keyword / internal label

## Examples
Instagram reel linking to /start-here:
- utm_source=instagram
- utm_medium=social
- utm_campaign=start_here_launch_2026_02
- utm_content=reel_01

YouTube description linking to /visas:
- utm_source=youtube
- utm_medium=video
- utm_campaign=visas_overview_2026_02
- utm_content=video_desc

## Partner links
We deliberately keep partner UTMs stable on `/go/*` redirects:

- utm_source=movingtobali.empathy.school
- utm_medium=referral
- utm_campaign=partner_directory
- utm_content=<partner slug>
- utm_term=<source page>

Inbound campaign context is appended using `mtb_in_*` parameters so you don’t lose the original source/campaign.
