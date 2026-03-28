import React from 'react';

// ==========================================
// SYSTEM UTILS
// ==========================================
const cn = (...classes) => classes.filter(Boolean).join(' ');

// ==========================================
// LAYOUT PRIMITIVES
// ==========================================

/**
 * Screen — root layout wrapper.
 * Forces the dark, deep-black theme.
 */
const Screen = ({ children }) => (
  <div className="min-h-screen w-full bg-[#050505] text-white font-sans antialiased selection:bg-red-600/30 scroll-smooth overflow-x-hidden transition-colors duration-500 flex flex-col">
    {children}
  </div>
);

/**
 * Background — global decorative environmental grid.
 */
const Background = () => (
  <div 
    className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
    style={{ 
      backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, 
      backgroundSize: '60px 60px' 
    }} 
  />
);

/**
 * Section — top-level page block with technical rhythm.
 */
const Section = ({ children, id, border = false, bg = '', py = '20', overflow = false, relative = true, align = 'left' }) => {
  const pyMap = {
    '0': '',
    '8': 'py-8',
    '12': 'py-12 md:py-20',
    '20': 'py-20 md:py-32',
    '24': 'py-24 md:py-32',
    '32': 'py-32 md:py-48',
  };

  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <section
      id={id}
      className={cn(
        "relative z-10 w-full",
        pyMap[py],
        border && "border-t border-white/5",
        bg,
        overflow && 'overflow-hidden',
        relative && 'relative',
        alignMap[align],
      )}
    >
      {children}
    </section>
  );
};

/**
 * Container — max-width centered wrapper.
 */
const Container = ({ children, size = '7xl' }) => {
  const sizeMap = {
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-none px-12',
  };

  return (
    <div className={cn('w-full mx-auto px-6 md:px-12', sizeMap[size])}>
      {children}
    </div>
  );
};

/**
 * Grid — CSS grid with responsive column control.
 */
const Grid = ({ children, cols = 1, sm = null, md = 2, lg = 3, gap = 8, items = 'start' }) => {
  const colMap = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };
  const smMap = { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' };
  const mdMap = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3' };
  const lgMap = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    hero: 'lg:grid-cols-[1fr_500px]',
  };
  
  return (
    <div className={cn('grid w-full', colMap[cols], sm && smMap[sm], md && mdMap[md], lg && lgMap[lg], `gap-${gap}`, `items-${items}`)}>
      {children}
    </div>
  );
};

/**
 * Stack — flex layout engine.
 */
const Stack = ({
  children,
  gap = 4,
  align = 'start',
  vertical = true,
  justify = 'start',
  wrap = false,
  fullWidth = false,
  as: Tag = 'div'
}) => {
  const alignMap = { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch' };
  const justifyMap = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between' };

  return (
    <Tag className={cn(
      'flex w-full',
      vertical ? 'flex-col' : 'flex-row',
      !vertical && wrap && 'flex-wrap',
      `gap-${gap}`,
      alignMap[align],
      justifyMap[justify],
      align === 'center' && !vertical && 'mx-auto',
    )}>
      {children}
    </Tag>
  );
};

// ==========================================
// TYPOGRAPHY SYSTEM
// ==========================================

/**
 * Display — massive technical heading.
 */
const Display = ({ children, accent = false, outline = false }) => {
  const style = outline ? { WebkitTextStroke: '1px rgba(255,255,255,0.3)' } : {};
  return (
    <span 
      style={style}
      className={cn(
        "text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] block",
        accent ? "text-red-600" : outline ? "text-transparent" : "text-white"
      )}
    >
      {children}
    </span>
  );
};

/**
 * Heading — section/subsection title.
 */
const Heading = ({ children, level = 2, accent = false }) => {
  const Tag = `h${level}`;
  const sizes = { 2: "text-4xl md:text-5xl", 3: "text-xl md:text-2xl", 4: "text-sm md:text-base tracking-widest" };
  return (
    <Tag className={cn(
      "font-black uppercase tracking-tighter leading-none", 
      sizes[level],
      accent ? "text-red-600" : "text-white"
    )}>
      {children}
    </Tag>
  );
};

/**
 * Accent — inline colored span.
 */
const Accent = ({ children, color = 'red' }) => {
  const colorMap = {
    red: 'text-red-600',
    gray: 'text-gray-500',
    white: 'text-white',
  };
  return <span className={colorMap[color] || colorMap.red}>{children}</span>;
};

/**
 * Text — body / caption text.
 */
const Text = ({ children, size = 'base', muted = false, mono = false, maxWidth = false, weight = 'normal', align = 'left', color = '', className = '' }) => {
  const sizeMap = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-sm md:text-base',
    'lg': 'text-lg md:text-xl font-light',
  };

  const weightMap = {
    'normal': 'font-normal',
    'medium': 'font-medium',
    'bold': 'font-bold',
    'black': 'font-black',
  };

  const alignMap = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right',
  };

  return (
    <p className={cn(
      color || (muted ? "text-gray-500" : "text-gray-300"),
      sizeMap[size] || sizeMap.base,
      weight === 'medium' ? 'font-medium' : weightMap[weight],
      alignMap[align],
      mono && "font-mono uppercase tracking-[0.1em] text-xs",
      maxWidth && "max-w-3xl", 
      "leading-relaxed",
      className
    )}>
      {children}
    </p>
  );
};

// ==========================================
// UI ATOMS
// ==========================================

const Button = ({ label, hoverLabel, icon: Icon, variant = 'primary', size = 'md', as: Tag = 'button', className = '', ...props }) => {
  const variants = {
    primary: "bg-red-600 border-red-900 border text-white shadow-xl shadow-red-500/20",
    secondary: "bg-white/10 border-white/20 border text-white hover:bg-white/20",
    outline: "border-2 border-red-600/30 text-gray-300 hover:border-red-600 hover:text-white"
  };

  const sizes = {
    sm: "px-6 py-2.5 text-[10px]",
    md: "px-8 py-4 text-xs",
    lg: "px-10 py-5 text-sm"
  };

  return (
    <Tag 
      {...props}
      className={cn(
        "group inline-flex items-center gap-2.5 font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 active:scale-95",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 18} className="group-hover:rotate-12 transition-transform shrink-0" />}
      <span className="relative overflow-hidden inline-block h-[1.2em]">
        <span className={cn(
          "inline-block transition-transform duration-300",
          hoverLabel && "group-hover:-translate-y-full"
        )}>
          {label}
        </span>
        {hoverLabel && (
          <span className="absolute left-0 top-full inline-block transition-transform duration-300 group-hover:-translate-y-full text-[0.85em] font-bold text-red-500 italic whitespace-nowrap">
            {hoverLabel}
          </span>
        )}
        {/* Ghost label to reserve width */}
        {hoverLabel && (
          <span className="invisible h-0 block text-[0.85em] font-bold italic whitespace-nowrap overflow-hidden">
            {hoverLabel}
          </span>
        )}
      </span>
    </Tag>
  );
};

const Card = ({ children, padding = '8', interactive = false, className = '', as: Tag = 'div', ...props }) => {
  const paddingMap = {
    '0': 'p-0',
    '4': 'p-4',
    '6': 'p-6',
    '8': 'p-8',
    '12': 'p-12 md:p-16',
  };

  return (
    <Tag 
      {...props}
      className={cn(
        "bg-white/5 border border-white/10 rounded-[2.5rem] transition-all duration-500 overflow-hidden",
        paddingMap[padding],
        interactive && "hover:bg-white/10 hover:border-red-600/30 hover:shadow-2xl hover:shadow-red-600/10 cursor-pointer group",
        className
      )}
    >
      {children}
    </Tag>
  );
};
const Badge = ({ children, className = '' }) => (
  <div className={cn(
    "inline-flex border border-red-600/20 bg-red-600/5 px-3 py-1 font-mono text-xs text-red-500 uppercase tracking-widest",
    className
  )}>
    {children}
  </div>
);

const IconBox = ({ icon: Icon, color = 'red' }) => {
  const colorMap = {
    red: 'text-red-600',
    white: 'text-white opacity-60'
  };
  return <Icon size={20} className={colorMap[color]} />;
};

const Terminal = ({ logs = [] }) => (
  <Card>
    <Stack gap={4}>
      <Stack vertical={false} align="center" gap={2}>
        <span className="w-3 h-3 rounded-full bg-red-600/20 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
        </span>
        <Text mono muted>Kernel Status</Text>
      </Stack>
      <div className="space-y-2 opacity-60">
        {logs.map((log, i) => (
          <div key={i} className="font-mono text-[11px] text-red-500">
            <span className="text-red-900/60 mr-2">[{i}]</span> {log}
          </div>
        ))}
      </div>
      <div className="h-1 bg-red-950/30 mt-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-red-600 w-1/3 animate-pulse" />
      </div>
    </Stack>
  </Card>
);

// ==========================================
// EXPORTS
// ==========================================

/**
 * GithubIcon — Custom SVG for Github.
 */
const GithubIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export {
  Screen,
  Background,
  Section,
  Container,
  Grid,
  Stack,
  Display,
  Heading,
  Accent,
  Text,
  Button,
  Card,
  Badge,
  IconBox,
  Terminal,
  GithubIcon,
};

