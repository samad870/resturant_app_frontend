import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: {}, // store items by id
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, item } = action.payload;
      if (!state.items[id]) {
        state.items[id] = { ...item, quantity: 1 };
      } else {
        state.items[id].quantity += 1;
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      if (state.items[id]) {
        state.items[id].quantity -= 1;
        if (state.items[id].quantity <= 0) {
          delete state.items[id];
        }
      }
    },
    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
