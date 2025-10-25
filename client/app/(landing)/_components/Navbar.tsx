"use client";

import { useScrollTop } from "@/hooks/useScrollTop";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
import { useState } from "react";
import { LoginModal } from "@/components/modals/LoginModal";

export const Navbar = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const scrolled = useScrollTop();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <nav
      className={cn(
        "sticky inset-x-0 top-0 z-50 mx-auto flex w-full items-center bg-background p-6 dark:bg-[#1F1F1F]",
        scrolled && "border-b shadow-sm",
      )}
    >
      <Logo />
      <div className="flex w-full items-center justify-end md:ml-auto">
        <div className="flex items-center gap-x-2">
          {isLoading && <Spinner />}
          {!isLoading && !isAuthenticated && (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Log In
              </Button>
              <Button 
                size="sm"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Get Ideon Free
              </Button>
            </>
          )}

          {isAuthenticated && !isLoading && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/documents"> Enter Ideon </Link>
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user?.firstName} {user?.lastName}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </nav>
  );
};
