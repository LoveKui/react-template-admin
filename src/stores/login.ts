import { create } from "zustand";
import { persist } from "zustand/middleware";

type Info = Record<string, any> | null;
type Token = Record<string, any> | null;

interface LoginState {
  userInfo: Info;
  setUserInfo: (info: Info) => void;
  token: Token;
  setToken: (token: Token) => void;
}

const useLoginStore = create<LoginState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      setUserInfo: (info) => set(() => ({ userInfo: info })),
      setToken: (token) => set(() => ({ token: token })),
    }),
    {
      name: "userInfo",
    }
  )
);

export default useLoginStore;
