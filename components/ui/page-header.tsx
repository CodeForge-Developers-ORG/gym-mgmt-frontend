"use client";

import * as React from "react";

/**
 * PageHeader component
 * - Renders a heading (h1) with the provided title.
 * - Uses an effect to set the browser tab title (document.title) whenever the title changes.
 *   This ensures every page that includes this component automatically updates the header title.
 */
export const PageHeader = ({ title }: { title: string }) => {
  React.useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <h1 className="text-3xl md:text-4xl font-bold text-center my-6">
      {title}
    </h1>
  );
};
