import React from 'react';

/**
 * TodoFilter Component: 전체, 진행 중, 완료 상태를 전환하는 탭 메뉴 영역
 */
const TodoFilter = ({ currentFilter, onFilterChange }) => {
  const filterOptions = [
    { key: 'ALL', label: '전체' },
    { key: 'ACTIVE', label: '진행 중' },
    { key: 'COMPLETED', label: '완료' },
  ];

  return (
    <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6">
      {filterOptions.map((option) => {
        const isActive = currentFilter === option.key;
        return (
          <button
            key={option.key}
            onClick={() => onFilterChange(option.key)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              isActive
                ? 'bg-white text-[#672be0] shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default TodoFilter;