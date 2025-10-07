import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2 hover:text-gray-300 transition-colors">
            <Mail className="h-8 w-8" />
            <span className="text-xl font-bold">AWS SES Template Manager</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className="hover:text-gray-300 transition-colors"
            >
              Templates
            </Link>
            <Link 
              to="/create-template" 
              className="hover:text-gray-300 transition-colors"
            >
              Create Template
            </Link>
          </nav>
          
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
