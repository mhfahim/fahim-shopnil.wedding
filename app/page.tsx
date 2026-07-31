"use client";

import { useCallback, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import { invitation } from "@/data/invitation";
import { CurtainReveal } from "@/components/CurtainReveal";
import { HeroSection } from "@/components/HeroSection";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { ScratchReveal } from "@/components/ScratchReveal";
import { ImageSlider } from "@/components/ImageSlider";
import { Countdown } from "@/components/Countdown";
import { Timeline } from "@/components/Timeline";
import { VenueSection } from "@/components/VenueSection";
import { MessageForm } from "@/components/MessageForm";
import { ClosingSection } from "@/components/ClosingSection";

export default function Page() {
  const [opened, setOpened] = useState(false);
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);

  const onRevealed = useCallback(() => {
    setOpened(true);
    heroHeadingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    // The globals.css media query only reaches CSS animation; this is what
    // stops Framer Motion moving anything for guests who ask it not to.
    <MotionConfig reducedMotion="user">
      {!opened ? (
        <CurtainReveal seal={invitation.seal} onRevealed={onRevealed} />
      ) : null}

      {/* One phone-width column. This invitation is never opened on a
          desktop, so there is no wider layout to fall back to. */}
      <main className="mx-auto w-full max-w-phone bg-cream-50">
        <HeroSection
          intro={invitation.intro}
          bride={invitation.bride}
          groom={invitation.groom}
          headingRef={heroHeadingRef}
        />

        <WelcomeMessage welcome={invitation.welcome} />

        <ScratchReveal
          card={invitation.revealCard}
          weddingDate={invitation.weddingDate}
        />

        <ImageSlider images={invitation.gallery} />

        <Countdown
          targetIso={invitation.weddingDate}
          closing={invitation.closing}
        />

        <Timeline entries={invitation.timeline} />

        <VenueSection venue={invitation.venue} />

        <MessageForm />

        <ClosingSection
          closing={invitation.closing}
          bride={invitation.bride}
          groom={invitation.groom}
          weddingDate={invitation.weddingDate}
        />
      </main>
    </MotionConfig>
  );
}
