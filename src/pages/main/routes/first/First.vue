<template>
  <div>
    <el-card class="crumbs-card">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/main/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/main/first' }">用户管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-card>
    <el-card class="container">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="账号">
          <el-input v-model="query.account" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="query.role" placeholder="用户类型">
            <el-option :key="role.id" v-for="role in roles" :label="role.itemName" :value="role.itemValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSelect">查询</el-button>
          <el-button type="danger" @click="deleteUsers">删除选中</el-button>
          <el-button type="primary" @click="exportUser">导出</el-button>
<!--          <el-button type="primary" @click="showImport">导入</el-button>-->
        </el-form-item>
      </el-form>
      <el-table
          @selection-change="selectChange"
          :data="users"
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
            prop="account"
            label="账号"
            width="120">
        </el-table-column>
        <el-table-column
            prop="password"
            label="密码"
            width="120">
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
            width="180">
        </el-table-column>
        <el-table-column
            prop="description"
            label="描述">
        </el-table-column>
        <el-table-column
            prop="roleName"
            label="角色">
        </el-table-column>
        <el-table-column
            label="头像">
          <template slot-scope="scope">
            <img :src="processUrl(scope.row.avatar)" alt="" height="100" width="100">
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="showDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="text" @click="deleteUser(scope.row)">删除</el-button>
            <el-button size="small" type="text" @click="uploadFile(scope.row)">下载头像</el-button>
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
import {userExport} from '@api/user'
// import {fileDownload} from '@api/api'
import axios from 'axios'
import UserEditDialog from '../../components/user/UserEditDialog'
// import UserImportDialog from '../../components/user/UserImportDialog'

export default {
  name: 'First',
  components: {
    UserEditDialog
  },
  data () {
    return {
      moment: moment,
      roles: [],
      selectUsers: [],
      query: {
        account: '',
        password: '',
        role: '',
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      id: '',
      name: '',
      type: '',
      users: [],
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
    exportUser () {
      let user = {
        loginName: this.query.account,
        password: this.query.password,
        role: this.query.role
      }
      userExport(user).then(res => {
        // 把响应流转为文件，模拟a标签进行下载
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'}) // 为blob设置文件类型，这里以.xlsx为例
        let url = window.URL.createObjectURL(blob) // 创建一个临时的url指向blob对象
        let a = document.createElement('a')
        a.href = url
        a.download = '用户信息表.xls'
        a.click()
        // 释放这个临时的对象url
        window.URL.revokeObjectURL(url)
      })
    },
    uploadFile (user) {
      var downloadUrl = 'http://124.220.56.38:8888' + user.avatar.substring(1)
      let a = document.createElement('a')
      a.href = downloadUrl
      a.click()
    },
    selectChange (value) {
      console.info(value)
      this.selectUsers = value
    },
    getUserList () {
      // userList().then(res => {
      // })
      axios.get('/api/user/list').then(res => {
        console.log(res.data)
        this.users = res.data.data.records
        this.query.total = res.data.data.total
      })
    },
    onSelect () {
      // userList(this.query).then(res => {
      //   this.users = res.data.records
      // })
      axios.get('/api/user/list', {
        params: {
          ...this.query
        }
      }).then(res => {
        console.log(res.data)
        this.users = res.data.data.records
      })
    },
    handleSizeChange (val) {
      this.query.pageSize = val
      // userList(this.query).then(res => {
      //   this.users = res.data.records
      //   this.query.total = res.data.total
      // })
      axios.get('/api/user/list', {
        params: {
          ...this.query
        }
      }).then(res => {
        console.log(res.data)
        this.users = res.data.data.records
        this.query.total = res.data.data.total
      })
    },
    handleCurrentChange (val) {
      this.query.pageNo = val
      // userList(this.query).then(res => {
      //   this.users = res.data.records
      //   this.query.total = res.data.total
      // })
      axios.get('/api/user/list', {
        params: {
          ...this.query
        }
      }).then(res => {
        console.log(res.data)
        this.users = res.data.data.records
        this.query.total = res.data.data.total
      })
    },
    showDialog (user) {
      // this.selectUser = JSON.parse(JSON.stringify(user))
      //
      // this.dialogFormVisible = true
      this.$refs.userEdit.show(JSON.parse(JSON.stringify(user)), this.roles)
    },
    deleteUser (user) {
      this.$confirm('确认删除该用户?', '提示', {
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
        axios.post('/api/user/singleDelete', {
          id: user.id
        }).then(res => {
          if (res.data) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUserList()
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
    deleteUsers () {
      this.$confirm('确认删除选中的所有用户?', '提示', {
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
        axios.post('/api/user/batchDeletes', {
          ids: ids
        }).then(res => {
          if (res.data) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUserList()
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
    this.getUserList()
    // dictionaryList({type: 'ROLE'}).then(res => {
    //   this.roles = res.data
    // })
    axios.get('/api/dictionary/listByType', {
      params: {
        type: 'ROLE'
      }
    }).then(res => {
      this.roles = res.data.data
    })
  }
}
</script>

<style scoped>

</style>
