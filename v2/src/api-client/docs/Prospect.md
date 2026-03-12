
# Prospect

Someone you\'re recruiting (vs Player on roster). See docs/api/scouting-system-api.md

## Properties

Name | Type
------------ | -------------
`id` | number
`teamId` | number
`createdBy` | number
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
`status` | string
`notes` | string
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { Prospect } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "teamId": null,
  "createdBy": null,
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
  "status": null,
  "notes": null,
  "createdAt": null,
  "updatedAt": null,
} satisfies Prospect

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Prospect
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


