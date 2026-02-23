
# ApiV1ReportsByIdIdPutRequest


## Properties

Name | Type
------------ | -------------
`title` | string
`description` | string
`status` | string
`dataSources` | Array&lt;string&gt;
`sections` | Array&lt;string&gt;
`filters` | object

## Example

```typescript
import type { ApiV1ReportsByIdIdPutRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "title": null,
  "description": null,
  "status": null,
  "dataSources": null,
  "sections": null,
  "filters": null,
} satisfies ApiV1ReportsByIdIdPutRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiV1ReportsByIdIdPutRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


