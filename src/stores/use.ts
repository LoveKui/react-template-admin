import { create } from "zustand";
import * as userAPI from "@/services/user/api";

interface UserState {
  fetch: () => void;
  users: any;
}

const useUseData = create<UserState>((set) => ({
  users: [],
  fetch: async () => {
    const res = await userAPI.getUserList({
      pageNum: 1,
      pageSize: 20,
    });

    set({
      users: res.data || [],
    });

    return res.data;
  },
}));

export default useUseData;
