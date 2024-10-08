// Types
import type { Rule } from '@txjs/vant-validator'
import type {
  FieldRule,
  FormProvide,
  FieldTextAlign,
  FieldRequiredAlign,
  FieldValidateError,
  FieldValidateTrigger,
  FieldValidationStatus
} from './types'

// Vue
import {
  defineComponent,
  type PropType,
  type ExtractPropTypes
} from 'vue'

// Taro
import {
  Form,
  type ITouchEvent,
  type FormProps as TaroFormProps
} from '@tarojs/components'

// Common
import { isString } from '@txjs/bool'
import { useExpose } from '@/hooks/expose'
import { useChildren } from '@/hooks/relation'

// Component utils
import { createInjectionKey } from '../_utils/basic'
import { preventDefault } from '../_utils/event'
import { numericProp, truthProp } from '../_utils/props'

const [name, bem] = BEM('form')

const formProps = {
  colon: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  showError: Boolean,
  shrink: truthProp,
  titleWidth: numericProp,
  scrollToError: Boolean,
  validateFirst: Boolean,
  showErrorMessage: truthProp,
  rules: Object as PropType<Record<string, FieldRule & Rule[]>>,
  titleAlign: String as PropType<FieldTextAlign>,
  inputAlign: String as PropType<FieldTextAlign>,
  requiredAlign: String as PropType<FieldRequiredAlign>,
  errorMessageAlign: String as PropType<FieldTextAlign>,
  onReset: Function as PropType<() => void>,
  onFinish: Function as PropType<(values: Record<string, unknown>) => void>,
  onFailed: Function as PropType<(evt: { errors: FieldValidateError[],  values: Record<string, unknown> }) => void>,
  onSubmit: Function as PropType<TaroFormProps['onSubmit']>,
  onValidate: Function as PropType<(evt: {
    name: string,
    message: string
  }) => void>,
  validateTrigger: {
    type: [String, Array] as PropType<FieldValidateTrigger | FieldValidateTrigger[]>,
    default: 'onBlur'
  }
}

export type FormProps = ExtractPropTypes<typeof formProps>

export const FORM_KEY = createInjectionKey<FormProvide>(name)

export default defineComponent({
  name,

  props: formProps,

  setup(props, { slots }) {
    const { children, linkChildren } = useChildren(FORM_KEY)

    const getFieldsByNames = (names?: string[]) => {
      if (names) {
        return children.filter((field) => names.includes(field.name))
      }
      return children
    }

    const validateSeq = (names?: string[]) => {
      return new Promise<void>((resolve, reject) => {
        const errors: FieldValidateError[] = []
        const fields = getFieldsByNames(names)

        fields
          .reduce(
            (promise, field) =>
              promise.then(() => {
                if (!errors.length) {
                  return field
                    .validate()
                    .then((error?: FieldValidateError) => {
                      if (error) {
                        errors.push(error)
                      }
                    })
                }
              }),
            Promise.resolve()
          )
          .then(() => {
            if (errors.length) {
              reject(errors)
            } else {
              resolve()
            }
          })
      })
    }

    const validateAll = (names?: string[]) => {
      return new Promise<void>((resolve, reject) => {
        const fields = getFieldsByNames(names)

        Promise
          .all(fields.map((field) => field.validate()))
          .then((errors) => {
            errors = errors.filter(Boolean)

            if (errors.length) {
              reject(errors)
            } else {
              resolve()
            }
          })
      })
    }

    const validateField = (name: string) => {
      const matched = children.find((item) => item.name === name)

      if (matched) {
        return new Promise<void>((resolve, reject) => {
          matched
            .validate()
            .then((error?: FieldValidateError) => {
              if (error) {
                reject(error)
              } else {
                resolve()
              }
            })
        })
      }

      return Promise.reject()
    }

    const validate = (name?: string | string[]) => {
      if (isString(name)) {
        return validateField(name)
      }
      return props.validateFirst ? validateSeq(name) : validateAll(name)
    }

    const getValidationStatus = () =>
      children.reduce((form, field) => {
        form[field.name] = field.getValidationStatus()
        return form
      }, {} as Record<string, FieldValidationStatus>)

    const scrollToField = (name: string) => {
      children.some((field) => {
        if (field.name === name) {
          field.scrollIntoView()
          return true
        }
        return false
      })
    }

    const getValues = () =>
      children
        .reduce(
          (form, field) => {
            form[field.name] = field.formValue.value
            return form
          }, {} as Record<string, unknown>
        )

    const reset = (name?: string | string[]) => {
      if (isString(name)) {
        name = [name]
      }

      const fields = getFieldsByNames(name)

      fields.forEach((field) => {
        field.resetValidation()
      })

      props.onReset?.()
    }

    const submit = () => {
      const values = getValues()

      validate()
        .then(() => props.onFinish?.(values))
        .catch((errors: FieldValidateError[]) => {
          props.onFailed?.({ errors, values })
          if (props.scrollToError && errors[0].name) {
            scrollToField(errors[0].name)
          }
        })
    }

    const onSubmit = (event: ITouchEvent) => {
      preventDefault(event)
      props.onSubmit?.(event)
      submit()
    }

    const onReset = (event: ITouchEvent) => {
      preventDefault(event)
      reset()
    }

    linkChildren({
      props,
      reset,
      submit,
      validate,
      getValues,
      scrollToField,
      getValidationStatus
    })

    useExpose({
      reset,
      submit,
      validate,
      getValues,
      scrollToField,
      getValidationStatus
    })

    return () => (
      <Form
        class={bem()}
        onSubmit={onSubmit}
        onReset={onReset}
      >
        {slots.default?.()}
      </Form>
    )
  }
})
