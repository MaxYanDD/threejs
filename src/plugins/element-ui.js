import Vue from 'vue'
import {
  Container,
  Aside,
  Header,
  Main,
  Footer,
  Form,
  FormItem,
  Input,
  Button,
  Dialog
} from 'element-ui'

Vue.prototype.$ELEMENT = { size: 'medium', zIndex: 3000 }

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Footer)
