import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HeroForm } from '../heroServises'

type useHeroDraftStoreType = {
  draft: HeroForm
  setDraft: (update: Partial<HeroForm> | ((prev: HeroForm) => Partial<HeroForm>)) => void
  clearDraft: () => void
}

const initialDraft: HeroForm = {
    nickname: '',
    real_name: '',
    origin_description: '',
    superpowers: '',
    catch_phrase: '',
    images: new DataTransfer().files,
}

export const useHeroDraftStore = create<useHeroDraftStoreType>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: (update) =>
        set(state => {
          const partial = typeof update === 'function' ? update(state.draft) : update
          return { draft: { ...state.draft, ...partial } }
        }),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: 'hero-draft',
      partialize: state => ({ draft: state.draft }),
    }
  )
)