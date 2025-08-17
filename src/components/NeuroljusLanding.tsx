import React, { useState } from "react";
import Link from "next/link";
export default function NeuroljusLanding() {
  const [lang, setLang] = useState<'en' | 'sv'>("en");
  const t = (en: string, sv: string) => (lang === "en" ? en : sv);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/80 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-200 via-teal-200 to-emerald-300 shadow-inner" />
            <span className="font-semibold tracking-tight">Neuroljus</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#solution" className="hover:underline">{t("Solution","Lösning")}</a>
            <a href="#how" className="hover:underline">{t("How it works","Så fungerar det")}</a>
            <a href="#reporting" className="hover:underline">{t("Reporting","Rapportering")}</a>
            <a href="#ethics" className="hover:underline">{t("Ethics","Etik")}</a>
            <a href="#pilot" className="hover:underline">{t("Pilot","Pilot")}</a>
            <Link href="/contact" className="hover:underline">
  {t("Contact","Kontakt")}
</Link>      
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === 'en' ? 'sv' : 'en')} className="text-xs px-3 py-1 rounded-full border hover:bg-gray-50">
              {lang === 'en' ? 'SV' : 'EN'}
            </button>
            <Link href="/contact" className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-black">
  {t("Get in touch","Kontakta oss")}
</Link>            
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
                {t(
                  "Human‑aligned AI for autistic communication and caregiver support",
                  "Människoanpassad AI för autistisk kommunikation och stöd till vårdnadshavare"
                )}
              </h1>
              <p className="mt-4 text-gray-600 md:text-lg">
                {t(
                  "Neuroljus builds an ethical interface between AI and autistic individuals, helping caregivers anticipate emotional crises, assist with reporting, and provide real‑time, context‑aware guidance during care routines.",
                  "Neuroljus bygger ett etiskt gränssnitt mellan AI och autistiska personer för att hjälpa vårdnadshavare att förutse känslomässiga kriser, bistå med rapportering och ge realtids‑, kontextmedveten vägledning under vårdrutiner."
                )}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#solution" className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-black text-sm">
                  {t("See the solution","Se lösningen")}
                </a>
                <a href="#pilot" className="px-4 py-2 rounded-xl border hover:bg-gray-50 text-sm">
                  {t("Join the pilot","Gå med i piloten")}
                </a>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                {t(
                  "Pre‑seed • Research & early pilots in Sweden",
                  "Pre‑seed • Forskning & tidiga piloter i Sverige"
                )}
              </p>
            </div>
            <div className="md:pl-8">
              <div className="rounded-2xl border p-6 shadow-sm">
                <h3 className="font-medium mb-2">{t("One‑minute overview","Översikt på en minut")}</h3>
                <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
                  <li>{t("Non‑invasive sensing and AI observation to read context and emotion.","Icke‑invasiva sensorer och AI‑observation för att läsa kontext och känslor.")}</li>
                  <li>{t("Predictive signals to anticipate escalation and recommend calming actions.","Prediktiva signaler för att förutse eskalering och föreslå lugnande åtgärder.")}</li>
                  <li>{t("AI‑assisted reporting to draft caregiver logs for review and signature.","AI‑assisterad rapportering för att utarbeta vårdnadsloggar för granskning och signatur.")}</li>
                  <li>{t("Real‑time AI assistance offering suggestions, reminders, and calming strategies.","AI‑stöd i realtid som erbjuder förslag, påminnelser och lugnande strategier.")}</li>
                  <li>{t("Consent‑first design; data minimization; caregiver‑controlled.","Samtycke först; dataminimering; vårdnadshavarkontrollerat.")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="solution" className="border-t bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold">{t("Our solution","Vår lösning")}</h2>

          <div className="grid md:grid-cols-4 gap-6 mt-6">
            {[{
              title: t("Empathic Observation","Empatisk observation"),
              body: t("Context‑aware AI observes micro‑expressions and rhythms without identification or labeling.","Kontextmedveten AI observerar mikro‑uttryck och rytmer utan identifiering eller etikettering."),
            },{
              title: t("Predictive Calm","Prediktivt lugn"),
              body: t("Signals forecast potential escalation and offer a short list of caregiver actions.","Signaler förutser möjlig eskalering och föreslår en kort lista av åtgärder för vårdnadshavare."),
            },{
              title: t("AI‑Assisted Reporting","AI‑assisterad rapportering"),
              body: t("Automatically generates structured daily reports based on observations, ready for caregiver review, modification, and signature.","Genererar automatiskt strukturerade dagliga rapporter baserade på observationer, redo för vårdnadshavares granskning, ändring och signatur."),
            },{
              title: t("Real‑time Caregiver Assistance","Realtidsstöd för vårdnadshavare"),
              body: t("Provides context‑aware suggestions, reminders, and calming strategies during care routines, acting as a collaborative partner.","Ger kontextmedvetna förslag, påminnelser och lugnande strategier under vårdrutiner och fungerar som en samarbetspartner."),
            }].map((card, i) => (
              <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="font-medium">{card.title}</h3>
                <p className="mt-2 text-sm text-gray-700">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold">{t("How it works","Så fungerar det")}</h2>
          <ol className="mt-6 grid md:grid-cols-4 gap-6 list-decimal pl-5">
            <li className="rounded-2xl border p-6 shadow-sm">
              <h4 className="font-medium">{t("Observe","Observera")}</h4>
              <p className="mt-2 text-sm text-gray-700">{t("Edge device watches non‑invasively and summarizes state as privacy‑preserving signals.","En lokalenhet observerar icke‑invasivt och sammanfattar läget som integritetsskyddade signaler.")}</p>
            </li>
            <li className="rounded-2xl border p-6 shadow-sm">
              <h4 className="font-medium">{t("Anticipate","Förutse")}</h4>
              <p className="mt-2 text-sm text-gray-700">{t("Temporal models learn personal rhythms to anticipate crises minutes ahead.","Tidsmodeller lär sig personliga rytmer för att förutse kriser minuter i förväg.")}</p>
            </li>
            <li className="rounded-2xl border p-6 shadow-sm">
              <h4 className="font-medium">{t("Support","Stöd")}</h4>
              <p className="mt-2 text-sm text-gray-700">{t("Caregiver receives simple, context‑aware guidance; optional room modulation can be triggered.","Vårdnadshavaren får enkel, kontextmedveten vägledning; valfri rumsmodulering kan aktiveras.")}</p>
            </li>
            <li className="rounded-2xl border p-6 shadow-sm">
              <h4 className="font-medium">{t("Document","Dokumentera")}</h4>
              <p className="mt-2 text-sm text-gray-700">{t("AI drafts the daily care log; caregiver reviews, edits, and signs.","AI utarbetar den dagliga vårdloggen; vårdnadshavaren granskar, redigerar och signerar.")}</p>
            </li>
          </ol>
        </div>
      </section>

      {/* Reporting */}
      <section id="reporting" className="border-t bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold">{t("AI Care Log — Reporting","AI‑vårdlogg — Rapportering")}</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h4 className="font-medium">{t("Workflow","Arbetsflöde")}</h4>
              <ul className="mt-2 text-sm text-gray-700 space-y-2 list-disc pl-5">
                <li>{t("Compile observations from the day (signals, context, interventions).","Samla dagens observationer (signaler, kontext, åtgärder).")}</li>
                <li>{t("Draft a structured report automatically.","Skapa automatiskt ett strukturerat utkast.")}</li>
                <li>{t("Caregiver reviews, edits.","Vårdnadshavare granskar, redigerar.")}</li>
                <li>{t("Export to clinic/school systems if enabled.","Exportera till klinik/skolsystem om aktiverat.")}</li>
              </ul>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h4 className="font-medium">{t("Output structure","Utdatans struktur")}</h4>
              <ul className="mt-2 text-sm text-gray-700 space-y-2 list-disc pl-5">
                <li>{t("State & mood summary","Sammanfattning av tillstånd & sinnestämning")}</li>
                <li>{t("Behaviors observed & triggers","Observerade beteenden & triggers")}</li>
                <li>{t("Actions taken & rationale","Vidtagna åtgärder & motiv")}</li>
                <li>{t("Outcome & follow‑up recommendations","Utfall & uppföljningsrekommendationer")}</li>
                <li>{t("Free‑text notes","Fritextanteckningar")}</li>
              </ul>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h4 className="font-medium">{t("Data handling","Datahantering")}</h4>
              <ul className="mt-2 text-sm text-gray-700 space-y-2 list-disc pl-5">
                <li>{t("GDPR‑compliant; data minimization; pseudonymization.","GDPR‑efterlevnad; dataminimering; pseudonymisering.")}</li>
                <li>{t("On‑device processing where possible; encrypted sync when needed.","Lokal bearbetning när möjligt; krypterad synk vid behov.")}</li>
                <li>{t("Role‑based access, audit logs, human‑in‑the‑loop.","Rollbaserad åtkomst, granskningsloggar, human‑in‑the‑loop.")}</li>
                <li>{t("Caregiver retains final authorship of reports.","Vårdnadshavaren behåller slutligt författarskap för rapporter.")}</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border p-6 shadow-sm">
            <p className="text-sm text-gray-700">
              {t(
                "Goal: reduce administrative burden, improve data quality for care and research, and accelerate adoption by starting with friendly documentation support.",
                "Mål: minska administrativ börda, förbättra datakvalitet för vård och forskning och påskynda införande genom vänligt dokumentationsstöd."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Ethics & Safety */}
      <section id="ethics" className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold">{t("Ethics & safety","Etik & säkerhet")}</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h4 className="font-medium">{t("Principles","Principer")}</h4>
              <ul className="mt-2 text-sm text-gray-700 space-y-2 list-disc pl-5">
                <li>{t("Consent‑first, caregiver‑controlled.","Samtycke först, kontrollerat av vårdnadshavare.")}</li>
                <li>{t("Data minimization; on‑device processing when possible.","Dataminimering; lokal bearbetning när det är möjligt.")}</li>
                <li>{t("No biometric ID; respectful language and design.","Ingen biometrisk ID; respektfullt språk och design.")}</li>
                <li>{t("Compliance: GDPR, CE‑marking path for device components.","Efterlevnad: GDPR, CE‑märkningsväg för enhetskomponenter.")}</li>
              </ul>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h4 className="font-medium">{t("Safeguards","Skyddsmekanismer")}</h4>
              <ul className="mt-2 text-sm text-gray-700 space-y-2 list-disc pl-5">
                <li>{t("Transparent logs for caregivers.","Transparanta loggar för vårdnadshavare.")}</li>
                <li>{t("Hard‑off switch; offline mode.","Fysisk av‑knapp; offline‑läge.")}</li>
                <li>{t("Accessible, screen‑light experiences.","Tillgängliga, skärmlätta upplevelser.")}</li>
                <li>{t("Independent ethics board (in formation); human‑in‑the‑loop for reports.","Oberoende etikråd (under uppbyggnad); human‑in‑the‑loop för rapporter.")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot */}
      <section id="pilot" className="border-t bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold">{t("Pilot in Sweden (2025)","Pilot i Sverige (2025)")}</h2>
          <p className="mt-3 text-gray-700 max-w-3xl">
            {t(
              "We are enrolling a small cohort of families, schools and clinics to co‑design and validate Neuroljus. Partners receive access to the early dashboard, research results, and training.",
              "Vi rekryterar en liten grupp familjer, skolor och kliniker för samskapande och validering av Neuroljus. Partner får tillgång till vårt tidiga gränssnitt, forskningsresultat och utbildning."
            )}
          </p>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {[
              t("Families & caregivers","Familjer & vårdnadshavare"),
              t("Schools & municipalities","Skolor & kommuner"),
              t("Clinics & researchers","Kliniker & forskare"),
            ].map((p, i) => (
              <div key={i} className="rounded-2xl border p-6 shadow-sm">
                <h4 className="font-medium">{p}</h4>
                <p className="mt-2 text-sm text-gray-700">{t(
                  "Co‑create with us and shape the tool around real needs.",
                  "Samskapa med oss och forma verktyget efter verkliga behov."
                )}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
<section id="contact" className="border-t">
  <div className="max-w-6xl mx-auto px-4 py-16">
    <h2 className="text-2xl md:text-3xl font-semibold">{t("Contact","Kontakt")}</h2>


    <div className="mt-6 rounded-2xl border p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="grow">
        <div className="text-sm text-gray-600">Email</div>
        <a href="mailto:care@neuroljus.com" className="font-medium">care@neuroljus.com</a>
        <div className="mt-3 text-xs text-gray-500">{t("Stockholm, Sweden","Stockholm, Sverige")}</div>
      </div>

      <div className="flex gap-3">
        <Link href="/contact" className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-black text-sm">
          {t("Open contact form","Öppna kontaktformuläret")}
        </Link>
        <a href="mailto:care@neuroljus.com" className="px-4 py-2 rounded-xl border hover:bg-gray-50 text-sm">
          {t("Send email","Skicka mejl")}
        </a>
      </div>
    </div>
  </div>
</section>
      
      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-10 text-xs text-gray-500 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Neuroljus — {t("All rights reserved.","Alla rättigheter förbehållna.")}</div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">{t("Privacy","Integritet")}</a>
            <a href="#" className="hover:underline">{t("Accessibility","Tillgänglighet")}</a>
            <a href="#ethics" className="hover:underline">{t("Ethics","Etik")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
