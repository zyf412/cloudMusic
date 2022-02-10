import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import FindMusic from '@/components/FindMusic/FindMusic.vue'
import PlayList from '@/components/PlayList/playList.vue'
import Search from '@/components/Search/Search.vue'
import ArtistDetail from '@/components/Artist/ArtistDetail.vue'
import AlbumDetail from '@/components/Artist/AlbumDetail.vue'
import MV from '@/components/Video/MV.vue'
import Video from '@/components/Video/Video.vue'
import AllVideo from '@/components/Video/AllVideo.vue'
import Collection from '@/components/Collection/Collection.vue'
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
    redirect: '/FindMusic',
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
        props: true,
        beforeEnter: (to, from, next) => {
          console.log(from)
          if (from.path === '/FindMusic') {
            eventBus.$emit('backAllPlayList')
            console.log('再次进入')
          }
          next()
        }
      },
      {
        path: '/albumDetail/:id',
        component: AlbumDetail,
        props: true,
        beforeEnter: (to, from, next) => {
          console.log(111111)
          console.log(from)
          eventBus.$emit('backArtistDetail')
          // 有个0.5s的过渡动画，所以需要在过渡结束之后触发
          setTimeout(() => {
            eventBus.$emit('changeSearchPage')
          }, 500)
          next()
        }
      },
      {
        path: '/mv/:id',
        component: MV,
        props: true,
        beforeEnter: (to, from, next) => {
          if (from.path === '/AllVideo' || from.path === '/FindMusic') {
            eventBus.$emit('backAllPlayList')
          }
          eventBus.$emit('gotoVideo')
          next()
        }
      },
      {
        path: '/AllVideo',
        component: AllVideo
      },
      {
        path: '/video/:id',
        component: Video,
        props: true,
        beforeEnter: (to, from, next) => {
          eventBus.$emit('backAllPlayList')
          eventBus.$emit('gotoVideo')
          next()
        }
      },
      {
        path: '/Collection',
        component: Collection
      }

    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
