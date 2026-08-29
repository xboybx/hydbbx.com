import connectToDatabase from "@/lib/mongodb";
import Draw24, { DEFAULT_25_BEATBOXERS } from "@/models/Draw24";
import Link from "next/link";
import { Metadata } from "next";
import { 
  Trophy, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  CreditCard, 
  AlertCircle,
  HelpCircle,
  Lock,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export const dynamic = "force-dynamic";

// Dynamic SEO metadata generation
export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  try {
    const draw24 = await Draw24.findOne({});
    const title = draw24?.title 
      ? `Wildcard Winners Registration | ${draw24.title}`
      : "Wildcard Winners Registration | Hyderabad Beatbox Championship";

    return {
      title,
      description: "Official Top Selected Beatboxers Roster & Registration for the Hyderabad Beatbox Championship. Register with entry fee.",
      openGraph: {
        title,
        description: "Official Top Selected Beatboxers Roster & Registration.",
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: "Wildcard Winners Registration | Hyderabad Beatbox Community",
    };
  }
}

export default async function Draw24Page() {
  await connectToDatabase();
  let draw24 = null;

  try {
    const found = await Draw24.findOne({});
    if (found) {
      draw24 = JSON.parse(JSON.stringify(found));
    }
  } catch (error) {
    console.error("Error fetching Draw 24 details from DB:", error);
  }

  // Fallback defaults if not in DB yet
  if (!draw24) {
    draw24 = {
      isActive: true,
      title: "Hyderabad Beatbox Championship 2026",
      registrationFee: "₹350",
      googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSengmcfx01WNUSI_ECZhjAkPEwlhn-i-au-cczkLme5yH9qtg/viewform",
      instagramHandle: "@hydbeatboxcommunity",
      beatboxers: DEFAULT_25_BEATBOXERS,
    };
  }

  const {
    isActive,
    title,
    registrationFee,
    googleFormUrl,
    instagramHandle,
    beatboxers,
  } = draw24;

  const rosterList = Array.isArray(beatboxers) && beatboxers.length > 0 ? beatboxers : DEFAULT_25_BEATBOXERS;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#0066FF] selection:text-white relative overflow-hidden">
      {/* Cohesive HBX Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[550px] h-[550px] bg-[#0066FF]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#0066FF]/8 rounded-full blur-[170px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[200px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="container mx-auto h-20 px-6 md:px-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105 duration-300">
            <img className="h-11 md:h-12 w-auto" src="/HBX logoo.png" alt="Hyderabad Beatbox Logo" />
          </Link>

          <Link
            href="/"
            className="text-white/80 hover:text-white transition-all duration-300 text-xs md:text-sm uppercase tracking-wider bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 px-5 py-2.5 rounded-full flex items-center gap-2 group shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      {!isActive ? (
        /* Inactive / Closed State */
        <div className="flex-grow container mx-auto px-4 flex flex-col items-center justify-center text-center py-24 max-w-xl relative z-10">
          <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-xl shadow-black/50">
            <Lock className="w-10 h-10 text-white/40" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white tracking-tight">Registration Closed</h1>
          <p className="text-white/60 mb-10 text-sm md:text-base leading-relaxed">
            Wildcard winners registration for the <strong className="text-white">{title}</strong> is currently closed or has concluded. Follow us on Instagram <strong className="text-[#0066FF]">{instagramHandle}</strong> for tournament bracket updates and schedule releases.
          </p>
          <Link
            href="/"
            className="px-8 py-3.5 bg-[#0066FF] hover:bg-blue-600 text-white rounded-full font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105"
          >
            Return to Homepage
          </Link>
        </div>
      ) : (
        /* Active State */
        <main className="flex-grow container mx-auto px-5 sm:px-8 md:px-12 py-10 md:py-16 max-w-6xl relative z-10">
          
          {/* Header Hero Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 md:mb-18">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#0066FF] text-xs md:text-sm font-semibold tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#0066FF]" />
              <span>Official Wildcard Results</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight uppercase">
              Wildcard Winners <br className="hidden sm:inline" />
              <span className="text-[#0066FF]">
                Roster & Registration
              </span>
            </h1>

            <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Congratulations to all selected wildcard winners for the <strong className="text-white">{title}</strong>! Find your name in the official roster below, and proceed to complete your registration.
            </p>

            {/* Quick Key Metrics Bar */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-md mx-auto">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 hover:border-[#0066FF]/40 hover:bg-white/[0.05]">
                <span className="text-xs text-white/50 uppercase font-semibold tracking-wider">Total Selected</span>
                <span className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2 mt-1">
                  <Trophy className="w-4 h-4 text-[#0066FF]" /> {rosterList.length} Artists
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 hover:border-emerald-500/40 hover:bg-white/[0.05]">
                <span className="text-xs text-white/50 uppercase font-semibold tracking-wider">Registration Fee</span>
                <span className="text-xl md:text-2xl font-extrabold text-emerald-400 flex items-center gap-2 mt-1">
                  <CreditCard className="w-4 h-4 text-emerald-400" /> {registrationFee}
                </span>
              </div>
            </div>
          </div>

          {/* 1. OFFICIAL ROSTER FIRST */}
          <section className="space-y-6 mb-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2 text-[#0066FF] text-xs font-bold uppercase tracking-widest mb-1.5">
                  <Trophy className="w-4 h-4 text-[#0066FF]" /> Official Selected Roster
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Top Qualified Beatboxers ({rosterList.length})
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                <span>Draw List #01 - #{String(rosterList.length).padStart(2, "0")}</span>
              </div>
            </div>

            {/* Grid of Beatboxers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-4">
              {rosterList.map((bbx: any) => {
                const formattedNumber = String(bbx.id).padStart(2, "0");
                return (
                  <div
                    key={bbx.id}
                    className="group relative p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-[#0066FF]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#0066FF]/10 hover:-translate-y-1 backdrop-blur-md flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Seed Number Tag */}
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/80 font-mono font-bold text-sm group-hover:bg-[#0066FF]/15 group-hover:border-[#0066FF]/40 group-hover:text-[#0066FF] transition-all shadow-inner">
                        #{formattedNumber}
                      </div>

                      {/* Artist Name & Tag */}
                      <div>
                        <h3 className="font-bold text-white text-base group-hover:text-[#0066FF] transition-colors">
                          {bbx.name}
                        </h3>
                        <span className="text-[11px] text-emerald-400 font-medium tracking-wide uppercase flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {bbx.status || "Confirmed"}
                        </span>
                      </div>
                    </div>

                    {/* Subtle Right Arrow / Status Cue */}
                    <div className="text-white/20 group-hover:text-[#0066FF] transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 2. REGISTRATION & FEE SPOTLIGHT SECTION */}
          <section className="mb-14 rounded-3xl p-6 sm:p-8 md:p-10 bg-black/60 border border-white/15 shadow-2xl shadow-black/80 backdrop-blur-xl relative overflow-hidden">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#0066FF]/10 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> Registration Open for Qualified Artists
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  Complete Your Registration
                </h2>
                <p className="text-white/70 text-sm sm:text-base max-w-xl leading-relaxed">
                  All confirmed wildcard winners must fill out the Google Form and pay the official entry fee of{" "}
                  <span className="text-emerald-400 font-bold text-lg">{registrationFee}</span> to lock in their spot for the championship.
                </p>
                
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 justify-center lg:justify-start text-xs sm:text-sm text-white/70">
                    <span className="w-5 h-5 rounded-full bg-[#0066FF]/20 text-[#0066FF] border border-[#0066FF]/30 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    <span>Fill in your artist name, contact information, and registration details.</span>
                  </div>
                  <div className="flex items-center gap-2.5 justify-center lg:justify-start text-xs sm:text-sm text-white/70">
                    <span className="w-5 h-5 rounded-full bg-[#0066FF]/20 text-[#0066FF] border border-[#0066FF]/30 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    <span>Pay <strong className="text-emerald-400 font-semibold">{registrationFee}</strong> through the payment method specified in the form.</span>
                  </div>
                  <div className="flex items-center gap-2.5 justify-center lg:justify-start text-xs sm:text-sm text-white/70">
                    <span className="w-5 h-5 rounded-full bg-[#0066FF]/20 text-[#0066FF] border border-[#0066FF]/30 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                    <span>Attach the payment screenshot or reference ID in the form submission.</span>
                  </div>
                </div>
              </div>

              {/* Action CTA Button */}
              <div className="flex flex-col items-center gap-3 w-full lg:w-auto shrink-0">
                <a
                  href={googleFormUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-9 py-4.5 bg-[#0066FF] hover:bg-blue-600 text-white rounded-full font-bold text-base sm:text-lg tracking-wide shadow-xl shadow-[#0066FF]/30 hover:shadow-[#0066FF]/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 border border-white/10"
                >
                  <span>Register via Google Form</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
                <span className="text-xs text-white/50 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#0066FF]" />
                  Registration Fee: <strong className="text-emerald-400 font-semibold">{registrationFee}</strong> per qualified artist
                </span>
              </div>
            </div>
          </section>

          {/* Help & Support Notice */}
          <div className="mt-12 text-center text-xs sm:text-sm text-white/50 flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4 text-white/40" />
            <span>Have questions or need assistance? Reach out to us on Instagram <strong className="text-[#0066FF]">{instagramHandle}</strong> or contact the HBX organizing crew.</span>
          </div>

        </main>
      )}

      {/* Footer Bar */}
      <footer className="border-t border-white/10 bg-black/80 py-6 text-center text-xs text-white/40 mt-auto">
        <p>&copy; {new Date().getFullYear()} Hyderabad Beatbox Community. All rights reserved.</p>
      </footer>
    </div>
  );
}
