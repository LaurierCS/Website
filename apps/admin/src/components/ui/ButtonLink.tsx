/**
 * A link that looks and presses like a `Button`, for actions that go to another page, like "New event" or Edit.
 */
import { motion } from 'motion/react';
import type { ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router';
import { type ButtonSize, type ButtonVariant, buttonClasses, KEY_PRESS } from './button-styles';

// Made once, outside render, so React keeps the same component between renders.
const MotionLink = motion.create(Link);

type ButtonLinkProps = Omit<ComponentProps<typeof MotionLink>, 'children'> & {
  variant: ButtonVariant;
  size?: ButtonSize;
  /** Drawn before the label. Decorative: the label names the link. */
  icon?: ReactNode;
  children: ReactNode;
};

export function ButtonLink({ variant, size = 'regular', icon, children, className = '', ...rest }: ButtonLinkProps) {
  return (
    <MotionLink {...KEY_PRESS} className={`${buttonClasses(variant, size)} ${className}`} {...rest}>
      {icon}
      {children}
    </MotionLink>
  );
}
