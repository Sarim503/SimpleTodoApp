"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const navigateToTodolist = () => {
    router.push("/Todolist");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>sarim khan project</h1>
      <button
        onClick={navigateToTodolist}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Go to Todo List
      </button>
    </div>
  );
}
