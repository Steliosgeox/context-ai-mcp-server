export interface PromptTemplate {
  name: string;
  description: string;
  arguments?: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;
}

export class PromptTemplates {
  private templates: PromptTemplate[] = [
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

  getAllPrompts(): PromptTemplate[] {
    return this.templates;
  }

  getPrompt(name: string, args?: Record<string, any>): any {
    const template = this.templates.find(t => t.name === name);
    if (!template) {
      throw new Error(`Prompt template '${name}' not found`);
    }

    const messages = this.generatePromptMessages(name, args);
    
    return {
      description: template.description,
      messages,
    };
  }

  private generatePromptMessages(name: string, args?: Record<string, any>): Array<{ role: string; content: { type: string; text: string } }> {
    switch (name) {
      case 'analyze_codebase':
        return [
          {
            role: 'user',
            content: {
              type: 'text',
              text: this.getCodebaseAnalysisPrompt(args?.focus),
            },
          },
        ];

      case 'code_review':
        return [
          {
            role: 'user',
            content: {
              type: 'text',
              text: this.getCodeReviewPrompt(args?.language),
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
              text: this.getRefactoringSuggestionsPrompt(args?.target_file),
            },
          },
        ];

      default:
        throw new Error(`Unknown prompt: ${name}`);
    }
  }

  private getCodebaseAnalysisPrompt(focus?: string): string {
    const focusSection = focus ? `\n\nPlease focus particularly on: ${focus}` : '';
    
    return `# Comprehensive Codebase Analysis

Please provide a thorough analysis of this codebase including:

## Architecture & Structure
- Overall project architecture and design patterns
- Directory structure and organization
- Module dependencies and relationships
- Separation of concerns and layer architecture

## Code Quality
- Code consistency and style
- Best practices adherence
- Error handling patterns
- Testing coverage and quality

## Technologies & Frameworks
- Technology stack analysis
- Framework usage patterns
- Library choices and their appropriateness
- Version compatibility and updates needed

## Maintainability
- Code readability and documentation
- Complexity analysis
- Technical debt identification
- Refactoring opportunities

## Performance & Optimization
- Performance bottlenecks
- Resource usage patterns
- Optimization opportunities
- Scalability considerations

## Security
- Security vulnerabilities
- Authentication and authorization patterns
- Data validation and sanitization
- Secure coding practices

## Recommendations
- Improvement suggestions
- Best practices to implement
- Tools and processes to adopt
- Migration or upgrade paths${focusSection}

Please use the available MCP tools to gather comprehensive context about the workspace and provide specific, actionable insights.`;
  }

  private getCodeReviewPrompt(language?: string): string {
    const languageSection = language ? `\n\nFocus on ${language}-specific best practices and patterns.` : '';
    
    return `# Code Review Checklist & Guidelines

Please conduct a thorough code review focusing on:

## Code Quality Standards
- [ ] **Readability**: Code is clear and self-documenting
- [ ] **Consistency**: Follows established coding conventions
- [ ] **Naming**: Variables, functions, and classes have meaningful names
- [ ] **Comments**: Complex logic is properly documented
- [ ] **Function Size**: Functions are focused and reasonably sized

## Logic & Functionality
- [ ] **Correctness**: Code logic is sound and handles edge cases
- [ ] **Error Handling**: Proper exception handling and error messages
- [ ] **Input Validation**: User inputs are validated and sanitized
- [ ] **Business Logic**: Implementation matches requirements
- [ ] **Data Flow**: Clear data flow and state management

## Performance & Efficiency
- [ ] **Algorithms**: Efficient algorithms and data structures
- [ ] **Resource Usage**: Memory and CPU usage optimization
- [ ] **Database Queries**: Optimized database interactions
- [ ] **Caching**: Appropriate use of caching mechanisms
- [ ] **Async Operations**: Proper handling of asynchronous code

## Security Considerations
- [ ] **Authentication**: Proper user authentication
- [ ] **Authorization**: Appropriate access controls
- [ ] **Data Protection**: Sensitive data is protected
- [ ] **Input Sanitization**: Prevention of injection attacks
- [ ] **Dependencies**: Security audit of third-party libraries

## Testing & Documentation
- [ ] **Test Coverage**: Adequate unit and integration tests
- [ ] **Test Quality**: Tests are meaningful and maintainable
- [ ] **Documentation**: Code is properly documented
- [ ] **API Documentation**: Public interfaces are documented
- [ ] **README**: Clear setup and usage instructions

## Architecture & Design
- [ ] **SOLID Principles**: Adherence to design principles
- [ ] **Design Patterns**: Appropriate use of design patterns
- [ ] **Modularity**: Code is properly modularized
- [ ] **Dependencies**: Minimal and appropriate dependencies
- [ ] **Configuration**: Externalized configuration${languageSection}

Please analyze the codebase using MCP tools and provide specific feedback for each relevant category.`;
  }

  private getArchitectureReviewPrompt(): string {
    return `# System Architecture Review

Please analyze the system architecture and provide insights on:

## High-Level Architecture
- **Overall Design**: System architecture pattern (MVC, microservices, layered, etc.)
- **Component Relationships**: How different parts of the system interact
- **Data Flow**: How data moves through the system
- **Service Boundaries**: Clear separation of responsibilities

## Structural Analysis
- **Layer Architecture**: Presentation, business, data access layers
- **Module Organization**: How code is organized into modules/packages
- **Dependency Management**: Dependencies between components
- **Interface Design**: APIs and contracts between components

## Scalability & Performance
- **Horizontal Scaling**: Can the system scale out?
- **Vertical Scaling**: Can the system scale up?
- **Performance Bottlenecks**: Potential performance issues
- **Resource Utilization**: Efficient use of system resources

## Maintainability & Extensibility
- **Code Organization**: Is the code well-organized?
- **Separation of Concerns**: Clear responsibility boundaries
- **Extensibility**: How easy is it to add new features?
- **Technical Debt**: Areas needing refactoring

## Technology Choices
- **Framework Selection**: Appropriateness of chosen frameworks
- **Database Design**: Data storage and access patterns
- **External Dependencies**: Third-party service integrations
- **Tool Ecosystem**: Development and deployment tools

## Recommendations
- **Immediate Improvements**: Quick wins for better architecture
- **Long-term Strategy**: Strategic architectural improvements
- **Risk Mitigation**: Addressing architectural risks
- **Best Practices**: Industry standard practices to adopt

Use MCP tools to analyze the workspace structure, dependencies, and patterns to provide comprehensive architectural insights.`;
  }

  private getSecurityAuditPrompt(): string {
    return `# Security Audit & Analysis

Please conduct a comprehensive security analysis focusing on:

## Authentication & Authorization
- **User Authentication**: How users are authenticated
- **Session Management**: Session handling and security
- **Access Control**: Role-based or attribute-based access control
- **Password Security**: Password policies and storage
- **Multi-factor Authentication**: MFA implementation

## Data Protection
- **Data Encryption**: Encryption at rest and in transit
- **Sensitive Data**: Handling of PII, secrets, and credentials
- **Data Validation**: Input validation and sanitization
- **Data Leakage**: Prevention of sensitive data exposure
- **Privacy Compliance**: GDPR, CCPA, and other regulations

## Application Security
- **Input Validation**: SQL injection, XSS prevention
- **CSRF Protection**: Cross-site request forgery prevention
- **API Security**: API authentication and rate limiting
- **File Upload Security**: Safe file handling
- **Error Handling**: Secure error messages

## Infrastructure Security
- **Configuration Security**: Secure system configuration
- **Dependency Management**: Third-party library security
- **Environment Variables**: Secure secret management
- **Logging**: Security event logging
- **Monitoring**: Security monitoring and alerting

## Code Security Patterns
- **Secure Coding**: Following secure coding practices
- **Code Injection**: Prevention of code injection attacks
- **Cryptography**: Proper use of cryptographic functions
- **Random Numbers**: Secure random number generation
- **Memory Management**: Memory safety considerations

## Compliance & Standards
- **Security Standards**: OWASP, NIST guidelines
- **Compliance Requirements**: Industry-specific requirements
- **Security Policies**: Documented security policies
- **Incident Response**: Security incident procedures
- **Regular Audits**: Security audit processes

Use MCP tools to scan the codebase for security patterns, vulnerabilities, and compliance with security best practices.`;
  }

  private getPerformanceOptimizationPrompt(): string {
    return `# Performance Optimization Analysis

Please analyze the codebase for performance optimization opportunities:

## Algorithm & Data Structure Optimization
- **Algorithm Complexity**: Time and space complexity analysis
- **Data Structure Choice**: Optimal data structure selection
- **Search & Sort Operations**: Efficient searching and sorting
- **Caching Strategies**: Memory and computational caching
- **Lazy Loading**: Deferred loading of resources

## Database Performance
- **Query Optimization**: SQL query performance
- **Index Usage**: Database index optimization
- **Connection Pooling**: Database connection management
- **Data Access Patterns**: Efficient data retrieval
- **Database Schema**: Normalized vs. denormalized design

## Frontend Performance
- **Bundle Size**: JavaScript bundle optimization
- **Code Splitting**: Dynamic import strategies
- **Asset Optimization**: Image, CSS, JS optimization
- **Rendering Performance**: DOM manipulation efficiency
- **Network Requests**: API call optimization

## Backend Performance
- **Request Processing**: Server request handling
- **Memory Usage**: Memory allocation and garbage collection
- **CPU Utilization**: CPU-intensive operation optimization
- **I/O Operations**: File and network I/O efficiency
- **Concurrency**: Parallel processing opportunities

## Network & Communication
- **API Design**: Efficient API structure
- **Data Transfer**: Minimizing data payload
- **Compression**: Content compression strategies
- **CDN Usage**: Content delivery networks
- **Protocol Optimization**: HTTP/2, WebSocket usage

## Monitoring & Profiling
- **Performance Metrics**: Key performance indicators
- **Bottleneck Identification**: Performance bottlenecks
- **Load Testing**: Performance under load
- **Real-time Monitoring**: Performance monitoring tools
- **Optimization Validation**: Measuring improvement impact

Use MCP tools to analyze code patterns, identify performance bottlenecks, and suggest specific optimization strategies.`;
  }

  private getRefactoringSuggestionsPrompt(targetFile?: string): string {
    const fileSection = targetFile ? `\n\nFocus specifically on: ${targetFile}` : '';
    
    return `# Code Refactoring Suggestions

Please analyze the codebase and provide refactoring recommendations:

## Code Structure Improvements
- **Function Decomposition**: Breaking down large functions
- **Class Design**: Single responsibility principle adherence
- **Module Organization**: Better code organization
- **Duplicate Code**: Code deduplication opportunities
- **Magic Numbers**: Constants and configuration extraction

## Design Pattern Application
- **Creational Patterns**: Factory, Builder, Singleton applications
- **Structural Patterns**: Adapter, Decorator, Facade opportunities
- **Behavioral Patterns**: Strategy, Observer, Command patterns
- **Architectural Patterns**: MVC, MVP, MVVM improvements
- **Anti-pattern Elimination**: Code smell removal

## Code Quality Enhancement
- **Naming Improvements**: Better variable and function names
- **Comment Optimization**: Improving code documentation
- **Error Handling**: Better exception management
- **Type Safety**: Stronger type definitions
- **Null Safety**: Null reference prevention

## Maintainability Improvements
- **Dependency Injection**: Loose coupling implementation
- **Configuration Management**: Externalized configuration
- **Logging Enhancement**: Better logging strategies
- **Testing Improvements**: More testable code structure
- **Documentation**: Code and API documentation

## Performance Refactoring
- **Algorithm Optimization**: More efficient algorithms
- **Memory Management**: Reduced memory footprint
- **I/O Optimization**: Efficient I/O operations
- **Caching Implementation**: Strategic caching
- **Lazy Initialization**: Deferred object creation

## Modern Language Features
- **Language Upgrades**: Using newer language features
- **Framework Updates**: Leveraging framework improvements
- **Library Modernization**: Updating to better libraries
- **Syntax Improvements**: Cleaner syntax adoption
- **Tool Integration**: Better development tools

Prioritize refactoring suggestions by impact and effort required.${fileSection}

Use MCP tools to analyze the current code structure and provide specific, actionable refactoring recommendations.`;
  }
}
