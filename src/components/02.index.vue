<template>
  <div class="index-container">
    <!-- 导航区域 -->
    <div class="nav" >
      <ul>
       <div class="font-wrapper">
         <h2>
          <span style="--i:1;">B</span>
          <span style="--i:2;">L</span>
          <span style="--i:3;">A</span>
          <span style="--i:4;">C</span>
          <span style="--i:5;">K</span>
          <span style="--i:6;">G</span>
          <span style="--i:7;">K</span>
          <span style="--i:8;">k</span>
         </h2>
      </div>
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
    <!-- <div class="player"> -->
      <!-- autoplay自动播放 -->
      <!-- <audio :src='musicUrl' controls autoplay></audio> -->
      <aplayer
      autoplay
      fixed
      :audio="audio"
      :lrcType="1"></aplayer>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      musicUrl: '',
      audio: []
    }
  },
  methods: {
    getMusicUrl (val) {
      this.musicUrl = val
      console.log(val)
    }
  },
  mounted () {
    this.$bus.on('getAudioData', obj => {
      this.audio.unshift(obj)
    })
  }
}
</script>

<style scoped>
.font-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}
.font-wrapper h2 span{
  font-family: bilbo;
  margin: 0 1px;
  animation: animate 3s linear infinite;
  animation-delay: calc(0.1s * var(--i));
}

@keyframes animate
{
  0%
  {
    color: #fff;
    filter: hue-rotate(0deg);
    text-shadow: 0 0 5px #00b3ff,
    0 0 20px #00b3ff,
    0 0 40px #00b3ff,
    0 0 80px #00b3ff,
    0 0 120px #00b3ff,
    0 0 200px #00b3ff,
    0 0 300px #00b3ff,
    0 0 400px #00b3ff;
  }
  30%,70%{
    color: #fff;
    filter: hue-rotate(360deg);
    text-shadow: 0 0 5px #00b3ff,
    0 0 20px #00b3ff,
    0 0 40px #00b3ff,
    0 0 80px #00b3ff,
    0 0 120px #00b3ff,
    0 0 200px #00b3ff;
  }
  100%{
    color: transparent;
    filter: blur(2px) hue-rotate(0deg);
    box-shadow: none;
  }
}
</style>
