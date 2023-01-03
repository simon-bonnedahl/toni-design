import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Order ID',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [{type: 'reference', to: {type: 'product'}}],
    }),
  ],
})
