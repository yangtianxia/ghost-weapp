import { defineComponent } from 'vue'
import { useNavBarContext } from '@/hooks/nav-bar-context'
import { postLogin } from '@/api/user/login'

import { App } from '@/components/app'
import { Cell } from '@/components/cell'

const [name] = BEM('toast')

export default defineComponent({
  name,

  setup() {
    useNavBarContext({
      title: 'toast'
    })

    const onShowLoading = async () => {
      toast.loading()
      try {
        await postLogin({})
      } catch (err) {
        console.log(err)
      } finally {
        toast.hide()
        console.log('hide')
      }
    }

    const onShowToast = () => {
      toast.info('toast')
    }

    const onShowModal = () => {
      modal.confirm({
        title: 'modal-title',
        content: 'modal-content'
      })
    }

    const onShowModalInfo = () => {
      modal.info({
        content: 'modal-info',
        onOk: () => {}
      })
    }

    return () => (
      <App loading={false}>
        <App.Body>
          <Cell.Group inset>
            <Cell
              isLink
              title="显示loading"
              onTap={onShowLoading}
            />
            <Cell
              isLink
              title="显示toast"
              onTap={onShowToast}
            />
            <Cell
              isLink
              title="显示modal"
              onTap={onShowModal}
            />
            <Cell
              isLink
              title="显示modal-info"
              onTap={onShowModalInfo}
            />
          </Cell.Group>
        </App.Body>
      </App>
    )
  }
})
