
# ApiV1LocationsPostRequest


## Properties

Name | Type
------------ | -------------
`name` | string
`address` | string
`city` | string
`state` | string
`zipCode` | string
`locationType` | string
`capacity` | number

## Example

```typescript
import type { ApiV1LocationsPostRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "address": null,
  "city": null,
  "state": null,
  "zipCode": null,
  "locationType": null,
  "capacity": null,
} satisfies ApiV1LocationsPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1LocationsPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


