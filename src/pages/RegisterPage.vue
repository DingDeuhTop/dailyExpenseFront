<script setup>
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const form = ref({
    name: '',
    email: '',
    password: ''
})

const router = useRouter();

const registerUser = async () => {
    await api.post('/register', {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password
    })
}
</script>
<template>
    <q-page padding>
        <q-card class="q-pa-md my-card">
            <h6 class="text-center">Register to Daily Expense</h6>
            <q-form @submit.prevent="registerUser(form)" class="q-gutter-md">
                <q-card-section>
                    <q-input class="q-py-sm" dense outlined v-model="form.name" type="text" label="Name" />
                    <q-input class="q-py-sm" dense outlined v-model="form.email" type="mail" label="Email" />
                    <q-input class="q-py-sm" dense outlined v-model="form.password" type="password" label="Password" />
                </q-card-section>
                <div align="center">
                    <q-btn label="Register" type="submit" color="primary" />
                    <q-space class="q-pt-sm" />
                    <router-link to="/login" style="text-decoration: none;">Already have Account</router-link>
                </div>
            </q-form>
        </q-card>
    </q-page>
</template>