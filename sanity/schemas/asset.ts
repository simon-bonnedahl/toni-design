import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'asset',
  title: 'Assets',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Asset ID',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'Asset URL',
      type: 'image',
    }),
  ],
})
