<template>
  <div class="login">
    <el-row class="login-container ma lg:w-1200px w-full" type="flex" align="middle" justify="center">
        <el-col :lg="{span: 8}" :span="24">

            <el-card shadow="hover" class="p-20px">

                <el-form @keyup.enter="submitLogin(formRef)" ref="formRef" :rules="rules" size="large" :model="form">

                    <el-form-item prop="username">
                        <el-input
                            type="text"
                            clearable
                            v-model="form.username"
                            autofocus
                            placeholder="Please enter your login email address"
                        >
                            <template #prefix>
                                <el-icon i="ep-user"></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    
                    <el-form-item prop="code" v-if="useType === 'reg'">
                        <el-input
                            v-model="form.code"
                            placeholder="Please enter verification code"
                        >
                            <template #prefix>
                                <el-icon i="ep-grid"></el-icon>
                            </template>
                            <template #append>
                                <el-button type="primary" @click="sendCode(formRef)">
                                    {{codeText}}
                                </el-button>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input
                            v-model="form.password"
                            type="password"
                            placeholder="Please enter password"
                            show-password
                        >
                            <template #prefix>
                                <el-icon i="ep-lock"></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="againPwd" v-if="useType === 'reg'">
                        <el-input
                            v-model="form.againPwd"
                            type="password"
                            placeholder="Please enter password again"
                            show-password
                        >
                            <template #prefix>
                                <el-icon i="ep-unlock"></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button
                            class="ma"
                            type="primary"
                            link
                            @click="useTypeChange(formRef)"
                            >{{buttonText('text')}}</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button class="w-full" :loading="form.loading" round type="primary" size="large" @click="submitLogin(formRef)">
                            {{buttonText('button')}}
                        </el-button>
                    </el-form-item>

                </el-form>

            </el-card>

        </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
    import {
    login,
    sendEmailCode,
    reguser
    } from "@/api/user"

    import {reactive, ref, computed } from 'vue'
    import type { ElForm } from 'element-plus'
    import { ElNotification } from 'element-plus'
    import { validatorPassword } from '@/utils/validate'
    import router from '@/router'
    import {useMainStore} from '@/store/main'

    const store = useMainStore()

    const formRef = ref<InstanceType<typeof ElForm>>()

    const useType = ref('login')

    const codeDatas = reactive({
        timer: null,
        num: 60
    })

    const buttonText = computed(() => {
        return (type: String) => {
            return (type === 'text' && useType.value === 'reg')?'Log in':(type === 'text' && useType.value === 'login')?'Create an account':useType.value === 'login'?'Log in':'Create an account'
        }
    })

    const form = reactive({
        username: '',
        password: '',
        code: '',
        againPwd: '',
        loading: false
    })

    const timestamp = ref('')

    const validatePass2 = (rule: any, value: any, callback: any) => {
        if (value === '') {
            callback(new Error('Please enter password again'))
        } else if (value !== form.password) {
            callback(new Error("Passwords are inconsistent"))
        } else {
            callback()
        }
    }

    // 验证码倒计时
    const codeText = computed(()=>{
        return codeDatas.num!==60?`剩余${codeDatas.num}秒`:'Get Verification'
    })

    // 获取验证码
    function sendCode(formEl: InstanceType<typeof ElForm> | undefined) {
        if (!formEl || codeDatas.num!==60) return
        formEl.validateField('username', (bool) => {
            if(bool){
                sendEmailCode({email: form.username}).then((res: any) => {
                    if(res?.code === 200){
                        codeDatas.num--
                        codeDatas.timer = setInterval(() => {
                            if (codeDatas.num < 1) {
                            if (codeDatas.timer != null) {
                                clearInterval(codeDatas.timer)
                                codeDatas.timer = null;
                            }
                            codeDatas.num = 60
                            } else {
                                codeDatas.num--
                            }
                        }, 1000)
                        ElNotification.success('发送验证码成功')
                        form.code = res?.data?.code
                        timestamp.value = res?.data?.timestamp
                    }else
                        ElNotification.success('发送验证码失败')
                }).catch((err:any) => {
                    ElNotification.error( err?.response?.data?.message || err.message)
                })
            }
        })
    }

    // 切换登录注册
    const useTypeChange = (formEl: InstanceType<typeof ElForm> | undefined)=>{
        if(useType.value === 'reg')
            useType.value = 'login'
        else
            useType.value = 'reg'
        if (!formEl) return
            formEl.resetFields()
    }

    // 表单验证规则
    const rules = reactive({
        username: [
            {
                required: true,
                message: 'Please enter your login email address',
                trigger: ['blur', 'change'],
            }
        ],

        password: [
            {
                required: true,
                message: 'Please enter your login password',
                trigger: ['blur', 'change'],
            },
            {
                validator: validatorPassword,
                trigger: ['blur', 'change'],
            },
        ],

        againPwd: [
            {
                validator: validatePass2,
                trigger: ['blur', 'change'],
            }
        ],

        code: [
            {
                required: true,
                message: 'Please enter verification code',
                trigger: ['blur', 'change']
            }
        ]
    })

    // 登录
    const submitLogin = (formEl: InstanceType<typeof ElForm> | undefined) => {
        if (!formEl) return
        formEl.validate((valid) => {
            if (valid) {
                form.loading = true
                const { username, password, code} = form
                if(useType.value === 'login')
                    login({email: username, password}).then((res: any) => {
                        if (res?.code == 200) {
                            if (!formEl) return
                                formEl.resetFields()
                            store.setToken(res?.data)
                            router.push({ path: '/chat' })
                        } else
                        ElNotification({
                            message: 'Login failed',
                            type: 'error',
                        })
                    }).catch((err: any) => {
                        ElNotification({
                            message: err?.response?.data?.message || err.message,
                            type: 'error'
                        })
                    }).finally(()=>{
                        form.loading = false
                    })
                else
                    reguser({email: username, code, timestamp: timestamp.value, password}).then((res: any) => {
                        if(res?.code === 200){
                            ElNotification.success('Account registration successful')
                            if (!formEl) return
                                formEl.resetFields()
                        }else
                            ElNotification.success('Account registration failed, try again')
                    }).catch((err: any) => {
                        ElNotification({
                            message: err?.response?.data?.message || err.message,
                            type: 'error'
                        })
                    }).finally(()=>{
                        form.loading = false
                    })
            } else {
                return false
            }
        })
    }
</script>

<style scoped lang="scss">
    .login{
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url('../../public/background/loginBackground.png'); /* 设置背景图片路径 */
      background-size: cover; /* 背景图片覆盖整个元素 */
      background-position: center; /* 背景图片居中 */
      background-repeat: no-repeat; /* 不重复背景图片 */
        .login-container{
            min-height: calc(80vh - 60px);
        }
      .p-20px{
        width: 400px;
        height: 350px;
        margin: 0 auto;
        padding: 20px;
        box-shadow: 0 0 10px var(--shadow-color);
        border-radius: 10px;
        background-color: var(--background-color);
        backdrop-filter: blur(3px); /* 模糊背景 */
        border: 2px solid #dad8d8; /* 添加白色边框 */
        transition: transform 0.3s, box-shadow 0.3s;
      }
      .p-20px{
          transform: translateY(-5px);
          box-shadow: 0 10px 20px var(--shadow-color);
      }
    }
</style>
