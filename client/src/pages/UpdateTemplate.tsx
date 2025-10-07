import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import TemplateForm from '../components/TemplateForm'
import { ses_api } from '../services/api'

const UpdateTemplate = () => {
  const navigate = useNavigate()
  const [search_params] = useSearchParams()
  const [initial_data, set_initial_data] = useState<{
    template_name: string
    subject_part: string
    text_part: string
    html_part: string
  } | undefined>()
  const [loading, set_loading] = useState(true)

  useEffect(() => {
    const template_name = search_params.get('name')
    if (template_name) {
      load_template(template_name)
    } else {
      navigate('/')
    }
  }, [search_params, navigate])

  const load_template = async (template_name: string) => {
    try {
      const region = localStorage.getItem('region') || 'us-east-1'
      const response = await ses_api.get_template(template_name, region)
      
      if (response.data) {
        set_initial_data({
          template_name: response.data.TemplateName,
          subject_part: response.data.SubjectPart,
          text_part: response.data.TextPart,
          html_part: response.data.HtmlPart,
        })
      }
    } catch (error: any) {
      console.error('Error loading template:', error)
      toast.error('Failed to load template')
      navigate('/')
    } finally {
      set_loading(false)
    }
  }

  const handle_submit = async (data: {
    template_name: string
    subject_part: string
    text_part: string
    html_part: string
    region: string
  }) => {
    await ses_api.update_template(data)
    toast.success('Template updated successfully!')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading template...</p>
        </div>
      </div>
    )
  }

  if (!initial_data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Template not found</p>
        </div>
      </div>
    )
  }

  return (
    <TemplateForm
      initial_data={initial_data}
      is_editing={true}
      onSubmit={handle_submit}
    />
  )
}

export default UpdateTemplate
