import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'subCategory',
  title: 'Sub-kategorier',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: {
        hotspot: true,
        accept: '.jpg, .png, .jpeg, .webp',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
