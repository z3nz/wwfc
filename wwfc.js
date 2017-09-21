#!/usr/bin/env node
const prog = require('caporal')
const chalk = require('chalk')
const dict = require('./dictionary')
const package = require('./package')

prog
  .version(package.version)
  .description('A CLI for cheating in words with friends and scrabble.')
  .argument('<letters>', 'Letters to search with.')
  .argument('[length]', 'Length of the word to search for.')
  .action(function(args, options, logger) {
    let letters = args.letters.split('')
    const min = args.length || 2
    const max = args.length || letters.length

    const letterCount = { '*': 0 }
    letters.forEach(letter => {
      letterCount[letter] = letterCount[letter] ? letterCount[letter] + 1 : 1
    })

    const words = []
    dict.forEach(word => {
      if (word.length <= max && word.length >= min) {
        let add = true
        let wild = 0
        word.split('').forEach(letter => {
          if (!letters.includes(letter) && letterCount['*'] == wild) {
            add = false
          } else if (!letters.includes(letter)) {
            wild++
          } else if (word.split('').filter(l => l == letter).length > letterCount[letter]) {
            add = false
          }
        })
        if (add) words.push(word)
      }
    })

    const sorted = {}
    words.forEach(word => {
      sorted[`${word.length}`] ? sorted[`${word.length}`].push(word) : sorted[`${word.length}`] = [word]
    })

    Object.keys(sorted).reverse().forEach(key => {
      console.log(chalk.red.bold(`${key} letter words`))
      console.log(sorted[key].join(' '))
      console.log()
    })
  })

prog.parse(process.argv)
