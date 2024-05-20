// src/components/common/Input.tsx

import React from 'react';

const Input: React.FC<{ value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ value, onChange }) => {
  return (
    <input type="text" value={value} onChange={onChange} />
  );
};

export default Input;

export {};
