import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import FindMusic from '@/components/FindMusic/FindMusic.vue'
import PlayList from '@/components/PlayList/playList.vue'
import Search from '@/components/Search/Search.vue'
import ArtistDetail from '@/components/Artist/ArtistDetail.vue'
// import AllPlayList from '@/components/PlayList/allPlayList.vue'
import { eventBus } from '@/eventBus/eventBus.js'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/', redirect: '/Home' },
  {
    path: '/Home',
    component: Home,
    children: [
      {
        path: '/FindMusic',
        component: FindMusic
      },
      {
        path: '/playList/:id',
        component: PlayList,
        props: true,
        beforeEnter: (to, from, next) => {
          eventBus.$emit('backAllPlayList')
          next()
        }
      },
      { path: '/search/:keyword', component: Search, props: true },
      {
        path: '/artistDetail/:id',
        component: ArtistDetail,
        props: true
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
