"use client";

import { useState } from "react";
import EditModalCategories from "./EditModalCategories";
export function EditAction({ categoryId, refreshData }) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <>
      <button
        className="p-2 hover:bg-gray-700 rounded-md transition-all text-admin-text-muted hover:text-white"
        onClick={() => setIsOpenModal(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>

      <EditModalCategories
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        id={categoryId}
        onSave={refreshData}
      />
    </>
  );
}
