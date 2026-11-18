import '@testing-library/jest-dom/vitest';
import { MotionGlobalConfig } from 'motion/react';

// Animations finish instantly in tests, so assertions see the final state and completion callbacks fire.
MotionGlobalConfig.skipAnimations = true;
