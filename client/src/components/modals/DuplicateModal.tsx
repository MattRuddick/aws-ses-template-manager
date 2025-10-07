import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy } from 'lucide-react'

interface DuplicateModalProps {
  is_open: boolean
  on_close: () => void
  template_name: string
}

const DuplicateModal = ({ is_open, on_close, template_name }: DuplicateModalProps) => {
  const [new_template_name, set_new_template_name] = useState('')
  const navigate = useNavigate()

  if (!is_open) return null

  const handle_confirm = () => {
    if (new_template_name.trim()) {
      navigate(`/create-template?d-origin=${template_name}&d-name=${new_template_name}`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={on_close}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <Copy className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Duplicate template
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-4">
                    Duplicating template: '{template_name}'
                  </p>
                  <div>
                    <label htmlFor="new-template-name" className="form-label">
                      New template name
                    </label>
                    <input
                      type="text"
                      id="new-template-name"
                      value={new_template_name}
                      onChange={(e) => set_new_template_name(e.target.value)}
                      className="form-input"
                      placeholder="Enter your new template name"
                    />
                    <p className="form-help">
                      This name can be changed within the next edit page if you so wish before you save your template.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="btn btn-primary sm:ml-3"
              onClick={handle_confirm}
              disabled={!new_template_name.trim()}
            >
              Next
            </button>
            <button
              type="button"
              className="btn btn-secondary mt-3 sm:mt-0 sm:w-auto"
              onClick={on_close}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DuplicateModal
