import React from 'react';

interface LopayLogoProps {
  variant?: 'full' | 'icon' | 'header';
  theme?: 'dark' | 'light';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const LopayLogoMark: React.FC<{
  className?: string;
  color?: string;
  accentColor?: string;
  size?: number;
}> = ({ className = 'w-10 h-10', color = 'currentColor', accentColor = '#000000', size }) => {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Skullcap / Cap Base (rounded bottom) */}
      <path
        d="M44 95C44 125 68 152 100 152C132 152 156 125 156 95C140 106 121 113 100 113C79 113 60 106 44 95Z"
        fill={color}
      />

      {/* Mortarboard Diamond Top */}
      <polygon
        points="100,34 180,80 100,126 20,80"
        fill={color}
      />

      {/* Stylized Block 'E' in negative space on Mortarboard */}
      <g fill={accentColor}>
        {/* Back vertical spine */}
        <rect x="80" y="65" width="40" height="8" rx="1.5" />
        <rect x="80" y="73" width="10" height="22" />
        <rect x="80" y="80" width="32" height="7" rx="1.5" />
        <rect x="80" y="95" width="40" height="8" rx="1.5" />
      </g>

      {/* Hanging Tassel on the right */}
      <g fill={color}>
        {/* Tassel cord connector */}
        <path
          d="M174 80L174 88C174 90 172 92 170 92L168 92"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Tassel hanging drop */}
        <rect x="168" y="86" width="12" height="42" rx="3" fill={color} />
      </g>
    </svg>
  );
};

export const LopayLogo: React.FC<LopayLogoProps> = ({
  variant = 'header',
  theme = 'light',
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const isDark = theme === 'dark';
  const primaryTextColor = isDark ? '#FFFFFF' : '#0b1c30';
  const subtitleColor = isDark ? '#A1A1AA' : '#45464d';
  const markColor = isDark ? '#FFFFFF' : '#0b1c30';
  const accentColor = isDark ? '#000000' : '#FFFFFF';

  if (variant === 'icon') {
    const iconSize = size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 80;
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <LopayLogoMark size={iconSize} color={markColor} accentColor={accentColor} />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {/* Logo Mark */}
        <div className="relative flex items-center justify-center mb-5">
          <LopayLogoMark
            size={size === 'xl' ? 120 : size === 'lg' ? 96 : 72}
            color={markColor}
            accentColor={accentColor}
          />
        </div>

        {/* LOPAY Brand Wordmark */}
        <h1
          className={`font-extrabold tracking-[0.08em] uppercase ${
            size === 'xl'
              ? 'text-4xl sm:text-5xl'
              : size === 'lg'
              ? 'text-3xl'
              : 'text-2xl'
          }`}
          style={{ color: primaryTextColor, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          LOPAY
        </h1>

        {/* TECHNOLOGIES Subtitle */}
        {showSubtitle && (
          <span
            className="text-[11px] sm:text-[12px] font-semibold tracking-[0.38em] uppercase mt-1.5 ml-1"
            style={{ color: subtitleColor }}
          >
            TECHNOLOGIES
          </span>
        )}
      </div>
    );
  }

  // variant === 'header' (Horizontal layout for top nav headers)
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className="shrink-0 flex items-center justify-center">
        <LopayLogoMark size={32} color={markColor} accentColor={accentColor} />
      </div>
      <div className="flex flex-col justify-center leading-none">
        <span
          className="text-[18px] font-extrabold tracking-[0.08em] uppercase leading-none"
          style={{ color: primaryTextColor }}
        >
          LOPAY
        </span>
        {showSubtitle && (
          <span
            className="text-[8px] font-bold tracking-[0.32em] uppercase mt-0.5"
            style={{ color: subtitleColor }}
          >
            TECHNOLOGIES
          </span>
        )}
      </div>
    </div>
  );
};
