import Head from 'next/head'
import NeuroljusLanding from '@/components/NeuroljusLanding'

export default function Home() {
  return (
    <>
      <Head>
        <title>Neuroljus — Human‑aligned AI for autistic communication</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Ethical, consent‑first AI that supports autistic communication, reporting, and caregiver assistance." />
      </Head>
      <NeuroljusLanding />
    </>
  )
}
