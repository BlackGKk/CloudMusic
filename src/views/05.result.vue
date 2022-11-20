<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{$route.query.query}}</h2>
      <span class="sub-title">找到{{count}}个结果</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead align="left">
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr class="el-table__row" v-for="(item, index) in songList" :key="item.id" @click="playMusic(item.id)">
              <td>{{index + 1}}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{item.name}}</span>
                    <span class="iconfont icon-mv" v-if="item.mv !== 0" @click="toMv(item.mv)">📺</span>
                  </div>
                  <span v-if="item.alia.length !== 0">{{item.alia[0]}}</span>
                </div>
              </td>
              <td>{{item.ar[0].name}}</td>
              <td>{{item.al.name}}</td>
              <td>{{item.dt}}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div class="item" v-for="item in playList" :key="item.id" @click="toPlayList(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount}}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play">▶</span>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div class="item" v-for="item in Mvs" :key="item.id" @click="toMv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play">▶</span>
              <div class="num-wrap">
                <div class="iconfont icon-play">▶</div>
                <div class="num">{{item.playCount}}</div>
              </div>
              <span class="time">{{item.duration}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{item.name}}</div>
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import request from '../utils/request.js'
// import axios from 'axios'
export default {
  name: 'result',
  data () {
    return {
      activeIndex: 'songs',
      count: 0,
      type: 1,
      limit: 20,
      songList: [],
      playList: [],
      Mvs: []
    }
  },
  methods: {
    toMv (id) {
      this.$router.push('/mv?id=' + id)
    },
    toPlayList (id) {
      this.$router.push('/playlist?query=' + id)
    },
    // 播放音乐
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
    // 搜索歌曲
    async searchSong () {
      const { data: res } = await request.get('/search?keywords=' + this.$route.query.query + '&limit=' + this.limit + '&type=' + this.type)
      this.songList = res.result.songs
      this.count = res.result.songCount
      // console.log(res)
      // 处理时间
      for (let i = 0; i < this.songList.length; i++) {
        const duration = this.songList[i].dt
        let min = parseInt(duration / 1000 / 60)
        if (min < 10) {
          min = '0' + min
        }
        let sec = parseInt(duration / 1000 % 60)
        if (sec < 10) {
          sec = '0' + sec
        }
        this.songList[i].dt = min + ':' + sec
      }
    },
    // 搜索歌单
    async searchList () {
      const { data: res } = await request.get('/search?keywords=' + this.$route.query.query + '&limit=' + this.limit + '&type=' + this.type)
      // console.log(res)
      this.playList = res.result.playlists
      this.count = res.result.playlistCount
    },
    // 搜索MV
    async searchMv () {
      const { data: res } = await request.get('/search?keywords=' + this.$route.query.query + '&limit=' + this.limit + '&type=' + this.type)
      // console.log(res)
      this.Mvs = res.result.mvs
      this.count = res.result.mvCount
      // 处理mv观看次数
      for (let i = 0; i < this.Mvs.length; i++) {
        if (this.Mvs[i].playCount > 100000) {
          this.Mvs[i].playCount = parseInt(this.Mvs[i].playCount / 10000) + '万'
        }
      }
      // 处理时间
      for (let i = 0; i < this.Mvs.length; i++) {
        const duration = this.Mvs[i].duration
        let min = parseInt(duration / 1000 / 60)
        if (min < 10) {
          min = '0' + min
        }
        let sec = parseInt(duration / 1000 % 60)
        if (sec < 10) {
          sec = '0' + sec
        }
        this.Mvs[i].duration = min + ':' + sec
      }
    }
  },
  watch: {
    '$route.query.query': {
      handler (newVal, oldVal) {
        this.searchSong()
      }
    },
    activeIndex () {
      switch (this.activeIndex) {
        case 'songs':
          this.type = 1
          this.searchSong()
          break
        case 'lists':
          this.type = 1000
          // console.log('发出请求了')
          this.searchList()
          break
        case 'mv':
          this.type = 1004
          // console.log('发出请求了')
          this.searchMv()
          break
      }
    }
  },
  created () {
    this.searchSong()
  }
}
</script>

<style scoped>
.song-wrap{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  padding: 20px 10px 20px 0;
  font-size: 16px;
}
</style>
