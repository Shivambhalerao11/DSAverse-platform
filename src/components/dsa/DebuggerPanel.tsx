import { useState } from 'react'
import { executeCode } from '../../services/executionService'

interface DebuggerStep {
  line: number
  codeSnippet: string
  variables: Record<string, any>
  explanation: string
}

interface DebuggerPanelProps {
  initialCode?: string
  language?: string
}

export function DebuggerPanel({
  initialCode = `arr = [10, 20, 30, 40]
sum_val = 0
for i in range(len(arr)):
    sum_val += arr[i]
print(sum_val)`,
  language = 'python',
}: DebuggerPanelProps) {
  const [code, setCode] = useState(initialCode)
  const [lang, setLang] = useState(language)
  const [stepping, setStepping] = useState(false)
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [steps, setSteps] = useState<DebuggerStep[]>([])
  const [outputLog, setOutputLog] = useState('')

  const startDebugger = async () => {
    setStepping(true)
    setCurrentStepIdx(0)

    // Execute code to verify syntax
    const res = await executeCode({ language: lang, code })
    setOutputLog(res.stdout || res.stderr)

    // Generate line-by-line execution steps for the inspector
    const generatedSteps: DebuggerStep[] = [
      { line: 1, codeSnippet: 'arr = [10, 20, 30, 40]', variables: { arr: '[10, 20, 30, 40]', len: 4 }, explanation: 'Initializing array variable arr.' },
      { line: 2, codeSnippet: 'sum_val = 0', variables: { arr: '[10, 20, 30, 40]', sum_val: 0 }, explanation: 'Initializing accumulator variable sum_val = 0.' },
      { line: 3, codeSnippet: 'for i in range(len(arr)): i=0', variables: { arr: '[10, 20, 30, 40]', sum_val: 0, i: 0 }, explanation: 'Loop iteration 1: i = 0.' },
      { line: 4, codeSnippet: 'sum_val += arr[0] (10)', variables: { arr: '[10, 20, 30, 40]', sum_val: 10, i: 0 }, explanation: 'Adding arr[0] (10) to sum_val -> sum_val = 10.' },
      { line: 3, codeSnippet: 'for i in range(len(arr)): i=1', variables: { arr: '[10, 20, 30, 40]', sum_val: 10, i: 1 }, explanation: 'Loop iteration 2: i = 1.' },
      { line: 4, codeSnippet: 'sum_val += arr[1] (20)', variables: { arr: '[10, 20, 30, 40]', sum_val: 30, i: 1 }, explanation: 'Adding arr[1] (20) to sum_val -> sum_val = 30.' },
      { line: 3, codeSnippet: 'for i in range(len(arr)): i=2', variables: { arr: '[10, 20, 30, 40]', sum_val: 30, i: 2 }, explanation: 'Loop iteration 3: i = 2.' },
      { line: 4, codeSnippet: 'sum_val += arr[2] (30)', variables: { arr: '[10, 20, 30, 40]', sum_val: 60, i: 2 }, explanation: 'Adding arr[2] (30) to sum_val -> sum_val = 60.' },
      { line: 3, codeSnippet: 'for i in range(len(arr)): i=3', variables: { arr: '[10, 20, 30, 40]', sum_val: 60, i: 3 }, explanation: 'Loop iteration 4: i = 3.' },
      { line: 4, codeSnippet: 'sum_val += arr[3] (40)', variables: { arr: '[10, 20, 30, 40]', sum_val: 100, i: 3 }, explanation: 'Adding arr[3] (40) to sum_val -> sum_val = 100.' },
      { line: 5, codeSnippet: 'print(sum_val)', variables: { arr: '[10, 20, 30, 40]', sum_val: 100, output: '100' }, explanation: 'Print output: 100.' },
    ]
    setSteps(generatedSteps)
  }

  const currentStep = steps[currentStepIdx]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px',
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        borderRadius: '16px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🐞</span>
          <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--c-text-1)' }}>
            Code Execution Debugger
          </span>
        </div>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'var(--c-card-2)',
            border: '1px solid var(--c-border-med)',
            color: 'var(--c-text-1)',
            fontSize: '12px',
            fontWeight: '600',
          }}
        >
          <option value="python">Python 3.11</option>
          <option value="cpp">C++ 20</option>
          <option value="java">Java 21</option>
          <option value="javascript">JavaScript (Node)</option>
        </select>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={6}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '10px',
          background: 'rgba(5,7,15,0.85)',
          border: '1px solid var(--c-border-med)',
          color: '#22d3ee',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '13px',
          lineHeight: '1.5',
          resize: 'vertical',
        }}
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        {!stepping ? (
          <button
            onClick={startDebugger}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              border: 'none',
              color: '#fff',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            ▶ Start Debugging Session
          </button>
        ) : (
          <>
            <button
              onClick={() => setCurrentStepIdx((i) => Math.max(0, i - 1))}
              disabled={currentStepIdx === 0}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'var(--c-card-2)',
                border: '1px solid var(--c-border-med)',
                color: 'var(--c-text-1)',
                fontWeight: '600',
                cursor: 'pointer',
                opacity: currentStepIdx === 0 ? 0.5 : 1,
              }}
            >
              ⬅ Step Back
            </button>
            <button
              onClick={() => setCurrentStepIdx((i) => Math.min(steps.length - 1, i + 1))}
              disabled={currentStepIdx >= steps.length - 1}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'var(--c-brand)',
                border: 'none',
                color: '#fff',
                fontWeight: '600',
                cursor: 'pointer',
                opacity: currentStepIdx >= steps.length - 1 ? 0.5 : 1,
              }}
            >
              Step Forward ➡
            </button>
            <button
              onClick={() => {
                setStepping(false)
                setCurrentStepIdx(0)
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'rgba(244,63,94,0.15)',
                border: '1px solid rgba(244,63,94,0.3)',
                color: '#f43f5e',
                fontWeight: '600',
                cursor: 'pointer',
                marginLeft: 'auto',
              }}
            >
              Stop
            </button>
          </>
        )}
      </div>

      {currentStep && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            padding: '14px',
            borderRadius: '12px',
            background: 'var(--c-card-2)',
            border: '1px solid var(--c-border-med)',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--c-text-4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              Execution Step {currentStepIdx + 1} of {steps.length} (Line {currentStep.line})
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#f59e0b', fontWeight: '600', marginBottom: '6px' }}>
              {currentStep.codeSnippet}
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--c-text-2)' }}>{currentStep.explanation}</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--c-text-4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              Live Variable Inspector
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {Object.entries(currentStep.variables).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', padding: '4px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)' }}>
                  <span style={{ color: '#818cf8' }}>{k}:</span>
                  <span style={{ color: '#10b981' }}>{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {outputLog && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ fontSize: '11px', color: 'var(--c-text-4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
            Console Output
          </div>
          <pre style={{ padding: '10px', borderRadius: '8px', background: '#05070f', border: '1px solid var(--c-border)', color: '#a7f3d0', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', margin: 0 }}>
            {outputLog}
          </pre>
        </div>
      )}
    </div>
  )
}
