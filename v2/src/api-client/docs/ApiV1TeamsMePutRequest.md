
# ApiV1TeamsMePutRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`programName` | string
`conference` | string
`division` | string
`city` | string
`state` | string
`primaryColor` | string
`secondaryColor` | string

## Example

```typescript
import type { ApiV1TeamsMePutRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "programName": null,
  "conference": null,
  "division": null,
  "city": null,
  "state": null,
  "primaryColor": null,
  "secondaryColor": null,
} satisfies ApiV1TeamsMePutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1TeamsMePutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


