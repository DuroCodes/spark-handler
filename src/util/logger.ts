/* eslint-disable no-console */
import {
  green, yellow, red, magenta, cyan,
} from 'chalk';

export const logger = {
  success: (message: unknown) => (
    console.log(`${green.bold('[SUCCESS]')} ${message}`)
  ),
  error: (message: unknown) => (
    console.log(`${red.bold('[ERROR]')} ${message}`)
  ),
  trace: (message: unknown) => (
    console.trace(`${'\b'.repeat(7)}${red.bold('[ERROR]')} ${message}`)
  ),
  debug: (message: unknown) => (
    console.log(`${magenta.bold('[DEBUG]')} ${message}`)
  ),
  warn: (message: unknown) => (
    console.log(`${yellow.bold('[WARN]')} ${message}`)
  ),
  info: (message: unknown) => (
    console.log(`${cyan.bold('[INFO]')} ${message}`)
  ),
};
