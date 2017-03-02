
const fs = require('fs-extra')
fs.removeSync('data.json')

const Gun = require('gun')
const gun = Gun()
require('./index')

gun.get('test').map().load(doc => {
    console.log('completed obj:', JSON.stringify(doc, null, 2))
})

let ref = gun.get('rel-data').put({
    value: 123,
    relation: {
        relation2: {
            relation3: {
                relation4: {
                    hello: 'world',
                    blab: 1334,
                    blbobboadfdf: false
                }
            }
        }
    }
})

gun.get('rel-data').path('relation.relation2.relation3').set({
    what: 'is this'
})

gun.get('test').set(ref)
