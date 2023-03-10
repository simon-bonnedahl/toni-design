import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'asset',
  title: 'Media',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Media ID',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'Media URL',
      type: 'image',
    }),
    defineField({
      name: 'accessibility',
      title: 'Användas i redigeraren?',
      type: 'boolean',
    }),
  ],
})
