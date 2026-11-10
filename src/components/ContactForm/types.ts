import type { GuidedAnswers } from '../../lib/contact-draft'

export type { ProjectType, Platform, Importance } from '../../lib/contact-draft'

export type Status = 'idle' | 'sending' | 'sent' | 'error'
export type PreferredContact = '' | 'email' | 'phone' | 'text'

/** `quick` is the default form; `guided` is the question-by-question helper. */
export type Mode = 'quick' | 'guided'

export type StepKey = 'type' | 'platforms' | 'reach' | 'category' | 'audience' | 'budget'

/** Set when the message box was filled from the guided answers. */
export type DraftNote = null | 'new' | 'appended'

export interface FormData extends GuidedAnswers {
  /** The message. Written by the visitor, or drafted from the guided answers. */
  description: string
  name: string
  email: string
  phone: string
  otherContact: string
  preferredContact: PreferredContact
}

export const INITIAL: FormData = {
  projectType: '',
  platforms: [],
  categories: [],
  categoryOther: '',
  seo: '',
  geo: '',
  audience: '',
  budget: '',
  description: '',
  name: '',
  email: '',
  phone: '',
  otherContact: '',
  preferredContact: '',
}

/** Sets one field, and clears any validation message the visitor is now fixing. */
export type SetField = <K extends keyof FormData>(key: K, value: FormData[K]) => void

/** The ids of the fields that can carry a validation message. */
export const FIELD = {
  message: 'cf-message',
  name: 'cf-name',
  email: 'cf-email',
} as const
