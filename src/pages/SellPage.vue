<script setup>
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';

const columns = ref([
    {
        name: "id",
        field: (sells) => sells.id,
        align: 'left',
        label: "Id",
    }, {
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
        name: "action",
        // field: (sells) => sells.price,
        align: 'center',
        label: "Action"
    },
]);

const sells = ref([]);
const sellItem = ref('');
const sellPrice = ref('')
const showSellEdit = ref(false);
const showSellDelete = ref(false);
const tempData = ref(null);
const total = ref(null);
const pagination = ref({
    sortBy: 'desc',
    descending: true,
    rowsPerPage: 3,
    page: 0,
})

onMounted(async () => {
    const res = await api.get('/sell')
    sells.value = res.data.sell.data
    total.value = res.data.total
})

async function addSell() {
    const res = await api.post('/sell', {
        item: sellItem.value,
        price: sellPrice.value,
    });
    sellItem.value = '';
    sellPrice.value = '';
    sells.value = res.data.sell.data;
}

function editItem(data) {
    tempData.value = data;
    showSellEdit.value = true
}

async function updateSellItem() {
    const res = await api.patch(`sell/${tempData.value.id}`, tempData.value)
    sells.value = res.data.sell.data
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
                            <q-input class="col-5 q-px-sm" dense outlined v-model="sellItem" type="text" label="Item" />
                            <q-input class="col-5 q-px-sm" dense outlined v-model="sellPrice" type="text"
                                label="Price(In Rupees)" />
                            <q-btn class="col-2" dense label="Add" type="submit" color="primary" />
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </q-form>

        <div class="q-pa-md">
            <q-table title="Product Sold(in Month)" :rows="sells" :columns="columns" v-model:pagination="pagination"
                row-key="name">
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
                            Total(in Month)
                        </q-td>
                        <q-td>
                            {{ total }}
                        </q-td>
                    </q-tr>
                </template>
            </q-table>
        </div>
    </q-page>

    <!-- Edit Sell Dialog -->
    <q-dialog v-model="showSellEdit" persistent>
        <q-card>
            <div class="text-green text-center">
                <h6>Edit Sell Item {{ tempData.id }}</h6>
            </div>
            <q-card-section class="row items-center">
                <q-input class="q-pa-sm" outlined v-model="tempData.item" type="text" label="Item" />
                <q-input outlined v-model="tempData.price" type="text" label="Price(in Rupees)" />
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
                <q-input class="q-pa-sm" outlined v-model="tempData.item" type="text" label="Item" />
                <q-input outlined v-model="tempData.price" type="text" label="Price(in Rupees)" />
            </q-card-section>
            <q-card-actions align="center">
                <q-btn label="Delete" color="red" @click="deleteSellItem" v-close-popup />
                <q-btn flat label="Cancel" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>