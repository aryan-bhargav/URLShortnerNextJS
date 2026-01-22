"use client";

import React, { useState } from "react";
import UrlList from "./url-list";
import ShortenForm from "./shorten-form";

const UrlShortnerContainer = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUrlShortened = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div>
      <ShortenForm onSuccess={handleUrlShortened} />
      <UrlList refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default UrlShortnerContainer;
