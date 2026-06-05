import React, { useState } from 'react';

/**
 * TodoInput Component: 새로운 할 일을 입력받는 영역
 */
const TodoInput = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setErrorMessage('내용을 입력해 주세요!');
      return;
    }

    onAdd(inputValue);
    setInputValue('');
    setErrorMessage('');
  };

  return (
    <div className="mb-5">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          className="w-full pl-4 pr-16 py-3.5 bg-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#672be0] transition-all text-slate-700 placeholder-slate-400"
          placeholder="새로운 할 일 추가..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-4 bg-[#672be0] text-white rounded-xl font-medium hover:bg-[#5421b8] active:scale-95 transition-all"
        >
          추가
        </button>
      </form>
      
      {errorMessage && (
        <p className="text-red-500 text-xs mt-2 ml-2 font-medium">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default TodoInput;