<div id="header">

</div>

<div id="content">

<div class="sect1">

## Test

<div class="sectionbody">

# Swagger Petstore v1.0.0

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Base URLs:

- [](http://petstore.swagger.io/v1)<http://petstore.swagger.io/v1>

License: MIT

# pets

## listPets

<span id="opIdlistPets"></span>

> Code samples

``` http
GET /v1/pets HTTP/1.1
Accept: application/json
Host: petstore.swagger.io
```

``` shell
curl --request GET \
  --url http://petstore.swagger.io/v1/pets \
  --header 'Accept: application/json'
```

`GET /pets`

*List all pets*

### Parameters

| Name  | In    | Type           | Required | Description                                    |
|-------|-------|----------------|----------|------------------------------------------------|
| limit | query | integer(int32) | false    | How many items to return at one time (max 100) |

> Example responses

> 200 Response

<div id="cb3" class="sourceCode">

``` sourceCode
{
  "type": "array",
  "items": {
    "type": "object",
    "required": [
      "id",
      "name"
    ],
    "properties": {
      "id": {
        "type": "integer",
        "format": "int64"
      },
      "name": {
        "type": "string"
      },
      "tag": {
        "type": "string"
      }
    }
  }
}
```

</div>

### Responses

| Status  | Meaning                                                 | Description           | Schema                |
|---------|---------------------------------------------------------|-----------------------|-----------------------|
| 200     | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | A paged array of pets | [Pets](#schemapets)   |
| default | Default                                                 | unexpected error      | [Error](#schemaerror) |

### Response Headers

| Status | Header | Type   | Format | Description                          |
|--------|--------|--------|--------|--------------------------------------|
| 200    | x-next | string |        | A link to the next page of responses |

This operation does not require authentication

## createPets

<span id="opIdcreatePets"></span>

> Code samples

``` http
POST /v1/pets HTTP/1.1
Accept: application/json
Host: petstore.swagger.io
```

``` shell
curl --request POST \
  --url http://petstore.swagger.io/v1/pets \
  --header 'Accept: application/json'
```

`POST /pets`

*Create a pet*

> Example responses

> default Response

<div id="cb6" class="sourceCode">

``` sourceCode
{
  "type": "object",
  "required": [
    "code",
    "message"
  ],
  "properties": {
    "code": {
      "type": "integer",
      "format": "int32"
    },
    "message": {
      "type": "string"
    }
  }
}
```

</div>

### Responses

| Status  | Meaning                                                      | Description      | Schema                |
|---------|--------------------------------------------------------------|------------------|-----------------------|
| 201     | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2) | Null response    | None                  |
| default | Default                                                      | unexpected error | [Error](#schemaerror) |

This operation does not require authentication

## showPetById

<span id="opIdshowPetById"></span>

> Code samples

``` http
GET /v1/pets/type,string HTTP/1.1
Accept: application/json
Host: petstore.swagger.io
```

``` shell
curl --request GET \
  --url 'http://petstore.swagger.io/v1/pets/type,string' \
  --header 'Accept: application/json'
```

`GET /pets/{petId}`

*Info for a specific pet*

### Parameters

| Name  | In   | Type   | Required | Description                   |
|-------|------|--------|----------|-------------------------------|
| petId | path | string | true     | The id of the pet to retrieve |

> Example responses

> 200 Response

<div id="cb9" class="sourceCode">

``` sourceCode
{
  "type": "object",
  "required": [
    "id",
    "name"
  ],
  "properties": {
    "id": {
      "type": "integer",
      "format": "int64"
    },
    "name": {
      "type": "string"
    },
    "tag": {
      "type": "string"
    }
  }
}
```

</div>

### Responses

| Status  | Meaning                                                 | Description                          | Schema                |
|---------|---------------------------------------------------------|--------------------------------------|-----------------------|
| 200     | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | Expected response to a valid request | [Pet](#schemapet)     |
| default | Default                                                 | unexpected error                     | [Error](#schemaerror) |

This operation does not require authentication

# Schemas

## Pet

<span id="schemapet"></span> <span id="schema_Pet"></span> <span id="tocSpet"></span> <span id="tocspet"></span>

<div id="cb10" class="sourceCode">

``` sourceCode
type: object
required:
  - id
  - name
properties:
  id:
    type: integer
    format: int64
  name:
    type: string
  tag:
    type: string
```

</div>

### Properties

| Name | Type           | Required | Restrictions | Description |
|------|----------------|----------|--------------|-------------|
| id   | integer(int64) | true     | none         | none        |
| name | string         | true     | none         | none        |
| tag  | string         | false    | none         | none        |

## Pets

<span id="schemapets"></span> <span id="schema_Pets"></span> <span id="tocSpets"></span> <span id="tocspets"></span>

<div id="cb11" class="sourceCode">

``` sourceCode
type: array
items:
  type: object
  required:
    - id
    - name
  properties:
    id:
      type: integer
      format: int64
    name:
      type: string
    tag:
      type: string
```

</div>

### Properties

| Name        | Type                  | Required | Restrictions | Description |
|-------------|-----------------------|----------|--------------|-------------|
| *anonymous* | \[[Pet](#schemapet)\] | false    | none         | none        |

## Error

<span id="schemaerror"></span> <span id="schema_Error"></span> <span id="tocSerror"></span> <span id="tocserror"></span>

<div id="cb12" class="sourceCode">

``` sourceCode
type: object
required:
  - code
  - message
properties:
  code:
    type: integer
    format: int32
  message:
    type: string
```

</div>

### Properties

| Name    | Type           | Required | Restrictions | Description |
|---------|----------------|----------|--------------|-------------|
| code    | integer(int32) | true     | none         | none        |
| message | string         | true     | none         | none        |

</div>

</div>

</div>

<div id="footer">

<div id="footer-text">

Last updated 2023-12-01 20:35:10 +0100

</div>

</div>
