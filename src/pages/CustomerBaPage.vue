<script setup>
import { api } from 'src/boot/axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { customerId } from 'src/modules/CustomerHelper';
const columns = ref([
    {
        name: 'id',
        field: (customer) => customer.id,
        align: 'left',
        label: "Id"
    },
    {
        name: 'name',
        field: (customer) => customer.name,
        align: 'left',
        label: "Name"
    },
    {
        name: 'action',
        field: (customer) => customer.action,
        align: 'left',
        label: "Action"
    },

])
const customer = ref([]);
const pagination = ref({
    sortBy: 'desc',
    descending: true,
    rowsPerPage: 15,
    page: 0,
    rowsNumber: 0
})

const router = useRouter()
const customerName = ref(null);
const edit_customerBa = ref(false);
const tempData = ref(null);
const delete_customerBa = ref(false);

onMounted(async () => {
    getBas({
        pagination: pagination.value
    })
})


async function getBas(props) {
    pagination.value = props.pagination
    const res = await api.get('/customer', {
        headers: {}, params: props.pagination
    })
    // console.log(res)
    customer.value = res.data.data
    // console.log(customer.value)
    pagination.value.rowsNumber = res.data.meta.total
}

async function showCustomerBa(props) {
    // console.log('asdf', props);
    localStorage.setItem('customerId', props.id)
    customerId.value = props.id
    router.push({
        name: 'ba',
        // state: { customerId: customerId.value }
    })
    // const res = await api.get('ba')
    // console.log(res)
}

async function addCustomer() {
    const res = await api.post('/customer',
        {
            name: customerName.value
        },
        {
            params: pagination.value
        }
    );
    customerName.value = ''
    customer.value = res.data.data
    pagination.value.rowsNumber = res.data.meta.total
}

function editCustomerBa(data) {
    tempData.value = data;
    edit_customerBa.value = true;
}

async function update_customerBa() {
    const res = await api.patch(`customer/${tempData.value.id}`,
        tempData.value
    );
    customer.value = res.data.data;
}

function deleteCustomerBa(data) {
    tempData.value = data;
    delete_customerBa.value = true
}

async function deleteCustomer() {
    const res = await api.delete(`customer/${tempData.value.id}`)
    customer.value = res.data.data
}
</script>
<template>
    <q-page padding>

        <q-form @submit="addCustomer" class="q-gutter-md">

            <div class="q-pt-sm q-pb-md">
                <q-card class="my-card">
                    <q-card-section class="row">
                        <q-input class="q-pr-sm col-10" outlined dense v-model="customerName" type="text"
                            placeholder="Enter  Customer Name" />
                        <q-btn class="q-pr-sm col-2" label="Add" type="submit" color="primary" />
                    </q-card-section>
                </q-card>
            </div>
        </q-form>
        <q-table title="Customer Ba" :rows="customer" :columns="columns" row-key="id" v-model:pagination="pagination"
            @request="getBas">
            <template v-slot:body="props">
                <tr>
                    <td>{{ props.row.id }}</td>
                    <td>{{ props.row.name }}</td>
                    <q-td>
                        <td>
                            <q-btn flat color="primary" label="View" @click="showCustomerBa(props.row)" />
                        </td>
                        <td>
                            <q-btn flat color="green" label="Edit" @click="editCustomerBa(props.row)" />
                        </td>
                        <td>
                            <q-btn flat color="red-9" label="Delete" @click="deleteCustomerBa(props.row)" />
                        </td>
                    </q-td>
                </tr>
            </template>
        </q-table>
    </q-page>
    <q-dialog v-model="edit_customerBa" persistent>
        <q-card>
            <div class="q-pa-md text-center">
                <span style="font-size: 20px; font-weight:bold">Edit Customer Name</span>
            </div>
            <q-card-section class="row items-center">
                <q-input dense outlined v-model="tempData.name" type="text" label="Enter Name" />
            </q-card-section>
            <q-card-actions align="center">
                <q-btn dense label="update" color="green" @click="update_customerBa" v-close-popup />
                <q-btn dense flat label="Cancel" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
    <q-dialog v-model="delete_customerBa" persistent>
        <q-card>
            <div class="q-pa-md text-center">
                <span class="text-red" style="font-size:20px; font-weight:bold">Do you want to delete item <span
                        class="text-bold">{{
                            tempData.id
                        }}</span>?
                </span>
            </div>
            <q-card-section class="row items-center">
                <q-input dense outlined v-model="tempData.name" type="text" label="Name" />
            </q-card-section>
            <q-card-actions align="center">
                <q-btn dense label="Delete" color="red-9" @click="deleteCustomer" v-close-popup />
                <q-btn dense flat label="Cancel" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>