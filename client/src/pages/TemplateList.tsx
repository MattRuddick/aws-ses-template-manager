import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Copy, 
  Send,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { ses_api } from '../services/api'
import type { TemplateMetadata } from '../types'
import DeleteModal from '../components/modals/DeleteModal'
import SendEmailModal from '../components/modals/SendEmailModal'
import DuplicateModal from '../components/modals/DuplicateModal'

const AWS_REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia) us-east-1' },
  { value: 'us-east-2', label: 'US East (Ohio) us-east-2' },
  { value: 'us-west-2', label: 'US West (Oregon) us-west-2' },
  { value: 'ap-south-1', label: 'Asia Pacific (Mumbai) ap-south-1' },
  { value: 'ap-northeast-2', label: 'Asia Pacific (Seoul) ap-northeast-2' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore) ap-southeast-1' },
  { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney) ap-southeast-2' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo) ap-northeast-1' },
  { value: 'ca-central-1', label: 'Canada (Central) ca-central-1' },
  { value: 'eu-central-1', label: 'Europe (Frankfurt) eu-central-1' },
  { value: 'eu-west-1', label: 'Europe (Ireland) eu-west-1' },
  { value: 'eu-west-2', label: 'Europe (London) eu-west-2' },
  { value: 'sa-east-1', label: 'South America (São Paulo) sa-east-1' },
]

const TemplateList = () => {
  const [templates, set_templates] = useState<TemplateMetadata[]>([])
  const [loading, set_loading] = useState(true)
  const [region, set_region] = useState(() => {
    return localStorage.getItem('region') || 'us-east-1'
  })
  
  // Modal states
  const [delete_modal_open, set_delete_modal_open] = useState(false)
  const [duplicate_modal_open, set_duplicate_modal_open] = useState(false)
  const [send_email_modal_open, set_send_email_modal_open] = useState(false)
  const [selected_template, set_selected_template] = useState<string>('')
  const [open_dropdown, set_open_dropdown] = useState<string | null>(null)
  const dropdown_ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    load_templates()
  }, [region])

  useEffect(() => {
    const handle_click_outside = (event: MouseEvent) => {
      if (dropdown_ref.current && !dropdown_ref.current.contains(event.target as Node)) {
        set_open_dropdown(null)
      }
    }

    if (open_dropdown) {
      document.addEventListener('mousedown', handle_click_outside)
    }

    return () => {
      document.removeEventListener('mousedown', handle_click_outside)
    }
  }, [open_dropdown])

  const load_templates = async () => {
    try {
      set_loading(true)
      const response = await ses_api.list_templates(region)
      set_templates(response.items.TemplatesMetadata || [])
    } catch (error: any) {
      console.error('Error loading templates:', error)
      toast.error(error.response?.data?.error || 'Failed to load templates')
    } finally {
      set_loading(false)
    }
  }

  const handle_region_change = (new_region: string) => {
    set_region(new_region)
    localStorage.setItem('region', new_region)
  }

  const handle_delete_template = async (template_name: string) => {
    try {
      await ses_api.delete_template(template_name, region)
      toast.success('Template deleted successfully')
      set_delete_modal_open(false)
      load_templates()
    } catch (error: any) {
      console.error('Error deleting template:', error)
      toast.error(error.response?.data?.error || 'Failed to delete template')
    }
  }

  const format_date = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const open_delete_modal = (template_name: string) => {
    set_selected_template(template_name)
    set_delete_modal_open(true)
  }

  const open_duplicate_modal = (template_name: string) => {
    set_selected_template(template_name)
    set_duplicate_modal_open(true)
  }

  const open_send_email_modal = (template_name: string) => {
    set_selected_template(template_name)
    set_send_email_modal_open(true)
  }

  const toggle_dropdown = (template_name: string) => {
    set_open_dropdown(open_dropdown === template_name ? null : template_name)
  }

  const close_dropdown = () => {
    set_open_dropdown(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li className="font-medium text-gray-900">SES Templates</li>
        </ol>
      </nav>

      {/* Header with region selector and create button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <label htmlFor="region-selector" className="form-label">
            Region
          </label>
          <select
            id="region-selector"
            value={region}
            onChange={(e) => handle_region_change(e.target.value)}
            className="form-select w-full sm:w-auto"
          >
            {AWS_REGIONS.map((reg) => (
              <option key={reg.value} value={reg.value}>
                {reg.label}
              </option>
            ))}
          </select>
        </div>
        
        <Link
          to="/create-template"
          className="btn btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create New</span>
        </Link>
      </div>

      {/* Templates table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading templates...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No templates found in this region</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Created Timestamp</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr key={template.Name}>
                    <td className="font-medium">{template.Name}</td>
                    <td>{format_date(template.CreatedTimestamp)}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/update-template?name=${template.Name}`}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit template"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        
                        <button
                          onClick={() => open_delete_modal(template.Name)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete template"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        
                        <div className="relative" ref={dropdown_ref}>
                          <button
                            onClick={() => toggle_dropdown(template.Name)}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                            title="More actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          
                          {open_dropdown === template.Name && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    close_dropdown()
                                    open_duplicate_modal(template.Name)
                                  }}
                                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Copy className="h-4 w-4" />
                                  <span>Duplicate</span>
                                </button>
                                <button
                                  onClick={() => {
                                    close_dropdown()
                                    open_send_email_modal(template.Name)
                                  }}
                                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Send className="h-4 w-4" />
                                  <span>Send test email</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <DeleteModal
        is_open={delete_modal_open}
        on_close={() => set_delete_modal_open(false)}
        template_name={selected_template}
        on_confirm={handle_delete_template}
      />
      
      <DuplicateModal
        is_open={duplicate_modal_open}
        on_close={() => set_duplicate_modal_open(false)}
        template_name={selected_template}
      />
      
      <SendEmailModal
        is_open={send_email_modal_open}
        on_close={() => set_send_email_modal_open(false)}
        template_name={selected_template}
        region={region}
      />
    </div>
  )
}

export default TemplateList
