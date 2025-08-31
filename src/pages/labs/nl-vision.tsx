import Head from "next/head";

export default function NLVisionDemo() {
  return (
    <>
      <Head>
        <title>NL-VISION Demo — Neuroljus</title>
        <meta name="description" content="NL-VISION demonstration and testing interface." />
      </Head>
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">NL-VISION Demo</h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <iframe
              src="/labs/nl-vision/index.html"
              className="w-full h-96 border-0 rounded"
              title="NL-VISION Demo"
            />
          </div>
        </div>
      </main>
    </>
  );
}