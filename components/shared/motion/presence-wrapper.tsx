"use client";

import { AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PresenceWrapperProps {
   children: ReactNode;
   mode?: "sync" | "wait" | "popLayout"; // Mode options from Framer Motion
}

function PresenceWrapper({ children, mode = "sync" }: PresenceWrapperProps) {
   return <AnimatePresence mode={mode}>{children}</AnimatePresence>;
}

export default PresenceWrapper;
