function populateTextSectionContent() {
  //Will strip template html of html tags leaving inner content for the template text field
  const htmlString = $('#templateHtml').val();
  const textContent = htmlString.replace(/<[^>]*>/g, "");
  $('#templateText').val(textContent);
}
