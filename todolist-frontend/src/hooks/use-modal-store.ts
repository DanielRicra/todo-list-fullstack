import { create } from "zustand";
import type { Task } from "../types";

interface ModalStore {
   isOpen: boolean;
   taskToUpdate: null | Task;
   onClose: () => void;
   onOpen: (task: Task) => void;
}

const useModalStore = create<ModalStore>()((set) => ({
   isOpen: false,
   taskToUpdate: null,
   onOpen: (task: Task) => set(() => ({ isOpen: true, taskToUpdate: task })),
   onClose: () => set(() => ({ isOpen: false, taskToUpdate: null })),
}));

export default useModalStore;
