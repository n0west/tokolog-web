import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  children,
  error,
  className = ""
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* ラベル */}
      <label className="block text-sm font-bold text-primary">
        {label}
        {required && (
          <span className="ml-1 text-red-500 text-xs">必須</span>
        )}
      </label>
      
      {/* 入力フィールド */}
      <div>
        {children}
      </div>
      
      {/* エラーメッセージ */}
      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;