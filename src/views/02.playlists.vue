<template>
  <div class="playlists-container">
    <!-- 同步 -->
    <div class="top-card">
      <div class="icon-wrap">
        <img :src="topList.coverImgUrl" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <div class="title">
          {{topList.name}}
        </div>
        <div class="info">
          {{topList.description}}
        </div>
      </div>
      <img :src="topList.coverImgUrl" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <div class="item" :class=" {active:tag == '全部' }" @click="tag = '全部'" >全部</div>
        <div class="item" :class=" {active:tag == '欧美' }" @click="tag = '欧美'" >欧美</div>
        <div class="item" :class=" {active:tag == '华语' }" @click="tag = '华语'" >华语</div>
        <div class="item" :class=" {active:tag == '流行' }" @click="tag = '流行'" >流行</div>
        <div class="item" :class=" {active:tag == '说唱' }" @click="tag = '说唱'" >说唱</div>
        <div class="item" :class=" {active:tag == '摇滚' }" @click="tag = '摇滚'" >摇滚</div>
        <div class="item" :class=" {active:tag == '民谣' }" @click="tag = '民谣'" >民谣</div>
        <div class="item" :class=" {active:tag == '电子' }" @click="tag = '电子'" >电子</div>
        <div class="item" :class=" {active:tag == '轻音乐' }" @click="tag = '轻音乐'" >轻音乐</div>
        <div class="item" :class=" {active:tag == '影视原声' }" @click="tag = '影视原声'" >影视原声</div>
        <div class="item" :class=" {active:tag == 'ACG'  }" @click="tag = 'ACG'" >ACG</div>
        <div class="item" :class=" {active:tag == '怀旧' }" @click="tag = '怀旧'" >怀旧</div>
        <div class="item" :class=" {active:tag == '治愈' }" @click="tag = '治愈'" >治愈</div>
        <div class="item" :class=" {active:tag == '旅行' }" @click="tag = '旅行'" >旅行</div>
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for=" item in playLists" :key="item.id" @click="toPlayList(item.id)">
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
      </div>
    </div>
    <!-- 分页器 -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="10"
    >
    </el-pagination>
  </div>
</template>

<script>
import request from '@/utils/request.js'
export default {
  name: 'recommend',
  data () {
    return {
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 顶部歌单
      topList: [],
      // 标签
      tag: '全部',
      // 歌单
      playLists: []
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.page = val
    },
    // 获得顶部歌单
    async getTopList () {
      const num = Math.round((Math.random() * 100) / 2)
      const { data: res } = await request.get('/top/playlist/highquality')
      this.topList = res.playlists[num]
    },
    // 获得歌单标签
    async getPlayList () {
      const { data: res } = await request.get('/top/playlist?limit=10&cat=' + this.tag + '&offset=' + ((this.page - 1) * 20))
      this.playLists = res.playlists
      this.total = res.total
    },
    // 跳转歌单详情页
    toPlayList (id) {
      this.$router.push(`/playlist?query=${id}`)
    }
  },
  watch: {
    tag () {
      this.page = 1
      this.getPlayList()
    },
    page () {
      this.getPlayList()
    }
  },
  created () {
    this.getTopList()
    this.getPlayList()
  }
}
</script>

<style >

</style>
