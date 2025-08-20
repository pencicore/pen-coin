import { create } from "zustand";

const userStore = create((set) => ({
  login: false,
  address: null,
  ethCount: 0,
  penCount: 0,
  setLogin: (login) => set(() => ({ login })),
  setAddress: (address) => set(() => ({ address })),
  setEthCount: (ethCount) => set(() => ({ ethCount })),
  setPenCount: (penCount) => set(() => ({ penCount })),
}));

export default userStore;