import Header from '@/components/custom/Header';
import { UserButton } from '@clerk/clerk-react';
import { AtomIcon, Edit, Share2 } from 'lucide-react';
import React from 'react';

function Home() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <Header />
      <div>
        {/* Background Image */}
        <img
          src={'/grid.svg'}
          className="absolute z-[-10] w-full h-[500px] object-cover opacity-30"
          alt="Background"
        />

        {/* Hero Section */}
        <section className="relative z-50 py-16">
          <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
            <a
              href="#"
              className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              role="alert"
            >
              <span className="text-xs bg-primary rounded-full text-white px-4 py-1.5 mr-3">
                New
              </span>{' '}
              <span className="text-sm font-medium">Introducing AI Resume Builder</span>
              <svg
                className="ml-2 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              Build Your Resume <span className="text-primary">With AI</span>
            </h1>
            <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
              Effortlessly craft a standout resume with our AI-powered builder, designed to make your job search easier.
            </p>
            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <a
                href="/auth/sign-in"
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-primary-dark focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
              >
                Get Started
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a
                href="https://github.com/bhargavtz/AI-Resume-Builder"
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                <svg
                  className="mr-2 -ml-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                </svg>
                See github Repo
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
              Why Choose Our AI Resume Builder?
            </h2>
            <div className="flex flex-wrap justify-around">
              <div className="w-1/3 p-4">
                <AtomIcon className="text-primary w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">AI-Powered Suggestions</h3>
                <p className="text-gray-600">Get real-time recommendations to enhance your resume.</p>
              </div>
              <div className="w-1/3 p-4">
                <Edit className="text-primary w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Customizable Templates</h3>
                <p className="text-gray-600">Choose from a variety of professionally designed templates.</p>
              </div>
              <div className="w-1/3 p-4">
                <Share2 className="text-primary w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">One-Click Sharing</h3>
                <p className="text-gray-600">Easily share your resume with potential employers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-white dark:bg-gray-800 py-12">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Testimonials</h2>
            <div className="flex flex-wrap justify-center space-x-6">
              <div className="w-1/3 bg-gray-50 p-4 rounded-lg shadow-lg">
                <p className="italic">
                  "This resume builder made the whole process so easy and enjoyable!"
                </p>
                <h3 className="font-bold mt-4">- Alex M.</h3>
              </div>
              <div className="w-1/3 bg-gray-50 p-4 rounded-lg shadow-lg">
                <p className="italic">
                  "I landed my dream job within a month of using this tool."
                </p>
                <h3 className="font-bold mt-4">- Sarah L.</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-gray-800 py-8 text-gray-300">
          <div className="container mx-auto px-6 text-center">
            <div className="mb-4">
              <UserButton />
            </div>
            <p className="text-sm">
              &copy; 2024 AI Resume Builder. All Rights Reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
