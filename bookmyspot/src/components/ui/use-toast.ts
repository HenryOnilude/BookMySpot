"use client"

import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  duration?: number
  onDismiss?: () => void
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

type State = {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const ANIMATION_DURATION = 150 // ms

type ToastState = {
  animating: boolean
  timeoutId?: ReturnType<typeof setTimeout>
  dismissing: boolean
}

const toastStates = new Map<string, ToastState>()

function clearToastState(toastId: string) {
  const state = toastStates.get(toastId)
  if (state?.timeoutId) {
    clearTimeout(state.timeoutId)
  }
  toastStates.delete(toastId)
}

function handleToastStateChange(toastId: string, open: boolean, onDismiss?: () => void) {
  const state = toastStates.get(toastId)
  if (!state) return

  if (!open && !state.dismissing) {
    state.dismissing = true
    toastStates.set(toastId, state)
    
    if (onDismiss) {
      onDismiss()
    }
    
    dispatch({
      type: "UPDATE_TOAST",
      toast: { id: toastId, open: false }
    })

    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", toastId })
      clearToastState(toastId)
    }, ANIMATION_DURATION)
  }
}

const addToRemoveQueue = (toastId: string, duration?: number, onDismiss?: () => void) => {
  const existingState = toastStates.get(toastId)
  if (existingState?.dismissing) {
    return
  }

  const timeoutId = setTimeout(() => {
    handleToastStateChange(toastId, false, onDismiss)
  }, duration || TOAST_REMOVE_DELAY)

  toastStates.set(toastId, {
    timeoutId,
    animating: false,
    dismissing: false
  })
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action
      if (toastId) {
        handleToastStateChange(toastId, false)
      } else {
        state.toasts.forEach((toast) => {
          handleToastStateChange(toast.id, false)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ duration, onOpenChange, ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
    
  const dismiss = () => {
    const state = toastStates.get(id)
    if (state?.dismissing) {
      return
    }

    handleToastStateChange(id, false, props.onDismiss)
  }

  // Initialize state
  toastStates.set(id, {
    animating: false,
    dismissing: false
  })

  // Create handler for open state changes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleToastStateChange(id, false, props.onDismiss)
    }
    // Preserve original onOpenChange callback
    if (onOpenChange) {
      onOpenChange(open)
    }
  }

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      duration,
      onOpenChange: handleOpenChange,
    },
  })

  if (duration !== Infinity) {
    addToRemoveQueue(id, duration, props.onDismiss)
  }

  return {
    id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
      // Clean up any remaining toasts
      toastStates.forEach((state, id) => {
        if (!state.dismissing) {
          handleToastStateChange(id, false)
        }
      })
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        handleToastStateChange(toastId, false)
      } else {
        state.toasts.forEach((toast) => {
          handleToastStateChange(toast.id, false)
        })
      }
    },
  }
}

export { useToast, toast }
