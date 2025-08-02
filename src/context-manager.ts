import { WorkspaceIndexer } from './workspace-indexer.js';
import * as path from 'path';

export interface SearchResult {
  file: string;
  line: number;
  match: string;
  context?: string;
  code: string;
  language: string;
}

export interface SearchOptions {
  query: string;
  fileTypes?: string[];
  includeContext?: boolean;
}

export interface DependencyAnalysis {
  direct: string[];
  transitive: string[];
  dependents: string[];
}

export interface ProjectPattern {
  name: string;
  description: string;
  usage: string;
  examples: string[];
}

export interface PatternAnalysis {
  architecture: ProjectPattern[];
  conventions: Array<{ type: string; description: string }>;
  designPatterns: Array<{ name: string; description: string }>;
}

export interface Improvement {
  category: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  impact: string;
  description: string;
  actions: string[];
  codeExample?: string;
  language?: string;
}

export interface ContextSummaryOptions {
  focusArea?: string;
  includeExamples?: boolean;
}

export class ContextManager {
  private workspaceIndexer: WorkspaceIndexer;

  constructor(workspaceIndexer: WorkspaceIndexer) {
    this.workspaceIndexer = workspaceIndexer;
  }

  async searchCode(options: SearchOptions): Promise<SearchResult[]> {
    const { query, fileTypes, includeContext = true } = options;
    const results: SearchResult[] = [];

    try {
      const files = await this.workspaceIndexer.getAllFiles(fileTypes);
      const isRegex = this.isRegexPattern(query);
      const searchPattern = isRegex ? new RegExp(query, 'gi') : query;

      for (const file of files) {
        const matches = await this.workspaceIndexer.searchInFile(file, searchPattern);
        
        for (const match of matches) {
          const language = this.getLanguageFromExtension(path.extname(file));
          let context = '';
          
          if (includeContext) {
            const content = await this.workspaceIndexer.getFileContent(file);
            const lines = content.split('\n');
            const startLine = Math.max(0, match.line - 3);
            const endLine = Math.min(lines.length, match.line + 2);
            context = lines.slice(startLine, endLine).join('\n');
          }

          results.push({
            file: path.relative(process.cwd(), file),
            line: match.line,
            match: match.match,
            context,
            code: match.content,
            language,
          });
        }
      }

      return results.slice(0, 50); // Limit results for performance
    } catch (error) {
      console.error('Error searching code:', error);
      return [];
    }
  }

  async getFileDependencies(filePath: string, includeTransitive = false): Promise<DependencyAnalysis> {
    try {
      const fullPath = path.resolve(filePath);
      const content = await this.workspaceIndexer.getFileContent(fullPath);
      
      const direct = this.extractDirectDependencies(content, fullPath);
      const transitive = includeTransitive ? await this.extractTransitiveDependencies(direct) : [];
      const dependents = await this.findDependents(fullPath);

      return { direct, transitive, dependents };
    } catch (error) {
      console.error('Error analyzing dependencies:', error);
      return { direct: [], transitive: [], dependents: [] };
    }
  }

  async getProjectPatterns(analysisType: string = 'all'): Promise<PatternAnalysis> {
    try {
      const analysis = await this.workspaceIndexer.analyzeWorkspace({ includeContent: true });
      
      const architecture = await this.analyzeArchitecturePatterns();
      const conventions = await this.analyzeCodeConventions();
      const designPatterns = await this.analyzeDesignPatterns();

      const result: PatternAnalysis = {
        architecture: analysisType === 'all' || analysisType === 'architecture' ? architecture : [],
        conventions: analysisType === 'all' || analysisType === 'conventions' ? conventions : [],
        designPatterns: analysisType === 'all' || analysisType === 'patterns' ? designPatterns : [],
      };

      return result;
    } catch (error) {
      console.error('Error analyzing patterns:', error);
      return { architecture: [], conventions: [], designPatterns: [] };
    }
  }

  async getContextSummary(options: ContextSummaryOptions = {}): Promise<string> {
    try {
      const analysis = await this.workspaceIndexer.analyzeWorkspace({ 
        includeContent: options.includeExamples 
      });
      
      let summary = `# Workspace Context Summary

## Project Overview
This workspace contains **${analysis.totalFiles} files** across **${analysis.totalDirectories} directories**, primarily using **${analysis.languages.join(', ')}**.

## Technologies & Frameworks
${analysis.technologies.map(tech => `- **${tech.name}**: ${tech.description}`).join('\n')}

## Architecture & Structure
${analysis.keyDirectories.map(dir => `- **${dir.path}**: ${dir.description}`).join('\n')}

## File Distribution
${analysis.fileDistribution.slice(0, 10).map(item => `- **${item.extension || 'no extension'}**: ${item.count} files`).join('\n')}
`;

      if (options.focusArea) {
        summary += await this.getFocusAreaContext(options.focusArea);
      }

      if (options.includeExamples && analysis.codePatterns) {
        summary += `\n## Code Patterns\n${analysis.codePatterns.join('\n\n')}`;
      }

      // Add contextual recommendations
      summary += await this.getContextualRecommendations(analysis);

      return summary;
    } catch (error) {
      console.error('Error generating context summary:', error);
      return 'Error generating context summary.';
    }
  }

  async suggestImprovements(scope: string = 'all'): Promise<Improvement[]> {
    const improvements: Improvement[] = [];

    try {
      const analysis = await this.workspaceIndexer.analyzeWorkspace({ includeContent: true });
      
      if (scope === 'all' || scope === 'security') {
        improvements.push(...await this.analyzeSecurityImprovements());
      }
      
      if (scope === 'all' || scope === 'performance') {
        improvements.push(...await this.analyzePerformanceImprovements());
      }
      
      if (scope === 'all' || scope === 'maintainability') {
        improvements.push(...await this.analyzeMaintainabilityImprovements());
      }

      return improvements.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      console.error('Error suggesting improvements:', error);
      return [];
    }
  }

  private isRegexPattern(query: string): boolean {
    try {
      new RegExp(query);
      return query.includes('(') || query.includes('[') || query.includes('*') || query.includes('+') || query.includes('?');
    } catch {
      return false;
    }
  }

  private getLanguageFromExtension(ext: string): string {
    const languageMap: Record<string, string> = {
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
  }

  private extractDirectDependencies(content: string, filePath: string): string[] {
    const dependencies: string[] = [];
    const ext = path.extname(filePath);

    if (['.js', '.ts', '.jsx', '.tsx'].includes(ext)) {
      // JavaScript/TypeScript imports
      const importRegex = /import.*from\s+['"`]([^'"`]+)['"`]/g;
      const requireRegex = /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
      
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        dependencies.push(match[1]);
      }
      while ((match = requireRegex.exec(content)) !== null) {
        dependencies.push(match[1]);
      }
    } else if (ext === '.py') {
      // Python imports
      const importRegex = /(?:from\s+(\S+)\s+import|import\s+(\S+))/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        dependencies.push(match[1] || match[2]);
      }
    }

    return Array.from(new Set(dependencies));
  }

  private async extractTransitiveDependencies(directDeps: string[]): Promise<string[]> {
    // This is a simplified implementation
    // In a real scenario, you'd need to parse package.json, requirements.txt, etc.
    return [];
  }

  private async findDependents(filePath: string): Promise<string[]> {
    const dependents: string[] = [];
    const files = await this.workspaceIndexer.getAllFiles(['.js', '.ts', '.jsx', '.tsx', '.py']);
    const relativePath = path.relative(process.cwd(), filePath);
    const baseName = path.basename(filePath, path.extname(filePath));

    for (const file of files) {
      if (file === filePath) continue;
      
      const content = await this.workspaceIndexer.getFileContent(file);
      const relativeImport = path.relative(path.dirname(file), filePath);
      
      if (content.includes(relativePath) || 
          content.includes(relativeImport) || 
          content.includes(baseName)) {
        dependents.push(path.relative(process.cwd(), file));
      }
    }

    return dependents;
  }

  private async analyzeArchitecturePatterns(): Promise<ProjectPattern[]> {
    const patterns: ProjectPattern[] = [];
    const analysis = await this.workspaceIndexer.analyzeWorkspace();

    // Detect common architectural patterns
    if (analysis.keyDirectories.some(dir => dir.path.includes('components'))) {
      patterns.push({
        name: 'Component-Based Architecture',
        description: 'Uses reusable components for UI construction',
        usage: 'Modular component structure detected',
        examples: analysis.keyDirectories.filter(dir => dir.path.includes('components')).map(dir => dir.path),
      });
    }

    if (analysis.keyDirectories.some(dir => dir.path.includes('pages') || dir.path.includes('views'))) {
      patterns.push({
        name: 'Page/View Based Routing',
        description: 'File-based routing system with dedicated page components',
        usage: 'Page-based navigation structure',
        examples: analysis.keyDirectories.filter(dir => dir.path.includes('pages') || dir.path.includes('views')).map(dir => dir.path),
      });
    }

    return patterns;
  }

  private async analyzeCodeConventions(): Promise<Array<{ type: string; description: string }>> {
    return [
      { type: 'File Naming', description: 'Uses camelCase for most files' },
      { type: 'Directory Structure', description: 'Follows standard project layout conventions' },
      { type: 'Import Style', description: 'Uses ES6 import/export syntax' },
    ];
  }

  private async analyzeDesignPatterns(): Promise<Array<{ name: string; description: string }>> {
    return [
      { name: 'Module Pattern', description: 'Code organized in modular structure' },
      { name: 'Factory Pattern', description: 'Used for creating objects dynamically' },
    ];
  }

  private async getFocusAreaContext(focusArea: string): Promise<string> {
    const files = await this.workspaceIndexer.getAllFiles();
    const relevantFiles = files.filter(file => {
      const pathLower = file.toLowerCase();
      return pathLower.includes(focusArea.toLowerCase());
    });

    if (relevantFiles.length === 0) {
      return `\n## ${focusArea} Focus Area\nNo specific files found for this focus area.`;
    }

    return `\n## ${focusArea} Focus Area\n${relevantFiles.slice(0, 10).map(file => `- ${path.relative(process.cwd(), file)}`).join('\n')}`;
  }

  private async getContextualRecommendations(analysis: any): Promise<string> {
    const recommendations = [];

    if (analysis.technologies.some((tech: any) => tech.name === 'TypeScript')) {
      recommendations.push('✅ TypeScript detected - Strong type safety in place');
    }

    if (analysis.keyDirectories.some((dir: any) => dir.path.includes('test'))) {
      recommendations.push('✅ Test directory found - Good testing structure');
    } else {
      recommendations.push('⚠️ Consider adding a dedicated test directory');
    }

    if (analysis.technologies.some((tech: any) => tech.name === 'Docker')) {
      recommendations.push('✅ Docker configuration found - Containerization ready');
    }

    return `\n## Recommendations\n${recommendations.join('\n')}`;
  }

  private async analyzeSecurityImprovements(): Promise<Improvement[]> {
    return [
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
        codeExample: `// Example validation\nconst requiredEnvVars = ['API_KEY', 'DATABASE_URL'];\nrequiredEnvVars.forEach(envVar => {\n  if (!process.env[envVar]) {\n    throw new Error(\`Missing required environment variable: \${envVar}\`);\n  }\n});`,
        language: 'javascript'
      }
    ];
  }

  private async analyzePerformanceImprovements(): Promise<Improvement[]> {
    return [
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
    ];
  }

  private async analyzeMaintainabilityImprovements(): Promise<Improvement[]> {
    return [
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
    ];
  }
}
