#!/usr/bin/env node

/**
 * Context AI MCP Server
 * 
 * This MCP server provides comprehensive context from your workspace to enhance AI capabilities.
 * It offers tools for workspace analysis, code search, pattern recognition, and context management.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs-extra';
import * as path from 'path';
import glob from 'fast-glob';
import ignore from 'ignore';
import { WorkspaceIndexer } from './workspace-indexer.js';
import { ContextManager } from './context-manager.js';
import { PromptTemplates } from './prompt-templates.js';

class ContextAIMCPServer {
  private server: Server;
  private workspaceIndexer: WorkspaceIndexer;
  private contextManager: ContextManager;
  private promptTemplates: PromptTemplates;
  private workspacePath: string;

  constructor() {
    this.server = new Server(
      {
        name: 'context-ai-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
          prompts: {},
        },
      }
    );

    this.workspacePath = process.env.WORKSPACE_PATH || process.cwd();
    this.workspaceIndexer = new WorkspaceIndexer(this.workspacePath);
    this.contextManager = new ContextManager(this.workspaceIndexer);
    this.promptTemplates = new PromptTemplates();

    this.setupToolHandlers();
    this.setupResourceHandlers();
    this.setupPromptHandlers();

    // Error handling
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'analyze_workspace',
            description: 'Analyze the entire workspace structure and provide comprehensive insights',
            inputSchema: {
              type: 'object',
              properties: {
                includeContent: {
                  type: 'boolean',
                  description: 'Include file contents in analysis',
                  default: false,
                },
                maxDepth: {
                  type: 'number',
                  description: 'Maximum directory depth to analyze',
                  default: 5,
                },
              },
            },
          },
          {
            name: 'search_codebase',
            description: 'Search for code patterns, functions, classes, or specific content across the workspace',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query (can be regex, function names, or natural language)',
                },
                fileTypes: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'File extensions to search in (e.g., [".ts", ".js", ".py"])',
                },
                includeContext: {
                  type: 'boolean',
                  description: 'Include surrounding context for matches',
                  default: true,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_file_dependencies',
            description: 'Analyze dependencies and relationships for a specific file',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: {
                  type: 'string',
                  description: 'Path to the file to analyze',
                },
                includeTransitive: {
                  type: 'boolean',
                  description: 'Include transitive dependencies',
                  default: false,
                },
              },
              required: ['filePath'],
            },
          },
          {
            name: 'get_project_patterns',
            description: 'Extract common patterns, architectures, and conventions from the codebase',
            inputSchema: {
              type: 'object',
              properties: {
                analysisType: {
                  type: 'string',
                  enum: ['architecture', 'patterns', 'conventions', 'all'],
                  description: 'Type of pattern analysis to perform',
                  default: 'all',
                },
              },
            },
          },
          {
            name: 'get_context_summary',
            description: 'Get a comprehensive summary of the workspace for AI context',
            inputSchema: {
              type: 'object',
              properties: {
                focusArea: {
                  type: 'string',
                  description: 'Specific area to focus on (e.g., "frontend", "backend", "testing")',
                },
                includeExamples: {
                  type: 'boolean',
                  description: 'Include code examples in the summary',
                  default: true,
                },
              },
            },
          },
          {
            name: 'suggest_improvements',
            description: 'Analyze the codebase and suggest improvements based on patterns and best practices',
            inputSchema: {
              type: 'object',
              properties: {
                scope: {
                  type: 'string',
                  enum: ['security', 'performance', 'maintainability', 'all'],
                  description: 'Scope of improvements to suggest',
                  default: 'all',
                },
              },
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'analyze_workspace':
            return await this.analyzeWorkspace(args as any);
          
          case 'search_codebase':
            return await this.searchCodebase(args as any);
          
          case 'get_file_dependencies':
            return await this.getFileDependencies(args as any);
          
          case 'get_project_patterns':
            return await this.getProjectPatterns(args as any);
          
          case 'get_context_summary':
            return await this.getContextSummary(args as any);
          
          case 'suggest_improvements':
            return await this.suggestImprovements(args as any);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private setupResourceHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const files = await this.workspaceIndexer.getAllFiles();
      
      return {
        resources: files.map(file => ({
          uri: `file://${file}`,
          name: path.basename(file),
          description: `File: ${path.relative(this.workspacePath, file)}`,
          mimeType: this.getMimeType(file),
        })),
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;
      if (!uri.startsWith('file://')) {
        throw new Error('Only file:// URIs are supported');
      }

      const filePath = uri.slice(7); // Remove 'file://' prefix
      const content = await fs.readFile(filePath, 'utf-8');
      
      return {
        contents: [
          {
            uri,
            mimeType: this.getMimeType(filePath),
            text: content,
          },
        ],
      };
    });
  }

  private setupPromptHandlers() {
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: this.promptTemplates.getAllPrompts(),
      };
    });

    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      return this.promptTemplates.getPrompt(request.params.name, request.params.arguments);
    });
  }

  private async analyzeWorkspace(args: any): Promise<any> {
    const analysis = await this.workspaceIndexer.analyzeWorkspace({
      includeContent: args.includeContent,
      maxDepth: args.maxDepth,
    });

    return {
      content: [
        {
          type: 'text',
          text: `# Workspace Analysis

## Structure Overview
- **Total Files**: ${analysis.totalFiles}
- **Languages**: ${analysis.languages.join(', ')}
- **Directories**: ${analysis.totalDirectories}

## File Distribution
${analysis.fileDistribution.map(item => `- **${item.extension}**: ${item.count} files`).join('\n')}

## Key Directories
${analysis.keyDirectories.map(dir => `- \`${dir.path}\`: ${dir.description}`).join('\n')}

## Technologies Detected
${analysis.technologies.map(tech => `- **${tech.name}**: ${tech.description}`).join('\n')}

${args.includeContent ? `\n## Sample Code Patterns\n${analysis.codePatterns?.join('\n\n')}` : ''}`,
        },
      ],
    };
  }

  private async searchCodebase(args: any): Promise<any> {
    const results = await this.contextManager.searchCode({
      query: args.query,
      fileTypes: args.fileTypes,
      includeContext: args.includeContext,
    });

    return {
      content: [
        {
          type: 'text',
          text: `# Code Search Results

Found ${results.length} matches for: "${args.query}"

${results.map(result => `
## ${result.file}
**Line ${result.line}**: ${result.context || result.match}
\`\`\`${result.language}
${result.code}
\`\`\`
`).join('\n')}`,
        },
      ],
    };
  }

  private async getFileDependencies(args: any): Promise<any> {
    const dependencies = await this.contextManager.getFileDependencies(
      args.filePath,
      args.includeTransitive
    );

    return {
      content: [
        {
          type: 'text',
          text: `# File Dependencies: ${args.filePath}

## Direct Dependencies
${dependencies.direct.map(dep => `- \`${dep}\``).join('\n')}

${args.includeTransitive ? `
## Transitive Dependencies
${dependencies.transitive.map(dep => `- \`${dep}\``).join('\n')}
` : ''}

## Dependents (files that depend on this file)
${dependencies.dependents.map(dep => `- \`${dep}\``).join('\n')}`,
        },
      ],
    };
  }

  private async getProjectPatterns(args: any): Promise<any> {
    const patterns = await this.contextManager.getProjectPatterns(args.analysisType);

    return {
      content: [
        {
          type: 'text',
          text: `# Project Patterns Analysis

## Architecture Patterns
${patterns.architecture.map(pattern => `
### ${pattern.name}
- **Description**: ${pattern.description}
- **Usage**: ${pattern.usage}
- **Examples**: ${pattern.examples.join(', ')}
`).join('\n')}

## Code Conventions
${patterns.conventions.map(conv => `- **${conv.type}**: ${conv.description}`).join('\n')}

## Design Patterns
${patterns.designPatterns.map(pattern => `- **${pattern.name}**: ${pattern.description}`).join('\n')}`,
        },
      ],
    };
  }

  private async getContextSummary(args: any): Promise<any> {
    const summary = await this.contextManager.getContextSummary({
      focusArea: args.focusArea,
      includeExamples: args.includeExamples,
    });

    return {
      content: [
        {
          type: 'text',
          text: summary,
        },
      ],
    };
  }

  private async suggestImprovements(args: any): Promise<any> {
    const suggestions = await this.contextManager.suggestImprovements(args.scope);

    return {
      content: [
        {
          type: 'text',
          text: `# Improvement Suggestions

${suggestions.map(suggestion => `
## ${suggestion.category}: ${suggestion.title}
**Priority**: ${suggestion.priority}
**Impact**: ${suggestion.impact}

${suggestion.description}

### Recommended Actions:
${suggestion.actions.map(action => `- ${action}`).join('\n')}

${suggestion.codeExample ? `### Example:
\`\`\`${suggestion.language}
${suggestion.codeExample}
\`\`\`
` : ''}
`).join('\n')}`,
        },
      ],
    };
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.js': 'application/javascript',
      '.ts': 'application/typescript',
      '.py': 'text/x-python',
      '.java': 'text/x-java-source',
      '.cpp': 'text/x-c++src',
      '.c': 'text/x-csrc',
      '.h': 'text/x-chdr',
      '.css': 'text/css',
      '.html': 'text/html',
      '.json': 'application/json',
      '.xml': 'text/xml',
      '.md': 'text/markdown',
      '.txt': 'text/plain',
    };
    return mimeTypes[ext] || 'text/plain';
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Context AI MCP Server running on stdio');
  }
}

// Start the server
if (process.argv[1] && process.argv[1].includes('index.js')) {
  const server = new ContextAIMCPServer();
  server.run().catch(console.error);
}
