import store from '@app/store';

export const sectionOpenInB24 = (catalogId, id) => {
    window.open(`https://${store.state.appData.portal}/shop/settings/menu_catalog_goods_${catalogId}/?IBLOCK_ID=${catalogId}&type=CRM_PRODUCT_CATALOG&lang=ru&find_section_section=${id}&SECTION_ID=${id}&apply_filter=Y`, '_blank');
};

export const sectionEditInB24 = (catalogId, id, parentId) => {
    window.open(`https://${store.state.appData.portal}/shop/settings/cat_section_edit/?IBLOCK_ID=${catalogId}&type=CRM_PRODUCT_CATALOG&lang=ru&ID=${id}&find_section_section=${parentId}`, '_blank');
};
