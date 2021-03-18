import IndexPage from 'components/IndexPage';
import CrmDealList from 'components/modules/Crm/Deal/DealList.vue';
import CrmDealFields from 'components/modules/Crm/Deal/DealFields';
import CrmDealFieldAdd from 'components/modules/Crm/Deal/DealFieldAdd';
import CrmDealFieldEdit from 'components/modules/Crm/Deal/DealFieldEdit';
import CrmDealStages from 'components/modules/Crm/Deal/DealStages.vue';
import CrmLeadList from 'components/modules/Crm/Lead/LeadList.vue';
import CrmLeadFields from 'components/modules/Crm/Lead/LeadFields';
import CrmLeadFieldAdd from 'components/modules/Crm/Lead/LeadFieldAdd';
import CrmLeadFieldEdit from 'components/modules/Crm/Lead/LeadFieldEdit';
import CrmLeadStatuses from 'components/modules/Crm/Lead/LeadStatuses.vue';
import CrmCompanyList from 'components/modules/Crm/Company/CompanyList.vue';
import CrmCompanyFields from 'components/modules/Crm/Company/CompanyFields';
import CrmCompanyFieldAdd from 'components/modules/Crm/Company/CompanyFieldAdd';
import CrmCompanyFieldEdit from 'components/modules/Crm/Company/CompanyFieldEdit';
import CrmContactList from 'components/modules/Crm/Contact/ContactList.vue';
import CrmContactFields from 'components/modules/Crm/Contact/ContactFields';
import CrmContactFieldAdd from 'components/modules/Crm/Contact/ContactFieldAdd';
import CrmContactFieldEdit from 'components/modules/Crm/Contact/ContactFieldEdit';
import CrmInvoiceList from 'components/modules/Crm/Invoice/InvoiceList.vue';
import CrmInvoiceFields from 'components/modules/Crm/Invoice/InvoiceFields';
import CrmInvoiceFieldAdd from 'components/modules/Crm/Invoice/InvoiceFieldAdd';
import CrmInvoiceFieldEdit from 'components/modules/Crm/Invoice/InvoiceFieldEdit';
import CrmInvoiceStatuses from 'components/modules/Crm/Invoice/InvoiceStatuses.vue';
import CrmInvoicePersonTypeList from 'components/modules/Crm/Invoice/PersonTypeList.vue';
import CrmActivityList from 'components/modules/Crm/Activity/ActivityList.vue';
import CrmCatalogList from 'components/modules/Crm/Catalog/CatalogList.vue';
import CrmProductSectionList from 'components/modules/Crm/ProductSection/ProductSectionList.vue';
import CrmProductSectionTree from 'components/modules/Crm/ProductSection/ProductSectionTree.vue';
import CrmProductList from 'components/modules/Crm/Product/ProductList.vue';
import CrmStatusTypes from 'components/modules/Crm/StatusTypes.vue';
import CrmSources from 'components/modules/Crm/Sources.vue';
import CrmIndustries from 'components/modules/Crm/Industries.vue';
import EntityList from 'components/modules/Entity/EntityList.vue';
import EntityAdd from 'components/modules/Entity/EntityAdd.vue';
import EntityProperties from 'components/modules/Entity/EntityProperties.vue';
import EntityPropertyAdd from 'components/modules/Entity/EntityPropertyAdd.vue';
import EntityPropertyEdit from 'components/modules/Entity/EntityPropertyEdit.vue';
import EntityRights from 'components/modules/Entity/EntityRights.vue';
import EntityRightsAdd from 'components/modules/Entity/EntityRightsAdd.vue';
import EntityItemList from 'components/modules/Entity/EntityItemList.vue';
import EntityItemAdd from 'components/modules/Entity/EntityItemAdd.vue';
import DepartmentList from 'components/modules/User/DepartmentList.vue';
import EventList from 'components/modules/Event/EventList.vue';
import PlacementList from 'components/modules/Placement/PlacementList.vue';
import PlacementTypes from 'components/modules/Placement/PlacementTypes.vue';
import Info from 'components/modules/Info/Info.vue';
import Console from 'components/modules/Console/Console.vue';
import SaleOrderList from 'components/modules/Sale/OrderList.vue';
import SalePaymentList from 'components/modules/Sale/PaymentList.vue';
import SaleShipmentList from 'components/modules/Sale/ShipmentList.vue';

export default [
    {
        path: '/',
        name: 'index',
        component: IndexPage,
    },
    {
        path: '/crm/deal/fields',
        name: 'crmDealFields',
        component: CrmDealFields,
    },
    {
        path: '/crm/deal/fields/add',
        name: 'crmDealFieldAdd',
        component: CrmDealFieldAdd,
    },
    {
        path: '/crm/deal/fields/edit/:fieldId',
        name: 'crmDealFieldEdit',
        component: CrmDealFieldEdit,
    },
    {
        path: '/crm/deal/list',
        name: 'crmDealList',
        component: CrmDealList,
    },
    {
        path: '/crm/deal/stages',
        name: 'crmDealStages',
        component: CrmDealStages,
    },
    {
        path: '/crm/lead/fields',
        name: 'crmLeadFields',
        component: CrmLeadFields,
    },
    {
        path: '/crm/lead/fields/add',
        name: 'crmLeadFieldAdd',
        component: CrmLeadFieldAdd,
    },
    {
        path: '/crm/lead/fields/edit/:fieldId',
        name: 'crmLeadFieldEdit',
        component: CrmLeadFieldEdit,
    },
    {
        path: '/crm/lead/list',
        name: 'crmLeadList',
        component: CrmLeadList,
    },
    {
        path: '/crm/lead/statuses',
        name: 'crmLeadStatuses',
        component: CrmLeadStatuses,
    },
    {
        path: '/crm/company/fields',
        name: 'crmCompanyFields',
        component: CrmCompanyFields,
    },
    {
        path: '/crm/company/fields/add',
        name: 'crmCompanyFieldAdd',
        component: CrmCompanyFieldAdd,
    },
    {
        path: '/crm/company/fields/edit/:fieldId',
        name: 'crmCompanyFieldEdit',
        component: CrmCompanyFieldEdit,
    },
    {
        path: '/crm/company/list',
        name: 'crmCompanyList',
        component: CrmCompanyList,
    },
    {
        path: '/crm/contact/fields',
        name: 'crmContactFields',
        component: CrmContactFields,
    },
    {
        path: '/crm/contact/fields/add',
        name: 'crmContactFieldAdd',
        component: CrmContactFieldAdd,
    },
    {
        path: '/crm/contact/fields/edit/:fieldId',
        name: 'crmContactFieldEdit',
        component: CrmContactFieldEdit,
    },
    {
        path: '/crm/contact/list',
        name: 'crmContactList',
        component: CrmContactList,
    },
    {
        path: '/crm/invoice/fields',
        name: 'crmInvoiceFields',
        component: CrmInvoiceFields,
    },
    {
        path: '/crm/invoice/fields/add',
        name: 'crmInvoiceFieldAdd',
        component: CrmInvoiceFieldAdd,
    },
    {
        path: '/crm/invoice/fields/edit/:fieldId',
        name: 'crmInvoiceFieldEdit',
        component: CrmInvoiceFieldEdit,
    },
    {
        path: '/crm/invoice/list',
        name: 'crmInvoiceList',
        component: CrmInvoiceList,
    },
    {
        path: '/crm/invoice/statuses',
        name: 'crmInvoiceStatuses',
        component: CrmInvoiceStatuses,
    },
    {
        path: '/crm/invoice/person_type',
        name: 'crmInvoicePersonTypeList',
        component: CrmInvoicePersonTypeList,
    },
    {
        path: '/crm/activity/list',
        name: 'crmActivityList',
        component: CrmActivityList,
    },
    {
        path: '/crm/catalog/list',
        name: 'crmCatalogList',
        component: CrmCatalogList,
    },
    {
        path: '/crm/catalog/:catalogId/products',
        name: 'crmProductList',
        component: CrmProductList,
    },
    {
        path: '/crm/catalog/:catalogId/sections',
        name: 'crmProductSectionList',
        component: CrmProductSectionList,
    },
    {
        path: '/crm/catalog/:catalogId/tree',
        name: 'crmProductSectionTree',
        component: CrmProductSectionTree,
    },
    {
        path: '/crm/status/types',
        name: 'crmStatusTypes',
        component: CrmStatusTypes,
    },
    {
        path: '/crm/status/sources',
        name: 'crmSources',
        component: CrmSources,
    },
    {
        path: '/crm/status/industries',
        name: 'crmIndustries',
        component: CrmIndustries,
    },
    {
        path: '/entity/list',
        name: 'entityList',
        component: EntityList,
    },
    {
        path: '/entity/:entityId/list',
        name: 'entityItemList',
        component: EntityItemList,
    },
    {
        path: '/entity/:entityId/items/add',
        name: 'entityItemAdd',
        component: EntityItemAdd,
    },
    {
        path: '/entity/:entityId/properties',
        name: 'entityProperties',
        component: EntityProperties,
    },
    {
        path: '/entity/:entityId/properties/add',
        name: 'entityPropertyAdd',
        component: EntityPropertyAdd,
    },
    {
        path: '/entity/:entityId/properties/:propertyCode/edit',
        name: 'entityPropertyEdit',
        component: EntityPropertyEdit,
    },
    {
        path: '/entity/:entityId/rights',
        name: 'entityRights',
        component: EntityRights,
    },
    {
        path: '/entity/:entityId/rights/add',
        name: 'entityRightsAdd',
        component: EntityRightsAdd,
    },
    {
        path: '/user/department/list',
        name: 'departmentList',
        component: DepartmentList,
    },
    {
        path: '/entity/add',
        name: 'entityAdd',
        component: EntityAdd,
    },
    {
        path: '/event/list',
        name: 'eventList',
        component: EventList,
    },
    {
        path: '/placement/list',
        name: 'placementList',
        component: PlacementList,
    },
    {
        path: '/placement/types',
        name: 'placementTypes',
        component: PlacementTypes,
    },
    {
        path: '/info',
        name: 'info',
        component: Info,
    },
    {
        path: '/console',
        name: 'console',
        component: Console,
    },
    {
        path: '/sale/order/list',
        name: 'saleOrderList',
        component: SaleOrderList,
    },
    {
        path: '/sale/payment/list',
        name: 'salePaymentList',
        component: SalePaymentList,
    },
    {
        path: '/sale/shipment/list',
        name: 'saleShipmentList',
        component: SaleShipmentList,
    },
]
