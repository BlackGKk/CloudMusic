<template>
  <div class="index-container">
    <!-- 导航区域 -->
    <div class="nav" >
      <ul>
        <li>
          <router-link to="/discovery">
            <span class="iconfont icon-find-music">🎧</span>
            发现音乐
          </router-link>
        </li>
        <li>
          <router-link to="/playlists">
            <span class="iconfont icon-music-list">💽</span>
            推荐歌单
          </router-link>
        </li>
        <li>
          <router-link to="/songs">
            <span class="iconfont icon-music">🎵</span>
            最新音乐
          </router-link>
        </li>
        <li>
          <router-link to="/mvs">
            <span class="iconfont icon-mv">📺</span>
            最新MV
          </router-link>
        </li>
      </ul>
    </div>
    <!-- 主体区域 -->
    <div class="main">
<!-- @musicurl="getMusicUrl" -->
      <router-view></router-view>
    </div>
    <!-- 播放标签 -->
    <div class="player">
      <!-- autoplay自动播放 -->
      <audio :src='musicUrl' controls autoplay></audio>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      musicUrl: ''
    }
  },
  methods: {
    getMusicUrl (val) {
      this.musicUrl = val
      console.log(val)
    }
  }
}
</script>

<style >

</style>
