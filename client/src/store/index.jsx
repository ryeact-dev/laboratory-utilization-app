import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const headerStore = create((set) => ({
  pageTitle: "", // current page title state management
  setPageTitle: ({ title }) => set(() => ({ pageTitle: title })),
}));

export const modalStore = create((set) => ({
  title: "", // current  title state management
  isOpen: false, // modal state management for opening closing
  bodyType: "", // modal content management
  size: "", // modal content management
  extraObject: {},

  openModal: ({ title, bodyType, extraObject, size }) =>
    set(() => ({
      isOpen: true,
      bodyType: bodyType,
      title: title,
      size: size || "max-w-md",
      extraObject: extraObject,
    })),
  closeModal: () =>
    set(() => ({
      isOpen: false,
      bodyType: "",
      title: "",
      extraObject: {},
    })),
}));

const INITIAL_BORROWER_SLIP_DATA = {
  id: "",
  laboratory: "",
  step: "1",
  subject_id: "",
};

export const borrowerSlipStore = create(
  persist(
    (set, get) => ({
      ...INITIAL_BORROWER_SLIP_DATA,
      setBorrowerSlipData: ({ id, laboratory, step }) =>
        set(() => ({ id, laboratory, step })),
      setResetBorrowerSlipData: () =>
        set(() => ({ ...INITIAL_BORROWER_SLIP_DATA })),
    }),
    {
      name: "borrower__slip__data", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

// const INITIAL_USER_DATA = {
//   currentUser: null,
//   activeSchoolYear: null,
//   activeTermSem: null,
//   termSemEndingDate: null,
//   termSemStartingDate: null,
//   syEndingDate: null,
//   syStaringDate: null,
// };

// export const userStore = create(
//   persist(
//     (set, get) => ({
//       ...INITIAL_USER_DATA,
//       setCurrentUser: (userInfo) => set(() => userInfo),
//     }),
//     {
//       name: "user__data", // name of the item in the storage (must be unique)
//       storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
//     },
//   ),
// );
