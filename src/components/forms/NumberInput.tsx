import React from 'react';

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suffix?: string; // "円"など
  error?: string;
  className?: string;
  onClick?: () => void;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  placeholder = "",
  suffix,
  error,
  className = "",
  onClick
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // 数値のみを許可（空文字は許可）
    if (newValue === '' || /^\d+$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        onClick={onClick}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 text-primary bg-white border-2 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500' : 'border-sub-border'}
          ${suffix ? 'pr-12' : ''}
        `}
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary font-medium">
          {suffix}
        </span>
      )}
    </div>
  );
};

export default NumberInput;