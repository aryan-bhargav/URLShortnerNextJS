"use client"

import React, { useState } from 'react'
import UrlList from './url-list'
import ShortenForm from './shorten-form'

const UrlShortnerContainer = () => {
  const [refreshKey,setRefreshKey] = useState<number>(0);
  const handleUrlShortened = () => {
    setRefreshKey((prev) => prev+1);
  }
  return (
    <div>
      <ShortenForm handleUrlShortened={handleUrlShortened} />
      <UrlList key={refreshKey} />
    </div>
  )
}

export default UrlShortnerContainer;
