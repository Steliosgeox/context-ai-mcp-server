"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.WorkspaceIndexer = void 0;
var fs_extra_1 = require("fs-extra");
var path = require("path");
var fast_glob_1 = require("fast-glob");
var ignore_1 = require("ignore");
var WorkspaceIndexer = /** @class */ (function () {
    function WorkspaceIndexer(workspacePath) {
        this.cache = new Map();
        this.workspacePath = workspacePath;
        this.loadGitignore();
    }
    WorkspaceIndexer.prototype.loadGitignore = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gitignorePath, gitignoreContent, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        gitignorePath = path.join(this.workspacePath, '.gitignore');
                        return [4 /*yield*/, fs_extra_1.default.pathExists(gitignorePath)];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, fs_extra_1.default.readFile(gitignorePath, 'utf-8')];
                    case 2:
                        gitignoreContent = _a.sent();
                        this.gitignore = (0, ignore_1.default)().add(gitignoreContent);
                        return [3 /*break*/, 4];
                    case 3:
                        this.gitignore = (0, ignore_1.default)();
                        _a.label = 4;
                    case 4:
                        // Add common ignore patterns
                        this.gitignore.add([
                            'node_modules/**',
                            '.git/**',
                            'dist/**',
                            'build/**',
                            '.vscode/**',
                            '*.log',
                            '.DS_Store',
                        ]);
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.error('Error loading .gitignore:', error_1);
                        this.gitignore = (0, ignore_1.default)();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    WorkspaceIndexer.prototype.getAllFiles = function (extensions) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, pattern, files, filteredFiles, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "files_".concat((extensions === null || extensions === void 0 ? void 0 : extensions.join(',')) || 'all');
                        if (this.cache.has(cacheKey)) {
                            return [2 /*return*/, this.cache.get(cacheKey)];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        pattern = extensions
                            ? "**/*.{".concat(extensions.map(function (ext) { return ext.replace('.', ''); }).join(','), "}")
                            : '**/*';
                        return [4 /*yield*/, (0, fast_glob_1.default)(pattern, {
                                cwd: this.workspacePath,
                                absolute: true,
                                onlyFiles: true,
                                dot: false,
                            })];
                    case 2:
                        files = _a.sent();
                        filteredFiles = files.filter(function (file) {
                            var relativePath = path.relative(_this.workspacePath, file);
                            return !_this.gitignore.ignores(relativePath);
                        });
                        this.cache.set(cacheKey, filteredFiles);
                        return [2 /*return*/, filteredFiles];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error getting files:', error_2);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WorkspaceIndexer.prototype.analyzeWorkspace = function () {
        return __awaiter(this, arguments, void 0, function (options) {
            var cacheKey, files, directories, extensionCounts_1, languages_1, fileDistribution, keyDirectories, technologies, codePatterns, analysis, error_3;
            var _this = this;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheKey = "analysis_".concat(JSON.stringify(options));
                        if (this.cache.has(cacheKey)) {
                            return [2 /*return*/, this.cache.get(cacheKey)];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, this.getAllFiles()];
                    case 2:
                        files = _a.sent();
                        return [4 /*yield*/, this.getDirectories()];
                    case 3:
                        directories = _a.sent();
                        extensionCounts_1 = new Map();
                        languages_1 = new Set();
                        files.forEach(function (file) {
                            var ext = path.extname(file).toLowerCase();
                            extensionCounts_1.set(ext, (extensionCounts_1.get(ext) || 0) + 1);
                            var language = _this.getLanguageFromExtension(ext);
                            if (language) {
                                languages_1.add(language);
                            }
                        });
                        fileDistribution = Array.from(extensionCounts_1.entries())
                            .map(function (_a) {
                            var extension = _a[0], count = _a[1];
                            return ({ extension: extension || 'no extension', count: count });
                        })
                            .sort(function (a, b) { return b.count - a.count; });
                        return [4 /*yield*/, this.identifyKeyDirectories()];
                    case 4:
                        keyDirectories = _a.sent();
                        return [4 /*yield*/, this.detectTechnologies()];
                    case 5:
                        technologies = _a.sent();
                        codePatterns = void 0;
                        if (!options.includeContent) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.extractCodePatterns()];
                    case 6:
                        codePatterns = _a.sent();
                        _a.label = 7;
                    case 7:
                        analysis = __assign({ totalFiles: files.length, totalDirectories: directories.length, languages: Array.from(languages_1), fileDistribution: fileDistribution, keyDirectories: keyDirectories, technologies: technologies }, (codePatterns && { codePatterns: codePatterns }));
                        this.cache.set(cacheKey, analysis);
                        return [2 /*return*/, analysis];
                    case 8:
                        error_3 = _a.sent();
                        console.error('Error analyzing workspace:', error_3);
                        throw error_3;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    WorkspaceIndexer.prototype.getDirectories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dirs, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, fast_glob_1.default)('**/', {
                                cwd: this.workspacePath,
                                absolute: true,
                                onlyDirectories: true,
                            })];
                    case 1:
                        dirs = _a.sent();
                        return [2 /*return*/, dirs.filter(function (dir) {
                                var relativePath = path.relative(_this.workspacePath, dir);
                                return !_this.gitignore.ignores(relativePath);
                            })];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error getting directories:', error_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WorkspaceIndexer.prototype.getLanguageFromExtension = function (ext) {
        var languageMap = {
            '.js': 'JavaScript',
            '.jsx': 'JavaScript (React)',
            '.ts': 'TypeScript',
            '.tsx': 'TypeScript (React)',
            '.py': 'Python',
            '.java': 'Java',
            '.cpp': 'C++',
            '.c': 'C',
            '.cs': 'C#',
            '.php': 'PHP',
            '.rb': 'Ruby',
            '.go': 'Go',
            '.rs': 'Rust',
            '.swift': 'Swift',
            '.kt': 'Kotlin',
            '.scala': 'Scala',
            '.css': 'CSS',
            '.scss': 'SCSS',
            '.sass': 'Sass',
            '.less': 'Less',
            '.html': 'HTML',
            '.vue': 'Vue.js',
            '.svelte': 'Svelte',
            '.md': 'Markdown',
            '.json': 'JSON',
            '.yaml': 'YAML',
            '.yml': 'YAML',
            '.xml': 'XML',
            '.sql': 'SQL',
            '.sh': 'Shell Script',
            '.ps1': 'PowerShell',
            '.dockerfile': 'Docker',
        };
        return languageMap[ext] || null;
    };
    WorkspaceIndexer.prototype.identifyKeyDirectories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var directories, keyDirs, _i, directories_1, dir, relativePath, dirName, description;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDirectories()];
                    case 1:
                        directories = _a.sent();
                        keyDirs = [];
                        for (_i = 0, directories_1 = directories; _i < directories_1.length; _i++) {
                            dir = directories_1[_i];
                            relativePath = path.relative(this.workspacePath, dir);
                            dirName = path.basename(dir);
                            description = '';
                            // Common directory patterns
                            if (dirName === 'src' || dirName === 'source') {
                                description = 'Source code directory';
                            }
                            else if (dirName === 'test' || dirName === 'tests' || dirName === '__tests__') {
                                description = 'Test files directory';
                            }
                            else if (dirName === 'docs' || dirName === 'documentation') {
                                description = 'Documentation directory';
                            }
                            else if (dirName === 'public' || dirName === 'static') {
                                description = 'Static assets directory';
                            }
                            else if (dirName === 'lib' || dirName === 'libs') {
                                description = 'Library files directory';
                            }
                            else if (dirName === 'components') {
                                description = 'Reusable components directory';
                            }
                            else if (dirName === 'pages' || dirName === 'views') {
                                description = 'Page/view components directory';
                            }
                            else if (dirName === 'utils' || dirName === 'utilities') {
                                description = 'Utility functions directory';
                            }
                            else if (dirName === 'config' || dirName === 'configuration') {
                                description = 'Configuration files directory';
                            }
                            else if (dirName === 'assets') {
                                description = 'Asset files directory';
                            }
                            else if (dirName === 'types') {
                                description = 'Type definitions directory';
                            }
                            else if (dirName === 'hooks') {
                                description = 'Custom hooks directory';
                            }
                            else if (dirName === 'api') {
                                description = 'API related files directory';
                            }
                            if (description) {
                                keyDirs.push({ path: relativePath, description: description });
                            }
                        }
                        return [2 /*return*/, keyDirs];
                }
            });
        });
    };
    WorkspaceIndexer.prototype.detectTechnologies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var technologies, packageJsonPath, packageJson, deps, requirementsPath, pyprojectPath, _a, dockerfilePath, k8sFiles, _i, k8sFiles_1, file, content, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        technologies = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 14, , 15]);
                        packageJsonPath = path.join(this.workspacePath, 'package.json');
                        return [4 /*yield*/, fs_extra_1.default.pathExists(packageJsonPath)];
                    case 2:
                        if (!_b.sent()) return [3 /*break*/, 4];
                        return [4 /*yield*/, fs_extra_1.default.readJson(packageJsonPath)];
                    case 3:
                        packageJson = _b.sent();
                        deps = __assign(__assign({}, packageJson.dependencies), packageJson.devDependencies);
                        // Framework detection
                        if (deps.react)
                            technologies.push({ name: 'React', description: 'JavaScript UI library' });
                        if (deps.vue)
                            technologies.push({ name: 'Vue.js', description: 'Progressive JavaScript framework' });
                        if (deps.angular)
                            technologies.push({ name: 'Angular', description: 'TypeScript web framework' });
                        if (deps.svelte)
                            technologies.push({ name: 'Svelte', description: 'Compile-time JavaScript framework' });
                        if (deps.next)
                            technologies.push({ name: 'Next.js', description: 'React production framework' });
                        if (deps.nuxt)
                            technologies.push({ name: 'Nuxt.js', description: 'Vue.js production framework' });
                        if (deps.express)
                            technologies.push({ name: 'Express.js', description: 'Node.js web framework' });
                        if (deps.fastify)
                            technologies.push({ name: 'Fastify', description: 'Fast Node.js web framework' });
                        // Build tools
                        if (deps.webpack)
                            technologies.push({ name: 'Webpack', description: 'Module bundler' });
                        if (deps.vite)
                            technologies.push({ name: 'Vite', description: 'Fast build tool' });
                        if (deps.rollup)
                            technologies.push({ name: 'Rollup', description: 'Module bundler' });
                        if (deps.parcel)
                            technologies.push({ name: 'Parcel', description: 'Zero-config build tool' });
                        // Testing
                        if (deps.jest)
                            technologies.push({ name: 'Jest', description: 'JavaScript testing framework' });
                        if (deps.vitest)
                            technologies.push({ name: 'Vitest', description: 'Vite-native testing framework' });
                        if (deps.cypress)
                            technologies.push({ name: 'Cypress', description: 'End-to-end testing' });
                        if (deps.playwright)
                            technologies.push({ name: 'Playwright', description: 'Browser automation' });
                        // TypeScript
                        if (deps.typescript)
                            technologies.push({ name: 'TypeScript', description: 'Typed JavaScript' });
                        _b.label = 4;
                    case 4:
                        requirementsPath = path.join(this.workspacePath, 'requirements.txt');
                        pyprojectPath = path.join(this.workspacePath, 'pyproject.toml');
                        return [4 /*yield*/, fs_extra_1.default.pathExists(requirementsPath)];
                    case 5:
                        _a = (_b.sent());
                        if (_a) return [3 /*break*/, 7];
                        return [4 /*yield*/, fs_extra_1.default.pathExists(pyprojectPath)];
                    case 6:
                        _a = (_b.sent());
                        _b.label = 7;
                    case 7:
                        if (_a) {
                            technologies.push({ name: 'Python', description: 'Python project detected' });
                        }
                        dockerfilePath = path.join(this.workspacePath, 'Dockerfile');
                        return [4 /*yield*/, fs_extra_1.default.pathExists(dockerfilePath)];
                    case 8:
                        if (_b.sent()) {
                            technologies.push({ name: 'Docker', description: 'Containerization technology' });
                        }
                        return [4 /*yield*/, (0, fast_glob_1.default)('**/*.{yaml,yml}', { cwd: this.workspacePath })];
                    case 9:
                        k8sFiles = _b.sent();
                        _i = 0, k8sFiles_1 = k8sFiles;
                        _b.label = 10;
                    case 10:
                        if (!(_i < k8sFiles_1.length)) return [3 /*break*/, 13];
                        file = k8sFiles_1[_i];
                        return [4 /*yield*/, fs_extra_1.default.readFile(path.join(this.workspacePath, file), 'utf-8')];
                    case 11:
                        content = _b.sent();
                        if (content.includes('apiVersion:') && content.includes('kind:')) {
                            technologies.push({ name: 'Kubernetes', description: 'Container orchestration' });
                            return [3 /*break*/, 13];
                        }
                        _b.label = 12;
                    case 12:
                        _i++;
                        return [3 /*break*/, 10];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        error_5 = _b.sent();
                        console.error('Error detecting technologies:', error_5);
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/, technologies];
                }
            });
        });
    };
    WorkspaceIndexer.prototype.extractCodePatterns = function () {
        return __awaiter(this, void 0, void 0, function () {
            var patterns, jsFiles, _i, _a, file, content, imports, exports_1, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        patterns = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, this.getAllFiles(['.js', '.ts', '.jsx', '.tsx'])];
                    case 2:
                        jsFiles = _b.sent();
                        _i = 0, _a = jsFiles.slice(0, 10);
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        file = _a[_i];
                        return [4 /*yield*/, fs_extra_1.default.readFile(file, 'utf-8')];
                    case 4:
                        content = _b.sent();
                        imports = content.match(/^import.*from.*$/gm);
                        if (imports && imports.length > 0) {
                            patterns.push("# Import Pattern (".concat(path.basename(file), "):\n```typescript\n").concat(imports.slice(0, 3).join('\n'), "\n```"));
                        }
                        exports_1 = content.match(/^export.*$/gm);
                        if (exports_1 && exports_1.length > 0) {
                            patterns.push("# Export Pattern (".concat(path.basename(file), "):\n```typescript\n").concat(exports_1.slice(0, 2).join('\n'), "\n```"));
                        }
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_6 = _b.sent();
                        console.error('Error extracting code patterns:', error_6);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, patterns.slice(0, 5)]; // Limit to 5 patterns
                }
            });
        });
    };
    WorkspaceIndexer.prototype.getFileContent = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs_extra_1.default.readFile(filePath, 'utf-8')];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        console.error("Error reading file ".concat(filePath, ":"), error_7);
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WorkspaceIndexer.prototype.searchInFile = function (filePath, query) {
        return __awaiter(this, void 0, void 0, function () {
            var content, lines, matches_1, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getFileContent(filePath)];
                    case 1:
                        content = _a.sent();
                        lines = content.split('\n');
                        matches_1 = [];
                        lines.forEach(function (line, index) {
                            var lineNumber = index + 1;
                            var match = null;
                            if (typeof query === 'string') {
                                if (line.toLowerCase().includes(query.toLowerCase())) {
                                    match = [query];
                                }
                            }
                            else {
                                match = line.match(query);
                            }
                            if (match) {
                                matches_1.push({
                                    line: lineNumber,
                                    content: line.trim(),
                                    match: match[0],
                                });
                            }
                        });
                        return [2 /*return*/, matches_1];
                    case 2:
                        error_8 = _a.sent();
                        console.error("Error searching in file ".concat(filePath, ":"), error_8);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return WorkspaceIndexer;
}());
exports.WorkspaceIndexer = WorkspaceIndexer;
