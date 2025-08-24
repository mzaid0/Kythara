"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  SendToBack,
  Settings,
  ShoppingBasket,
  UserCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { RiCoupon4Line, RiCouponLine } from "react-icons/ri";
import { MdOutlineCategory } from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";

const sidebarVariants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "3.05rem",
  },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
};

const transitionProps = {
  type: "tween" as const,
  ease: "easeOut" as const,
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

export function AdminSidebar({ onExpandChange }: { onExpandChange?: (expanded: boolean) => void }) {

  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();

  const sideBarOptions = [
    {
      id: 1,
      title: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      href: "/super-admin",
    },
    {
      id: 2,
      title: "Orders",
      icon: <SendToBack className="h-4 w-4" />,
      href: "/super-admin/orders",
    },
    {
      id: 3,
      title: "Products",
      icon: <ShoppingBasket className="h-4 w-4" />,
      href: "/super-admin/products",
    },
    {
      id: 4,
      title: "Categories",
      icon: <MdOutlineCategory className="h-4 w-4" />,
      href: "/super-admin/categories",
    },

    {
      id: 5,
      title: "Coupons",
      icon: <RiCouponLine className="h-4 w-4" />,
      href: "/super-admin/coupons",
    },
  ];

  const additionalLinks = [
    {
      id: 1,
      title: "Add Product",
      icon: <MdOutlineProductionQuantityLimits className="h-4 w-4" />,
      href: "/super-admin/products/add",
    },

    {
      id: 2,
      title: "Add Category",
      icon: <TbCategoryPlus className="h-4 w-4" />,
      href: "/super-admin/categories/add",
    },
    {
      id: 3,
      title: "Add Coupon",
      icon: <RiCoupon4Line className="h-4 w-4" />,
      href: "/super-admin/coupons/add",
    },
  ];



  const handleExpandChange = (expanded: boolean) => {
    setIsCollapsed(!expanded);
    if (onExpandChange) onExpandChange(expanded);
  };

  return (
    <motion.div
      className={cn(
        "sidebar h-full shrink-0 border-r bg-white dark:bg-black z-40",
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => handleExpandChange(true)}
      onMouseLeave={() => handleExpandChange(false)}
    >
      <motion.div
        className={`relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-white dark:bg-black transition-all`}
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            <div className="flex h-[54px] w-full shrink-0 border-b p-2">
              <div className="mt-[1.5px] flex w-full items-center justify-center">
                <Link href="/dashboard" className="flex items-center">
                  {/* Using the same logo from login form */}
                  {isCollapsed ? (
                    <p className="text-primary/80 font-extrabold text-lg">K</p>
                  ) : (
                    <div className="flex h-8 items-center">
                      <Image
                        src="/logo.svg"
                        alt="Kythara"
                        width={100}
                        height={24}
                        className="h-12 w-auto"
                        priority
                      />
                    </div>
                  )}
                </Link>
              </div>
            </div>

            <div className="flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className={cn("flex w-full flex-col gap-1")}>

                    <p className="text-xs ">Main</p>

                    {/* Primary navigation options */}
                    {sideBarOptions.map((option) => (
                      <Link key={option.id}
                        href={option.href}
                        className={cn(
                          "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                          pathname?.includes(option.href) &&
                          "bg-muted text-primary",
                        )}
                      >
                        {option.icon}
                        <motion.li variants={variants}>
                          {!isCollapsed && (
                            <p className="ml-2 text-sm font-medium">{option.title}</p>
                          )}
                        </motion.li>
                      </Link>
                    ))}

                    <Separator className="w-full" />

                    <p className="text-xs ">Add</p>
                    {additionalLinks.map((option) => (
                      <Link key={option.id}
                        href={option.href}
                        className={cn(
                          "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                          pathname?.includes(option.href) &&
                          "bg-muted text-primary",
                        )}
                      >
                        {option.icon}
                        <motion.li variants={variants}>
                          {!isCollapsed && (
                            <p className="ml-2 text-sm font-medium">{option.title}</p>
                          )}
                        </motion.li>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex flex-col p-2">
                <Link
                  href="/super-admin/settings"
                  className="mt-auto flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary"
                >
                  <Settings className="h-4 w-4 shrink-0" />{" "}
                  <motion.li variants={variants}>
                    {!isCollapsed && (
                      <p className="ml-2 text-sm font-medium">Settings</p>
                    )}
                  </motion.li>
                </Link>
                <div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full">
                      <div className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                        <Avatar className="size-4">
                          <AvatarFallback>
                            A
                          </AvatarFallback>
                        </Avatar>
                        <motion.li
                          variants={variants}
                          className="flex w-full items-center gap-2"
                        >
                          {!isCollapsed && (
                            <>
                              <p className="text-sm font-medium">Account</p>
                              <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                            </>
                          )}
                        </motion.li>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={5}>
                      <div className="flex flex-row items-center gap-2 p-2">
                        <Avatar className="size-6">
                          <AvatarFallback>
                            AL
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium">
                            {`Andrew Luo`}
                          </span>
                          <span className="line-clamp-1 text-xs text-muted-foreground">
                            {`andrew@usehindsight.com`}
                          </span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        asChild
                        className="flex items-center gap-2"
                      >
                        <Link href="/settings/profile">
                          <UserCircle className="h-4 w-4" /> Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}