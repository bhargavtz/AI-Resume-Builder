# Changelog

All notable changes to the AI Resume Builder project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete dashboard resume management system
- Animated testimonials section on landing page
- Modern 4-column footer with social links
- Dots background pattern on hero section
- Dropdown action menu for resume cards
- Delete resume with confirmation dialog
- Duplicate resume functionality
- Last modified date display on resume cards
- Loading states for all async operations
- Toast notifications for user feedback
- Auto-save functionality (1-second debounce)
- Next button auto-enablement on form validation
- Security validation for resume access

### Changed
- Replaced modern animated footer with 4-column layout
- Updated FAQ page to remove premium references
- Simplified pricing page to single free plan
- Enhanced ResumeItem component with action menu
- Fixed Next.js 15 async params issue in API routes
- Removed "Upgrade to Pro" section from dashboard
- Updated all premium feature mentions to free features

### Fixed
- Hydration mismatch error from browser extensions
- Resume creation with empty content instead of dummy data
- Next button enablement on existing resume load
- Database persistence for resume content
- Security vulnerability in GET endpoint (user isolation)
- API route params handling for Next.js 15+

### Removed
- Premium plan references from FAQ
- Pro and Enterprise pricing tiers
- Upgrade to Pro dashboard card
- Premium template mentions
- All paid feature limitations

---

## [0.2.0] - 2025-12-09

### Dashboard Features

#### Added
- **Resume Management**
  - View all resumes in grid layout
  - Search functionality for resumes
  - Statistics cards (Total, Recent, Downloads)
  - Quick action cards (New Resume, Browse Templates)
  
- **Resume Actions**
  - Edit resume (navigate to editor)
  - Preview resume (read-only view)
  - Download resume (PDF export)
  - Duplicate resume (create copy with content)
  - Delete resume (with confirmation dialog)
  
- **User Experience**
  - Hover effects on resume cards
  - Dropdown action menu (three dots icon)
  - Loading states during operations
  - Success/error toast notifications
  - Auto-refresh after actions
  - Last modified date display

#### Components Created
- `ResumeItem.tsx` - Enhanced resume card with actions
- `dropdown-menu.tsx` - shadcn dropdown component
- `confirm-dialog.tsx` - Reusable confirmation dialog

#### API Enhancements
- Fixed async params for Next.js 15
- Added user isolation security
- Proper error handling and logging

---

### Landing Page Enhancements

#### Added
- **Testimonials Section**
  - Animated scrolling columns (3 columns)
  - 9 user testimonials with images
  - Fade-center mask effect
  - Different scroll speeds per column
  - Responsive layout (1/2/3 columns)
  
- **Background Effects**
  - Dots pattern with fade-center mask
  - Gradient overlays
  - Animated blob backgrounds
  
- **Footer**
  - 4-column layout (About, Product, Support, Contact)
  - Social media links (Twitter, LinkedIn, GitHub)
  - Navigation links to all pages
  - Copyright notice
  - Responsive design

#### Components Created
- `testimonials-columns.tsx` - Animated testimonial columns
- `bg-pattern.tsx` - Background pattern component
- `footer-column.tsx` - 4-column footer layout
- `modern-animated-footer.tsx` - Alternative footer design

---

### Content Updates

#### FAQ Page
- Removed premium plan mentions
- Updated to "completely free to use"
- Simplified export format information
- Removed feature limitations
- Focus on core free features

#### Pricing Page
- Removed Pro plan (₹750/month)
- Removed Enterprise plan (₹2420/month)
- Single "Free Forever" plan
- All features included:
  - Unlimited Resumes
  - Professional Templates
  - AI Writing Assistant
  - PDF Export
  - ATS Optimization
  - Real-time Preview
  - Auto-Save

---

### Technical Improvements

#### Dependencies Added
- `@radix-ui/react-dropdown-menu` - Dropdown menus
- `framer-motion` - Already existed, used for animations

#### Bug Fixes
- **Hydration Mismatch**: Added `suppressHydrationWarning` to body tag
- **Empty Resume Data**: Removed dummy data fallback for new resumes
- **Next Button**: Auto-enables when valid data exists
- **Auto-Save**: Implemented with debouncing and validation
- **Security**: Added userId validation to GET endpoint
- **Async Params**: Fixed for Next.js 15 compatibility

#### Code Quality
- Removed 80+ lines of commented code
- Cleaned up PersonalDetail component
- Proper TypeScript types throughout
- Consistent error handling
- Loading states for all operations

---

### Database & API

#### Resume API (`/api/resumes/[id]`)
- **GET**: Fetch resume with user validation
- **PUT**: Update resume content
- **DELETE**: Delete resume with confirmation
- All endpoints validate user ownership

#### AI Features
- Generate professional summaries
- Create bullet points
- Suggest skills
- Improve content
- ATS score checking

---

### UI/UX Improvements

#### Design System
- Consistent color scheme
- Smooth animations throughout
- Hover effects on interactive elements
- Loading spinners for async operations
- Toast notifications for feedback

#### Responsive Design
- Mobile-first approach
- Tablet optimizations
- Desktop enhancements
- Flexible grid layouts

#### Accessibility
- Proper ARIA labels
- Keyboard navigation
- Screen reader support
- Semantic HTML

---

### Security Enhancements

#### Authentication
- Clerk integration
- Protected routes
- User session management

#### Data Protection
- User isolation (can only access own resumes)
- Secure API endpoints
- Input validation
- Error handling without exposing sensitive data

---

### Performance Optimizations

#### Auto-Save
- 1-second debounce
- Prevents excessive API calls
- Validates data before saving
- Error recovery

#### Loading States
- Skeleton screens
- Spinner animations
- Disabled buttons during operations
- Progress indicators

---

## Installation & Setup

### Environment Variables Required
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
MONGODB_URI=
GEMINI_API_KEY=
```

### Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
```

---

## Known Issues

### Resolved
- ✅ Hydration mismatch from browser extensions
- ✅ Dummy data on new resumes
- ✅ Next button not enabling
- ✅ Data not persisting to database
- ✅ Security vulnerability in GET endpoint
- ✅ Next.js 15 async params error

### In Progress
- None currently

---

## Future Roadmap

### Planned Features
- [ ] Multiple resume templates
- [ ] Cover letter generator
- [ ] LinkedIn profile import
- [ ] Resume analytics dashboard
- [ ] Export to DOCX format
- [ ] Multi-language support
- [ ] Team collaboration
- [ ] Resume version history

### Under Consideration
- [ ] AI-powered interview preparation
- [ ] Job matching recommendations
- [ ] Salary insights
- [ ] Career path suggestions

---

## Contributors

- **Bhargav** - Initial work and ongoing development
  - GitHub: [@bhargavtz](https://github.com/bhargavtz)
  - Email: bhargav05@yandex.com

---

## Acknowledgments

Special thanks to:
- Next.js team for the amazing framework
- Google for Gemini AI capabilities
- Clerk for authentication services
- shadcn for beautiful UI components
- The open-source community

---

**Last Updated**: December 9, 2025
**Version**: 2.0.0
**Status**: Active Development
