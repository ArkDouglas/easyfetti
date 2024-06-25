'use client'

import dynamic from 'next/dynamic'

const ConfettiBuilder = dynamic(() => import('./ConfettiBuilder'), {
	ssr: false,
})

export default function MyPage() {
	return <ConfettiBuilder />
}
