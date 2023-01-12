import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'account',
  title: 'Konto',
  type: 'document',
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
      title: 'E-post',
      type: 'string',
    }),
    defineField({
      name: 'password',
      title: 'Lösenord',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Adress',
      type: 'string',
    }),
    defineField({
      name: 'zipCode',
      title: 'Postnummer',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'Ort',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Land',
      type: 'string',
    }),
  ],
})
