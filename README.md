# AI Resume Builder

A comprehensive web application designed to help users create, manage, and customize professional resumes with the assistance of AI. This tool streamlines the resume creation process, offering various templates, real-time previews, and AI-powered suggestions to enhance content and formatting.

## Table of Contents

* [Features](#features)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
* [API Documentation](#api-documentation)
* [Contributing](#contributing)
* [License](#license)
* [Contact and Support](#contact-and-support)
* [Troubleshooting](#troubleshooting)

## Features

* **AI-Powered Content Generation:** Leverage advanced AI models to receive intelligent recommendations for resume content, including impactful phrasing, relevant keywords, and structured bullet points for experience and summary sections. This helps users craft compelling narratives without starting from scratch.
* **Rich Text Editing:** Utilize a comprehensive rich text editor for detailed customization of all resume sections, allowing for precise formatting, bolding, italics, and list creation.
* **Customizable Templates & Themes:** Select from a growing library of professionally designed resume templates and apply various color themes to match personal branding or industry standards.
* **Real-time Live Preview:** Instantly visualize all changes as they are made in a side-by-side preview, ensuring the final output matches expectations before export.
* **Intuitive User Dashboard:** A centralized dashboard provides a clear overview of all created resumes, allowing users to easily manage, duplicate, edit, and delete their documents.
* **Secure User Authentication:** Robust sign-in and sign-up functionalities ensure secure access to user data and personalized resume projects.
* **Dynamic Form Sections:** Structured forms for personal details, education, experience, and skills guide users through the resume creation process, ensuring all necessary information is captured.
* **Export Options:** (Assumed, can be added if implemented) Export your polished resumes into widely accepted formats like PDF, making them ready for job applications.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Node.js:** Version 18 or higher. You can download it from [nodejs.org](https://nodejs.org/).
* **npm** (Node Package Manager) or **Yarn:** npm comes bundled with Node.js. If you prefer Yarn, you can install it via `npm install -g yarn`.

## Installation

Follow these detailed steps to get the AI Resume Builder up and running on your local machine. These instructions are applicable across Windows, macOS, and Linux environments.

1. **Clone the repository:**

```bash
git clone https://github.com/bhargavtz/AI-Resume-Builder.git
cd AI-Resume-Builder
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

## Configuration

1. **Create a `.env.local` file:**

2. **Add environment variables:**

```
VITE_API_KEY=your_api_key_here
```

*Note:* `.env.local` is in `.gitignore` to prevent accidental commits of sensitive information.

## Usage

1. **Start the development server:**

```bash
npm run dev
# or
yarn dev
```

2. **Access the application:**
   Navigate to the displayed local URL (e.g., `http://localhost:5173`).

3. **Sign In/Sign Up:**

* New users can register; existing users can sign in.

4. **Create and Edit Resumes:**

* Add, edit, and manage resumes via the dashboard.
* Use AI features for content suggestions.
* View real-time previews.
* Export to PDF (if available).

## API Documentation

* **`service/GlobalApi.js`**: General API requests for resumes.
* **`service/AIModal.js`**: AI-specific content generation calls.

**Authentication:** Uses `VITE_API_KEY`.

## Contributing

1. **Fork and clone the repository:**

```bash
git clone https://github.com/bhargavtz/AI-Resume-Builder.git
```

2. **Create a branch:**

```bash
git checkout -b feature/your-feature-name
```

3. **Make changes and test.**
4. **Push and open a Pull Request.**

## License

Licensed under the MIT License. See `LICENSE` file for details.

## Contact and Support

* **GitHub Issues:** [AI Resume Builder Issues](https://github.com/bhargavtz/AI-Resume-Builder/issues)
* **Email:** [bhargavthummar05@gmail.com](mailto:bhargavthummar05@gmail.com)

## Troubleshooting

* **Installation issues:**

  * Ensure Node.js version is correct.
  * Clear cache: `npm cache clean --force` or `yarn cache clean`
  * Delete `node_modules` and lock files, then reinstall.

* **Port conflicts:**

  * Terminate processes using the port.
  * Or configure an alternate port in `vite.config.js`.

* **API Key errors:**

  * Verify `.env.local` contents.
  * Restart the dev server after editing environment variables.
  * Check API key permissions.
