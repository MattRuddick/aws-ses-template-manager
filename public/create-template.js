function createTemplate() {
  const createPayload = {
    "TemplateName": $('#templateName').val(),
    "HtmlPart": $('#templateHtml').val(),
    "SubjectPart": $('#templateSubject').val(),
    "TextPart": $('#templateText').val()
  };

  $.ajax({
    type: "POST",
    url: "/create-template",
    data: createPayload,
    success: (response) => {
      window.location.href = '/';
    }
  });

  //todo-> error checking
}
