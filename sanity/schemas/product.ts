import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Produkt',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Product Titel',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Token',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'product_id',
      title: 'Artikelnummer',
      type: 'string',
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
      name: 'categories',
      title: 'Kategorier',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'reference',
      to: {type: 'material'},
    }),
    defineField({
      name: 'width',
      title: 'Bredd (mm)',
      type: 'number',
    }),
    defineField({
      name: 'height',
      title: 'Höjd (mm)',
      type: 'number',
    }),
    defineField({
      name: 'price',
      title: 'Pris',
      type: 'number',
    }),
    defineField({
      name: 'adjutsable',
      title: 'Anpassningsbar?',
      type: 'boolean',
    }),
    defineField({
      name: 'complete',
      title: 'Färdig design?',
      type: 'boolean',
    }),
    defineField({
      name: 'json',
      title: 'JSON fil',
      type: 'file',
      options: {
        accept: '.json',
      },
    }),
  ]
})
