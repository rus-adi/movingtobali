import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { richTextCls } from "@/components/RichText";

export default function RichTextBlock({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(richTextCls, className)}>{children}</div>;
}
