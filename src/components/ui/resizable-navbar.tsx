"use client";
import { cn } from "@/lib/utils";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";

import React, { JSX, useCallback, useEffect, useRef, useState } from "react";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItem {
  name: string;
  items?: NavItem[];
  content?: JSX.Element
  link?: string;
}

interface NavItemsProps {
  items: NavItem[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn("sticky inset-x-0 top-20 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
            child as React.ReactElement<{ visible?: boolean }>,
            { visible },
          )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "800px",
      }}
      className={cn(
        "relative z-[60] mx-0 hidden w-full max-w-full rounded-none flex-row items-center justify-between self-start bg-transparent px-4 py-4 lg:flex dark:bg-transparent",
        visible && "bg-popover/80 dark:bg-popover/80",
        className,
      )}
    >
      <div className="flex flex-row justify-between items-center w-full max-w-[1200px] mx-auto">
        {children}
      </div>
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  // Function to close dropdown
  const closeDropdown = () => {
    setHovered(null);
  };

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-popover-foreground transition duration-200 hover:text-popover-foreground/80 lg:flex lg:space-x-2",
        className,
      )}
    >
      {items.map((item, idx) => (
        item.items ? (
          <div key={`nav-item-${idx}`} className="relative group">
            <span
              className="cursor-pointer flex px-4 py-2 text-lg gap-1 items-center justify-center text-popover-foreground/80 group-hover:text-accent-foreground/70"
              onMouseEnter={() => setHovered(idx)}
              onClick={onItemClick}
            >
              {item.name}
              <ChevronDown
                size={20}
                className="text-popover-foreground/60 group-hover:text-accent-foreground/70 transition-all duration-300"
                style={{
                  transform: hovered === idx ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease"
                }}
              />
            </span>
            {hovered === idx && item.items && (
              <motion.div
                layoutId="hovered"
                className="absolute bg-popover left-0 top-full mt-3 overflow-hidden w-max rounded-lg shadow-lg border border-border"
              >
                {item.items.map((subItem, subIdx) => (
                  <Link
                    key={`sub-item-${subIdx}`}
                    href={subItem.link!}
                    className="block px-4 py-2 text-popover-foreground hover:text-accent-foreground/70 hover:bg-primary/5 transition-all ease-in-out duration-200"
                    onClick={closeDropdown}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        ) : item.content ? (
          <div key={`nav-item-${idx}`} className="relative group">
            <span
              className="cursor-pointer flex px-4 py-2 text-lg gap-1 items-center justify-center text-popover-foreground/80 group-hover:text-accent-foreground/70"
              onMouseEnter={() => setHovered(idx)}
              onClick={onItemClick}
            >
              {item.name}
              <ChevronDown
                size={20}
                className="text-popover-foreground/60 group-hover:text-accent-foreground/70 transition-all duration-300"
                style={{
                  transform: hovered === idx ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease"
                }}
              />
            </span>
            {hovered === idx && (
              <motion.div
                layoutId="hovered"
                className="absolute bg-card left-1/2 transform translate-y-2 -translate-x-1/2 top-full overflow-hidden w-[950px] overflow-y-auto rounded-lg shadow-lg border border-border z-50 mb-8"
              >
                <div className="p-6" onClick={closeDropdown}>
                  {item.content}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <Link
            onMouseEnter={() => setHovered(idx)}
            onClick={onItemClick}
            className="relative px-4 py-2 text-lg text-popover-foreground/80 hover:text-accent-foreground/70 transition-all duration-300 ease-in-out"
            key={`link-${idx}`}
            href={item.link!}
          >
            {hovered === idx && (
              <motion.div
                layoutId="hovered"
                className="absolute inset-0 h-full w-full rounded-full bg-popover-foreground/10"
              />
            )}
            <span className="relative z-20">{item.name}</span>
          </Link>
        )
      ))}
    </motion.div>
  );
};



export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
        visible && "bg-popover",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-popover px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] border border-border",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = (idx: number) => {
    setExpanded(expanded === idx ? null : idx);
  };

  // Handle scroll position detection
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const threshold = 10; // 10px threshold for better UX
    
    const atTop = scrollTop <= threshold;
    const atBottom = scrollTop + clientHeight >= scrollHeight - threshold;
    
    setIsAtTop(atTop);
    setIsAtBottom(atBottom);

    // Enable page scroll when at boundaries
    if (atTop || atBottom) {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
    } else {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }
  }, []);

  // Initial setup and cleanup
  useEffect(() => {
    // Initially prevent background scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, []);

  // Add scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial scroll position
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex flex-col w-full h-full max-h-[calc(100vh-200px)] overflow-y-auto overscroll-contain scroll-smooth",
        className
      )}
      style={{
        // Better scrollbar styling
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(155, 155, 155, 0.3) transparent'
      }}
    >
      {/* Scroll indicator at top */}
      {!isAtTop && (
        <div className="sticky top-0 z-10 flex justify-center py-1 bg-gradient-to-b from-popover to-transparent">
          <div className="w-8 h-1 bg-popover-foreground/20 rounded-full"></div>
        </div>
      )}

      {items.map((item, idx) => (
        <div key={`mobile-nav-item-${idx}`} className="w-full flex-shrink-0">
          {item.items || item.content ? (
            <div>
              <button
                className="flex w-full items-center justify-between px-4 py-3 text-left text-popover-foreground hover:bg-popover-foreground/10 rounded-md transition-colors duration-200"
                onClick={() => toggleExpanded(idx)}
              >
                <span className="font-medium">{item.name}</span>
                <ChevronDown
                  size={20}
                  className="text-popover-foreground/60 transition-transform duration-300 flex-shrink-0"
                  style={{
                    transform: expanded === idx ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease"
                  }}
                />
              </button>

              <AnimatePresence>
                {expanded === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                    onAnimationComplete={() => {
                      // Recalculate scroll position after animation
                      setTimeout(handleScroll, 50);
                    }}
                  >
                    <div className="pl-4 py-2 space-y-1">
                      {item.items ? (
                        item.items.map((subItem, subIdx) => (
                          subItem.link ? (
                            <Link
                              key={`mobile-sub-item-${subIdx}`}
                              href={subItem.link}
                              className="block px-4 py-2 text-sm text-popover-foreground/70 hover:bg-popover-foreground/10 hover:text-popover-foreground rounded-md transition-colors duration-200"
                              onClick={onItemClick} // Close mobile navbar
                            >
                              {subItem.name}
                            </Link>
                          ) : (
                            <span
                              key={`mobile-sub-item-${subIdx}`}
                              className="block px-4 py-2 text-sm text-popover-foreground/70"
                            >
                              {subItem.name}
                            </span>
                          )
                        ))
                      ) : (
                        <div 
                          className="px-4 py-2"
                          onClick={(e) => {
                            // Check if clicked element is a link
                            const target = e.target as HTMLElement;
                            if (target.tagName === 'A' || target.closest('a')) {
                              onItemClick?.(); // Close mobile navbar when any link is clicked
                            }
                          }}
                        >
                          {item.content}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            item.link ? (
              <Link
                href={item.link}
                className="block px-4 py-3 text-popover-foreground hover:bg-popover-foreground/10 rounded-md transition-colors duration-200 font-medium"
                onClick={onItemClick} // Close mobile navbar
              >
                {item.name}
              </Link>
            ) : (
              <span className="block px-4 py-3 text-popover-foreground/70 font-medium">
                {item.name}
              </span>
            )
          )}
        </div>
      ))}

      {/* Scroll indicator at bottom */}
      {!isAtBottom && (
        <div className="sticky bottom-0 z-10 flex justify-center py-1 bg-gradient-to-t from-popover to-transparent">
          <div className="w-8 h-1 bg-popover-foreground/20 rounded-full"></div>
        </div>
      )}
    </div>
  );
};



export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <X className="text-popover-foreground" onClick={onClick} />
  ) : (
    <Menu className="text-popover-foreground" onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-popover-foreground"
    >
      <Image
        src="https://www.ridipt.com/assets/R1-CqCnrtdU.png"
        alt="logo"
        width={40}
        height={40}
      />
      <span className="font-bold text-lg text-popover-foreground hover:text-accent-foreground transition-all duration-300 ease-in-out">RIDIPT</span>
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "button",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
    | React.ComponentPropsWithoutRef<"a">
    | React.ComponentPropsWithoutRef<"button">
  )) => {

  const baseStyles =
    "px-4 py-2 rounded-md button text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

  const variantStyles = {
    primary:
      "bg-popover text-popover-foreground shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] border border-border",
    secondary: "bg-transparent shadow-none text-popover-foreground",
    dark: "bg-popover-foreground text-popover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    gradient:
      "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
  };

  if (href) {
    return (
      <Link
        href={href}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...(props as React.ComponentPropsWithoutRef<"a">)}
      >
        {children}
      </Link>
    );
  }

  return (
    <Tag
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};