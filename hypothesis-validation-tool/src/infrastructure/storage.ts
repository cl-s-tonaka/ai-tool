export interface StorageService {
  save<T>(key: string, data: T): void
  load<T>(key: string): T | null
  remove(key: string): void
  clear(): void
}

export class LocalStorageService implements StorageService {
  save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  load<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
      return null
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  }

  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }
}

export const storage = new LocalStorageService()

// ストレージキー定数
export const STORAGE_KEYS = {
  BRIEF: 'hypothesis-brief',
  IDEAS: 'hypothesis-ideas',
  SELECTED_IDEA: 'hypothesis-selected-idea',
  FLOWS: 'hypothesis-flows',
  MOCK: 'hypothesis-mock',
  SEED: 'hypothesis-seed',
} as const
