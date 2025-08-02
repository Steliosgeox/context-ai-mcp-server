# Claude Desktop Configuration Example

To use this MCP server with Claude Desktop, add the following configuration to your `claude_desktop_config.json` file:

## Windows Configuration
```json
{
  "mcpServers": {
    "context-ai-mcp-server": {
      "command": "node",
      "args": [
        "C:\\Users\\sgeorgoulis\\CONTEXT AI MCP SOC\\dist\\index.js"
      ],
      "env": {
        "WORKSPACE_PATH": "C:\\Users\\sgeorgoulis\\CONTEXT AI MCP SOC"
      }
    }
  }
}
```

## macOS/Linux Configuration
```json
{
  "mcpServers": {
    "context-ai-mcp-server": {
      "command": "node",
      "args": [
        "/absolute/path/to/context-ai-mcp-server/dist/index.js"
      ],
      "env": {
        "WORKSPACE_PATH": "/absolute/path/to/your/workspace"
      }
    }
  }
}
```

## Configuration File Locations

### Windows
- Standard: `%APPDATA%\Claude\claude_desktop_config.json`
- Alternative: `C:\Users\<username>\AppData\Roaming\Claude\claude_desktop_config.json`

### macOS
- `~/Library/Application Support/Claude/claude_desktop_config.json`

### Linux
- `~/.config/Claude/claude_desktop_config.json`

## Environment Variables

- **WORKSPACE_PATH**: Set this to the absolute path of the workspace you want to analyze
- You can set this to any project directory you want the MCP server to provide context for

## Usage in Claude Desktop

Once configured, restart Claude Desktop and you should see:
1. A tools icon in the chat interface
2. Available tools from the Context AI MCP Server
3. Prompt templates accessible via the `/` command

## Testing the Server

To test if the server is working correctly:

1. **In Claude Desktop**: Ask "Can you analyze my workspace?" and Claude should use the `analyze_workspace` tool
2. **In VS Code**: The server should appear in the MCP servers list
3. **Direct test**: Run `node dist/index.js` from the project directory - it should start without errors

## Troubleshooting

- **Server not found**: Check that the path in the configuration is absolute and correct
- **Permission issues**: Ensure Node.js can read the project files
- **Environment variables**: Make sure WORKSPACE_PATH points to a valid directory
- **Dependencies**: Run `npm install` to ensure all dependencies are installed
