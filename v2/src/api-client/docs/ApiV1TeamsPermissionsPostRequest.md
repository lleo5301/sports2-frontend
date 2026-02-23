
# ApiV1TeamsPermissionsPostRequest


## Properties

Name | Type
------------ | -------------
`userId` | number
`permissionType` | string
`isGranted` | boolean
`expiresAt` | Date
`notes` | string

## Example

```typescript
import type { ApiV1TeamsPermissionsPostRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "userId": null,
  "permissionType": null,
  "isGranted": null,
  "expiresAt": null,
  "notes": null,
} satisfies ApiV1TeamsPermissionsPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1TeamsPermissionsPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


