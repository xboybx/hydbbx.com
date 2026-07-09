import connectToDatabase from '@/lib/mongodb';
import Wildcard from '@/models/Wildcard';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Metadata } from 'next';

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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
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
            className="px-8 py-3.5 bg-[#0066FF] hover:bg-blue-700 text-white rounded-full font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105"
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
              <div className="order-2 lg:order-1 lg:col-span-8 space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-white/80 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    All India Solo Category
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight uppercase">
                    {wildcard.title}
                  </h1>
                </div>

                <hr className="border-white/10" />

                <div className="prose prose-sm md:prose-base lg:prose-lg prose-invert max-w-none text-white/80 leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
                    {wildcard.description}
                  </ReactMarkdown>
                </div>
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
