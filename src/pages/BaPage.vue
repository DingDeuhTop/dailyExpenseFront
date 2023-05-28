<script setup>
import { api } from 'src/boot/axios';
import { onMounted, ref, onUnmounted } from 'vue';
import { customerId } from 'src/modules/CustomerHelper';

const columns = ref([
    {
        name: 'id',
        field: (bas) => bas.id,
        align: 'left',
        label: 'Id'
    },
    {
        name: 'name',
        field: (ba) => ba.name,
        align: 'left',
        label: 'Customer Name'
    },
    {
        name: 'item',
        field: (bas) => bas.item,
        align: 'left',
        label: 'Item'
    },
    {
        name: 'price',
        field: (ba) => ba.price,
        align: 'left',
        label: 'Price'
    },
    {
        name: 'paid',
        field: (ba) => ba.paid,
        align: 'left',
        label: 'Paid'
    },
    {
        name: 'paid_date',
        field: (ba) => ba.paid_date,
        align: 'left',
        label: 'Date of Payment'
    },

])

// select ba item
const bas = ref([]);
const selledCustomer = ref(null);
const customers = ref([]);
const itemSelled = ref(null);
const total = ref(null);



const pagination = ref({
    sortBy: 'desc',
    descending: true,
    rowsPerPage: 15,
    page: 0,
    rowsNumber: 0
})

onMounted(async () => {
    if (customerId.value) {
        // getCustomerBa()
        getBas({
            pagination: { ...pagination.value, id: customerId.value }
        })
        getCustomers()
        // console.log(customers.value)

    } else {
        getBas({
            pagination: pagination.value
        })
        getCustomers()
    }
})
onUnmounted(() => {
    customerId.value = null
})

// async function getCustomerBa() {
//     const res = await api.get('/customer_ba/', {
//         params: {
//             id: customerId.value
//         }
//     })
//     bas.value = res.data;
//     console.log(bas.value);
// }
async function getCustomers() {
    // console.log('asd')
    const res = await api.get('/customer', {
        params: {
            rowsPerPage: 0,
        }
    })
    // console.log(res.data)
    customers.value = res.data.data
}

async function searchBa() {
    const res = await api.get('/ba', { params: { id: selledCustomer.value.id } })
    bas.value = res.data.bas
    // console.log(bas.value);
}

async function getBas(props) {
    // console.log('asd')
    pagination.value = props.pagination
    const res = await api.get('/ba', {
        headers: {},
        params: props.pagination,
    })
    bas.value = res.data.bas
    total.value = res.data.totalBa
    console.log(total.value)
    pagination.value.rowsNumber = res.data.data
}

// async function addBaItem() {
//     const res = await api.post('/ba', {
//         params: { id: sell_id.value.id },
//         customer_id: selledCustomer.value,
//         sell_id: itemSelled.value
//     });
//     console.log(res);
// }
</script>
<template>
    <q-page padding>
        <q-form @submit="searchBa" class="q-gutter-md">
            <div class=" q-py-md">
                <q-card class="my-card">
                    <q-card-section class="row">
                        <q-select class="col-8 q-pa-sm" dense v-model="selledCustomer" :options="customers"
                            option-value="id" option-label="name" label="Customer Name" filled />
                        <!-- <q-select v-model="baItem" :options="optionBaItem" option-label="displayBaItem"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    option-value="displayBa" filled /> -->
                        <q-btn class="q-ma-sm" label="Search" type="submit" color="primary" />
                    </q-card-section>
                </q-card>
            </div>
        </q-form>
        <q-table title="Ba Column" :rows="bas" :columns="columns" row-key="name" v-model:pagination="pagination"
            @request="getBas">
            <template v-slot:top-right>
                <!-- <q-form @submit="addBaItem" class="q-gutter-md">
                                                        <div class="row q-gutter-md">
                                                            <q-select dense v-model="selledCustomer" :options="customers" label="Customer Name"
                                                                option-value="id" option-label="name" filled />
                                                            <q-select dense v-model="itemSelled" :options="bas" option-value="id" option-label="sell?.item"
                                                                label="Standard" filled />
                                                            <q-input outlined dense v-model="addItem" type="text" label="Item" />
                                                            <q-input outlined dense v-model="addPrice" type="number" label="Price" /> 
                                                            <q-btn label="Add" type="submit" color="primary" />
                                                        </div>
                                                    </q-form> -->
            </template>
            <template v-slot:body="props">
                <tr>
                    <td>{{ props.row.id }}</td>
                    <td>{{ props.row?.customer.name }}</td>
                    <td>{{ props.row?.sell?.item }}</td>
                    <td>{{ props.row?.sell?.price }}</td>
                    <td>{{ props.row?.sell?.amount_pay }}</td>
                    <td>{{ props.row?.sell?.date_of_paid }}</td>
                </tr>
            </template>
            <template v-slot:bottom-row>
                <q-tr>
                    <q-td colspan="2">
                        Total Ba
                    </q-td>
                    <q-td>
                        {{ total }}
                    </q-td>
                </q-tr>
            </template>
        </q-table>
    </q-page>
</template>