
# PlayerUpdateInput


## Properties

Name | Type
------------ | -------------
`firstName` | string
`lastName` | string
`position` | string
`schoolType` | string
`school` | string
`city` | string
`state` | string
`graduationYear` | number
`weight` | number
`height` | string
`email` | string
`phone` | string
`status` | string

## Example

```typescript
import type { PlayerUpdateInput } from ''

// TODO: Update the object below with actual values
const example = {
  "firstName": null,
  "lastName": null,
  "position": null,
  "schoolType": null,
  "school": null,
  "city": null,
  "state": null,
  "graduationYear": null,
  "weight": null,
  "height": null,
  "email": null,
  "phone": null,
  "status": null,
} satisfies PlayerUpdateInput

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PlayerUpdateInput
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


