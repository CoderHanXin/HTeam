export default {
  theme: 'snow',
  boundary: document.body,
  modules: {
    toolbar: [
      ['bold', 'italic', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image']
    ]
  },
  placeholder: 'Insert text here ...',
  readOnly: false
}
