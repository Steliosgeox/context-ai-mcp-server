#!/usr/bin/env node
"use strict";
/**
 * Context AI MCP Server
 *
 * This MCP server provides comprehensive context from your workspace to enhance AI capabilities.
 * It offers tools for workspace analysis, code search, pattern recognition, and context management.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var fs_extra_1 = require("fs-extra");
var path = require("path");
var workspace_indexer_js_1 = require("./workspace-indexer.js");
var context_manager_js_1 = require("./context-manager.js");
var prompt_templates_js_1 = require("./prompt-templates.js");
var ContextAIMCPServer = /** @class */ (function () {
    function ContextAIMCPServer() {
        var _this = this;
        this.server = new index_js_1.Server({
            name: 'context-ai-mcp-server',
            version: '1.0.0',
        }, {
            capabilities: {
                resources: {},
                tools: {},
                prompts: {},
            },
        });
        this.workspacePath = process.env.WORKSPACE_PATH || process.cwd();
        this.workspaceIndexer = new workspace_indexer_js_1.WorkspaceIndexer(this.workspacePath);
        this.contextManager = new context_manager_js_1.ContextManager(this.workspaceIndexer);
        this.promptTemplates = new prompt_templates_js_1.PromptTemplates();
        this.setupToolHandlers();
        this.setupResourceHandlers();
        this.setupPromptHandlers();
        // Error handling
        this.server.onerror = function (error) {
            console.error('[MCP Error]', error);
        };
        process.on('SIGINT', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.server.close()];
                    case 1:
                        _a.sent();
                        process.exit(0);
                        return [2 /*return*/];
                }
            });
        }); });
    }
    ContextAIMCPServer.prototype.setupToolHandlers = function () {
        var _this = this;
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
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
                    }];
            });
        }); });
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(_this, void 0, void 0, function () {
            var _a, name, args, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = request.params, name = _a.name, args = _a.arguments;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 16, , 17]);
                        _b = name;
                        switch (_b) {
                            case 'analyze_workspace': return [3 /*break*/, 2];
                            case 'search_codebase': return [3 /*break*/, 4];
                            case 'get_file_dependencies': return [3 /*break*/, 6];
                            case 'get_project_patterns': return [3 /*break*/, 8];
                            case 'get_context_summary': return [3 /*break*/, 10];
                            case 'suggest_improvements': return [3 /*break*/, 12];
                        }
                        return [3 /*break*/, 14];
                    case 2: return [4 /*yield*/, this.analyzeWorkspace(args)];
                    case 3: return [2 /*return*/, _c.sent()];
                    case 4: return [4 /*yield*/, this.searchCodebase(args)];
                    case 5: return [2 /*return*/, _c.sent()];
                    case 6: return [4 /*yield*/, this.getFileDependencies(args)];
                    case 7: return [2 /*return*/, _c.sent()];
                    case 8: return [4 /*yield*/, this.getProjectPatterns(args)];
                    case 9: return [2 /*return*/, _c.sent()];
                    case 10: return [4 /*yield*/, this.getContextSummary(args)];
                    case 11: return [2 /*return*/, _c.sent()];
                    case 12: return [4 /*yield*/, this.suggestImprovements(args)];
                    case 13: return [2 /*return*/, _c.sent()];
                    case 14: throw new Error("Unknown tool: ".concat(name));
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        error_1 = _c.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: "Error executing ".concat(name, ": ").concat(error_1 instanceof Error ? error_1.message : String(error_1)),
                                    },
                                ],
                                isError: true,
                            }];
                    case 17: return [2 /*return*/];
                }
            });
        }); });
    };
    ContextAIMCPServer.prototype.setupResourceHandlers = function () {
        var _this = this;
        this.server.setRequestHandler(types_js_1.ListResourcesRequestSchema, function () { return __awaiter(_this, void 0, void 0, function () {
            var files;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.workspaceIndexer.getAllFiles()];
                    case 1:
                        files = _a.sent();
                        return [2 /*return*/, {
                                resources: files.map(function (file) { return ({
                                    uri: "file://".concat(file),
                                    name: path.basename(file),
                                    description: "File: ".concat(path.relative(_this.workspacePath, file)),
                                    mimeType: _this.getMimeType(file),
                                }); }),
                            }];
                }
            });
        }); });
        this.server.setRequestHandler(types_js_1.ReadResourceRequestSchema, function (request) { return __awaiter(_this, void 0, void 0, function () {
            var uri, filePath, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uri = request.params.uri;
                        if (!uri.startsWith('file://')) {
                            throw new Error('Only file:// URIs are supported');
                        }
                        filePath = uri.slice(7);
                        return [4 /*yield*/, fs_extra_1.default.readFile(filePath, 'utf-8')];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, {
                                contents: [
                                    {
                                        uri: uri,
                                        mimeType: this.getMimeType(filePath),
                                        text: content,
                                    },
                                ],
                            }];
                }
            });
        }); });
    };
    ContextAIMCPServer.prototype.setupPromptHandlers = function () {
        var _this = this;
        this.server.setRequestHandler(types_js_1.ListPromptsRequestSchema, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        prompts: this.promptTemplates.getAllPrompts(),
                    }];
            });
        }); });
        this.server.setRequestHandler(types_js_1.GetPromptRequestSchema, function (request) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.promptTemplates.getPrompt(request.params.name, request.params.arguments)];
            });
        }); });
    };
    ContextAIMCPServer.prototype.analyzeWorkspace = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var analysis;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.workspaceIndexer.analyzeWorkspace({
                            includeContent: args.includeContent,
                            maxDepth: args.maxDepth,
                        })];
                    case 1:
                        analysis = _b.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: "# Workspace Analysis\n\n## Structure Overview\n- **Total Files**: ".concat(analysis.totalFiles, "\n- **Languages**: ").concat(analysis.languages.join(', '), "\n- **Directories**: ").concat(analysis.totalDirectories, "\n\n## File Distribution\n").concat(analysis.fileDistribution.map(function (item) { return "- **".concat(item.extension, "**: ").concat(item.count, " files"); }).join('\n'), "\n\n## Key Directories\n").concat(analysis.keyDirectories.map(function (dir) { return "- `".concat(dir.path, "`: ").concat(dir.description); }).join('\n'), "\n\n## Technologies Detected\n").concat(analysis.technologies.map(function (tech) { return "- **".concat(tech.name, "**: ").concat(tech.description); }).join('\n'), "\n\n").concat(args.includeContent ? "\n## Sample Code Patterns\n".concat((_a = analysis.codePatterns) === null || _a === void 0 ? void 0 : _a.join('\n\n')) : ''),
                                    },
                                ],
                            }];
                }
            });
        });
    };
    ContextAIMCPServer.prototype.searchCodebase = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contextManager.searchCode({
                            query: args.query,
                            fileTypes: args.fileTypes,
                            includeContext: args.includeContext,
                        })];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: "# Code Search Results\n\nFound ".concat(results.length, " matches for: \"").concat(args.query, "\"\n\n").concat(results.map(function (result) { return "\n## ".concat(result.file, "\n**Line ").concat(result.line, "**: ").concat(result.context || result.match, "\n```").concat(result.language, "\n").concat(result.code, "\n```\n"); }).join('\n')),
                                    },
                                ],
                            }];
                }
            });
        });
    };
    ContextAIMCPServer.prototype.getFileDependencies = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var dependencies;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contextManager.getFileDependencies(args.filePath, args.includeTransitive)];
                    case 1:
                        dependencies = _a.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: "# File Dependencies: ".concat(args.filePath, "\n\n## Direct Dependencies\n").concat(dependencies.direct.map(function (dep) { return "- `".concat(dep, "`"); }).join('\n'), "\n\n").concat(args.includeTransitive ? "\n## Transitive Dependencies\n".concat(dependencies.transitive.map(function (dep) { return "- `".concat(dep, "`"); }).join('\n'), "\n") : '', "\n\n## Dependents (files that depend on this file)\n").concat(dependencies.dependents.map(function (dep) { return "- `".concat(dep, "`"); }).join('\n')),
                                    },
                                ],
                            }];
                }
            });
        });
    };
    ContextAIMCPServer.prototype.getProjectPatterns = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var patterns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contextManager.getProjectPatterns(args.analysisType)];
                    case 1:
                        patterns = _a.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: "# Project Patterns Analysis\n\n## Architecture Patterns\n".concat(patterns.architecture.map(function (pattern) { return "\n### ".concat(pattern.name, "\n- **Description**: ").concat(pattern.description, "\n- **Usage**: ").concat(pattern.usage, "\n- **Examples**: ").concat(pattern.examples.join(', '), "\n"); }).join('\n'), "\n\n## Code Conventions\n").concat(patterns.conventions.map(function (conv) { return "- **".concat(conv.type, "**: ").concat(conv.description); }).join('\n'), "\n\n## Design Patterns\n").concat(patterns.designPatterns.map(function (pattern) { return "- **".concat(pattern.name, "**: ").concat(pattern.description); }).join('\n')),
                                    },
                                ],
                            }];
                }
            });
        });
    };
    ContextAIMCPServer.prototype.getContextSummary = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var summary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contextManager.getContextSummary({
                            focusArea: args.focusArea,
                            includeExamples: args.includeExamples,
                        })];
                    case 1:
                        summary = _a.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: summary,
                                    },
                                ],
                            }];
                }
            });
        });
    };
    ContextAIMCPServer.prototype.suggestImprovements = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var suggestions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contextManager.suggestImprovements(args.scope)];
                    case 1:
                        suggestions = _a.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: "# Improvement Suggestions\n\n".concat(suggestions.map(function (suggestion) { return "\n## ".concat(suggestion.category, ": ").concat(suggestion.title, "\n**Priority**: ").concat(suggestion.priority, "\n**Impact**: ").concat(suggestion.impact, "\n\n").concat(suggestion.description, "\n\n### Recommended Actions:\n").concat(suggestion.actions.map(function (action) { return "- ".concat(action); }).join('\n'), "\n\n").concat(suggestion.codeExample ? "### Example:\n```".concat(suggestion.language, "\n").concat(suggestion.codeExample, "\n```\n") : '', "\n"); }).join('\n')),
                                    },
                                ],
                            }];
                }
            });
        });
    };
    ContextAIMCPServer.prototype.getMimeType = function (filePath) {
        var ext = path.extname(filePath).toLowerCase();
        var mimeTypes = {
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
    };
    ContextAIMCPServer.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transport = new stdio_js_1.StdioServerTransport();
                        return [4 /*yield*/, this.server.connect(transport)];
                    case 1:
                        _a.sent();
                        console.error('Context AI MCP Server running on stdio');
                        return [2 /*return*/];
                }
            });
        });
    };
    return ContextAIMCPServer;
}());
// Start the server
if (import.meta.url === "file://".concat(process.argv[1])) {
    var server = new ContextAIMCPServer();
    server.run().catch(console.error);
}
