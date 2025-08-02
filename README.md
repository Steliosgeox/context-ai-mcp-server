# Context AI MCP Server

A comprehensive Model Context Protocol (MCP) server that enhances AI capabilities by providing rich context from your workspace. This server is designed to make AI assistants smarter by giving them deep understanding of your codebase, patterns, and project structure.

## 🚀 Features

### 🔍 Workspace Analysis
- **Complete Code Analysis**: Analyzes entire workspace structure, technologies, and patterns
- **Dependency Mapping**: Tracks file dependencies and relationships
- **Technology Detection**: Automatically identifies frameworks, libraries, and tools
- **Architecture Insights**: Recognizes architectural patterns and design principles

### 🛠️ Powerful Tools
- `analyze_workspace`: Comprehensive workspace analysis with customizable depth
- `search_codebase`: Advanced code search with regex support and context
- `get_file_dependencies`: Detailed dependency analysis for any file
- `get_project_patterns`: Extract architectural patterns and conventions
- `get_context_summary`: Generate AI-optimized workspace summaries
- `suggest_improvements`: Automated code quality and security recommendations

### 📝 Smart Prompts
- **Code Review Templates**: Comprehensive code review checklists
- **Architecture Analysis**: System design evaluation prompts
- **Security Audits**: Security-focused analysis templates
- **Performance Optimization**: Performance analysis and improvement guides
- **Refactoring Suggestions**: Code quality improvement templates

### 📁 Resource Access
- Direct access to all workspace files
- Intelligent file filtering and organization
- MIME type detection and proper content handling
- Efficient caching for better performance

## 🎯 Use Cases

### For Development Teams
- **Onboarding**: Help new team members understand codebase structure
- **Code Reviews**: Automated analysis and comprehensive review checklists
- **Architecture Planning**: Analyze current patterns and plan improvements
- **Knowledge Transfer**: Preserve and share architectural knowledge

### For AI Enhancement
- **Context Enrichment**: Provide comprehensive workspace context to AI assistants
- **Pattern Recognition**: Help AI understand your specific coding patterns
- **Smart Suggestions**: Get AI recommendations based on your actual codebase
- **Automated Analysis**: Regular codebase health checks and improvement suggestions

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- TypeScript
- VS Code or compatible MCP client

### Installation

1. **Clone or create the project**:
   ```bash
   git clone <your-repo> context-ai-mcp-server
   cd context-ai-mcp-server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Configure your MCP client**:

   **For VS Code**: The `.vscode/mcp.json` file is already configured. Just open VS Code and the server will be available.

   **For Claude Desktop**: Add to your `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "context-ai-mcp-server": {
         "command": "node",
         "args": [
           "/ABSOLUTE/PATH/TO/context-ai-mcp-server/dist/index.js"
         ],
         "env": {
           "WORKSPACE_PATH": "/ABSOLUTE/PATH/TO/YOUR/PROJECT"
         }
       }
     }
   }
   ```

### Usage Examples

1. **Analyze Your Workspace**:
   ```
   Use the analyze_workspace tool to get comprehensive insights about your project structure, technologies, and patterns.
   ```

2. **Search Your Code**:
   ```
   Use search_codebase with queries like "function.*authenticate" to find authentication-related code across your project.
   ```

3. **Get Context Summary**:
   ```
   Use get_context_summary to generate AI-optimized summaries of your workspace for enhanced AI interactions.
   ```

## 🔧 Configuration

### Environment Variables
- `WORKSPACE_PATH`: Path to the workspace to analyze (defaults to current directory)

### Customization
The server can be customized by modifying:
- **Prompt Templates**: Edit `src/prompt-templates.ts` to add custom prompts
- **Analysis Logic**: Modify `src/context-manager.ts` for custom analysis patterns
- **File Indexing**: Adjust `src/workspace-indexer.ts` for different file handling

## 🏗️ Architecture

```
├── src/
│   ├── index.ts              # Main MCP server implementation
│   ├── workspace-indexer.ts  # File system analysis and indexing
│   ├── context-manager.ts    # Context extraction and management
│   └── prompt-templates.ts   # Predefined prompt templates
├── dist/                     # Compiled JavaScript output
├── .vscode/
│   └── mcp.json             # VS Code MCP configuration
└── .github/
    └── copilot-instructions.md # GitHub Copilot customization
```

## 🚀 Development

### Scripts
- `npm run build`: Compile TypeScript to JavaScript
- `npm run dev`: Watch mode for development
- `npm start`: Run the compiled server

### Adding New Tools
1. Add tool definition in `src/index.ts` `setupToolHandlers()`
2. Implement tool logic in `src/context-manager.ts`
3. Add corresponding method in the main server class
4. Update documentation

### Adding New Prompts
1. Add prompt template in `src/prompt-templates.ts`
2. Implement prompt generation logic
3. Test with MCP clients

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [VS Code MCP Support](https://code.visualstudio.com/docs/copilot/copilot-mcp)

---

**Made with ❤️ to enhance AI capabilities through rich workspace context**
