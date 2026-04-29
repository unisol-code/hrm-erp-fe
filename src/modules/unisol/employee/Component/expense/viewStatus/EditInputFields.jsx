import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const EditInputFields = ({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  className = '',
  options = [],
  label,
  error,
  helperText,
  disabled = false,
  icon: Icon,
  ...props 
}) => {
  const inputBaseClasses = "w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70";
  const inputClasses = `${inputBaseClasses} ${
    error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
  } ${className}`;

  const renderInput = () => {
    if (type === 'select' && options.length > 0) {
      return (
        <select
          value={value}
          onChange={onChange}
          className={inputClasses}
          required={required}
          disabled={disabled}
          {...props}
        >
          <option value="" className="text-gray-400">Select...</option>
          {options.map(option => (
            <option key={option.value} value={option.value} className="text-gray-700">
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${inputClasses} min-h-[100px] resize-y`}
          required={required}
          disabled={disabled}
          {...props}
        />
      );
    }

    if (type === 'number') {
      return (
        <div className="relative">
          <input
            type="number"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClasses}
            required={required}
            step="0.01"
            min="0"
            disabled={disabled}
            {...props}
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
        </div>
      );
    }

    return (
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          required={required}
          disabled={disabled}
          {...props}
        />
        {Icon && (
          <Icon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-sm font-medium ${error ? 'text-red-600' : 'text-gray-700'}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {renderInput()}
      </div>
      {(error || helperText) && (
        <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'} flex items-center gap-1`}>
          {error && <FiAlertCircle className="flex-shrink-0" />}
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default EditInputFields;