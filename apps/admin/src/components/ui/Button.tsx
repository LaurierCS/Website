/**
 * The admin's button. It lifts on hover and presses down onto its edge when clicked, like a real key.
 * `ButtonLink` is the same look for links that go somewhere.
 */
import { type HTMLMotionProps, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { type ButtonSize, type ButtonVariant, buttonClasses, KEY_PRESS } from './button-styles';

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant: ButtonVariant;
  size?: ButtonSize;
  /** Drawn before the label. Decorative: the label names the button. */
  icon?: ReactNode;
  children: ReactNode;
};

export function Button({ variant, size = 'regular', icon, children, className = '', type = 'button', ...rest }: ButtonProps) {
  return (
    <motion.button type={type} {...KEY_PRESS} className={`${buttonClasses(variant, size)} ${className}`} {...rest}>
      {icon}
      {children}
    </motion.button>
  );
}
