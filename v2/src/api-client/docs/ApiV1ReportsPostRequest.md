
# ApiV1ReportsPostRequest


## Properties

Name | Type
------------ | -------------
`title` | string
`type` | string
`description` | string
`status` | string
`dataSources` | Array&lt;string&gt;
`sections` | Array&lt;string&gt;
`filters` | object

## Example

```typescript
import type { ApiV1ReportsPostRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "title": null,
  "type": null,
  "description": null,
  "status": null,
  "dataSources": null,
  "sections": null,
  "filters": null,
} satisfies ApiV1ReportsPostRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1ReportsPostRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


