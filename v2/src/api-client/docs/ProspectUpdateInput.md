
# ProspectUpdateInput


## Properties

Name | Type
------------ | -------------
`firstName` | string
`lastName` | string
`primaryPosition` | string
`secondaryPosition` | string
`schoolType` | string
`schoolName` | string
`city` | string
`state` | string
`graduationYear` | number
`classYear` | string
`bats` | string
`throws` | string
`height` | string
`weight` | number
`status` | string
`notes` | string
`email` | string
`phone` | string

## Example

```typescript
import type { ProspectUpdateInput } from ''

// TODO: Update the object below with actual values
const example = {
  "firstName": null,
  "lastName": null,
  "primaryPosition": null,
  "secondaryPosition": null,
  "schoolType": null,
  "schoolName": null,
  "city": null,
  "state": null,
  "graduationYear": null,
  "classYear": null,
  "bats": null,
  "throws": null,
  "height": null,
  "weight": null,
  "status": null,
  "notes": null,
  "email": null,
  "phone": null,
} satisfies ProspectUpdateInput

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProspectUpdateInput
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


