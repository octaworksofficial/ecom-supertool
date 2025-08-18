'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
