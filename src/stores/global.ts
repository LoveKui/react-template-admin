import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GlobalState {
  primaryColor: string;
  setColor: (color: string) => void;
  oauth: any;
  setOauth: (value: any) => void;
}

//partialize 过滤属性，存储哪些字段到localStorage
const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      primaryColor: "#247fff",
      setColor: (color) => set(() => ({ primaryColor: color })),
      oauth: null,
      setOauth: (value) => set(() => ({ oauth: value }))
    }),
    {
      name: "primaryColor",
      partialize: (state) =>

        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            ["primaryColor", "oauth"].includes(key)
          )
        ),
    }
  )
);

export default useGlobalStore;
