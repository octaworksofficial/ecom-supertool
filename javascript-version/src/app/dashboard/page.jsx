'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

const DashboardRedirect = () => {
  const router = useRouter()
  
  useEffect(() => {
    // Website müşterileri sayfasına yönlendir
    router.push('/website-musterileri')
  }, [router])
  
  return (
    <div>Dashboard'a yönlendiriliyor...</div>
  )
}

export default DashboardRedirect
