import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "../hooks/theme/useTheme";

const Button = ({
  text = "Button",
  onClick,
  type = "button",
  variant = 1,
  disabled = false,
  icon,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    if (disabled) {
      return {
        base: "opacity-50 cursor-not-allowed",
        style: {
          backgroundColor: "#e5e7eb",
          borderColor: "#d1d5db",
          color: "#6b7280",
        },
      };
    }

    switch (variant) {
      case 1:
        return {
          base: "text-white border",
          style: {
            backgroundColor: theme?.primaryColor,
            borderColor: theme?.primaryColor,
            color: "white",
          },
          hover: {
            backgroundColor: theme?.highlightColor,
            color: "black",
          },
        };
      case 2:
        return {
          base: "text-white border",
          style: {
            backgroundColor: theme?.secondaryColor,
            color: "black",
          },
        };
      case 3:
        return {
          base: "border",
          style: {
            backgroundColor: "transparent",
            borderColor: theme?.primaryColor,
            color: theme?.primaryColor,
          },
          hover: {
            backgroundColor: theme?.highlightColor,
            color: "black",
          },
        };
      default:
        return {};
    }
  };

  const variantStyles = getButtonStyle();

  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`text-base text-center flex gap-1 px-4 py-2 rounded-md transition ${variantStyles.base}`}
      style={variantStyles.style}
      onMouseEnter={(e) => {
        if (!disabled && variantStyles.hover) {
          e.currentTarget.style.backgroundColor =
            variantStyles.hover.backgroundColor;
          e.currentTarget.style.color = variantStyles.hover.color;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && variantStyles.style) {
          e.currentTarget.style.backgroundColor =
            variantStyles.style.backgroundColor;
          e.currentTarget.style.color = variantStyles.style.color;
        }
      }}
    >
      {icon}
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([1, 2, 3]),
  disabled: PropTypes.bool,
  icon: PropTypes.element,
};

export default Button;
