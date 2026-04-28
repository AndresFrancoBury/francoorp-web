'use client'
import { useState } from 'react'
import IntroScreen from '@/components/home/IntroScreen'
import SelectorScreen from '@/components/home/SelectorScreen'

export default function HomePage() {
  const [screen, setScreen] = useState<'intro' | 'selector'>('intro')

  return (
    <>
      <IntroScreen
        visible={screen === 'intro'}
        onStart={() => setScreen('selector')}
      />
      <SelectorScreen
        visible={screen === 'selector'}
        onBack={() => setScreen('intro')}
      />
    </>
  )
}
