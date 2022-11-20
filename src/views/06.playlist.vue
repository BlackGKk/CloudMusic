<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <!-- 封面 -->
        <img :src="listDetail.coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <p class="title">{{listDetail.name}}</p>
        <div class="author-wrap">
          <img class="avatar" :src="creator.avatarUrl" alt="" />
          <span class="name">{{creator.nickname}}</span>
          <span class="time">{{listDetail.createTime}} 创建</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text">▶ 播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li v-for="(item,index) in listDetail.tags" :key="index">{{item}}</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{listDetail.description}}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
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
            <tr class="el-table__row" v-for="(item,index) in playList" :key="item.id" >
              <td>{{index + 1}}</td>
              <td>
                <div class="img-wrap" @click="playMusic(item.id)">
                  <img :src="item.al.picUrl" alt="" />
                  <span class="iconfont icon-play">▶</span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{item.name}}</span>
                    <span class="iconfont icon-mv" v-if="item.mv !== 0" @click="toMv(item.mv)" >📺</span>
                  </div>
                  <span v-if="item.alia.length > 0">{{item.alia[0]}}</span>
                </div>
              </td>
              <td>{{item.ar[0].name}}</td>
              <td>{{item.al.name}}</td>
              <td>{{item.dt}}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane :label="'评论(' + newCommentCount +')'" name="2">
        <!-- 精彩评论 -->
        <div class="comment-wrap">
          <p class="title">精彩评论<span class="number">({{hotCommentCount}})</span></p>
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
          <p class="title">最新评论<span class="number">({{newCommentCount}})</span></p>
          <div class="comments-wrap">
            <div class="item" v-for="item in newComment" :key="item.commentId">
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
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import request from '../utils/request'
export default {
  name: 'playlist',
  data () {
    return {
      activeIndex: '1',
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 限制
      limit: 20,
      // 歌单详情
      listDetail: {},
      // 歌单
      playList: [],
      // 头像
      creator: {},
      // 热门评论
      hotComment: [],
      // 热门评论数
      hotCommentCount: 0,
      // 最新评论
      newComment: [],
      // 最新评论数
      newCommentCount: 0
    }
  },
  methods: {
    toMv (id) {
      this.$router.push('/mv?id=' + id)
    },
    handleCurrentChange (val) {
      this.page = val
    },
    // 获取歌曲细节
    async getDetail () {
      const { data: res } = await request.get('/playlist/detail?id=' + this.$route.query.query)
      // console.log(res)
      this.listDetail = res.playlist
      this.creator = this.listDetail.creator
      this.playList = res.playlist.tracks
      // 处理歌曲时间
      for (let i = 0; i < this.playList.length; i++) {
        const duration = this.playList[i].dt
        let min = parseInt(duration / 1000 / 60)
        if (min < 10) {
          min = '0' + min
        }
        let sec = parseInt(duration / 1000 % 60)
        if (sec < 10) {
          sec = '0' + sec
        }
        this.playList[i].dt = min + ':' + sec
      }
      // 处理创建时间
      const date = new Date(this.listDetail.createTime)
      const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      this.listDetail.createTime = h + m + s
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
    // 获取热门评论
    async getHotComment () {
      const { data: res } = await request.get('/comment/hot?id=' + this.$route.query.query + '&type=2')
      // console.log(res)
      this.hotCommentCount = res.total
      this.hotComment = res.hotComments
      // 修改时间
      for (let i = 0; i < this.hotComment.length; i++) {
        const date = new Date(this.hotComment[i].time)
        const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
        const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        this.hotComment[i].time = h + m + s
      }
    },
    // 获取最新评论
    async getNewComment () {
      const { data: res } = await request.get('/comment/playlist',
        {
          params: {
            id: this.$route.query.query,
            limit: this.limit,
            offset: (this.page - 1) * this.limit
          }
        })
      // console.log(res)
      this.newCommentCount = res.total
      this.total = res.total
      this.newComment = res.comments
      // 修改时间
      for (let i = 0; i < this.newComment.length; i++) {
        const date = new Date(this.newComment[i].time)
        const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
        const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        this.newComment[i].time = h + m + s
      }
    }
  },
  watch: {
    page () {
      this.getNewComment()
    }
  },
  created () {
    this.getDetail()
    this.getHotComment()
    this.getNewComment()
  }
}
</script>

<style scoped>
.el-table td{

  height: 100%;
  padding: 15px 10px 15px 0;
  font-size: 16px;
}
</style>
