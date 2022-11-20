<template>
  <div class="songs-container">
    <div class="tab-bar">
      <span class="item" :class="{ active:tag == '0'}" @click="tag = '0'">全部</span>
      <span class="item" :class="{ active:tag == '7'}" @click="tag = '7'">华语</span>
      <span class="item" :class="{ active:tag == '96'}" @click="tag = '96'">欧美</span>
      <span class="item" :class="{ active:tag == '8'}" @click="tag = '8'">日本</span>
      <span class="item" :class="{ active:tag == '16'}" @click="tag = '16'">韩国</span>
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table">
      <thead align="left">
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr
        class="el-table__row"
        v-for="(item, index) in songs" :key="item.id">
          <td>{{index + 1}}</td>
          <td :style="'padding: 8px 0;'">
            <div class="img-wrap" @click="playMusic(item.id)">
              <img :src="item.album.blurPicUrl" alt="" />
              <span class="iconfont icon-play">▶</span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span class="songTitle">{{item.name}}</span>
                <span class="iconfont icon-mv" v-if="item.mvid !== 0" @click="toMv(item.mvid)">📺</span>
              </div>
              <span>{{item.alias[0]}}</span>
            </div>
          </td>
          <td class="author">{{item.artists[0].name}}</td>
          <td>{{item.album.name}}</td>
          <td :style="'padding-right:10px'">{{item.duration}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import request from '@/utils/request.js'
export default {
  name: 'songs',
  data () {
    return {
      tag: '0',
      songs: [],
      nameArr: []
    }
  },
  methods: {
    toMv (id) {
      this.$router.push('/mv?id=' + id)
    },
    // 获取最新音乐
    async getNewSong () {
      const { data: res } = await request.get('/top/song?type=' + this.tag)
      this.songs = res.data
      // console.log(this.songs)
      // 处理时间
      for (let i = 0; i < this.songs.length; i++) {
        const duration = this.songs[i].duration
        let min = parseInt(duration / 1000 / 60)
        if (min < 10) {
          min = '0' + min
        }
        let sec = parseInt(duration / 1000 % 60)
        if (sec < 10) {
          sec = '0' + sec
        }
        this.songs[i].duration = min + ':' + sec
      }
      // 处理歌手名
      this.nameArr = []
      for (let i = 0; i < this.songs.length; i++) {
        const artists = this.songs[i].artists
        if (artists.length > 1) {
          artists.forEach(i => {
            this.nameArr.push(i.name)
          })
          const artName = this.nameArr.join('/')
          this.songs[i].artists[0].name = artName
        }
      }
    },
    // 播放音乐
    async playMusic (id) {
      // 获得歌曲详情
      const { data: res } = await request.get('/song/detail?ids=' + id)
      // 获得歌曲url
      const { data: res2 } = await request.get('/song/url?id=' + id)
      // 获得歌曲歌词
      const { data: res3 } = await request.get('/lyric?id=' + id)
      const audioData = {
        name: res.songs[0].name,
        artist: res.songs[0].ar[0].name,
        url: res2.data[0].url,
        cover: res.songs[0].al.picUrl,
        lrc: res3.lrc.lyric
      }
      this.$bus.emit('getAudioData', audioData)
      // this.url = res.data[0].url
      // this.$parent.musicUrl = this.url
    }
  },
  watch: {
    tag () {
      this.getNewSong()
    }
  },
  created () {
    this.getNewSong()
  }
}
</script>

<style scoped>

.songTitle{
  font-size: 18px;
  font-weight: 600;
}
.author{
  font-size: 16px;
  opacity: 0.88;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
