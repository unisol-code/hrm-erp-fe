import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import {
  Gift,
  TrendingUp,
  Check,
  Users,
  Award
} from 'lucide-react';
import { useTheme } from '../../../../hooks/theme/useTheme';

const PlanCard = ({
  type,
  title,
  description,
  features = [],
  price,
  originalPrice,
  subtitle,
  isPopular = false,
  onSelect,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSelect = () => {
    setIsSelected(!isSelected);
    onSelect?.();
  };

  const Icon = type === 'bonus' ? Gift : TrendingUp;
  const accentColor = type === 'bonus' ? 'blue' : 'purple';
  const secondaryIcon = type === 'bonus' ? Users : Award;
  const { theme } = useTheme();
  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelect}
      sx={{
        cursor: 'pointer',
        transform: isSelected || isHovered ? 'scale(1.02) translateY(-8px)' : 'none',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
      }}
    >

      <Card
        variant="outlined"
        sx={{
          borderRadius: 4,
          boxShadow: isSelected
            ? `0 0 20px ${type === 'bonus' ? 'rgba(59,130,246,0.3)' : 'rgba(168,85,247,0.3)'}`
            : '0 4px 16px rgba(0,0,0,0.1)',
          borderColor: isSelected
            ? type === 'bonus' ? 'blue.400' : 'purple.400'
            : isPopular ? 'yellow.300' : 'grey.200',
          backgroundColor: '#ffffffdd',
          backdropFilter: 'blur(8px)',
        }}
      >
        <CardContent>

          {/* Icon */}
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: type === 'bonus'
                  ? 'linear-gradient(to bottom right, #3b82f6, #22d3ee)'
                  : 'linear-gradient(to bottom right, #a855f7, #ec4899)',
                position: 'relative',
              }}
            >
              <Icon color="white" size={28} />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {React.createElement(secondaryIcon, {
                  size: 14,
                  color: type === 'bonus' ? '#3b82f6' : '#a855f7',
                })}
              </Box>
            </Box>

            <Box>
              <Typography variant="h6">{title}</Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  color={type === 'bonus' ? 'blue' : 'purple'}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Description */}
          {description && (
            <Typography variant="body2" color="text.secondary" mb={2}>
              {description}
            </Typography>
          )}

          {/* Price */}
          {price && (
            <Box
              textAlign="center"
              mb={2}
              p={2}
              sx={{
                backgroundColor: '#f9fafb',
                borderRadius: 2,
              }}
            >
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                {originalPrice && (
                  <Typography
                    variant="body1"
                    sx={{ textDecoration: 'line-through', color: 'gray' }}
                  >
                    {originalPrice}
                  </Typography>
                )}
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={type === 'bonus' ? 'blue' : 'purple'}
                >
                  {price}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Employee tier level
              </Typography>
            </Box>
          )}

          {/* Features */}
          {features.length > 0 && (
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Plan Benefits
              </Typography>
              <Stack spacing={1}>
                {features.map((feature, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        backgroundColor: type === 'bonus' ? '#dbeafe' : '#f3e8ff',
                        borderRadius: 1,
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check
                        size={14}
                        color={type === 'bonus' ? '#2563eb' : '#9333ea'}
                      />
                    </Box>
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
          <Box mt={2}>
            <button
              style={{ backgroundColor: theme.primaryColor }}
              className="w-full text-white px-6 py-2 rounded-lg flex justify-center items-center font-semibold text-lg shadow-md hover:scale-[1.02] transition duration-300"
            >
              {isSelected ? 'Selected ✓' : 'Select This Plan'}
            </button>
          </Box>



          {/* Tier Label */}
          <Box mt={2} textAlign="center">
            <Chip
              label="Employee rewards program"
              size="small"
              sx={{
                backgroundColor: type === 'bonus' ? '#eff6ff' : '#f3e8ff',
                color: type === 'bonus' ? '#2563eb' : '#9333ea',
                border: `1px solid ${type === 'bonus' ? '#bfdbfe' : '#e9d5ff'}`,
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PlanCard;