import { cn } from "@/lib/cn";

const base = "text-gray-600 leading-7";

// Styled HTML output from markdown (dangerouslySetInnerHTML) using Tailwind utilities only.
// This keeps typography consistent and upgrades unordered lists to a clean icon list.
export const richTextCls =
  base +
  " [&_p]:my-4" +
  " [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-blue-700" +
  " [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-gray-900" +
  " [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-gray-900" +
  " [&_code]:rounded-lg [&_code]:border [&_code]:border-gray-200 [&_code]:bg-gray-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.95em]" +
  " [&_ul]:my-4 [&_ul]:list-none [&_ul]:space-y-2 [&_ul]:pl-0" +
  " [&_ul>li]:relative [&_ul>li]:pl-8" +
  " [&_ul>li]:before:content-['✓'] [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[0.15rem] [&_ul>li]:before:inline-flex [&_ul>li]:before:h-5 [&_ul>li]:before:w-5" +
  " [&_ul>li]:before:items-center [&_ul>li]:before:justify-center [&_ul>li]:before:rounded-full [&_ul>li]:before:border [&_ul>li]:before:border-gray-200" +
  " [&_ul>li]:before:bg-blue-50 [&_ul>li]:before:text-[12px] [&_ul>li]:before:font-bold [&_ul>li]:before:text-blue-700" +
  " [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5" +
  " [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4" +
  " [&_table]:w-full [&_table]:border-collapse" +
  " [&_th]:border-b [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-gray-600" +
  " [&_td]:border-b [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top" +
  " [&_hr]:my-10 [&_hr]:border-gray-200" +
  " [&_summary]:cursor-pointer";

export default function RichText({ html, className }: { html: string; className?: string }) {
  return <div className={cn(richTextCls, className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
