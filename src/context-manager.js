"use strict";
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
exports.ContextManager = void 0;
var path = require("path");
var ContextManager = /** @class */ (function () {
    function ContextManager(workspaceIndexer) {
        this.workspaceIndexer = workspaceIndexer;
    }
    ContextManager.prototype.searchCode = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var query, fileTypes, _a, includeContext, results, files, isRegex, searchPattern, _i, files_1, file, matches, _b, matches_1, match, language, context, content, lines, startLine, endLine, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        query = options.query, fileTypes = options.fileTypes, _a = options.includeContext, includeContext = _a === void 0 ? true : _a;
                        results = [];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 11, , 12]);
                        return [4 /*yield*/, this.workspaceIndexer.getAllFiles(fileTypes)];
                    case 2:
                        files = _c.sent();
                        isRegex = this.isRegexPattern(query);
                        searchPattern = isRegex ? new RegExp(query, 'gi') : query;
                        _i = 0, files_1 = files;
                        _c.label = 3;
                    case 3:
                        if (!(_i < files_1.length)) return [3 /*break*/, 10];
                        file = files_1[_i];
                        return [4 /*yield*/, this.workspaceIndexer.searchInFile(file, searchPattern)];
                    case 4:
                        matches = _c.sent();
                        _b = 0, matches_1 = matches;
                        _c.label = 5;
                    case 5:
                        if (!(_b < matches_1.length)) return [3 /*break*/, 9];
                        match = matches_1[_b];
                        language = this.getLanguageFromExtension(path.extname(file));
                        context = '';
                        if (!includeContext) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.workspaceIndexer.getFileContent(file)];
                    case 6:
                        content = _c.sent();
                        lines = content.split('\n');
                        startLine = Math.max(0, match.line - 3);
                        endLine = Math.min(lines.length, match.line + 2);
                        context = lines.slice(startLine, endLine).join('\n');
                        _c.label = 7;
                    case 7:
                        results.push({
                            file: path.relative(process.cwd(), file),
                            line: match.line,
                            match: match.match,
                            context: context,
                            code: match.content,
                            language: language,
                        });
                        _c.label = 8;
                    case 8:
                        _b++;
                        return [3 /*break*/, 5];
                    case 9:
                        _i++;
                        return [3 /*break*/, 3];
                    case 10: return [2 /*return*/, results.slice(0, 50)]; // Limit results for performance
                    case 11:
                        error_1 = _c.sent();
                        console.error('Error searching code:', error_1);
                        return [2 /*return*/, []];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    ContextManager.prototype.getFileDependencies = function (filePath_1) {
        return __awaiter(this, arguments, void 0, function (filePath, includeTransitive) {
            var fullPath, content, direct, transitive, _a, dependents, error_2;
            if (includeTransitive === void 0) { includeTransitive = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        fullPath = path.resolve(filePath);
                        return [4 /*yield*/, this.workspaceIndexer.getFileContent(fullPath)];
                    case 1:
                        content = _b.sent();
                        direct = this.extractDirectDependencies(content, fullPath);
                        if (!includeTransitive) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.extractTransitiveDependencies(direct)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = [];
                        _b.label = 4;
                    case 4:
                        transitive = _a;
                        return [4 /*yield*/, this.findDependents(fullPath)];
                    case 5:
                        dependents = _b.sent();
                        return [2 /*return*/, { direct: direct, transitive: transitive, dependents: dependents }];
                    case 6:
                        error_2 = _b.sent();
                        console.error('Error analyzing dependencies:', error_2);
                        return [2 /*return*/, { direct: [], transitive: [], dependents: [] }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ContextManager.prototype.getProjectPatterns = function () {
        return __awaiter(this, arguments, void 0, function (analysisType) {
            var analysis, architecture, conventions, designPatterns, result, error_3;
            if (analysisType === void 0) { analysisType = 'all'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.workspaceIndexer.analyzeWorkspace({ includeContent: true })];
                    case 1:
                        analysis = _a.sent();
                        return [4 /*yield*/, this.analyzeArchitecturePatterns()];
                    case 2:
                        architecture = _a.sent();
                        return [4 /*yield*/, this.analyzeCodeConventions()];
                    case 3:
                        conventions = _a.sent();
                        return [4 /*yield*/, this.analyzeDesignPatterns()];
                    case 4:
                        designPatterns = _a.sent();
                        result = {
                            architecture: analysisType === 'all' || analysisType === 'architecture' ? architecture : [],
                            conventions: analysisType === 'all' || analysisType === 'conventions' ? conventions : [],
                            designPatterns: analysisType === 'all' || analysisType === 'patterns' ? designPatterns : [],
                        };
                        return [2 /*return*/, result];
                    case 5:
                        error_3 = _a.sent();
                        console.error('Error analyzing patterns:', error_3);
                        return [2 /*return*/, { architecture: [], conventions: [], designPatterns: [] }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ContextManager.prototype.getContextSummary = function () {
        return __awaiter(this, arguments, void 0, function (options) {
            var analysis, summary, _a, _b, error_4;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.workspaceIndexer.analyzeWorkspace({
                                includeContent: options.includeExamples
                            })];
                    case 1:
                        analysis = _c.sent();
                        summary = "# Workspace Context Summary\n\n## Project Overview\nThis workspace contains **".concat(analysis.totalFiles, " files** across **").concat(analysis.totalDirectories, " directories**, primarily using **").concat(analysis.languages.join(', '), "**.\n\n## Technologies & Frameworks\n").concat(analysis.technologies.map(function (tech) { return "- **".concat(tech.name, "**: ").concat(tech.description); }).join('\n'), "\n\n## Architecture & Structure\n").concat(analysis.keyDirectories.map(function (dir) { return "- **".concat(dir.path, "**: ").concat(dir.description); }).join('\n'), "\n\n## File Distribution\n").concat(analysis.fileDistribution.slice(0, 10).map(function (item) { return "- **".concat(item.extension || 'no extension', "**: ").concat(item.count, " files"); }).join('\n'), "\n");
                        if (!options.focusArea) return [3 /*break*/, 3];
                        _a = summary;
                        return [4 /*yield*/, this.getFocusAreaContext(options.focusArea)];
                    case 2:
                        summary = _a + _c.sent();
                        _c.label = 3;
                    case 3:
                        if (options.includeExamples && analysis.codePatterns) {
                            summary += "\n## Code Patterns\n".concat(analysis.codePatterns.join('\n\n'));
                        }
                        // Add contextual recommendations
                        _b = summary;
                        return [4 /*yield*/, this.getContextualRecommendations(analysis)];
                    case 4:
                        // Add contextual recommendations
                        summary = _b + _c.sent();
                        return [2 /*return*/, summary];
                    case 5:
                        error_4 = _c.sent();
                        console.error('Error generating context summary:', error_4);
                        return [2 /*return*/, 'Error generating context summary.'];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ContextManager.prototype.suggestImprovements = function () {
        return __awaiter(this, arguments, void 0, function (scope) {
            var improvements, analysis, _a, _b, _c, _d, _e, _f, _g, _h, _j, error_5;
            if (scope === void 0) { scope = 'all'; }
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        improvements = [];
                        _k.label = 1;
                    case 1:
                        _k.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, this.workspaceIndexer.analyzeWorkspace({ includeContent: true })];
                    case 2:
                        analysis = _k.sent();
                        if (!(scope === 'all' || scope === 'security')) return [3 /*break*/, 4];
                        _b = (_a = improvements.push).apply;
                        _c = [improvements];
                        return [4 /*yield*/, this.analyzeSecurityImprovements()];
                    case 3:
                        _b.apply(_a, _c.concat([_k.sent()]));
                        _k.label = 4;
                    case 4:
                        if (!(scope === 'all' || scope === 'performance')) return [3 /*break*/, 6];
                        _e = (_d = improvements.push).apply;
                        _f = [improvements];
                        return [4 /*yield*/, this.analyzePerformanceImprovements()];
                    case 5:
                        _e.apply(_d, _f.concat([_k.sent()]));
                        _k.label = 6;
                    case 6:
                        if (!(scope === 'all' || scope === 'maintainability')) return [3 /*break*/, 8];
                        _h = (_g = improvements.push).apply;
                        _j = [improvements];
                        return [4 /*yield*/, this.analyzeMaintainabilityImprovements()];
                    case 7:
                        _h.apply(_g, _j.concat([_k.sent()]));
                        _k.label = 8;
                    case 8: return [2 /*return*/, improvements.sort(function (a, b) {
                            var priorityOrder = { high: 3, medium: 2, low: 1 };
                            return priorityOrder[b.priority] - priorityOrder[a.priority];
                        })];
                    case 9:
                        error_5 = _k.sent();
                        console.error('Error suggesting improvements:', error_5);
                        return [2 /*return*/, []];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ContextManager.prototype.isRegexPattern = function (query) {
        try {
            new RegExp(query);
            return query.includes('(') || query.includes('[') || query.includes('*') || query.includes('+') || query.includes('?');
        }
        catch (_a) {
            return false;
        }
    };
    ContextManager.prototype.getLanguageFromExtension = function (ext) {
        var languageMap = {
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.py': 'python',
            '.java': 'java',
            '.cpp': 'cpp',
            '.c': 'c',
            '.cs': 'csharp',
            '.php': 'php',
            '.rb': 'ruby',
            '.go': 'go',
            '.rs': 'rust',
            '.swift': 'swift',
            '.kt': 'kotlin',
            '.css': 'css',
            '.scss': 'scss',
            '.html': 'html',
            '.vue': 'vue',
            '.svelte': 'svelte',
            '.md': 'markdown',
            '.json': 'json',
            '.yaml': 'yaml',
            '.yml': 'yaml',
        };
        return languageMap[ext] || 'text';
    };
    ContextManager.prototype.extractDirectDependencies = function (content, filePath) {
        var dependencies = [];
        var ext = path.extname(filePath);
        if (['.js', '.ts', '.jsx', '.tsx'].includes(ext)) {
            // JavaScript/TypeScript imports
            var importRegex = /import.*from\s+['"`]([^'"`]+)['"`]/g;
            var requireRegex = /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
            var match = void 0;
            while ((match = importRegex.exec(content)) !== null) {
                dependencies.push(match[1]);
            }
            while ((match = requireRegex.exec(content)) !== null) {
                dependencies.push(match[1]);
            }
        }
        else if (ext === '.py') {
            // Python imports
            var importRegex = /(?:from\s+(\S+)\s+import|import\s+(\S+))/g;
            var match = void 0;
            while ((match = importRegex.exec(content)) !== null) {
                dependencies.push(match[1] || match[2]);
            }
        }
        return Array.from(new Set(dependencies));
    };
    ContextManager.prototype.extractTransitiveDependencies = function (directDeps) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // This is a simplified implementation
                // In a real scenario, you'd need to parse package.json, requirements.txt, etc.
                return [2 /*return*/, []];
            });
        });
    };
    ContextManager.prototype.findDependents = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var dependents, files, relativePath, baseName, _i, files_2, file, content, relativeImport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dependents = [];
                        return [4 /*yield*/, this.workspaceIndexer.getAllFiles(['.js', '.ts', '.jsx', '.tsx', '.py'])];
                    case 1:
                        files = _a.sent();
                        relativePath = path.relative(process.cwd(), filePath);
                        baseName = path.basename(filePath, path.extname(filePath));
                        _i = 0, files_2 = files;
                        _a.label = 2;
                    case 2:
                        if (!(_i < files_2.length)) return [3 /*break*/, 5];
                        file = files_2[_i];
                        if (file === filePath)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, this.workspaceIndexer.getFileContent(file)];
                    case 3:
                        content = _a.sent();
                        relativeImport = path.relative(path.dirname(file), filePath);
                        if (content.includes(relativePath) ||
                            content.includes(relativeImport) ||
                            content.includes(baseName)) {
                            dependents.push(path.relative(process.cwd(), file));
                        }
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, dependents];
                }
            });
        });
    };
    ContextManager.prototype.analyzeArchitecturePatterns = function () {
        return __awaiter(this, void 0, void 0, function () {
            var patterns, analysis;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        patterns = [];
                        return [4 /*yield*/, this.workspaceIndexer.analyzeWorkspace()];
                    case 1:
                        analysis = _a.sent();
                        // Detect common architectural patterns
                        if (analysis.keyDirectories.some(function (dir) { return dir.path.includes('components'); })) {
                            patterns.push({
                                name: 'Component-Based Architecture',
                                description: 'Uses reusable components for UI construction',
                                usage: 'Modular component structure detected',
                                examples: analysis.keyDirectories.filter(function (dir) { return dir.path.includes('components'); }).map(function (dir) { return dir.path; }),
                            });
                        }
                        if (analysis.keyDirectories.some(function (dir) { return dir.path.includes('pages') || dir.path.includes('views'); })) {
                            patterns.push({
                                name: 'Page/View Based Routing',
                                description: 'File-based routing system with dedicated page components',
                                usage: 'Page-based navigation structure',
                                examples: analysis.keyDirectories.filter(function (dir) { return dir.path.includes('pages') || dir.path.includes('views'); }).map(function (dir) { return dir.path; }),
                            });
                        }
                        return [2 /*return*/, patterns];
                }
            });
        });
    };
    ContextManager.prototype.analyzeCodeConventions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, [
                        { type: 'File Naming', description: 'Uses camelCase for most files' },
                        { type: 'Directory Structure', description: 'Follows standard project layout conventions' },
                        { type: 'Import Style', description: 'Uses ES6 import/export syntax' },
                    ]];
            });
        });
    };
    ContextManager.prototype.analyzeDesignPatterns = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, [
                        { name: 'Module Pattern', description: 'Code organized in modular structure' },
                        { name: 'Factory Pattern', description: 'Used for creating objects dynamically' },
                    ]];
            });
        });
    };
    ContextManager.prototype.getFocusAreaContext = function (focusArea) {
        return __awaiter(this, void 0, void 0, function () {
            var files, relevantFiles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.workspaceIndexer.getAllFiles()];
                    case 1:
                        files = _a.sent();
                        relevantFiles = files.filter(function (file) {
                            var pathLower = file.toLowerCase();
                            return pathLower.includes(focusArea.toLowerCase());
                        });
                        if (relevantFiles.length === 0) {
                            return [2 /*return*/, "\n## ".concat(focusArea, " Focus Area\nNo specific files found for this focus area.")];
                        }
                        return [2 /*return*/, "\n## ".concat(focusArea, " Focus Area\n").concat(relevantFiles.slice(0, 10).map(function (file) { return "- ".concat(path.relative(process.cwd(), file)); }).join('\n'))];
                }
            });
        });
    };
    ContextManager.prototype.getContextualRecommendations = function (analysis) {
        return __awaiter(this, void 0, void 0, function () {
            var recommendations;
            return __generator(this, function (_a) {
                recommendations = [];
                if (analysis.technologies.some(function (tech) { return tech.name === 'TypeScript'; })) {
                    recommendations.push('✅ TypeScript detected - Strong type safety in place');
                }
                if (analysis.keyDirectories.some(function (dir) { return dir.path.includes('test'); })) {
                    recommendations.push('✅ Test directory found - Good testing structure');
                }
                else {
                    recommendations.push('⚠️ Consider adding a dedicated test directory');
                }
                if (analysis.technologies.some(function (tech) { return tech.name === 'Docker'; })) {
                    recommendations.push('✅ Docker configuration found - Containerization ready');
                }
                return [2 /*return*/, "\n## Recommendations\n".concat(recommendations.join('\n'))];
            });
        });
    };
    ContextManager.prototype.analyzeSecurityImprovements = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, [
                        {
                            category: 'Security',
                            title: 'Add Environment Variable Validation',
                            priority: 'high',
                            impact: 'Prevents security vulnerabilities from missing configurations',
                            description: 'Implement validation for required environment variables',
                            actions: [
                                'Create environment variable schema',
                                'Add validation at application startup',
                                'Provide clear error messages for missing variables'
                            ],
                            codeExample: "// Example validation\nconst requiredEnvVars = ['API_KEY', 'DATABASE_URL'];\nrequiredEnvVars.forEach(envVar => {\n  if (!process.env[envVar]) {\n    throw new Error(`Missing required environment variable: ${envVar}`);\n  }\n});",
                            language: 'javascript'
                        }
                    ]];
            });
        });
    };
    ContextManager.prototype.analyzePerformanceImprovements = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, [
                        {
                            category: 'Performance',
                            title: 'Implement Code Splitting',
                            priority: 'medium',
                            impact: 'Reduces initial bundle size and improves load times',
                            description: 'Split large bundles into smaller, loadable chunks',
                            actions: [
                                'Identify large dependencies',
                                'Implement dynamic imports',
                                'Configure bundler for optimal splitting'
                            ]
                        }
                    ]];
            });
        });
    };
    ContextManager.prototype.analyzeMaintainabilityImprovements = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, [
                        {
                            category: 'Maintainability',
                            title: 'Add Code Documentation',
                            priority: 'medium',
                            impact: 'Improves code understanding and onboarding',
                            description: 'Add comprehensive documentation for key modules',
                            actions: [
                                'Document public APIs',
                                'Add inline comments for complex logic',
                                'Create README files for major components'
                            ]
                        }
                    ]];
            });
        });
    };
    return ContextManager;
}());
exports.ContextManager = ContextManager;
