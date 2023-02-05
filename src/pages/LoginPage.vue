<script setup>
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const form = ref({
    mail: '',
    password: ''
})

const router = useRouter();

// const getToken = async () => {
//     return
//     const res = await api.get('/buy', {
//         headers: {
//             authorization: 'Bearer ' + localStorage.getItem('token')
//         }
//     });
// }

const loginUser = async () => {
    const res = await api.post('/login', {
        email: form.value.mail,
        password: form.value.password
    });
    localStorage.setItem('token', res.data.token);
    router.push("/")
    console.log(res.data.token)

}

</script>
<template>
    <q-page padding>
        <q-card class="my-card q-pa-md">
            <h6 class="text-center">Login to Daily Expense</h6>
            <q-form @submit="loginUser(form)" class="q-gutter-md">

                <q-card-section>
                    <q-input dense outlined class="q-py-sm" v-model="form.mail" type="mail" label="Enter your email" />
                    <q-input dense outlined class="q-py-sm" v-model="form.password" type="password"
                        label="Enter your password" />
                </q-card-section>
                <div align="center">
                    <q-btn label="Login" type="submit" color="primary" />
                    <q-space class="q-pt-sm" />
                    <router-link to="/register" style="text-decoration: none;">Login to register?</router-link>
                </div>
            </q-form>
        </q-card>
    </q-page>
</template>