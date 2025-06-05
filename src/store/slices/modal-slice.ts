import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  title: string;
  content: string;
  onConfirm?: () => void;
  template?: "DELETE" | "EDIT" | "ERROR"; // Optional template for modal content
  component?: React.ReactNode; // Optional custom component to render in the modal
}
const initialState: ModalState = {
  isOpen: false,
  title: "",
  content: "",
  component: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (_state, action: PayloadAction<Omit<ModalState, "isOpen">>) => {
      return { ...action.payload, isOpen: true };
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
