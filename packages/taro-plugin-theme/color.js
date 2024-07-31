const { generate, presetPalettes, presetDarkPalettes } = require('@ant-design/colors')
const { omit } = require('@txjs/shared')
const { getCurrentTaroEnv } = require('../utils/cli')

const taroEnv = getCurrentTaroEnv()

const presetPrimaryColors = {
  default: '#00C074'
}

const presetDefaultColors = {
  black: '#000000',
  white: '#FFFFFF',
}

const primaryColor = presetPrimaryColors[taroEnv] || presetPrimaryColors['default']

presetPalettes.primary = generate(primaryColor)
presetDarkPalettes.primary = generate(primaryColor, {
  theme: 'dark',
  backgroundColor: '#171717'
})

function formatKey(obj) {
  const colors = {}
  Object.keys(obj).forEach((key) => {
    const item = obj[key]
    item.forEach((color, index) => {
      colors[`${key}-${index + 1}`] = color
    })
  })
  return colors
}

function getCurrentColor() {
  return {
    light: {
      ...formatKey(omit(presetPalettes, ['grey'])),
      ...presetDefaultColors,
      navigation: 'black',
      section: '#FFFFFF',
      'grey-1': '#F8F8F8',
      'grey-2': '#EFEFEF',
      'grey-3': '#DFDFDF',
      'grey-4': '#C6C6C6',
      'grey-5': '#ADADAD',
      'grey-6': '#949494',
      'grey-7': '#7B7B7B',
      'grey-8': '#626262',
      'grey-9': '#494949',
      'grey-10': '#303030',
      'grey-11': '#171717',
      'grey-12': '#0D0D0D',
    },
    dark: {
      ...formatKey(omit(presetDarkPalettes, ['grey'])),
      ...presetDefaultColors,
      navigation: 'white',
      section: '#171717',
      'grey-1': '#0D0D0D',
      'grey-2': '#171717',
      'grey-3': '#303030',
      'grey-4': '#494949',
      'grey-5': '#626262',
      'grey-6': '#7B7B7B',
      'grey-7': '#949494',
      'grey-8': '#ADADAD',
      'grey-9': '#C6C6C6',
      'grey-10': '#DFDFDF',
      'grey-11': '#EFEFEF',
      'grey-12': '#F8F8F8',
    }
  }
}

module.exports = {
  getCurrentColor
}
