"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Section from "./Section";
import { upload } from "@imagekit/next";

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const authenticator = async () => {
  try {
    const response = await fetch("/api/imagekit/auth");
    if (!response.ok) throw new Error("Authentication failed");
    return await response.json();
  } catch (error) {
    throw new Error(`Authentication error: ${error}`);
  }
};

export default function WriteBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 5MB Size Limit
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setErrors({ image: "File is too large! Please upload an image smaller than 5MB." });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // 1. Get Auth Params
      const authResponse = await fetch("/api/imagekit/auth");
      const { token, expire, signature, publicKey } = await authResponse.json();

      // 2. Upload to ImageKit
      const result = await upload({
        file,
        fileName: file.name,
        publicKey,
        token,
        expire,
        signature,
        folder: "hyd_site_blog_uimages",
      });

      setImage(result.url || "");
      // Removed setSuccess here to keep it quiet until final submit
    } catch (err: any) {
      setErrors({ image: "Image upload failed: " + err.message });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title) newErrors.title = "Title is required.";
    if (!author) newErrors.author = "Author name is required.";
    if (!content) newErrors.content = "Blog content is required.";
    if (!image) newErrors.image = "Please upload a cover image for your blog.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, image, author }),
      });
      setShowModal(true);
      setTitle("");
      setContent("");
      setImage("");
      setAuthor("");
    } catch (err) {
      setErrors({ form: "Failed to submit blog post. Please try again." });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="write-blog" className="py-8 md:py-12">
      <div className="container mx-auto px-4 relative">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 md:mb-16 text-center gradient-text">
          Write a Blog Post
        </h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto glass-effect p-8 rounded-lg shadow-lg border border-white/10"
        >
          {errors.form && <p className="text-red-500 mb-4 text-center">{errors.form}</p>}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Info & Image */}
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-white/80 mb-2 font-medium">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter a catchy title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full p-3 bg-white/10 backdrop-blur-md text-white placeholder:text-gray-500 rounded-xl border ${errors.title ? 'border-red-500' : 'border-white/20'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="author" className="block text-white/80 mb-2 font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  id="author"
                  placeholder="Who's the author?"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className={`w-full p-3 bg-white/10 backdrop-blur-md text-white placeholder:text-gray-500 rounded-xl border ${errors.author ? 'border-red-500' : 'border-white/20'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
                {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
              </div>

              <div>
                <label htmlFor="image" className="block text-white/80 mb-2 font-medium">
                  Blog Cover Image
                </label>
                <div className={`p-4 rounded-xl border-2 border-dashed ${errors.image ? 'border-red-500 bg-red-500/5' : 'border-white/20 bg-white/5'} transition-all`}>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                </div>
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                
                {image && (
                  <div className="mt-4 animate-in fade-in zoom-in duration-300">
                    <p className="text-xs text-green-400 mb-2 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Image ready for upload
                    </p>
                    <img src={image} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-white/20 shadow-lg" />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="flex flex-col h-full">
              <label htmlFor="content" className="block text-white/80 mb-2 font-medium">
                Blog Content (Markdown supported)
              </label>
              <textarea
                id="content"
                placeholder="Share your thoughts with the community..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`flex-grow w-full p-4 bg-white/10 backdrop-blur-md text-white placeholder:text-gray-500 rounded-xl border ${errors.content ? 'border-red-500' : 'border-white/20'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[300px] lg:min-h-0`}
              ></textarea>
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              type="submit"
              className="px-12 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all duration-300 disabled:bg-gray-600 disabled:scale-100 shadow-xl shadow-blue-600/20 flex items-center gap-2 mx-auto"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Submit for Approval"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#111] border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl text-center transform animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Submission Successful!</h3>
            <p className="text-white/70 mb-8 leading-relaxed">
              Thank you for contributing to the Hyderabad Beatbox Community. Your blog will be reviewed by our admin team and published within <span className="text-blue-400 font-bold">48 hours</span>.
            </p>
            <button
              onClick={() => router.push("/blog")}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/20"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}
