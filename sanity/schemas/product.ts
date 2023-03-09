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
      validation: (Rule) => Rule.min(5).max(30),
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
      validation: (Rule) => Rule.max(200),
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'height',
      title: 'Höjd (mm)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Pris',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'productType',
      title: 'Produkttyp',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        layout: 'radio',
        list: [
          {title: 'Anpassningsbar', value: 'adjustable'},
          {title: 'Färdig produkt', value: 'complete'},
        ],
      },
    }),

    defineField({
      name: 'JSON',
      title: 'JSON',
      type: 'string',
      hidden: ({parent}) => parent.productType !== 'adjustable',
    }),
  ],
})
