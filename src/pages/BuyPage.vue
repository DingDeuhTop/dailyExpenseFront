<script setup>
import { api } from 'src/boot/axios'
import { onMounted, ref } from 'vue';


const columns = ref([
    {
        name: "id",
        field: (buys) => buys.id,
        align: 'left',
        label: "Id",
    }, {
        name: "item",
        field: (buys) => buys.item,
        align: 'left',
        label: "Item",
    },
    {
        name: "price",
        field: (buys) => buys.price,
        align: 'left',
        label: "Price(in Rupees)"
    },
    {
        name: "action",
        // field: (buys) => buys.price,
        align: 'center',
        label: "Action"
    },
])
const buys = ref([]);
const buyItem = ref(null)
const buyPrice = ref(null)
const show_edit = ref(false)
const show_delete = ref(false);
const tempData = ref(null);
const total = ref(null)
const pagination = ref({
    sortBy: 'desc',
    descending: true,
    rowsPerPage: 15,
    page: 0,
    rowsNumber: 0
})


onMounted(async () => {
    // api.defaults.headers.common["Authorization"] =
    //     "Bearer " + localStorage.getItem("token");
    getBuys({
        pagination: pagination.value
    })

    // console.log(res);
})

async function getBuys(props) {
    pagination.value = props.pagination
    const res = await api.get('/buy',
        {
            headers: {
                // authorization: 'Bearer ' + localStorage.getItem('token')
            }, params: props.pagination
        })
    buys.value = res.data.buy.data;
    total.value = res.data.total;
    pagination.value.rowsNumber = res.data.buy.total;
}

async function addItem() {
    // console.log('asd')
    const res = await api.post('/buy',
        {
            item: buyItem.value,
            price: buyPrice.value

        },
        {
            params: pagination.value
        }
    );
    buyItem.value = '';
    buyPrice.value = '';
    buys.value = res.data.buy.data;
    pagination.value.rowsNumber = res.data.buy.total
    // console.log(res)
}
function onEdit(data) {
    tempData.value = data;
    show_edit.value = true;
}

async function updateEdit() {
    const res = await api.patch(`buy/${tempData.value.id}`,
        tempData.value
    );
    // console.log(res);
    buys.value = res.data.buy.data;
    total.value = res.data.total;
}

function onDelete(data) {
    tempData.value = data;
    // console.log(currentIndex.value);
    show_delete.value = true;
}

async function deleteItem() {
    const res = await api.delete(`buy/${tempData.value.id}`);
    // console.log(res);
    buys.value = res.data.buy.data;
    total.value = res.data.total
}

</script>
<template>
    <q-page>
        <!-- <q-card class="my-card row" v-for="buy in buys" :key="buy">
            <q-card-section class="col-6">
                {{ buy.item }}
            </q-card-section>
            <q-card-section class="col-6">
                {{ buy.price }}
            </q-card-section>
        </q-card> -->
        <q-form @submit="addItem" class="q-gutter-md">

            <div class="q-pt-sm q-pa-md">
                <q-card class="my-card">
                    <q-card-section class="row">
                        <q-input class="col-5 q-pr-sm" outlined dense v-model="buyItem" type="text"
                            placeholder="Enter Item" />
                        <q-input class="col-5 q-pr-sm" outlined dense v-model="buyPrice" type="number"
                            placeholder="Enter Price" />
                        <q-btn class="col-2" label="Add" type="submit" color="primary" />
                    </q-card-section>
                </q-card>
            </div>
        </q-form>
        <div class="q-pa-md">
            <q-table title="Product Buy(in Month)" :rows="buys" :columns="columns" row-key="name"
                v-model:pagination="pagination" @request="getBuys">
                <template v-slot:body="props">
                    <tr>
                        <td>
                            {{ props.row.id }}
                        </td>
                        <td>
                            {{ props.row.item }}
                        </td>
                        <td>
                            {{ props.row.price }}
                        </td>
                        <q-td>
                            <td>
                                <q-btn flat dense color="primary" label="Edit" @click="onEdit(props.row)" />
                            </td>
                            <td>
                                <q-btn flat dense color="red" label="Delete" @click="onDelete(props.row)" />
                            </td>
                        </q-td>
                    </tr>
                </template>
                <template v-slot:bottom-row>
                    <q-tr>
                        <q-td colspan="2">
                            Total(in Month)
                        </q-td>
                        <q-td>
                            {{ total }}
                        </q-td>
                    </q-tr>
                </template>
                <!-- <template v-slot:body-cell-action="props">
                    <q-td>
                        <q-btn flat dense color="primary" label="Edit" @click="onEdit(props.row.id)" />
                    </q-td>
                    <q-td>
                        <q-btn flat dense color="red" label="Delete" @click="onEdit(props.row.id)" />
                    </q-td>
                </template> -->
            </q-table>
        </div>

    </q-page>
    <!-- edit dialog buy item -->
    <q-dialog v-model="show_edit" persistent>
        <q-card>
            <div class="q-pa-sm text-center">
                <h6 class="text-green">Edit item <span class="text-bold">{{ tempData.id }}</span></h6>
            </div>
            <q-card-section class="row items-center">
                <q-input dense class="q-pa-sm" outlined v-model="tempData.item" type="text" label="Item" />
                <q-input dense outlined v-model="tempData.price" type="number" label="Price(in Rupees)" />
            </q-card-section>
            <q-card-actions align="center">
                <q-btn label="update" color="green" @click="updateEdit" v-close-popup />
                <q-btn flat label="Cancel" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
    <!-- delete item dialog -->
    <q-dialog v-model="show_delete" persistent>
        <q-card>
            <div class="q-pa-sm text-center">
                <h6 class="col-6 q-mt-md text-red">Do you want to delete item <span class="text-bold">{{
                    tempData.id
                }}</span>?
                </h6>
            </div>
            <q-card-section class="row items-center">
                <q-input dense class="q-pa-sm" outlined v-model="tempData.item" type="text" label="Item" />
                <q-input dense outlined v-model="tempData.price" type="number" label="Price(in Rupees)" />
            </q-card-section>
            <q-card-actions align="center">
                <q-btn label="Delete" color="red" @click="deleteItem" v-close-popup />
                <q-btn flat label="Cancel" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>