
# Player


## Properties

Name | Type
------------ | -------------
`id` | number
`firstName` | string
`lastName` | string
`position` | string
`schoolType` | string
`school` | string
`city` | string
`state` | string
`graduationYear` | number
`status` | string
`teamId` | number
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { Player } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "firstName": null,
  "lastName": null,
  "position": null,
  "schoolType": null,
  "school": null,
  "city": null,
  "state": null,
  "graduationYear": null,
  "status": null,
  "teamId": null,
  "createdAt": null,
  "updatedAt": null,
} satisfies Player

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Player
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


