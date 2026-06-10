"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { useParams } from "next/navigation";
import Section from "./Section";
import LoadingSpinner from "./LoadingSpinner";

interface BlogType {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
}

export default function BlogDetail() {
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky header after scrolling past the static header (around 450px)
      setIsSticky(window.scrollY > 450);

      // Update reading progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setReadingProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
      setLoading(false);
    };

    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <Section className="py-16 md:py-32">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </Section>
    );
  }

  if (!blog) {
    return (
      <Section className="py-16 md:py-32">
        <h2 className="text-2xl text-center text-white/80">
          Blog post not found.
        </h2>
      </Section>
    );
  }

  return (
    <>
      {/* Sticky Header (shows only when scrolled past the static header, fixed full-width black top bar) */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 transform ${
          isSticky 
            ? "translate-y-0 opacity-100" 
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-black/95 backdrop-blur-md border-b border-white/10 py-3 px-4 md:px-8 relative shadow-xl">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              <img
                src={
                  blog.image.startsWith("data:image")
                    ? blog.image
                    : `${blog.image}?tr=w-100,h-100,fo-auto,q-80`
                }
                alt={blog.title}
                className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg border border-white/10 flex-shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-white font-bold truncate text-sm md:text-base tracking-tight">
                  {blog.title}
                </h4>
                <p className="text-white/60 text-xs truncate">
                  By {blog.author}
                </p>
              </div>
            </div>

            <Link
              href="/#blog"
              className="text-xs md:text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white px-4 py-2 rounded-full transition-all duration-300 flex-shrink-0 flex items-center gap-1.5"
            >
              &larr; <span className="hidden sm:inline">Back to</span> Home
            </Link>
          </div>

          {/* Reading Progress Bar */}
          <div
            className="absolute bottom-0 left-0 h-[3px] bg-neutral-500 transition-all duration-100 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>

      <Section className="py-2 md:py-4">
      <div className="container mx-auto px-4 md:px-10 relative">
        <div className="mb-8">
          <Link href="/#blog" className="text-blue-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>

        {/* 1. Static inline header (scrolls naturally out of view) */}
        <div className="mb-12">
          <img
            src={
              blog.image.startsWith("data:image")
                ? blog.image
                : `${blog.image}?tr=w-1200,q-80`
            }
            alt={blog.title}
            className="h-auto max-h-[500px] object-cover rounded-lg mb-8 shadow-lg mx-auto w-full"
          />

          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center gradient-text">
            {blog.title}
          </h1>
          <p className="text-center text-white/60 mb-8">
            By {blog.author} on {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-sm sm:prose-base md:prose-lg prose-invert max-w-none text-white/80 mx-auto">
          <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>{blog.content}</ReactMarkdown>
        </div>
      </div>
    </Section>
    </>
  );
}
