import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'colorOption',
  title: 'Gravyrfärger',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Färgkombination (Fram/Bak ex. Vit/Svart)',
      type: 'string',
    }),
    defineField({
      name: 'frontColorValue',
      title: 'Färgen på framsidan i hexkod (#xxxxxx)',
      type: 'string',
    }),
    defineField({
      name: 'backColorValue',
      title: 'Färgen på baksidan i hexkod (#xxxxxx)',
      type: 'string',
    }),
  ],
})