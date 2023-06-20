const TEMPLATE_PREVIEW_SELECTOR = '#templatePreview';
const TEMPLATE_PREVIEW_CONTAINER_SELECTOR = '#templatePreviewContainer';

export const setTemplatePreview = () => {
  const templateHtml = window.codeMirrorEditor.getValue();
  $(TEMPLATE_PREVIEW_SELECTOR).html(templateHtml);
};

export const setupTemplatePreviewListeners = (templateFormSelector) => {
  $(templateFormSelector).on('input', () => {
    const showPreview = $(TEMPLATE_PREVIEW_CONTAINER_SELECTOR).visible();
    if (!showPreview) return;
    setTemplatePreview();
  });    

  $('#showPreview').on('change', (e) => {
    const newValue = e.target.checked;
    const changeVisibility = newValue ? 'show' : 'hide';
    $(TEMPLATE_PREVIEW_CONTAINER_SELECTOR)[changeVisibility]();
    if (newValue) return setTemplatePreview();
    $(TEMPLATE_PREVIEW_SELECTOR).html('');
  });
};
