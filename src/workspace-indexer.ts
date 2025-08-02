import * as fs from 'fs-extra';
import * as path from 'path';
import glob from 'fast-glob';
import ignore from 'ignore';

export interface WorkspaceAnalysis {
  totalFiles: number;
  totalDirectories: number;
  languages: string[];
  fileDistribution: Array<{ extension: string; count: number }>;
  keyDirectories: Array<{ path: string; description: string }>;
  technologies: Array<{ name: string; description: string }>;
  codePatterns?: string[];
}

export interface AnalysisOptions {
  includeContent?: boolean;
  maxDepth?: number;
}

export class WorkspaceIndexer {
  private workspacePath: string;
  private gitignore: any;
  private cache: Map<string, any> = new Map();

  constructor(workspacePath: string) {
    this.workspacePath = workspacePath;
    // Initialize gitignore with default patterns, load actual .gitignore async
    this.gitignore = ignore().add([
      'node_modules/**',
      '.git/**',
      'dist/**',
      'build/**',
      '.vscode/**',
      '*.log',
      '.DS_Store',
    ]);
    this.loadGitignore().catch(console.error);
  }

  private async loadGitignore() {
    try {
      const gitignorePath = path.join(this.workspacePath, '.gitignore');
      if (await fs.pathExists(gitignorePath)) {
        const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
        this.gitignore = ignore().add(gitignoreContent);
      } else {
        this.gitignore = ignore();
      }
      
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
    } catch (error) {
      console.error('Error loading .gitignore:', error);
      this.gitignore = ignore().add([
        'node_modules/**',
        '.git/**',
        'dist/**',
        'build/**',
        '.vscode/**',
        '*.log',
        '.DS_Store',
      ]);
    }
  }

  async getAllFiles(extensions?: string[]): Promise<string[]> {
    const cacheKey = `files_${extensions?.join(',') || 'all'}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const pattern = extensions 
        ? `**/*.{${extensions.map(ext => ext.replace('.', '')).join(',')}}`
        : '**/*';
      
      const files = await glob(pattern, {
        cwd: this.workspacePath,
        absolute: true,
        onlyFiles: true,
        dot: false,
      });

      const filteredFiles = files.filter(file => {
        const relativePath = path.relative(this.workspacePath, file);
        return !this.gitignore.ignores(relativePath);
      });

      this.cache.set(cacheKey, filteredFiles);
      return filteredFiles;
    } catch (error) {
      console.error('Error getting files:', error);
      return [];
    }
  }

  async analyzeWorkspace(options: AnalysisOptions = {}): Promise<WorkspaceAnalysis> {
    const cacheKey = `analysis_${JSON.stringify(options)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const files = await this.getAllFiles();
      const directories = await this.getDirectories();

      // Analyze file extensions
      const extensionCounts = new Map<string, number>();
      const languages = new Set<string>();

      files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        extensionCounts.set(ext, (extensionCounts.get(ext) || 0) + 1);
        
        const language = this.getLanguageFromExtension(ext);
        if (language) {
          languages.add(language);
        }
      });

      const fileDistribution = Array.from(extensionCounts.entries())
        .map(([extension, count]) => ({ extension: extension || 'no extension', count }))
        .sort((a, b) => b.count - a.count);

      // Identify key directories
      const keyDirectories = await this.identifyKeyDirectories();

      // Detect technologies
      const technologies = await this.detectTechnologies();

      // Extract code patterns if requested
      let codePatterns: string[] | undefined;
      if (options.includeContent) {
        codePatterns = await this.extractCodePatterns();
      }

      const analysis: WorkspaceAnalysis = {
        totalFiles: files.length,
        totalDirectories: directories.length,
        languages: Array.from(languages),
        fileDistribution,
        keyDirectories,
        technologies,
        ...(codePatterns && { codePatterns }),
      };

      this.cache.set(cacheKey, analysis);
      return analysis;
    } catch (error) {
      console.error('Error analyzing workspace:', error);
      throw error;
    }
  }

  private async getDirectories(): Promise<string[]> {
    try {
      const dirs = await glob('**/', {
        cwd: this.workspacePath,
        absolute: true,
        onlyDirectories: true,
      });

      return dirs.filter(dir => {
        const relativePath = path.relative(this.workspacePath, dir);
        return !this.gitignore.ignores(relativePath);
      });
    } catch (error) {
      console.error('Error getting directories:', error);
      return [];
    }
  }

  private getLanguageFromExtension(ext: string): string | null {
    const languageMap: Record<string, string> = {
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
  }

  private async identifyKeyDirectories(): Promise<Array<{ path: string; description: string }>> {
    const directories = await this.getDirectories();
    const keyDirs: Array<{ path: string; description: string }> = [];

    for (const dir of directories) {
      const relativePath = path.relative(this.workspacePath, dir);
      const dirName = path.basename(dir);

      let description = '';

      // Common directory patterns
      if (dirName === 'src' || dirName === 'source') {
        description = 'Source code directory';
      } else if (dirName === 'test' || dirName === 'tests' || dirName === '__tests__') {
        description = 'Test files directory';
      } else if (dirName === 'docs' || dirName === 'documentation') {
        description = 'Documentation directory';
      } else if (dirName === 'public' || dirName === 'static') {
        description = 'Static assets directory';
      } else if (dirName === 'lib' || dirName === 'libs') {
        description = 'Library files directory';
      } else if (dirName === 'components') {
        description = 'Reusable components directory';
      } else if (dirName === 'pages' || dirName === 'views') {
        description = 'Page/view components directory';
      } else if (dirName === 'utils' || dirName === 'utilities') {
        description = 'Utility functions directory';
      } else if (dirName === 'config' || dirName === 'configuration') {
        description = 'Configuration files directory';
      } else if (dirName === 'assets') {
        description = 'Asset files directory';
      } else if (dirName === 'types') {
        description = 'Type definitions directory';
      } else if (dirName === 'hooks') {
        description = 'Custom hooks directory';
      } else if (dirName === 'api') {
        description = 'API related files directory';
      }

      if (description) {
        keyDirs.push({ path: relativePath, description });
      }
    }

    return keyDirs;
  }

  private async detectTechnologies(): Promise<Array<{ name: string; description: string }>> {
    const technologies: Array<{ name: string; description: string }> = [];

    try {
      // Check package.json for Node.js technologies
      const packageJsonPath = path.join(this.workspacePath, 'package.json');
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

        // Framework detection
        if (deps.react) technologies.push({ name: 'React', description: 'JavaScript UI library' });
        if (deps.vue) technologies.push({ name: 'Vue.js', description: 'Progressive JavaScript framework' });
        if (deps.angular) technologies.push({ name: 'Angular', description: 'TypeScript web framework' });
        if (deps.svelte) technologies.push({ name: 'Svelte', description: 'Compile-time JavaScript framework' });
        if (deps.next) technologies.push({ name: 'Next.js', description: 'React production framework' });
        if (deps.nuxt) technologies.push({ name: 'Nuxt.js', description: 'Vue.js production framework' });
        if (deps.express) technologies.push({ name: 'Express.js', description: 'Node.js web framework' });
        if (deps.fastify) technologies.push({ name: 'Fastify', description: 'Fast Node.js web framework' });
        
        // Build tools
        if (deps.webpack) technologies.push({ name: 'Webpack', description: 'Module bundler' });
        if (deps.vite) technologies.push({ name: 'Vite', description: 'Fast build tool' });
        if (deps.rollup) technologies.push({ name: 'Rollup', description: 'Module bundler' });
        if (deps.parcel) technologies.push({ name: 'Parcel', description: 'Zero-config build tool' });
        
        // Testing
        if (deps.jest) technologies.push({ name: 'Jest', description: 'JavaScript testing framework' });
        if (deps.vitest) technologies.push({ name: 'Vitest', description: 'Vite-native testing framework' });
        if (deps.cypress) technologies.push({ name: 'Cypress', description: 'End-to-end testing' });
        if (deps.playwright) technologies.push({ name: 'Playwright', description: 'Browser automation' });
        
        // TypeScript
        if (deps.typescript) technologies.push({ name: 'TypeScript', description: 'Typed JavaScript' });
      }

      // Check for Python technologies
      const requirementsPath = path.join(this.workspacePath, 'requirements.txt');
      const pyprojectPath = path.join(this.workspacePath, 'pyproject.toml');
      if (await fs.pathExists(requirementsPath) || await fs.pathExists(pyprojectPath)) {
        technologies.push({ name: 'Python', description: 'Python project detected' });
      }

      // Check for Docker
      const dockerfilePath = path.join(this.workspacePath, 'Dockerfile');
      if (await fs.pathExists(dockerfilePath)) {
        technologies.push({ name: 'Docker', description: 'Containerization technology' });
      }

      // Check for Kubernetes
      const k8sFiles = await glob('**/*.{yaml,yml}', { cwd: this.workspacePath });
      for (const file of k8sFiles) {
        const content = await fs.readFile(path.join(this.workspacePath, file), 'utf-8');
        if (content.includes('apiVersion:') && content.includes('kind:')) {
          technologies.push({ name: 'Kubernetes', description: 'Container orchestration' });
          break;
        }
      }

    } catch (error) {
      console.error('Error detecting technologies:', error);
    }

    return technologies;
  }

  private async extractCodePatterns(): Promise<string[]> {
    const patterns: string[] = [];
    
    try {
      const jsFiles = await this.getAllFiles(['.js', '.ts', '.jsx', '.tsx']);
      
      for (const file of jsFiles.slice(0, 10)) { // Limit to first 10 files for performance
        const content = await fs.readFile(file, 'utf-8');
        
        // Extract common patterns
        const imports = content.match(/^import.*from.*$/gm);
        if (imports && imports.length > 0) {
          patterns.push(`# Import Pattern (${path.basename(file)}):\n\`\`\`typescript\n${imports.slice(0, 3).join('\n')}\n\`\`\``);
        }
        
        const exports = content.match(/^export.*$/gm);
        if (exports && exports.length > 0) {
          patterns.push(`# Export Pattern (${path.basename(file)}):\n\`\`\`typescript\n${exports.slice(0, 2).join('\n')}\n\`\`\``);
        }
      }
    } catch (error) {
      console.error('Error extracting code patterns:', error);
    }

    return patterns.slice(0, 5); // Limit to 5 patterns
  }

  async getFileContent(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return '';
    }
  }

  async searchInFile(filePath: string, query: string | RegExp): Promise<Array<{ line: number; content: string; match: string }>> {
    try {
      const content = await this.getFileContent(filePath);
      const lines = content.split('\n');
      const matches: Array<{ line: number; content: string; match: string }> = [];

      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        let match: RegExpMatchArray | null = null;

        if (typeof query === 'string') {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            match = [query];
          }
        } else {
          match = line.match(query);
        }

        if (match) {
          matches.push({
            line: lineNumber,
            content: line.trim(),
            match: match[0],
          });
        }
      });

      return matches;
    } catch (error) {
      console.error(`Error searching in file ${filePath}:`, error);
      return [];
    }
  }
}
