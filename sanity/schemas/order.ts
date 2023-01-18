import {defineField, defineType} from 'sanity'
const order = defineType({
  name: 'order',
  title: 'Ordrar',
  type: 'document',
  fields: [
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'orderDate',
      title: 'Order datum',
      type: 'date',
      readOnly: true,
    }),
    defineField({
      name: 'items',
      title: 'Order produkter',
      type: 'array',
      of: [{type: 'reference', to: {type: 'product'}}],
      readOnly: true,
    }),

    defineField({
      name: 'customerDetails',
      title: 'Kunduppgifter',
      type: 'object',
      readOnly: true,
      fields: [
        defineField({
          name: 'firstname',
          title: 'Förnamn',
          type: 'string',
        }),
        defineField({
          name: 'lastname',
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
          name: 'company',
          title: 'Företag',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'orderDetails',
      title: 'Orderdetaljer',
      type: 'object',
      readOnly: true,
      fields: [
        defineField({
          name: 'deliveryMethod',
          title: 'Leveransmetod',
          type: 'string',
        }),
        defineField({
          name: 'paymentMethod',
          title: 'Betalningsmetod',
          type: 'string',
        }),
        defineField({
          name: 'total',
          title: 'Belopp',
          type: 'number',
        }),
      ],
    }),
  ],
})
export default order
