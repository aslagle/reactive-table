var collection = new Mongo.Collection('filter-regex-test');

collection.remove({});

collection.insert({name: 'item 1', value: '1+2'});
collection.insert({name: 'item 2', value: 'abc'});

ReactiveTable.publish('filter-regex-disabled', collection, {}, {enableRegex: false});
ReactiveTable.publish('filter-regex-enabled', collection, {}, {enableRegex: true});

ReactiveTable.publish('filter-inclusion', collection, {}, {fields: {name: 1}});
ReactiveTable.publish('filter-exclusion', collection, {}, {fields: {value: 0}});

var collectionWithNestedKeys = new Mongo.Collection('filter-nested-keys');

collectionWithNestedKeys.remove({});

collectionWithNestedKeys.insert({'name': 'item 1', 'nested': [{'value': 'value 1'}, {'value': 'other'}]});
collectionWithNestedKeys.insert({'name': 'item 2', 'nested': [{'value': 'value 2'}]});

ReactiveTable.publish('nested-filter-inclusion', collectionWithNestedKeys, {}, {fields: {nested: 1}});
ReactiveTable.publish('nested-filter-exclusion', collectionWithNestedKeys, {}, {fields: {nested: 0}});

ReactiveTable.publish('nested-filter-inclusion-with-array', collectionWithNestedKeys, {}, {fields: {"nested.value": 1}})