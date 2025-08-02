# 🚀 Deployment Guide

This guide covers different ways to deploy and use the Context AI MCP Server.

## 📦 Option 1: NPM Package Installation (Recommended for Users)

Once published to npm, users can install globally:

```bash
npm install -g context-ai-mcp-server
```

Then configure in Claude Desktop:
```json
{
  "mcpServers": {
    "context-ai-mcp-server": {
      "command": "context-ai-mcp-server",
      "env": {
        "WORKSPACE_PATH": "/path/to/your/workspace"
      }
    }
  }
}
```

## 🏠 Option 2: Local Development Setup (Current)

For local development and personal use:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/context-ai-mcp-server.git
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

4. **Configure Claude Desktop** with absolute paths:
   ```json
   {
     "mcpServers": {
       "context-ai-mcp-server": {
         "command": "node",
         "args": ["/absolute/path/to/context-ai-mcp-server/dist/index.js"],
         "env": {
           "WORKSPACE_PATH": "/absolute/path/to/your/workspace"
         }
       }
     }
   }
   ```

## ☁️ Option 3: Cloud Deployment (Advanced)

For always-online access, you can deploy to cloud platforms:

### Vercel Deployment
```bash
npm install -g vercel
vercel --prod
```

### Railway Deployment
```bash
npm install -g @railway/cli
railway login
railway link
railway up
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["npm", "start"]
```

## 🌐 Option 4: GitHub Repository + Direct Install

Users can install directly from GitHub:

```bash
npm install -g git+https://github.com/your-username/context-ai-mcp-server.git
```

## 🔧 Configuration Options

### Environment Variables
- `WORKSPACE_PATH`: Path to analyze (required)
- `MAX_FILE_SIZE`: Maximum file size to process (default: 1MB)
- `CACHE_TTL`: Cache time-to-live in seconds (default: 3600)
- `LOG_LEVEL`: Logging level (debug, info, warn, error)

### MCP Client Configurations

#### Claude Desktop
Location: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)

#### VS Code
Location: `.vscode/mcp.json` in your workspace

#### Custom MCP Client
Use the standard MCP protocol over stdio

## 📈 Publishing to NPM

To publish this package to npm:

1. **Update package.json** with your details
2. **Build the project**: `npm run build`
3. **Login to npm**: `npm login`
4. **Publish**: `npm publish`

## 🎯 Recommended Approach

For **personal use**:
- Use Option 2 (Local Development) for full workspace access

For **sharing with others**:
- Publish to npm (Option 1) for easy installation
- Create GitHub repository for collaboration

For **enterprise/team use**:
- Deploy to cloud (Option 3) for always-available access
- Set up CI/CD for automatic updates

## 🔒 Security Considerations

- **Workspace Access**: Only grant access to trusted directories
- **Environment Variables**: Never expose sensitive data
- **Network Access**: Consider firewall rules for cloud deployments
- **Authentication**: Implement auth for shared deployments

## 🚨 Next Steps for You

I recommend:

1. **✅ Keep your local setup** (it's working great!)
2. **🚀 Create a GitHub repository** to share with others
3. **📦 Publish to npm** so others can easily install
4. **🌟 Share the repository** to help others make their AI smarter too!

Would you like me to help you create the GitHub repository or publish to npm?
