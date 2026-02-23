import { ImageResponse } from "next/og";
import { getSite } from "@/lib/site";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  const site = getSite();
  return new ImageResponse(
    (
      <div tw="w-full h-full flex flex-col justify-center p-[70px] bg-gradient-to-br from-[#fbf7f0] via-white to-[#eef7f1] text-[#1f2a24] font-sans">
        <div tw="text-[60px] font-extrabold leading-[1.05]">{site.brand.name}</div>
        <div tw="mt-4 max-w-[900px] text-[28px] opacity-90">{site.seo.defaultDescription}</div>
        <div tw="mt-6 flex gap-3">
          <div tw="px-4 py-2 rounded-full border border-black/10 text-[18px]">movingtobali.empathy.school</div>
          <div tw="px-4 py-2 rounded-full border border-black/10 text-[18px]">by Empathy School</div>
        </div>
      </div>
    ),
    size
  );
}
