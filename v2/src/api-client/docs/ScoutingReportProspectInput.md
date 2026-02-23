
# ScoutingReportProspectInput

Grades can be numeric (20-80) or letter (B+, A, etc). Event types: game, showcase, practice, workout, video. Present/future grade pairs for each skill. See docs/api/scouting-system-api.md. 

## Properties

Name | Type
------------ | -------------
`reportDate` | Date
`eventType` | string
`overallPresent` | any
`overallFuture` | any
`hittingPresent` | any
`hittingFuture` | any
`pitchingPresent` | any
`pitchingFuture` | any
`fieldingPresent` | any
`fieldingFuture` | any
`speedPresent` | any
`speedFuture` | any
`sixtyYardDash` | number
`mlbComparison` | string
`notes` | string

## Example

```typescript
import type { ScoutingReportProspectInput } from ''

// TODO: Update the object below with actual values
const example = {
  "reportDate": null,
  "eventType": null,
  "overallPresent": null,
  "overallFuture": null,
  "hittingPresent": null,
  "hittingFuture": null,
  "pitchingPresent": null,
  "pitchingFuture": null,
  "fieldingPresent": null,
  "fieldingFuture": null,
  "speedPresent": null,
  "speedFuture": null,
  "sixtyYardDash": null,
  "mlbComparison": null,
  "notes": null,
} satisfies ScoutingReportProspectInput

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ScoutingReportProspectInput
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


