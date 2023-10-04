import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();
export const CartState = atom({
  key: "CartState",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const CartItemState = atom({
  key: "CartItemState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
