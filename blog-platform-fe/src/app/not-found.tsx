import React from 'react'
import { Button } from '@/components/ui/button' 
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Not Found</h1>
      <p className="text-lg">The page you are looking for does not exist.</p>
      <Link href="/">
        <Button>Go to Home</Button>
      </Link>
    </div>
  )
}
