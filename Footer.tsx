"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/providers/TranslationsProvider";
import { getLocalizedRoute } from "@/utils/translations/language-utils";
import { Lang } from "@/utils/translations/dictionary-utils";
import { footerData } from "./data";
import { Facebook, Linkedin, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Social media icons mapping
const socialIcons = {
   Facebook: Facebook,
   LinkedIn: Linkedin,
   Instagram: Instagram,
};

export function Footer({
   lang,
   hideInAdmin = false,
}: {
   lang: Lang;
   hideInAdmin?: boolean;
}) {
   const { theme } = useTheme();
   const { footer: dict } = useTranslation("common");
   const [mounted, setMounted] = useState(false);
   const pathname = usePathname();

   useEffect(() => {
      setMounted(true);
   }, []);

   const isAdminPage = pathname.includes(`/${lang}/admin`);
   const shouldHide = hideInAdmin && isAdminPage;

   if (shouldHide) {
      return null;
   }

   const mainFooterSections = [
      footerData.companyLinks,
      footerData.servicesLinks,
      footerData.resourcesLinks,
      footerData.supportLinks,
      footerData.legalLinks,
   ];

   return (
      <footer className="border-t">
         <div className="max-w-7xl mx-auto px-8 py-8 md:py-12">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-5 space-y-4">
               {mainFooterSections.map((section) => (
                  <div key={section.title} className="flex flex-col space-y-4">
                     <h3 className="text-sm font-semibold text-foreground">
                        {dict[section.title as keyof typeof dict]}
                     </h3>
                     <ul className="space-y-3 text-sm">
                        {section.links.map((link) => (
                           <li key={link.href}>
                              <Link
                                 href={getLocalizedRoute(lang, link.href)}
                                 className="text-muted-foreground  hover:underline block text-sm"
                              >
                                 {dict?.[link.label as keyof typeof dict] ||
                                    link.label}
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>

            <Separator className="my-8" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
               <div className="lg:col-span-2">
                  <div className="flex flex-col lg:flex-row items-start gap-8">
                     <div className="flex flex-col space-y-4 min-w-0">
                        {mounted && (
                           <Link
                              href="/"
                              className="flex items-center space-x-2 group"
                           >
                              <Image
                                 src={
                                    theme === "dark"
                                       ? "/images/logo.png"
                                       : "/images/logo-black.png"
                                 }
                                 alt="BlendLab Logo"
                                 width={130}
                                 height={130}
                                 className="transition-transform duration-300 group-hover:scale-105"
                              />
                           </Link>
                        )}
                     </div>
                  </div>
               </div>

               <div className="flex flex-col justify-between space-y-6 md:mx-auto">
                  <div className="flex flex-col space-y-4">
                     <div className="flex space-x-4">
                        {footerData.socialLinks.links.map((link) => (
                           <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground transition-colors hover:text-primary p-2 rounded-md hover:bg-muted/50"
                              title={
                                 dict?.[link.label as keyof typeof dict] ||
                                 link.label
                              }
                           >
                              {(() => {
                                 const IconComponent =
                                    socialIcons[
                                       link.label as keyof typeof socialIcons
                                    ];
                                 return IconComponent ? (
                                    <IconComponent className="h-5 w-5 transition-transform hover:scale-110" />
                                 ) : null;
                              })()}
                           </a>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </footer>
   );
}
