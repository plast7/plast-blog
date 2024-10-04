import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import RotatingStarsCanvas from '../components/rotatingStarsCanvas'

export const Route = createFileRoute('/star')({
  component: StarTwo,
})

function StarTwo() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <RotatingStarsCanvas />
    </div>
  )
}

export default StarTwo
