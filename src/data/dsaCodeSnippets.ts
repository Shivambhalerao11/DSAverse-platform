export type SupportedLanguage =
  | 'Python'
  | 'C'
  | 'C++'
  | 'Java'
  | 'JavaScript'
  | 'TypeScript'
  | 'Go'
  | 'Rust'
  | 'Kotlin'
  | 'Swift'
  | 'PHP'
  | 'Ruby'
  | 'C#'
  | 'R'
  | 'MATLAB'

export const ALL_LANGUAGES: SupportedLanguage[] = [
  'Python',
  'C',
  'C++',
  'Java',
  'JavaScript',
  'TypeScript',
  'Go',
  'Rust',
  'Kotlin',
  'Swift',
  'PHP',
  'Ruby',
  'C#',
  'R',
  'MATLAB',
]

export const LANGUAGE_METADATA: Record<SupportedLanguage, { icon: string; ext: string; color: string }> = {
  Python: { icon: '🐍', ext: 'py', color: '#3572A5' },
  C: { icon: '⚙️', ext: 'c', color: '#555555' },
  'C++': { icon: '⚡', ext: 'cpp', color: '#f34b7d' },
  Java: { icon: '☕', ext: 'java', color: '#b07219' },
  JavaScript: { icon: '🟨', ext: 'js', color: '#f1e05a' },
  TypeScript: { icon: '🔷', ext: 'ts', color: '#3178c6' },
  Go: { icon: '🐹', ext: 'go', color: '#00ADD8' },
  Rust: { icon: '🦀', ext: 'rs', color: '#dea584' },
  Kotlin: { icon: '🪨', ext: 'kt', color: '#A97BFF' },
  Swift: { icon: '🐦', ext: 'swift', color: '#F05138' },
  PHP: { icon: '🐘', ext: 'php', color: '#4F5D95' },
  Ruby: { icon: '💎', ext: 'rb', color: '#701516' },
  'C#': { icon: '🎯', ext: 'cs', color: '#178600' },
  R: { icon: '📊', ext: 'r', color: '#198CE7' },
  MATLAB: { icon: '🔢', ext: 'm', color: '#e16737' },
}

export function getCodeSnippet(topic: string, operation: string, lang: SupportedLanguage): string {
  const snippets: Record<string, Record<string, Partial<Record<SupportedLanguage, string>>>> = {
    array: {
      traverse: {
        Python: `def traverse(arr):\n    for i in range(len(arr)):\n        print(f"Index {i}: {arr[i]}")`,
        C: `void traverse(int arr[], int n) {\n    for(int i = 0; i < n; i++) {\n        printf("Index %d: %d\\n", i, arr[i]);\n    }\n}`,
        'C++': `void traverse(const std::vector<int>& arr) {\n    for(size_t i = 0; i < arr.size(); ++i) {\n        std::cout << "Index " << i << ": " << arr[i] << "\\n";\n    }\n}`,
        Java: `public static void traverse(int[] arr) {\n    for(int i = 0; i < arr.length; i++) {\n        System.out.println("Index " + i + ": " + arr[i]);\n    }\n}`,
        JavaScript: `function traverse(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    console.log(\`Index \${i}: \${arr[i]}\`);\n  }\n}`,
        TypeScript: `function traverse(arr: number[]): void {\n  for (let i = 0; i < arr.length; i++) {\n    console.log(\`Index \${i}: \${arr[i]}\`);\n  }\n}`,
        Go: `func traverse(arr []int) {\n    for i, val := range arr {\n        fmt.Printf("Index %d: %d\\n", i, val)\n    }\n}`,
        Rust: `fn traverse(arr: &[i32]) {\n    for (i, val) in arr.iter().enumerate() {\n        println!("Index {}: {}", i, val);\n    }\n}`,
        R: `traverse <- function(arr) {\n  for (i in 1:length(arr)) {\n    cat("Index", i-1, ":", arr[i], "\\n")\n  }\n}`,
        MATLAB: `function traverse(arr)\n  for i = 1:length(arr)\n    fprintf('Index %d: %d\\n', i-1, arr(i));\n  end\nend`,
      },
    },
  }

  const topicMap = snippets[topic]
  if (topicMap && topicMap[operation] && topicMap[operation][lang]) {
    return topicMap[operation][lang]!
  }

  return `# ${operation} implementation in ${lang}\n# Interactive DSA Code Visualizer`
}
