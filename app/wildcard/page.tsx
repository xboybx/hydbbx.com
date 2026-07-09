import connectToDatabase from '@/lib/mongodb';
import Wildcard from '@/models/Wildcard';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Metadata } from 'next';
import {
  Calendar,
  User,
  Video,
  Clock,
  Check,
  X,
  Mic,
  FileText,
  Scale,
  Trophy,
  AlertOctagon,
  DollarSign,
  CheckSquare,
  Info
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// Dynamic SEO metadata generation
export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  try {
    const wildcard = await Wildcard.findOne({});
    if (!wildcard || !wildcard.isActive) {
      return {
        title: "Wildcard Submissions - Hyderabad Beatbox Community",
      };
    }

    const title = `${wildcard.title} | Hyderabad Beatbox Community`;
    const description = wildcard.description
      .replace(/[#*`>_\-]/g, "")
      .substring(0, 150) + "...";

    return {
      title,
      description,
      openGraph: {
        title: wildcard.title,
        description,
        type: "website",
        images: wildcard.poster ? [{ url: wildcard.poster }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: wildcard.title,
        description,
        images: wildcard.poster ? [wildcard.poster] : [],
      },
    };
  } catch (error) {
    console.error("Error generating wildcard metadata:", error);
    return {
      title: "Wildcard Submissions - Hyderabad Beatbox Community",
    };
  }
}

export default async function WildcardPage() {
  await connectToDatabase();
  let wildcard = null;

  try {
    const foundWildcard = await Wildcard.findOne({});
    if (foundWildcard) {
      wildcard = JSON.parse(JSON.stringify(foundWildcard));
    }
  } catch (error) {
    console.error("Error fetching wildcard details:", error);
  }

  // Fallback template if nothing in DB yet
  if (!wildcard) {
    wildcard = {
      isActive: false,
      title: "HYDERABAD BEATBOX CHAMPIONSHIP 2026 ALL INDIA CATEGORY",
      description: "",
      poster: "",
      googleFormUrl: "",
    };
  }

  // Detect if the description matches the official HBC 2026 guidelines
  const isHbcGuidelines = wildcard.description && (
    wildcard.description.includes("HYDERABAD BEATBOX CHAMPIONSHIP") ||
    wildcard.description.includes("ALL INDIA SOLO WILDCARD GUIDELINES")
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Header Bar */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto h-20 px-6 md:px-8 flex items-center justify-between">
          <Link href="/" className="transition-transform hover:scale-102 duration-300">
            <img className="h-12" src="/HBX logoo.png" alt="Hyderabad Beatbox logo" />
          </Link>
          <Link
            href="/"
            className="text-white/80 hover:text-white transition-colors duration-300 text-xs md:text-sm uppercase tracking-wider bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-2"
          >
            &larr; Back to Home
          </Link>
        </div>
      </header>

      {/* Main Page Layout */}
      {!wildcard.isActive ? (
        /* Submissions Closed / Inactive State */
        <div className="flex-grow container mx-auto px-4 flex flex-col items-center justify-center text-center py-20 max-w-xl">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-lg shadow-white/5">
            <svg className="w-10 h-10 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold mb-4 text-white">Submissions Closed</h1>
          <p className="text-white/60 mb-10 text-sm md:text-base leading-relaxed">
            Wildcard submissions for this championship are currently closed. Follow our social media pages or return to the home page to stay updated on future announcements!
          </p>
          <Link
            href="/"
            className="px-8 py-3.5 bg-white hover:bg-white/90 text-black rounded-full font-bold text-sm tracking-wide shadow-lg shadow-white/5 transition-all duration-300 hover:scale-105"
          >
            Go to Homepage
          </Link>
        </div>
      ) : (
        /* Active State - Luma-style Sidebar Layout */
        <div className="flex-grow bg-[#050505] relative overflow-hidden">
          {/* Page background glows */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neutral-600/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-neutral-400/5 rounded-full blur-[140px] pointer-events-none" />

          <main className="container mx-auto px-6 md:px-8 py-12 md:py-16 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

              {/* Left Column: Guidelines details (Order 2 on mobile, 1 on desktop) */}
              <div className="order-2 lg:order-1 lg:col-span-8 space-y-8">

                {/* Meta details at the very top */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-400" />
                    <span>Hyderabad Beatbox Community</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight uppercase">
                    {wildcard.title}
                  </h1>
                  <p className="text-base sm:text-lg text-white/60 font-medium uppercase tracking-wider border-l-2 border-sky-400 pl-3">
                    Solo Category
                  </p>
                </div>

                <hr className="border-white/10" />

                {isHbcGuidelines ? (
                  /* Premium Styled Guidelines Layout */
                  <div className="space-y-8">

                    {/* Intro */}
                    <p className="text-base md:text-lg text-white/80 leading-relaxed">
                      This is the All India Solo Wildcard submission guidelines for the Hyderabad Beatbox Championship 2026. Check the rules and regulations regarding the wildcard submission below and complete your submission using the form link.
                    </p>

                    {/* Submission Window */}
                    <div className="glass-effect border border-white/10 rounded-2xl p-6 space-y-4 bg-white/[0.02]">
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white">
                        <Calendar className="w-6 h-6 text-sky-400" />
                        Submission Window
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                          <span className="text-xs text-white/40 block mb-1 uppercase tracking-wider">Deadline</span>
                          <span className="text-base font-bold text-rose-400">10 August 2026 | 12:00 AM (IST)</span>
                        </div>
                      </div>
                      <p className="text-xs text-white/40 italic">Note: Late submissions will not be accepted under any circumstances.</p>
                    </div>

                    {/* Eligibility */}
                    <div className="glass-effect border border-white/10 rounded-2xl p-6 bg-white/[0.02] space-y-3">
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white">
                        <User className="w-6 h-6 text-sky-400" />
                        Eligibility
                      </h2>
                      <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                        The All India Solo Wildcard is open to beatboxers from <span className="text-sky-400 font-semibold">across India</span>.
                      </p>
                    </div>

                    {/* Video Requirements */}
                    <div className="glass-effect border border-white/10 rounded-2xl p-6 bg-white/[0.02] space-y-6">
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white">
                        <Video className="w-6 h-6 text-sky-400" />
                        Video Requirements
                      </h2>
                      <div className="space-y-4 text-white/80 text-sm sm:text-base">
                        <div className="flex flex-col sm:flex-row sm:gap-3">
                          <span className="font-semibold text-white min-w-[120px] mb-1 sm:mb-0">Platform:</span>
                          <span>Upload your wildcard to <strong className="text-sky-400 font-semibold">YouTube</strong> (Public or Unlisted).</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-3">
                          <span className="font-semibold text-white min-w-[120px] mb-1 sm:mb-0">Hashtag:</span>
                          <span>Include <strong className="text-sky-400 font-semibold">#HBC2026</strong> in the video description.</span>
                        </div>
                        <div className="space-y-2">
                          <span className="font-semibold text-white block">Video Title Format:</span>
                          <div className="p-4 bg-black/60 border border-sky-500/20 rounded-xl font-mono text-xs sm:text-sm text-neutral-200 break-all select-all leading-normal">
                            ARTIST NAME | HYDERABAD BEATBOX CHAMPIONSHIP 2026 | ALL INDIA SOLO WILDCARD | #HBC2026
                          </div>
                          <p className="text-xs text-white/40 italic">Tip: Copy the format exactly as shown above.</p>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-5">
                        <h3 className="text-lg font-bold text-white mb-4">Video Guidelines</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            "Record in Landscape (16:9).",
                            "Ensure your face and mouth remain clearly visible throughout the performance.",
                            "Use good lighting and a stable camera.",
                            "Record in a quiet environment for the best audio quality."
                          ].map((item, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-white/70">
                              <Check className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Performance Duration */}
                    <div className="glass-effect border border-white/10 rounded-2xl p-6 bg-white/[0.02] space-y-6">
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white">
                        <Clock className="w-6 h-6 text-sky-400" />
                        Performance Duration
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                          <span className="text-xs text-white/40 block mb-1 uppercase tracking-wider">Introduction</span>
                          <span className="text-lg sm:text-xl font-extrabold text-sky-400">Up to 15 seconds</span>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                          <span className="text-xs text-white/40 block mb-1 uppercase tracking-wider">Beatbox Routine</span>
                          <span className="text-lg sm:text-xl font-extrabold text-sky-400">~ 1 minute 30s</span>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                          <span className="text-xs text-white/40 block mb-1 uppercase tracking-wider">Total Duration</span>
                          <span className="text-lg sm:text-xl font-extrabold text-sky-400">~ 1 minute 45s</span>
                        </div>
                      </div>

                      <div className="p-5 bg-white/5 border-l-4 border-sky-400 rounded-r-xl space-y-2">
                        <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Introduction Speech Rule:</p>
                        <blockquote className="text-white italic text-sm sm:text-base leading-relaxed">
                          &ldquo;My name is <span className="text-sky-400 font-semibold">[Artist Name]</span>, and this is my All India Solo Wildcard for the Hyderabad Beatbox Championship 2026.&rdquo;
                        </blockquote>
                      </div>
                    </div>

                    {/* Recording Rules */}
                    <div className="glass-effect border border-white/10 rounded-2xl p-6 bg-white/[0.02] space-y-4">
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white">
                        <Video className="w-6 h-6 text-sky-400" />
                        Recording Rules
                      </h2>
                      <ul className="space-y-3">
                        {[
                          "The performance must be recorded in one continuous take.",
                          "No cuts or video editing are allowed.",
                          "Audio and video must be recorded simultaneously.",
                          "The performer must remain clearly visible throughout the performance.",
                          "Any submission found to contain manipulated or misleading content may be disqualified."
                        ].map((rule, idx) => (
                          <li key={idx} className="flex gap-3 text-white/80 text-sm sm:text-base">
                            <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0 mt-2" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Audio & Mixing Rules */}
                    <div className="glass-effect border border-white/10 rounded-2xl p-6 bg-white/[0.02] space-y-6">
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white">
                        <Mic className="w-6 h-6 text-sky-400" />
                        Audio & Mixing Rules
                      </h2>
                      <p className="text-sm text-white/60">
                        To ensure fair judging while maintaining good recording quality, the following processing rules apply.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Allowed Section */}
                        <div className="bg-emerald-950/5 border border-emerald-500/10 rounded-xl p-5 space-y-4">
                          <h3 className="text-emerald-400 font-bold flex items-center gap-2 text-base">
                            <Check className="w-5 h-5 text-emerald-400" /> Allowed
                          </h3>
                          <ul className="space-y-3">
                            {["Basic EQ", "Basic Compression", "Reverb", "Moderate Noise Reduction"].map((item, idx) => (
                              <li key={idx} className="flex gap-2.5 text-sm text-white/70">
                                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Not Allowed Section */}
                        <div className="bg-rose-950/5 border border-rose-500/10 rounded-xl p-5 space-y-4">
                          <h3 className="text-rose-400 font-bold flex items-center gap-2 text-base">
                            <X className="w-5 h-5 text-rose-500" /> Not Allowed
                          </h3>
                          <ul className="space-y-3">
                            {[
                              "Delay effects",
                              "Auto-Tune / Pitch Correction",
                              "Overdubbing or adding new sounds after the recording",
                              "Re-recording or replacing any part of the original performance",
                              "Applying different processing to individual sounds (kick, snare, bass, etc.)",
                              "Automation or changing effects during the performance"
                            ].map((item, idx) => (
                              <li key={idx} className="flex gap-2.5 text-sm text-white/70">
                                <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center text-xs sm:text-sm font-semibold text-white/80">
                        ⚠️ The entire recording must use the same processing from start to finish.
                      </div>
                    </div>

                    {/* Raw Recording Submission */}
                    <div className="glass-effect border border-white/10 rounded-2xl p-6 bg-white/[0.02] space-y-4">
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white">
                        <FileText className="w-6 h-6 text-sky-400" />
                        Raw Recording Submission
                      </h2>
                      <div className="space-y-3 text-sm sm:text-base text-white/80 leading-relaxed">
                        <p>
                          Participants using an <strong className="text-white">external microphone or audio interface</strong> must submit:
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5 text-white/70">
                          <li>Original camera recording.</li>
                          <li>Original microphone recording (raw).</li>
                        </ul>
                        <p>
                          Participants recording directly using a <strong className="text-white">phone or camera</strong> without any external audio equipment only need to submit their YouTube link.
                        </p>
                        <p className="text-xs text-white/40 italic border-t border-white/5 pt-3">
                          * The organizing team may request additional raw files for verification if required.
                        </p>
                      </div>
                    </div>

                    {/* Judging Criteria */}
                    <div className="glass-effect border border-white/10 rounded-2xl p-6 bg-white/[0.02] space-y-6">
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white">
                        <Scale className="w-6 h-6 text-sky-400" />
                        Judging Criteria (50 Points)
                      </h2>
                      <p className="text-sm text-white/60">
                        Entries will be scored out of a total of 50 points based on the following five categories:
                      </p>

                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { name: "Technical Skill", pts: 10, desc: "Difficulty, cleanliness, control, and consistency of your beatboxing." },
                          { name: "Musicality", pts: 10, desc: "Rhythm, timing, groove, and how musical your routine sounds." },
                          { name: "Structure & Composition", pts: 10, desc: "Flow, transitions, arrangement, and the overall development of your routine." },
                          { name: "Originality", pts: 10, desc: "Creativity, unique sounds, patterns, and your personal style." },
                          { name: "Subjectivity", pts: 10, desc: "The overall impact of your performance, including confidence, expression, stage presence, and the impression you leave on the judges." }
                        ].map((item, idx) => (
                          <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white/10 hover:border-white/10">
                            <div className="space-y-1">
                              <h3 className="text-base font-bold text-white">{item.name}</h3>
                              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{item.desc}</p>
                            </div>
                            <span className="shrink-0 bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider w-fit text-center shadow-sm">
                              {item.pts} Points
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Qualification */}
                    <div className="glass-effect border border-white/10 rounded-2xl p-6 bg-white/[0.02] space-y-4">
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white">
                        <Trophy className="w-6 h-6 text-sky-400" />
                        Qualification
                      </h2>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center gap-4">
                        <span className="text-3xl font-extrabold text-sky-400 shrink-0">25</span>
                        <p className="text-sm text-white/80 leading-relaxed">
                          The <strong className="text-white font-semibold">Top 25 Solo Wildcards</strong> will qualify for the <strong className="text-white font-semibold">Hyderabad Beatbox Championship 2026</strong>.
                        </p>
                      </div>
                      <p className="text-xs text-white/40 italic">Note: The judges' decision will be final and binding.</p>
                    </div>

                    {/* Disqualification */}
                    <div className="glass-effect border border-white/10 rounded-2xl p-6 bg-white/[0.02] space-y-4">
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-rose-400">
                        <AlertOctagon className="w-6 h-6" />
                        Disqualification
                      </h2>
                      <p className="text-sm text-white/60">Entries may be disqualified if:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          "Submitted after the deadline.",
                          "Video or audio violates the competition rules.",
                          "Incorrect title format or missing #HBC2026.",
                          "Required raw recordings are not submitted when requested.",
                          "False or misleading information is provided."
                        ].map((item, idx) => (
                          <div key={idx} className="flex gap-2.5 text-xs sm:text-sm text-white/70 bg-neutral-900/40 border border-neutral-800/60 p-3 rounded-lg">
                            <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Registration Fee */}
                    <div className="glass-effect border border-white/10 rounded-2xl p-6 bg-white/[0.02] space-y-6">
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white">
                        <DollarSign className="w-6 h-6 text-sky-400" />
                        Registration Fee & Submission
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-5 bg-white/5 border border-white/5 rounded-xl space-y-1">
                          <span className="text-xs text-white/40 uppercase tracking-wider block">Registration Fee</span>
                          <span className="text-2xl sm:text-3xl font-extrabold text-sky-400">₹350</span>
                        </div>
                        <div className="p-5 bg-white/5 border border-white/5 rounded-xl space-y-1">
                          <span className="text-xs text-white/40 uppercase tracking-wider block">Official Submission Link</span>
                          <a
                            href="https://www.hyderabadbeatboxcommunity.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm sm:text-base font-bold text-sky-400 hover:text-blue-300 hover:underline block break-all mt-1"
                          >
                            www.hyderabadbeatboxcommunity.in
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Submission Checklist */}
                    <div className="glass-effect border border-white/10 rounded-2xl p-6 bg-white/[0.02] space-y-4">
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white">
                        <CheckSquare className="w-6 h-6 text-sky-400" />
                        Submission Checklist
                      </h2>
                      <p className="text-sm text-white/60 mb-2">Ensure you complete all instructions before submitting your wildcard:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          "Upload your wildcard to YouTube.",
                          "Use the correct video title format.",
                          "Add #HBC2026 in the description.",
                          "Submit your YouTube link.",
                          "Submit raw recordings (if required).",
                          "Complete your registration."
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                            <div className="w-5 h-5 rounded bg-sky-500/10 border border-sky-500/35 flex items-center justify-center text-sky-400 shrink-0">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs sm:text-sm text-white/80">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Important Note */}
                    <div className="glass-effect border border-white/10 rounded-2xl p-6 bg-white/[0.02] space-y-4">
                      <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-sky-400">
                        <Info className="w-6 h-6" />
                        Important Note
                      </h2>
                      <ul className="space-y-3 text-xs sm:text-sm text-white/70">
                        {[
                          "By submitting your wildcard, you confirm that the performance is your own original work.",
                          "You have read and agreed to all the rules and guidelines.",
                          "Hyderabad Beatbox Community reserves the right to use your wildcard for judging, promotion, livestreams, social media, and other event-related purposes. Ownership of the performance remains with the artist."
                        ].map((item, idx) => (
                          <li key={idx} className="flex gap-2 leading-relaxed">
                            <span className="text-sky-400 shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-center font-bold text-white mt-6 border-t border-white/5 pt-4 text-base sm:text-lg tracking-wide">
                        🎤🔥 See you at the Hyderabad Beatbox Championship 2026! 🎤🔥
                      </p>
                    </div>

                  </div>
                ) : (
                  /* Standard Markdown Fallback (if description is completely changed by admin) */
                  <div className="prose prose-sm md:prose-base lg:prose-lg prose-invert max-w-none text-white/80 leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
                      {wildcard.description}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Right Column: Poster Sticky Action Card (Order 1 on mobile, 2 on desktop) */}
              <div className="order-1 lg:order-2 lg:col-span-4 w-full">
                <div className="lg:sticky lg:top-28">
                  <div className="glass-effect border border-white/10 rounded-2xl p-4 sm:p-5 space-y-5 shadow-2xl shadow-white/2 max-w-[420px] mx-auto w-full bg-white/5">

                    {/* Poster container */}
                    <div className="relative rounded-xl border border-white/5 overflow-hidden w-full aspect-[3/4] bg-black/40">
                      {wildcard.poster ? (
                        <img
                          src={wildcard.poster}
                          alt={wildcard.title}
                          className="object-cover w-full h-full transition-transform duration-700 hover:scale-102"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                          <p className="text-white/40 italic text-sm">No poster uploaded</p>
                        </div>
                      )}
                    </div>

                    {/* Event summary details */}
                    <div className="space-y-3 pt-2 text-xs sm:text-sm text-white/70 border-t border-white/5">
                      <div className="flex justify-between pb-1">
                        <span>Event Type:</span>
                        <span className="font-semibold text-white">Wildcard Submission</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span className="font-semibold text-white">Video Submission</span>
                      </div>
                    </div>

                    {/* Submit CTA Button inside card */}
                    {wildcard.googleFormUrl && (
                      <a
                        href={wildcard.googleFormUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 text-white rounded-xl font-bold text-sm transition-all duration-300 group cursor-pointer btn-wildcard-premium"
                      >
                        Submit Wildcard Entry
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      )}
    </div>
  );
}
