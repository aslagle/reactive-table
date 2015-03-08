var collection = new Mongo.Collection('filter-regex-test');

collection.remove({});

collection.insert({name: 'item 1', value: '1+2'});
collection.insert({name: 'item 2', value: 'abc'});

ReactiveTable.publish('filter-regex-disabled', collection, {}, {enableRegex: false});
ReactiveTable.publish('filter-regex-enabled', collection, {}, {enableRegex: true});

ReactiveTable.publish('filter-inclusion', collection, {}, {fields: {name: 1}});
ReactiveTable.publish('filter-exclusion', collection, {}, {fields: {value: 0}});