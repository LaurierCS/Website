import { useState } from 'react';
import { PatternBackground } from '../components/universal/PatternBackground';
import SeoHead from '../components/seo/SeoHead';
import Editor from '@monaco-editor/react';

const CHALLENGES = [
  {
    id: 'grade-calculator-with-curve',
    number: 1,
    title: 'Grade Calculator with Curve',
    difficulty: 'Easy',
    initialCode: `def solution(scores):
    pass


if __name__ == "__main__":
    score1 = int(input())
    score2 = int(input())
    score3 = int(input())
    letter_grades, average = solution([score1, score2, score3])
    for grade in letter_grades:
        print(grade)
    print(f"{average:.1f}")`,
  },
  {
    id: 'merge-two-sorted-lists',
    number: 2,
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    initialCode: `class ListNode(object):
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution(object):
    def solve(self, list1, list2):
        pass`,
  },
  {
    id: 'binary-tree-inorder-traversal',
    number: 3,
    title: 'Binary Tree Inorder Traversal',
    difficulty: 'Easy',
    initialCode: `class TreeNode(object):
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution(object):
    def solve(self, root):
        pass`,
  },
];

export default function TestsPage() {
  const [selectedChallenge, setSelectedChallenge] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('lcs_selected_challenge_id');
      const challenge = CHALLENGES.find(c => c.id === savedId);
      return challenge || CHALLENGES[0];
    }
    return CHALLENGES[0];
  });

  const [code, setCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCodes = JSON.parse(localStorage.getItem('lcs_challenge_codes') || '{}');
      const currentId = localStorage.getItem('lcs_selected_challenge_id') || CHALLENGES[0].id;
      const challenge = CHALLENGES.find(c => c.id === currentId) || CHALLENGES[0];
      return savedCodes[challenge.id] || challenge.initialCode;
    }
    return CHALLENGES[0].initialCode;
  });

  const [result, setResult] = useState<{ text: string; color: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChallengeChange = (challenge: typeof CHALLENGES[0]) => {
    setSelectedChallenge(challenge);
    setResult(null);
    localStorage.setItem('lcs_selected_challenge_id', challenge.id);

    const savedCodes = JSON.parse(localStorage.getItem('lcs_challenge_codes') || '{}');
    setCode(savedCodes[challenge.id] || challenge.initialCode);
  };

  const handleRestart = () => {
    if (window.confirm('Are you sure you want to reset your code? All unsaved changes for this question will be lost.')) {
      setCode(selectedChallenge.initialCode);
      const savedCodes = JSON.parse(localStorage.getItem('lcs_challenge_codes') || '{}');
      savedCodes[selectedChallenge.id] = selectedChallenge.initialCode;
      localStorage.setItem('lcs_challenge_codes', JSON.stringify(savedCodes));
      setResult(null);
    }
  };

  const handleCodeChange = (newCode: string | undefined) => {
    const val = newCode || '';
    setCode(val);
    const savedCodes = JSON.parse(localStorage.getItem('lcs_challenge_codes') || '{}');
    savedCodes[selectedChallenge.id] = val;
    localStorage.setItem('lcs_challenge_codes', JSON.stringify(savedCodes));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch(`/api/challenges/${selectedChallenge.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'bruhh',
        },
        body: JSON.stringify({ code }),
      });

      const contentType = response.headers.get('content-type') ?? '';
      if (!response.ok || !contentType.includes('application/json')) {
        setResult({
          text: `ERROR: HTTP ${response.status}`,
          color: 'text-yellow-500',
        });
        return;
      }

      const data = await response.json();

      if (data.allPassed === true) {
        setResult({ text: 'COMPLETE', color: 'text-green-500' });
      } else if (data.executionError) {
        setResult({ text: `ERROR: ${data.executionError.toUpperCase()}`, color: 'text-yellow-500' });
      } else {
        setResult({ text: 'WRONG', color: 'text-red-500' });
      }
    } catch {
      setResult({ text: 'ERROR CONNECTING TO SERVER', color: 'text-yellow-500' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col bg-[#1a1a1a]">
      <SeoHead
        title="Coding Tests - LCS"
        description="Submit your Python solutions for the LCS event."
        canonicalPath="/tests"
      />
      <PatternBackground />

      <main className="relative z-10 flex-1 flex flex-col h-full w-full overflow-hidden">
        <div className="h-12 bg-[#282828] border-b border-white/10 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 font-mono text-sm font-bold">Question {selectedChallenge.number}</span>
            <div className="h-4 w-px bg-white/20"></div>
            <span className="text-zinc-500 text-xs font-medium">Difficulty: {selectedChallenge.difficulty}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRestart}
              className="px-4 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-bold rounded transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/5 bg-[#282828] border-r border-white/10 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-[#323232]">
              <h2 className="text-white font-bold text-sm uppercase tracking-wider">Challenges</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {CHALLENGES.map((challenge) => (
                <button
                  key={challenge.id}
                  onClick={() => handleChallengeChange(challenge)}
                  className={`w-full text-left p-4 border-b border-white/5 transition-colors ${
                    selectedChallenge.id === challenge.id ? 'bg-zinc-700 text-white' : 'bg-transparent text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <div className="text-sm font-bold">Question {challenge.number}</div>
                  <div className="text-xs opacity-60">{challenge.difficulty}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="w-4/5 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="bg-[#323232] text-zinc-400 px-4 py-2 border-b border-white/10 flex items-center justify-between font-mono text-xs">
                <span>solution.py</span>
                <span>Python 3</span>
              </div>
              <div className="flex-1 w-full overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  theme="vs-dark"
                  value={code}
                  onChange={handleCodeChange}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    fontFamily: 'JetBrains Mono, Fira Code, monospace',
                    lineNumbers: 'on',
                    cursorBlinking: 'smooth',
                    formatOnPaste: true,
                    autoIndent: 'full',
                  }}
                />
              </div>
            </div>

            <div className="h-1/3 bg-[#282828] border-t border-white/10 flex flex-col">
              <div className="bg-[#323232] px-4 py-2 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-zinc-400 font-mono text-xs uppercase tracking-wider font-bold">Console</span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
              <div className="p-4 font-mono text-sm flex-1 overflow-y-auto bg-black/20">
                {result ? (
                  <div className={`text-lg font-bold ${result.color}`}>
                    {`> ${result.text}`}
                  </div>
                ) : (
                  <div className="text-zinc-600">
                    {`> Ready. Select a challenge and click 'Submit' to verify your code...`}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
