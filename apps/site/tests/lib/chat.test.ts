import { describe, expect, it } from 'vitest';
import {
  FIRST_READ_MS,
  FIRST_STATE,
  nextStep,
  POSTED_AT_START,
  readMs,
  typingMs,
  type ChatState,
} from '../../src/lib/chat';

const messages = ['Hi', 'A slightly longer message for the second turn', 'Bye', 'One more'];

describe('nextStep', () => {
  it('starts on the messages the page was sent with, then types and posts the rest in turn, on a loop', () => {
    const seen: string[] = [];
    let state: ChatState = FIRST_STATE;
    for (let step = 0; step < 6; step += 1) {
      state = nextStep(state, messages).state;
      seen.push(`${state.message} ${state.phase}`);
    }
    expect(FIRST_STATE).toEqual({ message: POSTED_AT_START - 1, phase: 'reading' });
    expect(seen).toEqual(['3 typing', '3 reading', '0 typing', '0 reading', '1 typing', '1 reading']);
  });

  it('shows "is typing" for as long as that message takes to type, then leaves it up to be read', () => {
    const typing = nextStep({ message: 0, phase: 'reading' }, messages);
    expect(typing.waitMs).toBe(typingMs(messages[1]));
    expect(nextStep(typing.state, messages).waitMs).toBe(readMs(messages[1], 1));
  });
});

describe('typingMs', () => {
  it('types for 1.2 to 2.2 seconds, longer for longer messages', () => {
    expect(typingMs('Hi')).toBe(1200);
    expect(typingMs('x'.repeat(60))).toBe(1500);
    expect(typingMs('x'.repeat(200))).toBe(2200);
  });
});

describe('readMs', () => {
  it('leaves the first message up for 5 seconds', () => {
    expect(readMs('Hi', 0)).toBe(FIRST_READ_MS);
  });

  it('leaves later messages up for at least 3 seconds, longer when they are long', () => {
    expect(readMs('Hi', 1)).toBe(3000);
    expect(readMs('x'.repeat(80), 1)).toBe(3600);
  });
});
