import { useEffect, useState } from 'react'
import type { Storage } from 'webextension-polyfill'
import { storage } from 'webextension-polyfill'

interface Params<T> {
  key: string
  initialValue?: T | null
}

export function useStorageLocal<T>({ key, initialValue = null }: Params<T>) {
  const [value, _setValue] = useState<T | null>(initialValue)

  useEffect(() => {
    storage.local.get(key).then(val => _setValue(val[key] ?? initialValue))
    const callback = (changes: Record<string, Storage.StorageChange>) => {
      if (changes[key]) _setValue(changes[key].newValue)
    }
    storage.onChanged.addListener(callback)
    return () => {
      storage.onChanged.removeListener(callback)
    }
  }, [key, initialValue])

  const setValue = async (val: T | null) => {
    _setValue(val)
    await storage.local.set({ [key]: val })
  }

  return [value, setValue] as [T | null, (val: T) => void]
}
