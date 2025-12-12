# Contributing Guide

Thank you for your interest in contributing to AI Resume Builder! This guide will help you get started.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### 1. Fork the Repository

Click the "Fork" button on GitHub to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/AI-Resume-Builder.git
cd AI-Resume-Builder
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/bhargavtz/AI-Resume-Builder.git
```

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Set Up Environment

Copy `.env.example` to `.env.local` and add your keys.

### 3. Run Development Server

```bash
npm run dev
```

### 4. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 5. Test Your Changes

```bash
# Run linter
npm run lint

# Build to check for errors
npm run build
```

### 6. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

**Commit Message Format**:
```
<type>: <description>

[optional body]
[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### 7. Push Changes

```bash
git push origin feature/your-feature-name
```

### 8. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template
5. Submit for review

## Code Style Guidelines

### TypeScript

```typescript
// ✅ Good
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

function getUserName(user: UserProfile): string {
  return `${user.firstName} ${user.lastName}`;
}

// ❌ Bad
function getUserName(user: any) {
  return user.firstName + " " + user.lastName;
}
```

### React Components

```typescript
// ✅ Good - Functional component with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}

// ❌ Bad - Missing types
export function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `ResumeCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- API routes: `route.ts`
- Pages: `page.tsx`

### Import Order

```typescript
// 1. React and Next.js
import React from 'react';
import { NextRequest } from 'next/server';

// 2. External libraries
import axios from 'axios';
import { toast } from 'sonner';

// 3. Internal modules
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

// 4. Types
import type { Resume } from '@/lib/types';

// 5. Styles (if any)
import './styles.css';
```

## Project Structure Guidelines

### Adding New Features

**1. API Endpoint**

```typescript
// app/api/feature/route.ts
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-error';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
  }
  
  // Your logic here
  
  return successResponse(data);
}
```

**2. Component**

```typescript
// components/feature/FeatureComponent.tsx
'use client';

import React from 'react';

interface FeatureComponentProps {
  // Props
}

export function FeatureComponent({ }: FeatureComponentProps) {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

**3. Utility Function**

```typescript
// lib/featureUtils.ts
/**
 * Description of what this function does
 * @param param1 - Description
 * @returns Description
 */
export function utilityFunction(param1: string): string {
  // Implementation
  return result;
}
```

## Testing Guidelines

### Unit Tests

```typescript
// __tests__/lib/utils.test.ts
import { describe, it, expect } from '@jest/globals';
import { formatDate } from '@/lib/utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2025-12-11');
    expect(formatDate(date)).toBe('Dec 11, 2025');
  });
});
```

### Integration Tests

```typescript
// __tests__/api/resumes.test.ts
import { describe, it, expect } from '@jest/globals';

describe('POST /api/resumes', () => {
  it('should create a new resume', async () => {
    const response = await fetch('/api/resumes', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Resume' })
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
```

## Documentation Guidelines

### Code Comments

```typescript
/**
 * Generates a professional summary using AI
 * 
 * @param jobTitle - The target job title
 * @param experience - Years of experience
 * @param skills - Comma-separated skills
 * @returns AI-generated professional summary
 * @throws {ApiError} If AI service is unavailable
 */
export async function generateSummary(
  jobTitle: string,
  experience: string,
  skills: string
): Promise<string> {
  // Implementation
}
```

### README Updates

When adding new features, update relevant documentation:
- `README.md` - Main project README
- `docs/api-reference.md` - API documentation
- `docs/user-guide.md` - User-facing features

## Pull Request Guidelines

### PR Title

```
feat: add cover letter generation feature
fix: resolve PDF export issue on dark mode
docs: update API reference for new endpoints
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests passing

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

## Review Process

1. **Automated Checks**: CI/CD runs linting and tests
2. **Code Review**: Maintainer reviews code
3. **Feedback**: Address review comments
4. **Approval**: PR approved and merged

## Areas for Contribution

### High Priority
- [ ] Add comprehensive unit tests
- [ ] Improve error handling
- [ ] Add E2E tests
- [ ] Performance optimizations
- [ ] Accessibility improvements

### Features
- [ ] Additional resume templates
- [ ] Real-time collaboration
- [ ] Resume version history
- [ ] Job application tracking
- [ ] LinkedIn profile import

### Documentation
- [ ] Video tutorials
- [ ] API examples
- [ ] Deployment guides
- [ ] Troubleshooting guides

## Getting Help

- **Questions**: [GitHub Discussions](https://github.com/bhargavtz/AI-Resume-Builder/discussions)
- **Bugs**: [GitHub Issues](https://github.com/bhargavtz/AI-Resume-Builder/issues)
- **Security**: Email security@example.com

## Recognition

Contributors will be:
- Listed in `CONTRIBUTORS.md`
- Mentioned in release notes
- Given credit in documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AI Resume Builder! 🎉
