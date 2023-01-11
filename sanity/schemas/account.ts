import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'account',
  title: 'Konto',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Namn',
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
      name: 'id',
      title: 'ID',
      type: 'string',
    }),
  ],
})
