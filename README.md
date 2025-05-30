# ihk_postman_mcp

A Node.js module that provides a FastMCP server for interacting with the Postman API. This tool allows you to manage Postman workspaces, collections, folders, and requests programmatically.

## 한국어 설명

이 프로젝트는 Postman API와 상호 작용하기 위한 FastMCP 서버를 제공하는 Node.js 모듈입니다. 이 도구를 사용하면 Postman 워크스페이스, 컬렉션, 폴더 및 요청을 프로그래밍 방식으로 관리할 수 있습니다.

## Installation

```bash
npm install ihk_postman_mcp
```

## Usage

This package requires a Postman API key to be set as an environment variable:

```bash
export API_KEY=your_postman_api_key
```

You can then use the package as a CLI tool:

```bash
ihk_postman_mcp
```

Or import it in your code:

```javascript
import { FastMCP } from "fastmcp";
import { createAPIClient } from "ihk_postman_mcp";
import ToolSetup from "ihk_postman_mcp/dist/lib/ToolSetup.js";

// Create server instance
const server = new FastMCP({
  name: "Postman MCP",
  version: "1.0.0",
});

// Create API client with your Postman API key
const postmanAPI = createAPIClient("your_postman_api_key");

// Setup tools
ToolSetup(server, postmanAPI);

// Start server
server.start({
  transportType: "stdio"
});
```

## Available Tools

The package provides the following tools for interacting with the Postman API:

### getAllWorkspaces

Get all workspaces for the current user.

### getWorkspace

Get workspace information by ID including collections.

Parameters:
- `id`: Workspace ID

### createNewRequest

Add a new request (API) to a collection.

Parameters:
- `uid`: Collection UID to add the request to
- `folderId` (optional): Folder ID to add the request to
- `name`: Request name
- `dataMode` (optional): Type of request body ('raw', 'formdata', 'none', 'urlencoded')
- `dataOptions` (optional): Options for the data mode
- `rawModeData` (optional): JSON string for the request body
- `description` (optional): Request description
- `headers` (optional): Request headers
- `method` (optional): HTTP method
- `url`: API URL (use :paramName for path variables and standard query string format)

### getAllCollections

Get all collections regardless of workspace.

### getCollection

Get collection information by UID including folders and requests.

Parameters:
- `uid`: Collection UID

### getFolder

Get folder information by ID including subfolders and requests.

Parameters:
- `collectionUid`: Collection UID containing the folder
- `folderId`: Folder ID to retrieve

### getRequest

Get request (API) information by ID.

Parameters:
- `collectionUid`: Collection UID containing the request
- `requestId`: Request ID to retrieve

## License

ISC