# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## MCP Server Development Guidelines

This is an MCP (Model Context Protocol) server project that provides enhanced context and capabilities to AI assistants. 

### Key Features
- **Workspace Analysis**: Comprehensive analysis of codebases and project structures
- **Context Management**: Rich context extraction and management for AI interactions
- **Prompt Templates**: Predefined prompts for common AI assistant tasks
- **Code Search**: Advanced search capabilities across the workspace
- **Pattern Recognition**: Identification of architectural patterns and best practices

### Development Guidelines
- Use TypeScript for all source code
- Follow MCP server patterns and conventions
- Implement proper error handling and logging to stderr (never stdout for STDIO servers)
- Use the MCP SDK for all protocol interactions
- Maintain compatibility with VS Code, Claude Desktop, and other MCP clients

### MCP Server Specific Rules
- Always log to stderr or files, never to stdout (breaks JSON-RPC communication)
- Implement all three MCP capabilities: Resources, Tools, and Prompts
- Use proper JSON schemas for tool parameters
- Handle client disconnections gracefully
- Support both local and remote workspace analysis

### References
- MCP Documentation: https://modelcontextprotocol.io/llms-full.txt
- Python MCP Server Template: https://github.com/modelcontextprotocol/create-python-server
- MCP SDK: https://github.com/modelcontextprotocol/typescript-sdk

### Context Enhancement Focus
This server is designed to make AI assistants smarter by providing:
- Complete workspace context and structure
- Code patterns and architectural insights
- Dependency analysis and relationships
- Performance and security recommendations
- Automated code quality assessments
