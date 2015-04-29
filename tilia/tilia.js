#!/usr/bin/env node

var bloomfilter = require('bloomfilter');
var byline = require('byline');
var fs = require('fs');

process.stdin.setEncoding('utf8');
var stream = byline(process.stdin);
var bloom = new bloomfilter.BloomFilter(8*4*1000000,16);
var count = 0;
console.log('Processing...')

stream.on('data', function(line) {
  count++;
  if(count%1000000==0){
    console.log((count/1000000) + 'M processed');
  }
  bloom.add(line);
});

stream.on('end', function() {
  console.log('Done. Processed ' + (count/1000000) + 'M');
  var array = [].slice.call(bloom.buckets);
  fs.writeFile('bloomfilter.json',JSON.stringify(array), function (err) {
    if(err){
      console.log('Failed to save bloomfilter')
    }else{
      console.log('Saved Bloomfilter')
    }
  })
});



