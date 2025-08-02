"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptTemplates = void 0;
var PromptTemplates = /** @class */ (function () {
    function PromptTemplates() {
        this.templates = [
            {
                name: 'analyze_codebase',
                description: 'Comprehensive codebase analysis prompt',
                arguments: [
                    {
                        name: 'focus',
                        description: 'Specific aspect to focus analysis on',
                        required: false,
                    },
                ],
            },
            {
                name: 'code_review',
                description: 'Code review checklist and guidelines',
                arguments: [
                    {
                        name: 'language',
                        description: 'Programming language to focus on',
                        required: false,
                    },
                ],
            },
            {
                name: 'architecture_review',
                description: 'System architecture analysis and recommendations',
            },
            {
                name: 'security_audit',
                description: 'Security-focused code analysis',
            },
            {
                name: 'performance_optimization',
                description: 'Performance improvement suggestions',
            },
            {
                name: 'refactoring_suggestions',
                description: 'Code refactoring recommendations',
                arguments: [
                    {
                        name: 'target_file',
                        description: 'Specific file to focus refactoring on',
                        required: false,
                    },
                ],
            },
        ];
    }
    PromptTemplates.prototype.getAllPrompts = function () {
        return this.templates;
    };
    PromptTemplates.prototype.getPrompt = function (name, args) {
        var template = this.templates.find(function (t) { return t.name === name; });
        if (!template) {
            throw new Error("Prompt template '".concat(name, "' not found"));
        }
        var messages = this.generatePromptMessages(name, args);
        return {
            description: template.description,
            messages: messages,
        };
    };
    PromptTemplates.prototype.generatePromptMessages = function (name, args) {
        switch (name) {
            case 'analyze_codebase':
                return [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: this.getCodebaseAnalysisPrompt(args === null || args === void 0 ? void 0 : args.focus),
                        },
                    },
                ];
            case 'code_review':
                return [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: this.getCodeReviewPrompt(args === null || args === void 0 ? void 0 : args.language),
                        },
                    },
                ];
            case 'architecture_review':
                return [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: this.getArchitectureReviewPrompt(),
                        },
                    },
                ];
            case 'security_audit':
                return [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: this.getSecurityAuditPrompt(),
                        },
                    },
                ];
            case 'performance_optimization':
                return [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: this.getPerformanceOptimizationPrompt(),
                        },
                    },
                ];
            case 'refactoring_suggestions':
                return [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: this.getRefactoringSuggestionsPrompt(args === null || args === void 0 ? void 0 : args.target_file),
                        },
                    },
                ];
            default:
                throw new Error("Unknown prompt: ".concat(name));
        }
    };
    PromptTemplates.prototype.getCodebaseAnalysisPrompt = function (focus) {
        var focusSection = focus ? "\n\nPlease focus particularly on: ".concat(focus) : '';
        return "# Comprehensive Codebase Analysis\n\nPlease provide a thorough analysis of this codebase including:\n\n## Architecture & Structure\n- Overall project architecture and design patterns\n- Directory structure and organization\n- Module dependencies and relationships\n- Separation of concerns and layer architecture\n\n## Code Quality\n- Code consistency and style\n- Best practices adherence\n- Error handling patterns\n- Testing coverage and quality\n\n## Technologies & Frameworks\n- Technology stack analysis\n- Framework usage patterns\n- Library choices and their appropriateness\n- Version compatibility and updates needed\n\n## Maintainability\n- Code readability and documentation\n- Complexity analysis\n- Technical debt identification\n- Refactoring opportunities\n\n## Performance & Optimization\n- Performance bottlenecks\n- Resource usage patterns\n- Optimization opportunities\n- Scalability considerations\n\n## Security\n- Security vulnerabilities\n- Authentication and authorization patterns\n- Data validation and sanitization\n- Secure coding practices\n\n## Recommendations\n- Improvement suggestions\n- Best practices to implement\n- Tools and processes to adopt\n- Migration or upgrade paths".concat(focusSection, "\n\nPlease use the available MCP tools to gather comprehensive context about the workspace and provide specific, actionable insights.");
    };
    PromptTemplates.prototype.getCodeReviewPrompt = function (language) {
        var languageSection = language ? "\n\nFocus on ".concat(language, "-specific best practices and patterns.") : '';
        return "# Code Review Checklist & Guidelines\n\nPlease conduct a thorough code review focusing on:\n\n## Code Quality Standards\n- [ ] **Readability**: Code is clear and self-documenting\n- [ ] **Consistency**: Follows established coding conventions\n- [ ] **Naming**: Variables, functions, and classes have meaningful names\n- [ ] **Comments**: Complex logic is properly documented\n- [ ] **Function Size**: Functions are focused and reasonably sized\n\n## Logic & Functionality\n- [ ] **Correctness**: Code logic is sound and handles edge cases\n- [ ] **Error Handling**: Proper exception handling and error messages\n- [ ] **Input Validation**: User inputs are validated and sanitized\n- [ ] **Business Logic**: Implementation matches requirements\n- [ ] **Data Flow**: Clear data flow and state management\n\n## Performance & Efficiency\n- [ ] **Algorithms**: Efficient algorithms and data structures\n- [ ] **Resource Usage**: Memory and CPU usage optimization\n- [ ] **Database Queries**: Optimized database interactions\n- [ ] **Caching**: Appropriate use of caching mechanisms\n- [ ] **Async Operations**: Proper handling of asynchronous code\n\n## Security Considerations\n- [ ] **Authentication**: Proper user authentication\n- [ ] **Authorization**: Appropriate access controls\n- [ ] **Data Protection**: Sensitive data is protected\n- [ ] **Input Sanitization**: Prevention of injection attacks\n- [ ] **Dependencies**: Security audit of third-party libraries\n\n## Testing & Documentation\n- [ ] **Test Coverage**: Adequate unit and integration tests\n- [ ] **Test Quality**: Tests are meaningful and maintainable\n- [ ] **Documentation**: Code is properly documented\n- [ ] **API Documentation**: Public interfaces are documented\n- [ ] **README**: Clear setup and usage instructions\n\n## Architecture & Design\n- [ ] **SOLID Principles**: Adherence to design principles\n- [ ] **Design Patterns**: Appropriate use of design patterns\n- [ ] **Modularity**: Code is properly modularized\n- [ ] **Dependencies**: Minimal and appropriate dependencies\n- [ ] **Configuration**: Externalized configuration".concat(languageSection, "\n\nPlease analyze the codebase using MCP tools and provide specific feedback for each relevant category.");
    };
    PromptTemplates.prototype.getArchitectureReviewPrompt = function () {
        return "# System Architecture Review\n\nPlease analyze the system architecture and provide insights on:\n\n## High-Level Architecture\n- **Overall Design**: System architecture pattern (MVC, microservices, layered, etc.)\n- **Component Relationships**: How different parts of the system interact\n- **Data Flow**: How data moves through the system\n- **Service Boundaries**: Clear separation of responsibilities\n\n## Structural Analysis\n- **Layer Architecture**: Presentation, business, data access layers\n- **Module Organization**: How code is organized into modules/packages\n- **Dependency Management**: Dependencies between components\n- **Interface Design**: APIs and contracts between components\n\n## Scalability & Performance\n- **Horizontal Scaling**: Can the system scale out?\n- **Vertical Scaling**: Can the system scale up?\n- **Performance Bottlenecks**: Potential performance issues\n- **Resource Utilization**: Efficient use of system resources\n\n## Maintainability & Extensibility\n- **Code Organization**: Is the code well-organized?\n- **Separation of Concerns**: Clear responsibility boundaries\n- **Extensibility**: How easy is it to add new features?\n- **Technical Debt**: Areas needing refactoring\n\n## Technology Choices\n- **Framework Selection**: Appropriateness of chosen frameworks\n- **Database Design**: Data storage and access patterns\n- **External Dependencies**: Third-party service integrations\n- **Tool Ecosystem**: Development and deployment tools\n\n## Recommendations\n- **Immediate Improvements**: Quick wins for better architecture\n- **Long-term Strategy**: Strategic architectural improvements\n- **Risk Mitigation**: Addressing architectural risks\n- **Best Practices**: Industry standard practices to adopt\n\nUse MCP tools to analyze the workspace structure, dependencies, and patterns to provide comprehensive architectural insights.";
    };
    PromptTemplates.prototype.getSecurityAuditPrompt = function () {
        return "# Security Audit & Analysis\n\nPlease conduct a comprehensive security analysis focusing on:\n\n## Authentication & Authorization\n- **User Authentication**: How users are authenticated\n- **Session Management**: Session handling and security\n- **Access Control**: Role-based or attribute-based access control\n- **Password Security**: Password policies and storage\n- **Multi-factor Authentication**: MFA implementation\n\n## Data Protection\n- **Data Encryption**: Encryption at rest and in transit\n- **Sensitive Data**: Handling of PII, secrets, and credentials\n- **Data Validation**: Input validation and sanitization\n- **Data Leakage**: Prevention of sensitive data exposure\n- **Privacy Compliance**: GDPR, CCPA, and other regulations\n\n## Application Security\n- **Input Validation**: SQL injection, XSS prevention\n- **CSRF Protection**: Cross-site request forgery prevention\n- **API Security**: API authentication and rate limiting\n- **File Upload Security**: Safe file handling\n- **Error Handling**: Secure error messages\n\n## Infrastructure Security\n- **Configuration Security**: Secure system configuration\n- **Dependency Management**: Third-party library security\n- **Environment Variables**: Secure secret management\n- **Logging**: Security event logging\n- **Monitoring**: Security monitoring and alerting\n\n## Code Security Patterns\n- **Secure Coding**: Following secure coding practices\n- **Code Injection**: Prevention of code injection attacks\n- **Cryptography**: Proper use of cryptographic functions\n- **Random Numbers**: Secure random number generation\n- **Memory Management**: Memory safety considerations\n\n## Compliance & Standards\n- **Security Standards**: OWASP, NIST guidelines\n- **Compliance Requirements**: Industry-specific requirements\n- **Security Policies**: Documented security policies\n- **Incident Response**: Security incident procedures\n- **Regular Audits**: Security audit processes\n\nUse MCP tools to scan the codebase for security patterns, vulnerabilities, and compliance with security best practices.";
    };
    PromptTemplates.prototype.getPerformanceOptimizationPrompt = function () {
        return "# Performance Optimization Analysis\n\nPlease analyze the codebase for performance optimization opportunities:\n\n## Algorithm & Data Structure Optimization\n- **Algorithm Complexity**: Time and space complexity analysis\n- **Data Structure Choice**: Optimal data structure selection\n- **Search & Sort Operations**: Efficient searching and sorting\n- **Caching Strategies**: Memory and computational caching\n- **Lazy Loading**: Deferred loading of resources\n\n## Database Performance\n- **Query Optimization**: SQL query performance\n- **Index Usage**: Database index optimization\n- **Connection Pooling**: Database connection management\n- **Data Access Patterns**: Efficient data retrieval\n- **Database Schema**: Normalized vs. denormalized design\n\n## Frontend Performance\n- **Bundle Size**: JavaScript bundle optimization\n- **Code Splitting**: Dynamic import strategies\n- **Asset Optimization**: Image, CSS, JS optimization\n- **Rendering Performance**: DOM manipulation efficiency\n- **Network Requests**: API call optimization\n\n## Backend Performance\n- **Request Processing**: Server request handling\n- **Memory Usage**: Memory allocation and garbage collection\n- **CPU Utilization**: CPU-intensive operation optimization\n- **I/O Operations**: File and network I/O efficiency\n- **Concurrency**: Parallel processing opportunities\n\n## Network & Communication\n- **API Design**: Efficient API structure\n- **Data Transfer**: Minimizing data payload\n- **Compression**: Content compression strategies\n- **CDN Usage**: Content delivery networks\n- **Protocol Optimization**: HTTP/2, WebSocket usage\n\n## Monitoring & Profiling\n- **Performance Metrics**: Key performance indicators\n- **Bottleneck Identification**: Performance bottlenecks\n- **Load Testing**: Performance under load\n- **Real-time Monitoring**: Performance monitoring tools\n- **Optimization Validation**: Measuring improvement impact\n\nUse MCP tools to analyze code patterns, identify performance bottlenecks, and suggest specific optimization strategies.";
    };
    PromptTemplates.prototype.getRefactoringSuggestionsPrompt = function (targetFile) {
        var fileSection = targetFile ? "\n\nFocus specifically on: ".concat(targetFile) : '';
        return "# Code Refactoring Suggestions\n\nPlease analyze the codebase and provide refactoring recommendations:\n\n## Code Structure Improvements\n- **Function Decomposition**: Breaking down large functions\n- **Class Design**: Single responsibility principle adherence\n- **Module Organization**: Better code organization\n- **Duplicate Code**: Code deduplication opportunities\n- **Magic Numbers**: Constants and configuration extraction\n\n## Design Pattern Application\n- **Creational Patterns**: Factory, Builder, Singleton applications\n- **Structural Patterns**: Adapter, Decorator, Facade opportunities\n- **Behavioral Patterns**: Strategy, Observer, Command patterns\n- **Architectural Patterns**: MVC, MVP, MVVM improvements\n- **Anti-pattern Elimination**: Code smell removal\n\n## Code Quality Enhancement\n- **Naming Improvements**: Better variable and function names\n- **Comment Optimization**: Improving code documentation\n- **Error Handling**: Better exception management\n- **Type Safety**: Stronger type definitions\n- **Null Safety**: Null reference prevention\n\n## Maintainability Improvements\n- **Dependency Injection**: Loose coupling implementation\n- **Configuration Management**: Externalized configuration\n- **Logging Enhancement**: Better logging strategies\n- **Testing Improvements**: More testable code structure\n- **Documentation**: Code and API documentation\n\n## Performance Refactoring\n- **Algorithm Optimization**: More efficient algorithms\n- **Memory Management**: Reduced memory footprint\n- **I/O Optimization**: Efficient I/O operations\n- **Caching Implementation**: Strategic caching\n- **Lazy Initialization**: Deferred object creation\n\n## Modern Language Features\n- **Language Upgrades**: Using newer language features\n- **Framework Updates**: Leveraging framework improvements\n- **Library Modernization**: Updating to better libraries\n- **Syntax Improvements**: Cleaner syntax adoption\n- **Tool Integration**: Better development tools\n\nPrioritize refactoring suggestions by impact and effort required.".concat(fileSection, "\n\nUse MCP tools to analyze the current code structure and provide specific, actionable refactoring recommendations.");
    };
    return PromptTemplates;
}());
exports.PromptTemplates = PromptTemplates;
