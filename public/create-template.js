$(document).ready(function(){

  // check to see if the template we're creating is a duplicate of an existing template
  const urlParams = new URLSearchParams(window.location.search);
  window.history.replaceState({}, document.title, "/create-template");  // clean the url search params from the URL

  window.codeMirrorEditor = window.CodeMirror.fromTextArea(document.querySelector('#codeMirror'), {
    mode: "htmlmixed",
    lineNumbers: true,
    viewportMargin: Infinity
  });

  if (urlParams.has('d-origin')) {
    // we need to load the existing template from which we will duplicate
    $.get(`/get-template/${urlParams.get('d-origin')}?region=${localStorage.getItem('region')}`, function (response) {
      $('#templateName').val(urlParams.get('d-name'));
      $('#templateSubject').val(response.data.SubjectPart);
      $('#templateText').val(response.data.TextPart);
      window.codeMirrorEditor.setValue(response.data.HtmlPart ? response.data.HtmlPart : "");
      $('#saveTemplateCta').removeAttr('disabled');  // enable the save button
    });
  }
  
  $('#alwaysFullyRenderCodeEditor').on('change', (e) => {
    const newValue = e.target.checked;
    const newViewportMargin = newValue ? Infinity : window.CodeMirror.defaults.viewportMargin;
    window.codeMirrorEditor.setOption('viewportMargin', newViewportMargin);
  });

  const isCodeMirrorEvent = (e) => (e.target === window.codeMirrorEditor.getInputField());

  // observe any changes to the form. If so, then enable the create btn
  $('#createTemplateForm').on('input', (e) => {
    if (isCodeMirrorEvent(e)) return;
    const isEditorConfig = e.target.getAttribute('data-editor-config') === 'true';
    if (isEditorConfig) return;
    $('#createTemplateForm button').attr('disabled', false);
  });

  // We may not get an input event on deletion from the codeMirror editor
  window.codeMirrorEditor.on('change', () => $('#createTemplateForm button').attr('disabled', false));

  const setTemplatePreview = () => {
    const templateHtml = window.codeMirrorEditor.getValue();
    $('#templatePreview').html(templateHtml);
  };

  const handlePreview = () => {
    const showPreview = $('#templatePreviewContainer')[0].checkVisibility();
    if (!showPreview) return;
    setTemplatePreview();
  }

  // We may not get an input event on deletion from the codeMirror editor
  $('#createTemplateForm').on('input', (e) => {
    if (isCodeMirrorEvent(e)) return;
    handlePreview();
  });

  window.codeMirrorEditor.on('change', handlePreview);

  $('#showPreview').on('change', (e) => {
    const newValue = e.target.checked;
    const changeVisibility = newValue ? 'show' : 'hide';
    $('#templatePreviewContainer')[changeVisibility]();
    if (newValue) return setTemplatePreview();
    $('#templatePreview').html('');
  });

  // handle form submissions
  $('#createTemplateForm').submit(function(e) {
    e.preventDefault();

    const createPayload = {
      "TemplateName": $('#templateName').val(),
      "HtmlPart": window.codeMirrorEditor.getValue(),
      "SubjectPart": $('#templateSubject').val(),
      "TextPart": $('#templateText').val(),
      "region": localStorage.getItem('region')
    };

    $.ajax({
      type: "POST",
      url: "/create-template",
      data: createPayload,
      success: function() {
        window.location.href = '/';
      },
      error: function(xhr) {
        let content;
        if (xhr.responseJSON.message) {
          content = xhr.responseJSON.message;
        } else {
          content = "Error saving template. Please try again";
        }
        $('#errContainer').html(content).removeClass('d-none');
      }
    });
  });

});
