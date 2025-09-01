import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function About() {
  const [lang, setLang] = useState<"sv" | "en">("sv");

  // Detect browser language once
  useEffect(() => {
    try {
      const l = navigator.language?.toLowerCase().startsWith("sv") ? "sv" : "en";
      setLang(l as "sv" | "en");
    } catch {
      setLang("sv");
    }
  }, []);

  // Bilingual texts
  const T = useMemo(
    () => ({
      titleSV: "Om NeuroLjus",
      titleEN: "About NeuroLjus",
      descriptionSV: "NeuroLjus es una plataforma de AI empática diseñada para ayudar a familias, cuidadores y profesionales a comprender patrones sensoriales y señales de bienestar de personas con necesidades especiales.",
      descriptionEN: "NeuroLjus is an empathic AI platform designed to help families, caregivers and professionals understand sensory patterns and wellness signals of people with special needs.",
      backSV: "← Volver al inicio",
      backEN: "← Back to home",
      tagSV: "Empatisk AI för sensorisk förståelse",
      tagEN: "Empathic AI for Sensory Understanding",
    }),
    []
  );

  const isSV = lang === "sv";

  // SEO dynamic
  const seoTitle = isSV ? "Om NeuroLjus" : "About NeuroLjus";
  const seoDesc = isSV ? T.descriptionSV : T.descriptionEN;

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/brand/neuroljus-logo.svg" />
        <meta name="theme-color" content="#1E1F3B" />
      </Head>

      <div className="page">
        <div className="container">
          {/* Header */}
          <header className="header" role="banner">
            <Link className="brand" href="/" aria-label="NeuroLjus home">
              <Image
                src="/brand/neuroljus-logo.svg"
                alt="NeuroLjus logo – protected core with aurora"
                width={36}
                height={36}
                priority
                className="brandLogo"
              />
              <div>
                <div className="brandName">NeuroLjus</div>
                <div className="tagline">{isSV ? T.tagSV : T.tagEN}</div>
              </div>
            </Link>

            <nav className="nav" aria-label={isSV ? "Primär" : "Primary"}>
              <Link href="/labs/nl-vision">Demo</Link>
              <Link href="/nl-vision">Vision&nbsp;AI</Link>
              <Link href="/about">{isSV ? "Om" : "About"}</Link>
            </nav>

            <div className="langToggle" role="group" aria-label="Language switch">
              <button
                onClick={() => setLang("sv")}
                aria-label="Byt språk till svenska"
                aria-pressed={isSV}
              >
                SV
              </button>
              <button
                onClick={() => setLang("en")}
                aria-label="Switch language to English"
                aria-pressed={!isSV}
              >
                EN
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="main" role="main">
            <section className="content">
              <h1 className="title">{isSV ? T.titleSV : T.titleEN}</h1>
              <p className="description">{isSV ? T.descriptionSV : T.descriptionEN}</p>
              
              <div className="backLink">
                <Link href="/">{isSV ? T.backSV : T.backEN}</Link>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        :global(html) {
          scroll-behavior: smooth;
        }
        .page {
          min-height: 100dvh;
          color: #fff;
          background:
            radial-gradient(1200px 700px at 20% 10%, rgba(94,230,164,0.18), transparent 60%),
            radial-gradient(900px 600px at 80% 20%, rgba(124,227,247,0.18), transparent 60%),
            radial-gradient(1200px 900px at 50% 120%, rgba(166,133,247,0.18), transparent 60%),
            #1E1F3B;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: inherit;
        }
        .brandLogo {
          border-radius: 8px;
        }
        .brandName {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }
        .tagline {
          font-size: 12px;
          opacity: 0.7;
          color: #cbd5e1;
        }
        .nav {
          display: flex;
          gap: 32px;
          align-items: center;
        }
        .nav a {
          color: #cbd5e1;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        .nav a:hover {
          color: #fff;
        }
        .langToggle {
          display: flex;
          gap: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 4px;
        }
        .langToggle button {
          background: none;
          border: none;
          color: #cbd5e1;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        .langToggle button[aria-pressed="true"] {
          background: rgba(255,255,255,0.2);
          color: #fff;
        }
        .main {
          padding: 80px 0;
          text-align: center;
        }
        .content {
          max-width: 800px;
          margin: 0 auto;
        }
        .title {
          font-size: 48px;
          font-weight: 700;
          margin: 0 0 32px;
          background: linear-gradient(135deg, #5EE6A4, #7CE3F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .description {
          font-size: 18px;
          line-height: 1.6;
          color: #cbd5e1;
          margin: 0 0 48px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .backLink {
          margin-top: 48px;
        }
        .backLink a {
          color: #7CE3F7;
          text-decoration: none;
          font-size: 16px;
          transition: color 0.2s;
        }
        .backLink a:hover {
          color: #5EE6A4;
        }
        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          .nav {
            gap: 24px;
          }
          .title {
            font-size: 36px;
          }
          .description {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}
