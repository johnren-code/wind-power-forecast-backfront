<template>
  <el-dialog title="用户编辑" :visible.sync="dialogFormVisible">
    <el-form ref="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="selectUser.account"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="selectUser.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="selectUser.email"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="selectUser.description"></el-input>
      </el-form-item>
      <el-form-item label="角色类型">
        <el-select v-model="selectUser.role" placeholder="请选择角色类型">
          <el-option :key="role.id" v-for="role in roles" :label="role.itemName" :value="Number(role.itemValue)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户头像">
        <el-upload
            class="avatar-uploader"
            action="/api/file/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
          <img v-if="selectUser.avatar" :src="processUrl(selectUser.avatar)" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="userSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {userUpdate} from '@api/user'
import moment from 'moment'
export default {
  name: 'UserEditDialog',
  data: function () {
    return {
      moment: moment,
      dialogFormVisible: false,
      selectUser: {},
      roles: [],
      imageUrl: ''
    }
  },
  methods: {
    processUrl (url) {
      return 'http://127.0.0.1:8888' + url.substring(1)
    },
    userSave () {
      userUpdate(this.selectUser).then(res => {
        if (res.data) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.$emit('ok')
        }
      })
    },
    show (user, roles) {
      this.selectUser = user
      this.roles = roles
      this.dialogFormVisible = true
    },
    handleAvatarSuccess (res, file) {
      this.selectUser.avatar = res.url
    },
    beforeAvatarUpload (file) {
      // const isJPG = file.type === 'image/jpeg'
      // const isLt2M = file.size / 1024 / 1024 < 2
      //
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      // }
      // return isJPG && isLt2M
      return true
    }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
