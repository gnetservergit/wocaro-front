/**
 * ACF flexible content → React component renderer.
 *
 * WordPress pages store sections as page_layout blocks (acf_fc_layout name + fields).
 * pageLayoutMap links each layout name (e.g. "Landing", "WhyChoose") to its component.
 * PageAcfLayout loops layouts and renders the matching component with `data={layout}`.
 */
import type { ComponentType } from "react";
import Banner from "@/component/common/Banner";
import PromoBanner from "@/component/common/PromoBanner";
import ClientReviews from "@/component/home/ClientReviews";
import Features from "@/component/home/Features";
import HomeFaqs from "@/component/home/HomeFaqs";
import Landing from "@/component/home/Landing";
import Service from "@/component/home/Service";
import UpdateSteps from "@/component/home/UpdateSteps";
import WebsiteAudit from "@/component/home/WebsiteAudit";
import WhatThisIsFor from "@/component/home/WhatThisIsFor";
import WhyChoose from "@/component/home/WhyChoose";
import StoryBehind from "@/component/about/StoryBehind";
import Emergency from "@/component/contact/Emergency";
import ContactForm from "@/component/contact/ContactForm";
import Plan from "@/component/pricing/Plan";
import OnboardingSteps from "@/component/services/OnboardingSteps";
import AddOnServices from "@/component/pricing/AddOnServices";
import Support from "@/component/services/Support";
import CheckList from "@/component/common/CheckList";
import type { WpLayoutBlock } from "@/lib/wp-pages";

type LayoutComponent = ComponentType<{ data?: Record<string, unknown> }>;

/** Maps ACF flexible layout names to React components (all pages). */
export const pageLayoutMap: Record<string, LayoutComponent> = {
  Landing,
  Banner,
  Service,
  Support,
  OnboardingSteps,
  UpdateSteps,
  WhyChoose,
  PromoBanner,
  Features,
  WhatThisIsFor,
  GotQuestion: HomeFaqs,
  ClientReviews,
  WebsiteAudit,
  Plan,
  ContactForm,
  CheckList,
  StoryBehind,
  Emergency,
  AddOnServices,
};

export function PageAcfLayout({ layouts }: { layouts: WpLayoutBlock[] }) {
  return (
    <>
      {layouts.map((layout, index) => {
        const key = (layout.acf_fc_layout || layout.acf_layout) as string | undefined;
        if (!key) return null;

        const Component = pageLayoutMap[key];
        if (!Component) return null;

        return <Component key={`${key}-${index}`} data={layout} />;
      })}
    </>
  );
}
