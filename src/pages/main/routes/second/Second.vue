<template>
  <div>
    <el-card class="crumbs-card">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/main/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/main/second' }">反馈管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-card>
    <el-card class="container">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="风场ID">
          <el-input v-model="query.farmId" placeholder="风场ID"></el-input>
        </el-form-item>
        <el-form-item label="运行状态">
          <el-select v-model="query.state" placeholder="运行状态">
            <el-option :key="role.id" v-for="role in roles" :label="role.itemName" :value="role.itemValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSelect">查询</el-button>
          <el-button type="danger" @click="deleteFeedbacks">删除选中</el-button>
          <el-button type="primary" @click="exportFeedback">导出</el-button>
          <!--          <el-button type="primary" @click="showImport">导入</el-button>-->
        </el-form-item>
      </el-form>
      <el-table
          @selection-change="selectChange"
          :data="feedbacks"
          style="width: 100%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="ID"
            width="120">
        </el-table-column>
        <el-table-column
            prop="farmId"
            label="风场ID"
            width="120">
        </el-table-column>
        <el-table-column
            prop="stateName"
            label="运行状态"
            width="120">
        </el-table-column>
        <el-table-column
            prop="description"
            label="描述">
        </el-table-column>
        <el-table-column
            label="上报时间">
          <template slot-scope="scope">
            <span>{{moment(scope.row.createTime).format('yyyy-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="deleteFeedback(scope.row)">删除</el-button>
            <el-button size="small" type="text" @click="downloadFile(scope.row)">下载异常数据</el-button>
            <!--            <a :href="scope.row.url">下载</a>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="query.total">
      </el-pagination>
    </el-card>
    <user-edit-dialog ref="userEdit" @ok="getUserList"/>
    <user-import-dialog ref="userImport"/>
  </div>
</template>

<script>

import moment from 'moment'
import {feedbackExport} from '@api/user'
// import {fileDownload} from '@api/api'
import axios from 'axios'
import UserEditDialog from '../../components/user/UserEditDialog'
// import UserImportDialog from '../../components/user/UserImportDialog'

export default {
  name: 'Second',
  components: {
    UserEditDialog
  },
  data () {
    return {
      moment: moment,
      roles: [],
      selectUsers: [],
      query: {
        farmId: '',
        state: '',
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      id: '',
      name: '',
      type: '',
      feedbacks: [],
      tableData: []
    }
  },
  methods: {
    processUrl (url) {
      return 'http://124.220.56.38:8888' + url.substring(1)
    },
    showImport () {
      this.$refs.userImport.show()
    },
    exportFeedback () {
      let user = {
        loginName: this.query.account,
        password: this.query.password,
        role: this.query.role
      }
      feedbackExport(user).then(res => {
        // 把响应流转为文件，模拟a标签进行下载
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'}) // 为blob设置文件类型，这里以.xlsx为例
        let url = window.URL.createObjectURL(blob) // 创建一个临时的url指向blob对象
        let a = document.createElement('a')
        a.href = url
        a.download = '反馈信息表.xls'
        a.click()
        // 释放这个临时的对象url
        window.URL.revokeObjectURL(url)
      })
    },
    downloadFile (feedback) {
      var downloadUrl = 'http://124.220.56.38:8888' + feedback.fileUrl.substring(1)
      let a = document.createElement('a')
      a.href = downloadUrl
      a.click()
    },
    selectChange (value) {
      console.info(value)
      this.selectUsers = value
    },
    getFeedbackList () {
      // userList().then(res => {
      // })
      axios.get('/api/feedback/list').then(res => {
        console.log(res.data)
        this.feedbacks = res.data.data.records
        this.query.total = res.data.data.total
      })
    },
    onSelect () {
      // userList(this.query).then(res => {
      //   this.users = res.data.records
      // })
      console.log('this.query', this.query)
      axios.get('/api/feedback/list', {
        params: {
          ...this.query
        }
      }).then(res => {
        console.log(res.data)
        this.feedbacks = res.data.data.records
      })
    },
    handleSizeChange (val) {
      this.query.pageSize = val
      // userList(this.query).then(res => {
      //   this.users = res.data.records
      //   this.query.total = res.data.total
      // })
      axios.get('/api/feedback/list', {
        params: {
          ...this.query
        }
      }).then(res => {
        console.log(res.data)
        this.feedbacks = res.data.data.records
        this.query.total = res.data.data.total
      })
    },
    handleCurrentChange (val) {
      this.query.pageNo = val
      // userList(this.query).then(res => {
      //   this.users = res.data.records
      //   this.query.total = res.data.total
      // })
      axios.get('/api/feedback/list', {
        params: {
          ...this.query
        }
      }).then(res => {
        console.log(res.data)
        this.feedbacks = res.data.data.records
        this.query.total = res.data.data.total
      })
    },
    showDialog (user) {
      // this.selectUser = JSON.parse(JSON.stringify(user))
      //
      // this.dialogFormVisible = true
      this.$refs.userEdit.show(JSON.parse(JSON.stringify(user)), this.roles)
    },
    deleteFeedback (user) {
      this.$confirm('确认删除该反馈?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteId({id: user.id}).then(res => {
        //   if (res.data) {
        //     this.$message({
        //       message: '删除成功',
        //       type: 'success'
        //     })
        //     this.getUserList()
        //   }
        // })
        axios.post('/api/feedback/singleDelete', {
          id: user.id
        }).then(res => {
          if (res.data) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getFeedbackList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      console.info(user)
    },
    deleteFeedbacks () {
      this.$confirm('确认删除选中的所有反馈?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // let ids = []
        // for (var i = 0; i < this.selectUsers.length; i++) {
        //   ids.push(this.selectUsers[i].id)
        // }
        let ids = this.selectUsers.map(user => user.id)
        // deleteIds({ids: ids}).then(res => {
        //   if (res.data) {
        //     this.$message({
        //       message: '删除成功',
        //       type: 'success'
        //     })
        //     this.getUserList()
        //   }
        // })
        axios.post('/api/feedback/batchDeletes', {
          ids: ids
        }).then(res => {
          if (res.data) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getFeedbackList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  created () {
    this.getFeedbackList()
    // dictionaryList({type: 'ROLE'}).then(res => {
    //   this.roles = res.data
    // })
    axios.get('/api/dictionary/listByType', {
      params: {
        type: 'STATE'
      }
    }).then(res => {
      this.roles = res.data.data
    })
  }
}
</script>

<style scoped>

</style>
