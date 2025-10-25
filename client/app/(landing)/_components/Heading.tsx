"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LoginModal } from "@/components/modals/LoginModal";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold sm:text-5xl md:text-5xl">
        Your Ideas💡, Documents📕, & Plans🚀. Welcome to{" "}
        <span className="underline">Ideon</span>
      </h1>
      <h2 className="text-base font-medium sm:text-xl">
        Ideon is the connected workspace where <br /> better, faster work
        happens.
      </h2>
      {isLoading && (
        <div className="flex w-full items-center justify-center">
          <Spinner size="md" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/documents">
            Enter Ideon
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <Button onClick={() => setIsLoginModalOpen(true)}>
          Get Ideon free
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
};
