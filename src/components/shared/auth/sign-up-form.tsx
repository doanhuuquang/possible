"use client";

import { FirebaseError } from "firebase/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { email, z } from "zod";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import User from "@/lib/models/user";
import { createUser } from "@/lib/services/user-service";

const inputClassName =
  "px-5 py-7 bg-background/60 rounded-md text-foreground border-1 w-full outline-none focus:border-primary";

const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "Vui lòng điền tên hợp lệ.",
    }),
    lastName: z.string().min(2, {
      message: "Vui lòng điền họ hợp lệ.",
    }),
    email: email("Vui lòng nhập địa chỉ email hợp lệ."),
    birth_of_date: z.date("Ngày sinh không được để trống"),
    password: z.string().min(6, {
      message: "Mật khẩu phải có ít nhất 6 ký tự.",
    }),
    confirm_password: z.string().min(6, {
      message: "Xác nhận mật khẩu phải có ít nhất 6 ký tự.",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  });

export default function SignupForm() {
  const [loading, setLoading] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      birth_of_date: new Date(),
      password: "",
      confirm_password: "",
    },
  });

  const handleSignUp = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const user: User = new User({
        id: "",
        avatarBase64: "",
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        birthOfDate: values.birth_of_date,
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
      });

      // Tạo tài khoản và lưu thông tin người dùng Firebase Authentication
      await createUser({
        email: values.email,
        password: values.password,
        user: user,
      });

      // Xóa trắng form
      form.reset();

      toast("Thành công", {
        position: "top-center",
        description: "Đăng ký tài khoản thành công.",
        action: {
          label: "Ok",
          onClick: () => router.push("/"),
        },
      });
    } catch (error) {
      console.error("Error signing up:", error);
      if (
        error instanceof FirebaseError &&
        error.code === "auth/email-already-in-use"
      ) {
        toast("Thất bại", {
          position: "top-center",
          description: "Email đã được sử dụng. Vui lòng thử email khác.",
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });
      } else {
        toast("Thất bại", {
          position: "top-center",
          description: "Đăng ký tài khoản thất bại. Vui lòng thử lại sau.",
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSignUp)}
        className={cn("col-span-4 space-y-5", loading && "disable")}
      >
        <div className="flex gap-5 w-full">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Họ</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Họ của bạn"
                    {...field}
                    className={inputClassName}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tên của bạn"
                    {...field}
                    className={inputClassName}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@gmail.com"
                  {...field}
                  className={inputClassName}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birth_of_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày sinh</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ngày sinh"
                  className={inputClassName}
                  type="date"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    field.onChange(
                      e.target.value ? new Date(e.target.value) : null
                    );
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-5 w-full">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Mật khẩu"
                    {...field}
                    className={inputClassName}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Xác nhận mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    {...field}
                    className={inputClassName}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3">
          <Checkbox
            id="terms"
            checked={isChecked}
            onCheckedChange={() => setIsChecked(!isChecked)}
          />
          <Label htmlFor="terms">
            <p className="text-muted-foreground text-xs space-x-1">
              <span>
                Bằng việc nhấn vào nút Đăng ký, chúng tôi hiểu rằng bạn đã đọc
                và đồng ý với
              </span>
              <Link
                href={"/"}
                className="font-semibold text-foreground underline underline-offset-1"
              >
                Chính sách bảo mật
              </Link>
              <span>và</span>
              <Link
                href={"/"}
                className="font-semibold text-foreground underline underline-offset-1"
              >
                Điều khoản sử dụng
              </Link>
            </p>
          </Label>
        </div>

        <div className="space-y-3">
          <Button
            disabled={loading || !isChecked}
            type="submit"
            className="w-full py-5 rounded-sm hover:cursor-pointer"
          >
            <p className="uppercase">
              {loading ? "Đang kiểm tra thông tin..." : "Xác nhận đăng ký"}
            </p>
            {loading ? <LoaderCircle className="animate-spin" /> : <></>}
          </Button>

          <div className="w-full flex items-center gap-5 text-muted-foreground text-sm">
            <div className="grow bg-accent h-px"></div>
            <p>Hoặc</p>
            <div className="grow bg-accent h-px"></div>
          </div>

          <Button
            variant={"outline"}
            className="w-full py-5 rounded-sm hover:cursor-pointer flex items-center gap-3"
          >
            <Image
              src="/assets/icons/google/google.svg"
              alt="Google Icon"
              width={20}
              height={20}
            />
            <p className="uppercase">Đăng ký bằng tài khoản Google</p>
          </Button>
        </div>
      </form>
    </Form>
  );
}
