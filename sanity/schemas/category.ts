import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Kategorier',
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
    }),
    defineField({
      name: 'subCategories',
      title: 'Sub-kategorier',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {
              type: 'subCategory',
            },
          ],
        },
      ],
    }),
  ],
})
