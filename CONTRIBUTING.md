# Contributing to Rostar Notes Hub

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a new branch for your feature
4. Make your changes
5. Commit with clear messages
6. Push to your fork
7. Create a Pull Request

## Development Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Coding Standards

### Frontend (React)
- Use functional components with hooks
- Follow React best practices
- Use Zustand for state management
- Write meaningful component names
- Add PropTypes or TypeScript when possible
- Keep components under 300 lines

### Backend (Node.js/Express)
- Follow REST API conventions
- Use async/await
- Add proper error handling
- Write meaningful variable names
- Keep functions focused and DRY
- Add comments for complex logic

## Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `refactor/refactor-name` - Code refactoring
- `docs/doc-name` - Documentation
- `test/test-name` - Tests

### Commit Messages
```
type: brief description

Longer explanation if needed.
- Bullet points for changes
- More details

Fixes #123
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`

## Pull Request Process

1. Update the README with any new features
2. Add tests if applicable
3. Ensure code follows standards
4. Update documentation
5. Make sure all tests pass
6. Request review from maintainers

## Testing

### Frontend
```bash
cd frontend
npm run test
```

### Backend
```bash
cd backend
npm run test
```

## Common Tasks

### Adding a New Feature

1. Create feature branch
2. Implement feature
3. Test thoroughly
4. Add documentation
5. Create PR with detailed description

### Fixing a Bug

1. Create fix branch
2. Write test that reproduces bug
3. Fix the bug
4. Ensure test passes
5. Create PR with explanation

### Documentation

- Keep README updated
- Add inline code comments
- Document API changes
- Update SETUP.md if needed

## Reporting Issues

When reporting an issue, include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, etc.)
- Error messages/logs

## Feature Requests

When requesting a feature:
- Explain the use case
- Describe the desired behavior
- Provide examples if possible
- Consider impact on performance

## Review Process

- Code review by maintainers
- Feedback within 48 hours typically
- Changes requested clearly explained
- Approved and merged when ready

## License

By contributing, you agree your code will be licensed under MIT License.

## Questions?

- Check existing issues/discussions
- Create a new discussion
- Ask for help in PRs

---

**Happy Contributing! 🚀**
