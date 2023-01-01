import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Produkter',
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
      name: 'id',
      title: 'Artikelnummer',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Beskrivning av produkten',
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
      name: 'keywords',
      title: 'Nyckelord som används för sökning',
      type: 'array',
      of: [{type: 'string'}],
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
      name: 'adjustable',
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