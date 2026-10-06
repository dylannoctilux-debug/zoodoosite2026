"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { ToastAction } from "@radix-ui/react-toast";
import { useFormStatus } from "react-dom";
import Image from "next/image";

import { Button } from "@/components/atom/button";
import { Input } from "@/components/atom/input";
import { Label } from "@/components/atom/label";
import Spinner from "@/components/atom/spinner";
import { cn } from "@/lib/utils";
import { login } from "@/actions/login";
import { useToast } from "@/components/atom/use-toast";

const LoginPageUI = () => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const { pending } = useFormStatus();

  return (
    <div className="grid gap-3">
      <div className="grid gap-1">
        <Label className="sr-only" htmlFor="email">
          email
        </Label>
        <Input
          id="email"
          name="email"
          placeholder="name@example.com"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          disabled={pending}
        />
      </div>
      <div className="grid gap-1">
        <Label className="sr-only" htmlFor="password">
          password
        </Label>
        <Input
          id="password"
          name="password"
          placeholder="password"
          type={isPasswordHidden ? "password" : "text"}
          autoCapitalize="none"
          autoComplete="current-password"
          autoCorrect="off"
          disabled={pending}
          iconRight={
            <Button
              type="button"
              aria-label={isPasswordHidden ? "Hiện mật khẩu" : "Ẩn mật khẩu"}
              variant="link"
              className="absolute right-0"
              onClick={(e) => {
                e.preventDefault();
                setIsPasswordHidden(!isPasswordHidden);
              }}
            >
              {isPasswordHidden ? <Eye size={18} /> : <EyeOff size={18} />}
            </Button>
          }
        />
      </div>
      <div className="grid gap-1">
        <Button disabled={pending} type="submit">
          {pending && <Spinner />}
          Login
        </Button>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const { toast } = useToast();

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="mx-auto w-24">
          <Image
            src="/assets/images/logos/logo-zoodoo-green.png"
            alt="ZooDoo logo"
            width={100}
            height={100}
            priority={true}
          />
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Login
        </h2>

        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className={cn("grid gap-6")}>
              <form
                action={async (formData: FormData) => {
                  try {
                    const result = await login(formData);
                    if (result?.error) throw new Error(result.error);
                  } catch (e: any) {
                    toast({
                      title: "Error",
                      description: e.message,
                      action: (
                        <ToastAction altText="Dismiss">Dismiss</ToastAction>
                      ),
                      variant: "destructive",
                    });
                  }
                }}
              >
                <LoginPageUI />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
