
# ApiV1SchedulesPostRequest


## Properties

Name | Type
------------ | -------------
`teamName` | string
`programName` | string
`date` | Date
`sections` | Array&lt;string&gt;

## Example

```typescript
import type { ApiV1SchedulesPostRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "teamName": null,
  "programName": null,
  "date": null,
  "sections": null,
} satisfies ApiV1SchedulesPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1SchedulesPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


