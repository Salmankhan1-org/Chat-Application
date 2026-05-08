// hooks/useSwitchLanguage.ts

import { useRouter, usePathname } from "next/navigation";

export const useSwitchLanguage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (lang: string) => {
    const segments = pathname.split('/');
    segments[1] = lang;
    router.push(segments.join('/'));
  };

  return switchLanguage;
};