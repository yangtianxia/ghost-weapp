import { canIUse, getAccountInfoSync } from '@tarojs/taro'
import { isNil } from '@txjs/bool'

let miniProgram: ReturnType<typeof getAccountInfoSync>['miniProgram']

export const useAccountInfo = () => {
  if (isNil(miniProgram) && canIUse('getAccountInfoSync')) {
    miniProgram = getAccountInfoSync().miniProgram
  }
  return miniProgram
}
