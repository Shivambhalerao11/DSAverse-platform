import { useState } from 'react'
import { addXp } from '../../services/xpService'

interface Question {
  question: string
  options: string[]
  answer: number
  explanation: string
}

interface QuizPanelProps {
  topicName: string
  questions?: Question[]
  accentColor?: string
  onCompleteXP?: (xp: number) => void
}

const DEFAULT_QUESTIONS: Record<string, Question[]> = {
  default: [
    {
      question: 'What is the average time complexity for searching an element in an unsorted array?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      answer: 2,
      explanation: 'In an unsorted collection, you may need to inspect every element in the worst case, yielding O(n) time.',
    },
    {
      question: 'Which of the following is true about in-place algorithms?',
      options: [
        'They require O(n) extra space',
        'They use O(1) or constant auxiliary space',
        'They cannot mutate the original array',
        'They only run in linear time',
      ],
      answer: 1,
      explanation: 'In-place algorithms modify the input structure directly without requiring proportional extra memory allocation.',
    },
  ],
}

export function QuizPanel({
  topicName,
  questions,
  accentColor = '#6366f1',
  onCompleteXP,
}: QuizPanelProps) {
  const quizList = questions || DEFAULT_QUESTIONS.default
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)

  const q = quizList[currentIndex]

  const handleSubmit = () => {
    if (selectedOption === null) return
    setIsSubmitted(true)
    if (selectedOption === q.answer) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 < quizList.length) {
      setCurrentIndex((i) => i + 1)
      setSelectedOption(null)
      setIsSubmitted(false)
    } else {
      setQuizFinished(true)
      addXp(50)
      if (onCompleteXP) onCompleteXP(50)
    }
  }

  if (quizFinished) {
    return (
      <div
        style={{
          padding: '24px 20px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '42px' }}>🎉</span>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--c-text-1)' }}>
          Quiz Completed!
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--c-text-3)' }}>
          You scored <strong>{score}</strong> out of <strong>{quizList.length}</strong> on {topicName}.
        </p>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13px',
            fontWeight: '700',
            color: '#f59e0b',
            background: 'rgba(245,158,11,0.15)',
            padding: '4px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(245,158,11,0.3)',
          }}
        >
          +50 XP Earned!
        </div>
        <button
          onClick={() => {
            setCurrentIndex(0)
            setSelectedOption(null)
            setIsSubmitted(false)
            setScore(0)
            setQuizFinished(false)
          }}
          style={{
            marginTop: '8px',
            padding: '8px 16px',
            background: accentColor,
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: '600',
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Retry Quiz
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '16px 20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: 'var(--c-text-4)', fontWeight: '600' }}>
          Question {currentIndex + 1} of {quizList.length}
        </span>
        <span
          style={{
            fontSize: '10px',
            color: accentColor,
            fontWeight: '700',
            background: `${accentColor}15`,
            padding: '2px 8px',
            borderRadius: '10px',
          }}
        >
          {topicName} Quiz
        </span>
      </div>

      <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--c-text-1)', lineHeight: '1.5' }}>
        {q.question}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {q.options.map((opt, i) => {
          let bg = 'var(--c-card)'
          let border = '1px solid var(--c-border)'
          let color = 'var(--c-text-2)'

          if (selectedOption === i) {
            bg = `${accentColor}18`
            border = `1px solid ${accentColor}50`
            color = accentColor
          }

          if (isSubmitted) {
            if (i === q.answer) {
              bg = 'rgba(16,185,129,0.15)'
              border = '1px solid rgba(16,185,129,0.4)'
              color = '#10b981'
            } else if (selectedOption === i) {
              bg = 'rgba(244,63,94,0.15)'
              border = '1px solid rgba(244,63,94,0.4)'
              color = '#f43f5e'
            }
          }

          return (
            <button
              key={i}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(i)}
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                background: bg,
                border: border,
                borderRadius: '8px',
                color: color,
                fontSize: '12.5px',
                fontFamily: 'Inter, sans-serif',
                cursor: isSubmitted ? 'default' : 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {isSubmitted && (
        <div
          style={{
            padding: '10px 12px',
            background: selectedOption === q.answer ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
            border: `1px solid ${selectedOption === q.answer ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--c-text-2)',
            lineHeight: '1.5',
          }}
        >
          <strong>{selectedOption === q.answer ? '✅ Correct!' : '❌ Incorrect.'}</strong>{' '}
          {q.explanation}
        </div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            style={{
              padding: '8px 16px',
              background: selectedOption !== null ? accentColor : 'var(--c-card-2)',
              border: 'none',
              borderRadius: '8px',
              color: selectedOption !== null ? '#fff' : 'var(--c-text-5)',
              fontWeight: '600',
              fontSize: '12px',
              cursor: selectedOption !== null ? 'pointer' : 'not-allowed',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            style={{
              padding: '8px 16px',
              background: accentColor,
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {currentIndex + 1 < quizList.length ? 'Next Question →' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  )
}
