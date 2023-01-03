import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'signImages',
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
  ],
})

//Behövs detta?
