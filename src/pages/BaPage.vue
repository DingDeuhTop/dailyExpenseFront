<script setup>
import { api } from 'src/boot/axios';
import { onMounted, ref, onUnmounted } from 'vue';
import { customerId } from 'src/modules/CustomerHelper';
import { useRoute } from 'vue-router';
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
const baItem = ref('');
const optionBaItem = ref([]);
const allResponseDate = ref([]);
const route = useRoute();


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
        console.log(route.params)

    } else {
        getBas({
            pagination: pagination.value
        })
        // getCustomer
    }
})

onUnmounted(() => {
    customerId.value = null
})

async function getCustomerBa() {
    const res = await api.get('/customer_ba/', {
        params: {
            id: customerId.value
        }
    })
    bas.value = res.data;
    console.log(res.value);
}
async function getBas(props) {
    // console.log('asd')
    pagination.value = props.pagination
    const res = await api.get('/ba', {
        headers: {},
        params: props.pagination,
    })
    bas.value = res.data.data
    pagination.value.rowsNumber = res.data.meta.total
}
</script>
<template>
    <q-page padding>
        <!-- <q-form @submit="onSubmit" class="q-gutter-md">
            <div class=" q-py-md">
                <q-card class="my-card">
                    <q-card-section>
                        <q-select v-model="baItem" :options="optionBaItem" option-label="displayBaItem"
                            option-value="displayBa" filled />
                        <q-btn label="Submit" type="submit" color="primary" />
                        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                    </q-card-section>
                </q-card>
            </div>
        </q-form> -->
        <q-table title="Ba Column" :rows="bas" :columns="columns" row-key="name" v-model:pagination="pagination"
            @request="getBas">
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
        </q-table>
    </q-page>
</template>