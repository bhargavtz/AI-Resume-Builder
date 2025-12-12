# AI Resume Builder

A modern, AI-powered resume builder built with Next.js, TypeScript, and Gemini AI. Create professional, ATS-optimized resumes in minutes with intelligent AI assistance.

![AI Resume Builder](https://img.shields.io/badge/Next.js-16.0.8-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🤖 AI-Powered Features
- **AI Writing Assistant** - Generate professional summaries and bullet points
- **Smart Suggestions** - Get AI-powered content recommendations
- **ATS Optimization** - Ensure your resume passes applicant tracking systems
- **Auto-Save** - Never lose your work with automatic saving

### 📝 Resume Management
- **Unlimited Resumes** - Create as many resumes as you need
- **Easy Editing** - Intuitive interface with real-time preview
- **Multiple Actions** - Edit, duplicate, delete, download resumes
- **Template System** - Professional templates ready to use

### 🎨 User Experience
- **Real-time Preview** - See changes instantly as you type
- **Responsive Design** - Works perfectly on all devices
- **Dark/Light Mode** - Theme support for comfortable editing
- **Modern UI** - Beautiful interface with smooth animations

### 🔒 Security & Authentication
- **Clerk Authentication** - Secure user authentication
- **User Isolation** - Each user can only access their own resumes
- **Data Privacy** - Your data is secure and private

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.8 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **AI**: Google Gemini 2.0 Flash
- **Rate Limiting**: Upstash Redis (Recommended for Production)
- **Security**: Share Token Expiration, Circuit Breakers
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Clerk account
- Google Gemini API key

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/bhargavtz/AI-Resume-Builder.git
cd AI-Resume-Builder
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Application URL (Required for Share Links)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Upstash Redis (Optional - Recommended for Production Rate Limiting)
UPSTASH_REDIS_URL=your_upstash_redis_url
UPSTASH_REDIS_TOKEN=your_upstash_redis_token
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
AI-Resume-Builder/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── ai/             # AI-related endpoints
│   │   └── resumes/        # Resume CRUD operations
│   ├── dashboard/          # Dashboard pages
│   ├── pricing/            # Pricing page
│   ├── faq/                # FAQ page
│   └── page.tsx            # Landing page
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── resume/             # Resume-specific components
│   ├── Navbar.tsx          # Navigation bar
│   ├── Footer.tsx          # Footer component
│   └── ResumeItem.tsx      # Resume card component
├── lib/                     # Utility libraries
│   ├── db.ts               # Database connection
│   ├── models/             # Mongoose models
│   └── utils.ts            # Utility functions
├── service/                 # Service layer
│   ├── GlobalApi.ts        # API service
│   └── AIService.ts        # AI service
├── context/                 # React context
│   └── ResumeInfoContext.tsx
└── public/                  # Static assets
```

## 🎯 Key Features Explained

### Dashboard
- View all your resumes in a grid layout
- Search and filter resumes
- Quick actions: Create, Edit, Duplicate, Delete
- Statistics showing total resumes created

### Resume Editor
- Step-by-step form for easy data entry
- Real-time preview on the right side
- Auto-save functionality (saves every second)
- AI-powered content generation
- Download as PDF

### AI Capabilities
- Generate professional summaries based on job title
- Create bullet points for work experience
- Suggest relevant skills
- Improve existing content
- ATS optimization suggestions

## 🔧 API Endpoints

### Resume Management
- `GET /api/resumes` - Get all user resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/[id]` - Get specific resume
- `PUT /api/resumes/[id]` - Update resume
- `DELETE /api/resumes/[id]` - Delete resume

### AI Features (Enhanced with Retry Logic & Circuit Breakers)
- `POST /api/ai/generate-summary` - Generate professional summary
- `POST /api/ai/generate-bullets` - Generate work experience bullets
- `POST /api/ai/suggest-skills` - Get skill suggestions
- `POST /api/ai/improve-resume` - Improve resume content
- `POST /api/ai/ats-score` - Check ATS compatibility
- `POST /api/ai/review-resume` - Comprehensive resume review
- `POST /api/ai/cover-letter` - Generate tailored cover letter

## 🎨 Customization

### Adding New Templates
1. Create template component in `components/resume/templates/`
2. Add template preview
3. Register in template selector

### Modifying AI Prompts
Edit prompts in `service/AIService.ts` to customize AI behavior

### Styling
- Tailwind classes in components
- Global styles in `app/globals.css`
- Theme configuration in `tailwind.config.ts`

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Verify `MONGODB_URI` in `.env.local`
- Check network connectivity
- Ensure MongoDB is running

**Clerk Authentication Issues**
- Verify Clerk keys in `.env.local`
- Check Clerk dashboard settings
- Clear browser cache and cookies

**AI Features Not Working**
- Verify `GEMINI_API_KEY` is correct
- Check API quota limits
- Review console for error messages

## 📝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Bhargav**
- GitHub: [@bhargavtz](https://github.com/bhargavtz)
- Twitter: [@bhargavtz](https://twitter.com/bhargavtz)
- Email: bhargav05@yandex.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Clerk](https://clerk.com/) - Authentication
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI capabilities
- [Framer Motion](https://www.framer.com/motion/) - Animations

## 📊 Project Stats

- **Total Components**: 50+
- **API Endpoints**: 15+
- **AI Features**: 5+
- **Supported Formats**: PDF
- **Database**: MongoDB
- **Authentication**: Clerk

## 🔮 Future Enhancements

- [ ] Multiple resume templates
- [ ] Cover letter generator
- [ ] LinkedIn profile import
- [ ] Resume analytics
- [ ] Team collaboration features
- [ ] Multi-language support

## 📞 Support

For support, email bhargav05@yandex.com or open an issue on GitHub.

---

Made with ❤️ by Bhargav using Next.js & Gemini AI
