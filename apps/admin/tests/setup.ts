import '@testing-library/jest-dom/vitest';
import { MotionGlobalConfig } from 'motion/react';

// Animations finish instantly in tests, so assertions see the final state and completion callbacks fire.
MotionGlobalConfig.skipAnimations = true;

// jsdom has <dialog> but can't open or close it yet. These do what a browser does, minus trapping focus.
HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
  this.removeAttribute('open');
};