<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">MV详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video
          controls
          autoplay
          :src="mvUrl"
        ></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="imgUrl" alt="" />
          </div>
          <span class="name">{{mvDetail.artistName}}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{mvDetail.name}}</h2>
          <span class="date">发布：{{mvDetail.publishTime}}</span>
          <span class="number">播放：{{mvDetail.playCount}}次</span>
          <p class="desc">{{mvDetail.desc}}</p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap">
        <p class="title">精彩评论<span class="number">({{this.hotComment.length}})</span></p>
        <div class="comments-wrap">
          <div class="item" v-for="item in hotComment" :key="item.commentId">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{item.user.nickname}}：</span>
                <span class="comment">{{item.content}}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length !== 0">
                <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                <span class="comment">{{item.beReplied[0].content}}</span>
              </div>
              <div class="date">{{item.timeStr}}  {{item.time}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">最新评论<span class="number">({{this.total}})</span></p>
        <div class="comments-wrap">
          <div class="item" v-for="item in mvComment" :key="item.commentId">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{item.user.nickname}}：</span>
                <span class="comment">{{item.content}}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length !== 0">
                <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                <span class="comment">{{item.beReplied[0].content}}</span>
              </div>
              <div class="date">{{item.timeStr}}  {{item.time}}</div>
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
        :page-size="20"
        :limit="limit"
      >
      </el-pagination>
    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="item in simiMv" :key="item.id" @click="toMv(item.id)">
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
      </div>
    </div>
  </div>
</template>

<script>
import request from '../utils/request'
export default {
  name: 'mv',
  data () {
    return {
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 页容量
      limit: 20,
      // MV相关信息
      mvDetail: [],
      // 图片
      imgUrl: '',
      // 相似MV
      simiMv: [],
      // MvURL
      mvUrl: '',
      // MV评论
      mvComment: [],
      // 热门评论
      hotComment: []
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.page = val
    },
    toMv (id) {
      this.$router.push('/mv?id=' + id)
    },
    // 获取Mv相关信息
    async getMvDetail () {
      const { data: res } = await request.get('/mv/detail?mvid=' + this.$route.query.id)
      // console.log(res)
      this.mvDetail = res.data
      this.imgUrl = this.mvDetail.artists[0].img1v1Url
    },
    // 获取相关Mv
    async getSimiMv () {
      const { data: res } = await request.get('/simi/mv?mvid=' + this.$route.query.id)
      this.simiMv = res.mvs
      console.log(this.simiMv)
      // 处理时间
      for (let i = 0; i < this.simiMv.length; i++) {
        const duration = this.simiMv[i].duration
        let min = parseInt(duration / 1000 / 60)
        if (min < 10) {
          min = '0' + min
        }
        let sec = parseInt(duration / 1000 % 60)
        if (sec < 10) {
          sec = '0' + sec
        }
        this.simiMv[i].duration = min + ':' + sec
      }
      // 处理观看次数
      for (let i = 0; i < this.simiMv.length; i++) {
        if (this.simiMv[i].playCount > 100000) {
          this.simiMv[i].playCount = parseInt(this.simiMv[i].playCount / 10000) + '万'
        }
      }
    },
    // 获取mv地址
    async getMvUrl () {
      const { data: res } = await request.get('/mv/url?id=' + this.$route.query.id)
      this.mvUrl = res.data.url
    },
    async getArtists () {
      const { data: res } = await request.get('/artists?id=' + this.$route.query.id)
      console.log(res)
    },
    // 获取mv评论
    async getMvComment () {
      const { data: res } = await request.get('/comment/mv',
        {
          params: {
            id: this.$route.query.id,
            limit: this.limit,
            offset: (this.page - 1) * this.limit
          }
        })
      // console.log(res)
      this.total = res.total
      this.mvComment = res.comments
      this.timeForMate(this.mvComment)
    },
    // 获取热门评论
    async getHotComment () {
      const { data: res } = await request.get('/comment/mv',
        {
          params: {
            id: this.$route.query.id,
            limit: this.limit,
            offset: 0
          }
        })
      this.hotComment = res.hotComments
      this.timeForMate(this.hotComment)
    },
    // 修改评论时间
    timeForMate (dateArr) {
      for (let i = 0; i < dateArr.length; i++) {
        const date = new Date(dateArr[i].time)
        const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
        const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        dateArr[i].time = h + m + s
      }
    }
  },
  watch: {
    page () {
      this.getMvComment()
    },
    '$route.query.id': {
      handler (newVal, oldVal) {
        this.page = 1
        this.getMvDetail()
        this.getMvUrl()
        this.getSimiMv()
        this.getMvComment()
        console.log(this.$route.query.id)
      }
    }
  },
  created () {
    this.getMvDetail()
    this.getMvUrl()
    this.getSimiMv()
    this.getMvComment()
    this.getHotComment()
  }
}
</script>

<style></style>
