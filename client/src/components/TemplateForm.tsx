import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import CodeEditor from '../components/CodeEditor'

interface TemplateFormProps {
  initial_data?: {
    template_name: string
    subject_part: string
    text_part: string
    html_part: string
  }
  is_editing?: boolean
  onSubmit: (data: {
    template_name: string
    subject_part: string
    text_part: string
    html_part: string
    region: string
  }) => Promise<void>
}

const TemplateForm = ({ initial_data, is_editing = false, onSubmit }: TemplateFormProps) => {
  const [form_data, set_form_data] = useState({
    template_name: initial_data?.template_name || '',
    subject_part: initial_data?.subject_part || '',
    text_part: initial_data?.text_part || '',
    html_part: initial_data?.html_part || '',
  })
  
  const [show_preview, set_show_preview] = useState(true)
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState('')

  const region = localStorage.getItem('region') || 'us-east-1'

  const handle_input_change = (field: string, value: string) => {
    set_form_data(prev => ({ ...prev, [field]: value }))
    set_error('')
  }

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form_data.template_name.trim()) {
      set_error('Template name is required')
      return
    }
    
    if (!form_data.subject_part.trim()) {
      set_error('Subject is required')
      return
    }

    try {
      set_loading(true)
      set_error('')
      await onSubmit({
        ...form_data,
        region
      })
    } catch (err: any) {
      set_error(err.response?.data?.error || 'An error occurred while saving the template')
    } finally {
      set_loading(false)
    }
  }

  const generate_text_content = () => {
    // Simple HTML to text conversion
    const text_content = form_data.html_part
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
    
    set_form_data(prev => ({ ...prev, text_part: text_content }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-gray-700">
              SES Templates
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="font-medium text-gray-900">
            {is_editing ? 'Update Template' : 'Create Template'}
          </li>
        </ol>
      </nav>

      <form onSubmit={handle_submit} className="space-y-6">
        {/* Template Name */}
        <div>
          <label htmlFor="template-name" className="form-label">
            Template Name
          </label>
          {is_editing && (
            <p className="text-sm text-gray-500 mb-2">
              This value cannot be changed when editing this template
            </p>
          )}
          <input
            type="text"
            id="template-name"
            value={form_data.template_name}
            onChange={(e) => handle_input_change('template_name', e.target.value)}
            className="form-input"
            placeholder="Template Name"
            disabled={is_editing}
            required
          />
          <p className="form-help">
            The name of the template. When you send the email, you refer to this name.
          </p>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="template-subject" className="form-label">
            Subject
          </label>
          <input
            type="text"
            id="template-subject"
            value={form_data.subject_part}
            onChange={(e) => handle_input_change('subject_part', e.target.value)}
            className="form-input"
            placeholder="Subject"
            required
          />
          <p className="form-help">
            The subject line of the email. This property may contain replacement tags.
          </p>
        </div>

        {/* Text Part */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="template-text" className="form-label">
              Text
            </label>
            <button
              type="button"
              onClick={generate_text_content}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Generate Content
            </button>
          </div>
          <textarea
            id="template-text"
            value={form_data.text_part}
            onChange={(e) => handle_input_change('text_part', e.target.value)}
            className="form-textarea"
            placeholder="Text content"
            rows={6}
          />
          <p className="form-help">
            The text body of the email. Recipients whose email clients don't display HTML email see this version of the email. This property may contain replacement tags.
          </p>
        </div>

        {/* HTML Part */}
        <div>
          <label htmlFor="template-html" className="form-label">
            HTML
          </label>
          <CodeEditor
            value={form_data.html_part}
            onChange={(value) => handle_input_change('html_part', value)}
            placeholder="HTML content"
            height="400px"
          />
          <p className="form-help">
            The HTML body of the email. This property may contain replacement tags.
          </p>
        </div>

        {/* Preview Toggle */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => set_show_preview(!show_preview)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
          >
            {show_preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{show_preview ? 'Hide' : 'Show'} Preview</span>
          </button>
        </div>

        {/* Preview */}
        {show_preview && (
          <div>
            <label className="form-label">Template Preview</label>
            <div className="border border-gray-300 rounded-md p-4 bg-white min-h-[200px]">
              <div dangerouslySetInnerHTML={{ __html: form_data.html_part || '<p class="text-gray-500">No HTML content to preview</p>' }} />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link
            to="/"
            className="btn btn-secondary inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (is_editing ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TemplateForm
