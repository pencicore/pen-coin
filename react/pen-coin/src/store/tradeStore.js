import { create } from "zustand";

const tradeStore = create((set) => ({
    pricePEN: 0.0,
    priceETH: 0.0,
    setPricePEN: (pricePEN) => set(() => ({ pricePEN })),
    setPriceETH: (priceETH) => set(() => ({ priceETH })),
}));

export default tradeStore;