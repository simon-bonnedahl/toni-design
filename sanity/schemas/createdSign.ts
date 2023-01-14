import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'createdSign',
  title: 'Skapade skyltar',
  type: 'document',
  fields: [
    defineField({
      name: 'creator',
      title: 'Skapare',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
    }),

    defineField({
      name: 'json',
      title: 'JSON',
      type: 'string',
    }),
  ],
})
