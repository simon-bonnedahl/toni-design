import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Order ID',
      type: 'number',
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [{type: 'reference', to: {type: 'product'}}],
    }),
    defineField({
      name: 'total',
      title: 'Total',
      type: 'number',
    }),
    defineField({
      name: 'orderData',
      title: 'Order Data',
      type: 'object',
      fields: [
        defineField({
          name: 'firstName',
          title: 'Förnamn',
          type: 'string',
        }),
        defineField({
          name: 'lastName',
          title: 'Efternamn',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'string',
        }),
        defineField({
          name: 'phone',
          title: 'Telefon',
          type: 'string',
        }),
        defineField({
          name: 'zipCode',
          title: 'Postnummer',
          type: 'string',
        }),
        defineField({
          name: 'city',
          title: 'Stad',
          type: 'string',
        }),
        defineField({
          name: 'country',
          title: 'Land',
          type: 'string',
        }),
        defineField({
          name: 'delivery',
          title: 'Leverans',
          type: 'string',
        }),
        defineField({
          name: 'payment',
          title: 'Betalsätt',
          type: 'string',
        }),
      ],
    }),
  ],
})
