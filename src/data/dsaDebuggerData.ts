import { type SupportedLanguage } from './dsaCodeSnippets'

export interface DebuggerStep {
  stepIndex: number
  lineHighlight: number
  explanation: string
  variables: Record<string, string | number | boolean>
  activeIndices?: number[]
  compareIndices?: number[]
  swapIndices?: number[]
  foundIndex?: number
}

export function getDebuggerData(
  topic: string,
  operation: string,
  lang: SupportedLanguage,
  params?: { array?: number[]; target?: number; index?: number; value?: number; stringInput?: string }
): { code: string; steps: DebuggerStep[] } {
  const arr = params?.array || [5, 3, 8, 1, 6]
  const target = params?.target ?? 8
  const index = params?.index ?? 2
  const val = params?.value ?? 9

  if (topic === 'array') {
    if (operation === 'traverse') {
      const steps: DebuggerStep[] = arr.map((v, i) => ({
        stepIndex: i + 1,
        lineHighlight: lang === 'Python' ? 4 : lang === 'C' || lang === 'C++' ? 3 : 2,
        explanation: `Inspecting element at index ${i} with value ${v}. Memory address: 0x${(1000 + i * 4).toString(16).toUpperCase()}.`,
        variables: { i, 'arr[i]': v, length: arr.length, address: `0x${(1000 + i * 4).toString(16).toUpperCase()}` },
        activeIndices: [i],
      }))
      return {
        code:
          lang === 'Python'
            ? `def traverse(arr):\n    n = len(arr)\n    for i in range(n):\n        print(f"Index {i}: {arr[i]}")\n    return arr`
            : lang === 'C++'
            ? `void traverse(vector<int>& arr) {\n    int n = arr.size();\n    for(int i = 0; i < n; i++) {\n        cout << "Index " << i << ": " << arr[i] << endl;\n    }\n}`
            : `function traverse(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    console.log(arr[i]);\n  }\n}`,
        steps,
      }
    }

    if (operation === 'search') {
      const steps: DebuggerStep[] = []
      let found = -1
      for (let i = 0; i < arr.length; i++) {
        const isMatch = arr[i] === target
        steps.push({
          stepIndex: steps.length + 1,
          lineHighlight: lang === 'Python' ? 3 : 2,
          explanation: `Checking if arr[${i}] (${arr[i]}) equals target (${target}) -> ${isMatch ? 'Match Found!' : 'No match'}`,
          variables: { i, 'arr[i]': arr[i], target, match: isMatch },
          activeIndices: [i],
          compareIndices: [i],
          foundIndex: isMatch ? i : undefined,
        })
        if (isMatch) {
          found = i
          break
        }
      }
      return {
        code:
          lang === 'Python'
            ? `def linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i  # Found\n    return -1`
            : lang === 'C++'
            ? `int linearSearch(vector<int>& arr, int target) {\n    for(int i = 0; i < arr.size(); i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`
            : `function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}`,
        steps,
      }
    }

    if (operation === 'insert') {
      const steps: DebuggerStep[] = [
        {
          stepIndex: 1,
          lineHighlight: 2,
          explanation: `Target insertion: Insert value ${val} at index ${index}. Expanding array allocation.`,
          variables: { index, val, initialLength: arr.length },
          activeIndices: [index],
        },
        {
          stepIndex: 2,
          lineHighlight: 3,
          explanation: `Shifting elements to the right to clear space at index ${index}.`,
          variables: { index, val, shiftedIndex: index + 1 },
          activeIndices: [index, index + 1],
        },
        {
          stepIndex: 3,
          lineHighlight: 4,
          explanation: `Placed value ${val} at index ${index}. New array length: ${arr.length + 1}.`,
          variables: { index, val, newLength: arr.length + 1 },
          activeIndices: [index],
          foundIndex: index,
        },
      ]
      return {
        code:
          lang === 'Python'
            ? `def insert_element(arr, index, val):\n    arr.append(0)\n    for i in range(len(arr)-1, index, -1):\n        arr[i] = arr[i-1]\n    arr[index] = val\n    return arr`
            : `function insertElement(arr, index, val) {\n  arr.splice(index, 0, val);\n  return arr;\n}`,
        steps,
      }
    }

    if (operation === 'reverse') {
      const steps: DebuggerStep[] = []
      let l = 0,
        r = arr.length - 1
      let stepNo = 1
      while (l < r) {
        steps.push({
          stepIndex: stepNo++,
          lineHighlight: 3,
          explanation: `Swapping elements: arr[${l}] (${arr[l]}) ↔ arr[${r}] (${arr[r]}). Left ptr: ${l}, Right ptr: ${r}.`,
          variables: { left: l, right: r, 'arr[left]': arr[l], 'arr[right]': arr[r] },
          swapIndices: [l, r],
        })
        l++
        r--
      }
      return {
        code:
          lang === 'Python'
            ? `def reverse_array(arr):\n    l, r = 0, len(arr) - 1\n    while l < r:\n        arr[l], arr[r] = arr[r], arr[l]\n        l += 1; r -= 1`
            : `function reverseArray(arr) {\n  let l = 0, r = arr.length - 1;\n  while (l < r) {\n    [arr[l], arr[r]] = [arr[r], arr[l]];\n    l++; r--;\n  }\n}`,
        steps,
      }
    }
  }

  // Fallback default step
  return {
    code: `# ${operation} in ${lang}\n# Synchronized execution step`,
    steps: [
      {
        stepIndex: 1,
        lineHighlight: 1,
        explanation: `Executing ${operation} operation on ${topic}.`,
        variables: { topic, operation, lang },
        activeIndices: [0],
      },
    ],
  }
}
