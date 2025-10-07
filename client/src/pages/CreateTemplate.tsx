import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import TemplateForm from '../components/TemplateForm'
import { ses_api } from '../services/api'

const CreateTemplate = () => {
  const navigate = useNavigate()
  const [search_params] = useSearchParams()
  const [initial_data, set_initial_data] = useState<{
    template_name: string
    subject_part: string
    text_part: string
    html_part: string
  } | undefined>()

  useEffect(() => {
    // Check if this is a duplicate operation
    const duplicate_origin = search_params.get('d-origin')
    const duplicate_name = search_params.get('d-name')
    
    if (duplicate_origin && duplicate_name) {
      load_template_for_duplication(duplicate_origin)
    }
  }, [search_params])

  const load_template_for_duplication = async (template_name: string) => {
    try {
      const region = localStorage.getItem('region') || 'us-east-1'
      const response = await ses_api.get_template(template_name, region)
      
      if (response.data) {
        set_initial_data({
          template_name: search_params.get('d-name') || '',
          subject_part: response.data.SubjectPart,
          text_part: response.data.TextPart,
          html_part: response.data.HtmlPart,
        })
      }
    } catch (error: any) {
      console.error('Error loading template for duplication:', error)
      toast.error('Failed to load template for duplication')
    }
  }

  const handle_submit = async (data: {
    template_name: string
    subject_part: string
    text_part: string
    html_part: string
    region: string
  }) => {
    await ses_api.create_template(data)
    toast.success('Template created successfully!')
    navigate('/')
  }

  return (
    <TemplateForm
      initial_data={initial_data}
      onSubmit={handle_submit}
    />
  )
}

export default CreateTemplate
