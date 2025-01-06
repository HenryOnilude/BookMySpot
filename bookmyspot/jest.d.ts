/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

import { Result } from 'axe-core'
import { MatcherFunction } from 'expect'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveNoViolations(): R
      toHaveLength(length: number): R
      toHaveTextContent(text: string | RegExp): R
      toHaveClass(...classNames: string[]): R
      toContain(text: string): R
      toBeNull(): R
      toHaveBeenCalledWith(...args: any[]): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveStyle(style: Record<string, any>): R
      toBe(expected: any): R
      toBeTruthy(): R
      toBeFalsy(): R
    }
  }
}

declare module '@testing-library/jest-dom' {
  export interface Matchers<R> {
    toBeInTheDocument(): R
    toHaveNoViolations(): R
    toHaveLength(length: number): R
    toHaveTextContent(text: string | RegExp): R
    toHaveClass(...classNames: string[]): R
    toContain(text: string): R
    toBeNull(): R
    toHaveBeenCalledWith(...args: any[]): R
    toHaveAttribute(attr: string, value?: string): R
    toHaveStyle(style: Record<string, any>): R
    toBe(expected: any): R
    toBeTruthy(): R
    toBeFalsy(): R
  }
}

declare module 'jest-axe' {
  export interface JestMatchers<R> {
    toHaveNoViolations(): R
  }
  
  export function axe(node: Element | string, options?: any): Promise<Result>
  export function toHaveNoViolations(): MatcherFunction
  export function configureAxe(options?: any): void
}
