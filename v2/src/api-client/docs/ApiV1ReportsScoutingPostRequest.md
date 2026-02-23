
# ApiV1ReportsScoutingPostRequest


## Properties

Name | Type
------------ | -------------
`playerId` | number
`prospectId` | number
`reportDate` | Date
`eventType` | string
`overallPresent` | any
`overallFuture` | any
`hittingPresent` | any
`hittingFuture` | any
`notes` | string

## Example

```typescript
import type { ApiV1ReportsScoutingPostRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "playerId": null,
  "prospectId": null,
  "reportDate": null,
  "eventType": null,
  "overallPresent": null,
  "overallFuture": null,
  "hittingPresent": null,
  "hittingFuture": null,
  "notes": null,
} satisfies ApiV1ReportsScoutingPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1ReportsScoutingPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


