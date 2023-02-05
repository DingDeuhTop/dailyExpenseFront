<script setup>
import { api } from 'src/boot/axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const user = ref({
    name: '',
    store_name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    establish: ''
})
const authUser = ref([]);
const router = useRouter

onMounted(async () => {
    try {
        const res = await api.get('user')
        user.value = res.data
        // console.log(user.value)
    } catch (error) {
        console.log(error)
    }
})


async function onSubmit() {
    try {
        const res = await api.post("updateDetail", user.value);
        // console.log(res)
        authUser.value = res.data;
        console.log(authUser.value);
        router.push('/')
    } catch (error) {
        console.log(error);
    }
}
</script>
<template>
    <q-page padding>
        <q-card class="my-card">
            <q-card-section>
                <h4>Edit <span style="font-weight: bold">{{ user.name.toUpperCase() }}</span> Profile</h4>
            </q-card-section>
            <q-card-section>
                <q-form @submit="onSubmit" class="q-gutter-md">
                    <q-input outlined dense v-model="user.name" type="text" label="Name" />
                    <q-input outlined dense v-model="user.store_name" type="text" label="Store Name" />
                    <q-input outlined dense v-model="user.email" type="mail" label="Email" />
                    <q-input outlined dense v-model="user.password" type="password" stack-label placeholder="**********"
                        label="Password" />
                    <q-input outlined dense v-model="user.phone_number" mask='##########' label="Phone Number" />
                    <q-input outlined dense v-model="user.address" type="text" label="Address" />
                    <q-input outlined dense v-model="user.establish" mask="####" label="Establish Year" />
                    <div align="center">
                        <q-btn label="Update" type="submit" color="primary" />
                        <q-btn label="Cancel" type="reset" color="primary" to="/" flat class="q-ml-sm" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>