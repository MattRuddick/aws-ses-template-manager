export interface SesTemplate {
  TemplateName: string
  SubjectPart: string
  TextPart: string
  HtmlPart: string
  CreatedTimestamp: string
  dynamic_fields: string[]
}

export interface TemplateMetadata {
  Name: string
  CreatedTimestamp: string
}

export interface CreateTemplateData {
  template_name: string
  subject_part: string
  text_part: string
  html_part: string
  region: string
}

export interface UpdateTemplateData extends CreateTemplateData {}

export interface SendEmailData {
  template_name: string
  source: string
  template_data: string
  to_address: string
  region: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface ListTemplatesResponse {
  items: {
    TemplatesMetadata: TemplateMetadata[]
  }
}
