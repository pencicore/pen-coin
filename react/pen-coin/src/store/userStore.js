import { create } from "zustand";

const userStore = create((set) => ({
  login: false,
  address: null,
  ethCount: 0,
  penCount: 0,
  playCount: 0,
  setLogin: (login) => set(() => ({ login })),
  setAddress: (address) => set(() => ({ address })),
  setEthCount: (ethCount) => set(() => ({ ethCount })),
  setPenCount: (penCount) => set(() => ({ penCount })),
  setPlayCount: () => set((state) => ({ playCount: state.playCount + 1 })),
}));

export default userStore;