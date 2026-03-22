# Content governance model

## Public-facing goals
The user should be able to tell:
- who this hub is for
- what is experience-based
- what needs official verification
- what is current enough to trust for a real decision

## Front matter fields
```yaml
governance:
  owner: "Move to Bali editorial"
  lastReviewed: '2026-03-22'
  reviewCadenceDays: 90
  reviewPriority: medium
  evidenceLevel: reviewed
  contentState: core
```

## Definitions
### owner
The team most accountable for keeping the page honest.

### lastReviewed
The last governance review, separate from the original publish date.

### reviewCadenceDays
How often the page should be checked.

### reviewPriority
How painful page drift would be if the page became inaccurate.

### evidenceLevel
- `experience-based`
- `reviewed`
- `official-links`

### contentState
- `core`
- `monitor`
- `experimental`

## Design rule
Governance should reduce anxiety, not add bureaucracy.
Families should feel:
- “this page is looked after”
not:
- “this page is full of warnings”
