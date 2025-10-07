# AWS SES Template Manager

A modern, React-based GUI wrapper around AWS SES SDK for creating, managing, and testing email templates.

## Features

- **Template Management**: Create, read, update, and delete AWS SES email templates
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Code Editor**: Syntax-highlighted HTML editor with CodeMirror
- **Template Preview**: Live preview of HTML templates
- **Test Emails**: Send test emails with dynamic field replacement
- **Template Duplication**: Duplicate existing templates with new names
- **Multi-Region Support**: Switch between AWS regions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js with Express.js
- AWS SDK v2
- Express Rate Limiting
- Helmet for security
- CORS support

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons
- CodeMirror for code editing
- React Router for navigation
- React Hot Toast for notifications
- Axios for API calls

## Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS account with SES access
- AWS credentials configured

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aws-ses-template-manager
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your AWS credentials:
   ```
   PORT=3000
   NODE_ENV=development
   AWS_ACCESS_KEY_ID=your-aws-access-key-id
   AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
   AWS_DEFAULT_REGION=us-east-1
   ```

4. **Build the frontend**
   ```bash
   npm run build
   ```

## Development

To run in development mode with hot reloading:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3000
- Frontend dev server on http://localhost:5173

## Production

To run in production:

```bash
npm start
```

## Usage

1. **Access the application** at http://localhost:3000
2. **Select your AWS region** from the dropdown
3. **Create templates** with HTML, text, and subject content
4. **Edit existing templates** by clicking the edit icon
5. **Send test emails** using the "Send test email" option
6. **Duplicate templates** for quick template creation
7. **Delete templates** when no longer needed

## API Endpoints

- `GET /api/list-templates` - List all templates
- `GET /api/get-template/:name` - Get specific template
- `POST /api/create-template` - Create new template
- `PUT /api/update-template` - Update existing template
- `DELETE /api/delete-template/:name` - Delete template
- `POST /api/send-template` - Send test email

## Security Features

- Rate limiting on API endpoints
- Special rate limiting for email sending (30 emails per 15 minutes)
- Helmet.js for security headers
- CORS protection
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details