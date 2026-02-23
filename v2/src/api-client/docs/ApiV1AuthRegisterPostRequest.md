
# ApiV1AuthRegisterPostRequest


## Properties

Name | Type
------------ | -------------
`email` | string
`password` | string
`firstName` | string
`lastName` | string
`role` | string
`phone` | string

## Example

```typescript
import type { ApiV1AuthRegisterPostRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "email": null,
  "password": null,
  "firstName": null,
  "lastName": null,
  "role": null,
  "phone": null,
} satisfies ApiV1AuthRegisterPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1AuthRegisterPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


