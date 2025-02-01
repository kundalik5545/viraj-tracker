"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  PlusCircle,
  Wallet,
  TrendingUp,
  Menu,
  ChevronRight,
  ArrowRightLeft,
} from "lucide-react";
import { checkUser } from "@/actions/checkUser";

const routes = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview of your finances",
  },
  {
    href: "/transaction",
    label: "Transactions",
    icon: ArrowRightLeft,
    description: "List of recent transaction",
  },
  {
    href: "/transaction/new",
    label: "Add New Transaction",
    icon: PlusCircle,
    description: "Add a new transaction",
  },
  {
    href: "/bank-account",
    label: "Bank Accounts",
    icon: Wallet,
    description: "Manage your bank accounts",
  },
  {
    href: "/investments",
    label: "Investments",
    icon: TrendingUp,
    description: "Track your investments",
  },
];

export function Navigation() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isSignedIn, user } = useUser();
  const [open, setOpen] = useState(false);

  const checkUsers = async () => {
    const user = await checkUser();
  };

  useEffect(() => {
    checkUsers();
  }, []);

  const AuthButtons = () => (
    <div className="space-y-2">
      <SignInButton mode="modal">
        <Button className="w-full">Sign In</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button variant="outline" className="w-full">
          Sign Up
        </Button>
      </SignUpButton>
    </div>
  );

  const UserProfile = () => (
    <div className="flex items-center justify-between p-2">
      <UserButton
        appearance={{
          elements: {
            userButtonBox: "w-full flex justify-between items-center",
          },
        }}
      />
    </div>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b ">
        <div className="flex h-16 items-center px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b p-6">
                <Link href="/" onClick={() => setOpen(false)}>
                  <SheetTitle>Finance Manager</SheetTitle>
                </Link>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <nav className="flex-1 flex flex-col p-4">
                  {routes.map((route) => {
                    const Icon = route.icon;
                    const isActive = pathname === route.href;
                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                          isActive ? "bg-accent" : "transparent"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={cn(
                              "font-medium",
                              isActive ? "text-primary" : "text-foreground"
                            )}
                          >
                            {route.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {route.description}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
                <div className="p-4 border-t pb-8 mb-16">
                  {isSignedIn ? <UserProfile /> : <AuthButtons />}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex justify-center">
            <h1 className="text-lg font-semibold">Finance Manager</h1>
          </div>
          {isSignedIn && <UserButton />}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:block fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300",
          isSidebarOpen ? "w-72" : "w-[70px]"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/">
            {isSidebarOpen ? (
              <h1 className="text-lg font-semibold">Finance Manager</h1>
            ) : (
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-4 w-4" />
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                isSidebarOpen ? "rotate-180" : ""
              )}
            />
          </Button>
        </div>
        <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
          <nav className="flex flex-col gap-2 p-4">
            {routes.map((route) => {
              const Icon = route.icon;
              const isActive = pathname === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent group",
                    isActive ? "bg-accent" : "transparent"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground",
                      "group-hover:text-primary"
                    )}
                  />
                  {isSidebarOpen && (
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={cn(
                          "font-medium",
                          isActive ? "text-primary" : "text-foreground"
                        )}
                      >
                        {route.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {route.description}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            {isSignedIn ? <UserProfile /> : <AuthButtons />}
          </div>
        </div>
      </aside>

      {/* Main content margin for desktop */}
      <div
        className={cn("hidden md:block", isSidebarOpen ? "ml-72" : "ml-[70px]")}
      />

      {/* Mobile content margin */}
      <div className="h-16 md:hidden" />
    </>
  );
}
