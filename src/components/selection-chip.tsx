'use client';

import type {ButtonHTMLAttributes} from 'react';
import styles from './selection-chip.module.css';

/** HAIRUS shared text-selection chip (Figma 1074:2674 / 1074:2681). */
export function SelectionChip({className, type='button', ...props}: ButtonHTMLAttributes<HTMLButtonElement>) {
 return <button {...props} type={type} className={[styles.chip,className].filter(Boolean).join(' ')}/>;
}
