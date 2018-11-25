# Kviz API

API for creating dynamic forms.

## Setup

Run `npm install` and then `npm start`.

## Docs

### Environment

Environment variables are in `.env` file, but for your own purposes,
you can create `.env.local` file that overrides `.env`.

### GraphQL

GraphQL schema and docs are available 
[here](https://htmlpreview.github.io/?https://github.com/zuffik/kviz-api/blob/master/docs/schema/index.html).

### Endpoints

 - `POST|GET /graphql`: GET requests for GraphiQL and post for data posting/fetching.
 - `POST /upload`: `multipart/form-data` type file upload. Files are identified by `upload` key
    and stored in `/upload`
    directory. 
    
    Example request:
    ```curl
    curl -X POST \
      http://localhost:3000/upload \
      -H 'Accept: application/json' \
      -H 'Content-Type: application/x-www-form-urlencoded' \
      -H 'cache-control: no-cache' \
      -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
      -F upload=@path/to/file
    ```
    
    Example response:
    ```json
    {
       "files": [
         {
             "file": "img.jpg",
             "path": "upload/img.jpg",
             "id": "5bfa7528b7b4d70d700ab52b"
         }
       ]
    }
    
    ```
