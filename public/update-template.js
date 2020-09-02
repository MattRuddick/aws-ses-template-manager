$(document).ready(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const templateName = urlParams.get('name');

  if (!templateName) {
    window.location.href = '/'; //something went wrong
  }

  $.get(`/get-template/${templateName}`, function (response) {
    $('#templateName').val(response.data.TemplateName);
    $('#templateSubject').val(response.data.SubjectPart);
    $('#templateText').val(response.data.TextPart);
    $('#templateHtml').val(response.data.HtmlPart);
  });
})

