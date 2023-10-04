import { atom } from "recoil";
export const SearchState = atom({
  key: "SearchState",
  default: {
    keyword: null,
    results: [],
  },
});
