<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <el-carousel class="" :interval="4000" type="card">
      <!-- 循环到的轮播图 -->
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <img :src="item.imageUrl" alt="" />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">
        推荐歌单
      </h3>
      <div class="items">

        <div class="item" v-for="(item, index) in list" :key="index" @click="toPlayList(item.id)">
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{item.copywriter}}</span>
            </div>
            <img :src="item.picUrl" alt="" />
            <span  class="iconfont icon-play">▶</span>
          </div>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">
        最新音乐
      </h3>
      <div class="items">

        <div class="item" v-for="(item,index) in songs" :key="index">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="" />
            <span @click="playMusic(item.id)" class="iconfont icon-play">▶</span>
          </div>
          <div class="song-wrap">
            <div class="song-name">{{item.name}}</div>
            <div class="singer">{{item.song.artists[0].name}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div class="item" v-for="item in Mvs" :key="item.id" @click="toMv(item.id)">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play">▶</span>
            <div class="num-wrap">
              <div class="iconfont icon-play">▶</div>
              <div class="num">{{item.playCount}}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{item.name}}</div>
            <div class="singer">{{item.artistName}}</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// 导入request.js
import request from '@/utils/request.js'
// import axios from 'axios'
export default {
  name: 'discovery',
  data () {
    return {
      // 轮播图
      banners: [],
      // 推荐歌单
      list: [],
      // 最新音乐
      songs: [],
      Mvs: [],
      url: ''
    }
  },
  methods: {
    toMv (id) {
      this.$router.push('/mv?id=' + id)
    },
    toPlayList (id) {
      this.$router.push('/playlist?query=' + id)
    },
    // 轮播图接口
    async getBanner () {
      const { data: res } = await request.get('/banner')
      // console.log(res)
      this.banners = res.banners
    },
    // 推荐歌单
    async getPersonalized () {
      const { data: res } = await request.get('/personalized', {
        params: {
          limit: 10
        }
      })
      this.list = res.result
    },
    // 最新音乐
    async getNewsong () {
      const { data: res } = await request.get('/personalized/newsong')
      this.songs = res.result
    },
    // // 点击播放音乐
    async playMusic (id) {
      const { data: res } = await request.get('/song/url', {
        params: {
          id: id
        }
      })
      // console.log(res)
      this.url = res.data[0].url
      this.$parent.musicUrl = this.url
    },
    // playMusic (id) {
    //   axios({
    //     url: 'https://autumnfish.cn/song/url',
    //     method: 'get',
    //     withCredentials: true,
    //     params: {
    //       id
    //     }
    //   }).then(res => {
    //     console.log(res)
    //     this.url = res.data.data[0].url
    //     console.log(this.$parent)
    //     this.$parent.musicUrl = this.url
    //   })
    // },
    // 最新mv
    async getNewMv () {
      const { data: res } = await request.get('/personalized/mv')
      this.Mvs = res.result
    }
  },
  created () {
    this.getBanner()
    this.getPersonalized()
    this.getNewsong()
    this.getNewMv()
  }
}
</script>

<style >

</style>
