<script setup>
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar'

const columns = ref([
    {
        name: "id",
        field: (sells) => sells.id,
        align: 'left',
        label: "Id",
    },
    {
        name: "customer",
        field: (sells) => sells.customerName,
        align: 'left',
        label: "Customer",
    },
    {
        name: "item",
        field: (sells) => sells.item,
        align: 'left',
        label: "Item",
    },
    {
        name: "price",
        field: (sells) => sells.price,
        align: 'left',
        label: "Price(in Rupees)"
    },
    {
        name: "date",
        field: (sells) => sells.date,
        align: 'left',
        label: "Date of Sell"
    },
    {
        name: "amount_paid",
        field: (sells) => sells.amount_paid,
        align: 'left',
        label: "Amount Pay"
    },
    {
        name: "date_of_paid",
        field: (sells) => sells.date_of_paid,
        align: 'left',
        label: "Amount Paid Date"
    },
    {
        name: "action",
        // field: (sells) => sells.price,
        align: 'center',
        label: "Action"
    },
]);

const sells = ref([]);
const sellItem = ref('');
const sellPrice = ref('')
const sellDate = ref('');
const sellAmountPaid = ref('');
const sellPaidDate = ref('');
const showSellEdit = ref(false);
const showSellDelete = ref(false);
const showBa = ref(false);
const tempData = ref(null);
const total = ref(null);
const selledCustomer = ref(null)
const customers = ref([]);
const showCustomer = ref(false);
const customerName = ref('');
const $q = useQuasar();


const pagination = ref({
    sortBy: 'desc',
    descending: true,
    rowsPerPage: 15,
    page: 0,
    rowsNumber: 0
})

onMounted(async () => {

    getSells({
        pagination: pagination.value
    })
    getCustomers()
})

async function getCustomers() {
    const res = await api.get('/customer', {
        params: {
            rowsPerPage: 0,
        }

    })
    // console.log(res.data.data)
    customers.value = res.data.data
}

async function getSells(props) {
    pagination.value = props.pagination
    showCustomer.value = true
    const res = await api.get('/sell', {
        headers: {}, params: props.pagination
    })
    sells.value = res.data.sell.data;
    total.value = res.data.total;
    pagination.value.rowsNumber = res.data.sell.total
}

async function addNewCustomer() {
    const res = await api.post('/customer', {
        name: customerName.value
    })
    customers.value = res.data.data
    console.log(res)
}

async function addSell() {
    const res = await api.post('/sell', {
        item: sellItem.value,
        price: sellPrice.value,
        customer_id: selledCustomer.value.id,
        date: sellDate.value,
        amount_paid: sellAmountPaid.value,
        date_of_paid: sellPaidDate.value
    },
        {
            params: pagination.value
        }
    );
    sellItem.value = '';
    selledCustomer.value = ''
    sellPrice.value = '';
    sellDate.value = '';
    sellAmountPaid.value = '';
    sellPaidDate.value = '';
    sells.value = res.data.sell.data;
    pagination.value.rowsNumber = res.data.sell.total
}

function addBa(data) {
    tempData.value = data;
    // console.log('asdf', tempData.value)
    showBa.value = true
}

async function confirmAdd() {
    tempData.value.sell_id = tempData.value.id
    try {
        const res = await api.post('ba', tempData.value)
        $q.notify({
            message: 'Item has been added',
            color: 'green'
        })
    } catch (error) {
        // console.log(error.response)
        $q.notify({
            message: error.response.data.message,
            color: 'red'
        })

    }

}

function editItem(data) {
    tempData.value = data;
    showSellEdit.value = true
}

async function updateSellItem() {
    try {
        const res = await api.patch(`sell/${tempData.value.id}`, tempData.value)
        sells.value = res.data.sell.data
        $q.notify({
            message: 'Updated Successfully',
            color: 'green'
        })
    } catch (error) {
        console.log(error)
    }

}

function deleteItem(data) {
    tempData.value = data;
    showSellDelete.value = true;
}

async function deleteSellItem() {
    const res = await api.delete(`sell/${tempData.value.id}`, tempData.value);
    sells.value = res.data.sell.data;
}
</script>

<template>
    <q-page>
        <q-form @submit="addSell" class="q-gutter-md">
            <div class="q-pt-sm q-pa-md">
                <q-card class="my-card">
                    <q-card-section>
                        <div class="row">
                            <!-- <q-input class="col-3 q-pa-sm" dense outlined v-model="sellCustomerName" type="text"
                                                                                            label="Customer Name" /> -->
                            <q-select class="col-3 q-pa-sm" dense v-model="selledCustomer" :options="customers"
                                option-value="id" option-label="name" label="Customer Name" filled />
                            <q-input class="col-3 q-pa-sm" dense outlined v-model="sellItem" type="text" label="Item" />
                            <q-input class="col-3 q-pa-sm" dense outlined v-model="sellPrice" type="text"
                                label="Price(In Rupees)" />
                            <q-input class="col-3 q-pa-sm" dense outlined v-model="sellDate" type="date" />
                            <q-input class="col-3 q-pa-sm" dense outlined v-model="sellAmountPaid" type="number"
                                label="Amout Paid" />
                            <q-input class="col-3 q-pa-sm" dense outlined v-model="sellPaidDate" type="date" />
                            <q-btn class="col-3" dense label="Add" type="submit" color="primary" />
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </q-form>

        <div class="q-pa-md">
            <q-table title="Product Sold(in Month)" :rows="sells" :columns="columns" v-model:pagination="pagination"
                row-key="name" @request="getSells">
                <template v-slot:body="props">
                    <tr>
                        <td>
                            {{ props.row.id }}
                        </td>
                        <td>
                            {{ props.row.customer.name }}
                        </td>
                        <td>
                            {{ props.row?.item }}
                        </td>
                        <td>
                            {{ props.row.price }}
                        </td>
                        <td>
                            {{ props.row.date }}
                        </td>
                        <td>
                            {{ props.row.amount_pay }}
                        </td>
                        <td>
                            {{ props.row.date_of_paid }}
                        </td>
                        <q-td>
                            <td>
                                <q-btn color="primary" label="Add To Ba" @click="addBa(props.row)" />
                            </td>
                            <td>
                                <q-btn flat dense color="primary" label="Edit" @click="editItem(props.row)" />
                            </td>
                            <td>
                                <q-btn flat dense color="red" label="Delete" @click="deleteItem(props.row)" />
                            </td>
                        </q-td>
                    </tr>
                </template>
                <template v-slot:bottom-row>
                    <q-tr>
                        <q-td colspan="2">
                            Total Price (in Month)
                        </q-td>
                        <q-td>
                            {{ total }}
                        </q-td>
                    </q-tr>
                </template>
            </q-table>
        </div>
    </q-page>

    <!-- add customer name -->
    <q-dialog v-model="showCustomer" persistent>
        <q-card>
            <q-card-section class="row items-center">
                <div>
                    <p class="text-green-8 text-center">Add New Customer</p>
                    <q-input outlined dense v-model="customerName" type="text" label="Customer Name" />
                </div>
            </q-card-section>
            <q-card-actions align="center">
                <q-btn label="Add" color="primary" @click="addNewCustomer" v-close-popup />
                <q-btn flat label="Already Exist" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
    <!-- Ba add na -->
    <q-dialog v-model="showBa" persistent>
        <q-card>
            <q-card-section class="row items-center">
                <q-input class="col-xs-6 col-sm-3 col-lg-4 q-pa-sm" dense outlined v-model="tempData.customer.name"
                    type="text" label="Customer Name" />
                <q-input class="col-xs-6 col-sm-3 col-lg-4 q-pa-sm" dense outlined v-model="tempData.item" type="text"
                    label="Item" />
                <q-input class="col-xs-6 col-sm-3 col-lg-4 q-pa-sm" dense outlined v-model="tempData.price" type="text"
                    label="Price" />
                <q-input class="col-xs-6 col-sm-3 col-lg-4 q-pa-sm" dense outlined v-model="tempData.date" type="text"
                    label="Date" />
            </q-card-section>
            <q-card-actions align="center">
                <q-btn label="Confirm" color="primary" @click="confirmAdd" v-close-popup />
                <q-btn flat label="Cancel" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>

    <!-- Edit Sell Dialog -->
    <q-dialog v-model="showSellEdit" persistent>
        <q-card>
            <div class="text-green text-center">
                <h6>Edit Sell Item of {{ tempData.customer.name }}</h6>
            </div>
            <q-card-section class="row items-center">
                <!-- <q-input class="q-pa-sm" outlined v-model="tempData.customer.name" type="text" label="Item" /> -->
                <q-select class="q-pa-sm" dense v-model="tempData.customer.name" :options="customers" option-value="id"
                    option-label="name" label="Standard" filled />
                <q-input class="q-pa-sm" dense outlined v-model="tempData.item" type="text" label="Item" />
                <q-input class="q-pa-sm" dense outlined v-model="tempData.price" type="text" label="Price(in Rupees)" />
            </q-card-section>
            <q-card-actions align="center">
                <q-btn label="Update" color="green" @click="updateSellItem" v-close-popup />
                <q-btn flat label="Cancel" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>

    <!-- Delete Sell Dialog -->
    <q-dialog v-model="showSellDelete" persistent>
        <q-card>
            <div class="text-red text-center">
                <h6>Do you want to delete item {{ tempData.id }}</h6>
            </div>
            <q-card-section class="row items-center">
                <p></p>
                <q-input class="q-pa-sm" outlined v-model="tempData.customerName" type="text" label="Item" />
                <q-input class="q-pa-sm" outlined v-model="tempData.item" type="text" label="Item" />
                <q-input class="q-pa-sm" outlined v-model="tempData.price" type="text" label="Price(in Rupees)" />
            </q-card-section>
            <q-card-actions align="center">
                <q-btn label="Delete" color="red" @click="deleteSellItem" v-close-popup />
                <q-btn flat label="Cancel" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>