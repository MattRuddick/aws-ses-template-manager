import { useState, useEffect } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { ses_api } from '../../services/api'
import type { SesTemplate } from '../../types'

interface SendEmailModalProps {
  is_open: boolean
  on_close: () => void
  template_name: string
  region: string
}

const SendEmailModal = ({ is_open, on_close, template_name, region }: SendEmailModalProps) => {
  const [loading, set_loading] = useState(false)
  const [template, set_template] = useState<SesTemplate | null>(null)
  const [form_data, set_form_data] = useState({
    source: '',
    to_address: '',
    dynamic_fields: {} as Record<string, string>
  })
  const [email_sent, set_email_sent] = useState(false)
  const [sent_time, set_sent_time] = useState<string>('')

  useEffect(() => {
    if (is_open && template_name) {
      load_template()
    }
  }, [is_open, template_name])

  const load_template = async () => {
    try {
      set_loading(true)
      const response = await ses_api.get_template(template_name, region)
      if (response.data) {
        set_template(response.data)
        // Initialize dynamic fields
        const initial_fields: Record<string, string> = {}
        response.data.dynamic_fields.forEach(field => {
          initial_fields[field] = ''
        })
        set_form_data(prev => ({ ...prev, dynamic_fields: initial_fields }))
      }
    } catch (error: any) {
      console.error('Error loading template:', error)
      toast.error(error.response?.data?.error || 'Failed to load template')
    } finally {
      set_loading(false)
    }
  }

  const handle_input_change = (field: string, value: string) => {
    if (field === 'source' || field === 'to_address') {
      set_form_data(prev => ({ ...prev, [field]: value }))
    } else {
      set_form_data(prev => ({
        ...prev,
        dynamic_fields: { ...prev.dynamic_fields, [field]: value }
      }))
    }
  }

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form_data.source || !form_data.to_address) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      set_loading(true)
      await ses_api.send_template({
        template_name,
        source: form_data.source,
        template_data: JSON.stringify(form_data.dynamic_fields),
        to_address: form_data.to_address,
        region
      })
      
      set_email_sent(true)
      set_sent_time(new Date().toLocaleString())
      toast.success('Email sent successfully!')
      
      // Auto-hide success message after 8 seconds
      setTimeout(() => {
        set_email_sent(false)
      }, 8000)
    } catch (error: any) {
      console.error('Error sending email:', error)
      toast.error(error.response?.data?.error || 'Failed to send email')
    } finally {
      set_loading(false)
    }
  }

  const reset_modal = () => {
    set_form_data({
      source: '',
      to_address: '',
      dynamic_fields: {}
    })
    set_email_sent(false)
    set_sent_time('')
    set_template(null)
  }

  const handle_close = () => {
    reset_modal()
    on_close()
  }

  if (!is_open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handle_close}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Send Test Email
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">
                    Send your email template "<strong>{template_name}</strong>" via AWS SES to a single recipient email address. (<strong>for testing purposes only!</strong>)
                  </p>
                  <p className="text-sm text-red-600 mb-4">
                    Any emails sent from here are liable to billing and costs through your AWS account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handle_submit}>
            <div className="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
              {loading && !template ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading template...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="source-address" className="form-label">
                      Source email address
                    </label>
                    <input
                      type="email"
                      id="source-address"
                      value={form_data.source}
                      onChange={(e) => handle_input_change('source', e.target.value)}
                      className="form-input"
                      placeholder="source email address"
                      required
                    />
                    <p className="form-help">
                      The domain you're sending from must already be verified in AWS
                    </p>
                  </div>

                  <div>
                    <label htmlFor="to-address" className="form-label">
                      Recipient email address
                    </label>
                    <input
                      type="email"
                      id="to-address"
                      value={form_data.to_address}
                      onChange={(e) => handle_input_change('to_address', e.target.value)}
                      className="form-input"
                      placeholder="recipient email address"
                      required
                    />
                    <p className="form-help">
                      Must already be verified in AWS for sandbox accounts
                    </p>
                  </div>

                  {template && template.dynamic_fields.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Template replacement tags
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Specify any of your {template.dynamic_fields.length} implemented replacement tag values here:
                      </p>
                      <div className="space-y-3">
                        {template.dynamic_fields.map((field) => (
                          <div key={field}>
                            <label htmlFor={`field-${field}`} className="form-label">
                              {field}
                            </label>
                            <input
                              type="text"
                              id={`field-${field}`}
                              value={form_data.dynamic_fields[field] || ''}
                              onChange={(e) => handle_input_change(field, e.target.value)}
                              className="form-input"
                              placeholder="value"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {template && template.dynamic_fields.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No replacement tag fields to display</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              {email_sent && (
                <div className="flex items-center text-green-600 mb-3 sm:mb-0 sm:mr-3">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">Email sent: {sent_time}</span>
                </div>
              )}
              <button
                type="button"
                className="btn btn-secondary sm:ml-3"
                onClick={handle_close}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !template}
              >
                {loading ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SendEmailModal
